import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICreateMusulliPayload, IUpdateMusulliPayload, ICreateMonthlyPaymentPayload, IUpdateMonthlyPaymentPayload } from "./musulli.interface";

const createMusulli = async (payload: ICreateMusulliPayload) => {
  const result = await prisma.musulli.create({
    data: {
      ...payload,
      joinedAt: new Date(payload.joinedAt),
      paidTill: payload.paidTill ? new Date(payload.paidTill) : null,
    },
  });

  return result;
};

const createMonthlyPayment = async (payload: ICreateMonthlyPaymentPayload) => {
  const musulli = await prisma.musulli.findUnique({
    where: {
      id: payload.musulliId,
    },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found");
  }

  const amount = payload.amount || 0;
  const newPaidAmount = amount;
  const newDue = musulli.monthlyFee - newPaidAmount;
  
  let statusVal: "PAID" | "PARTIAL" | "DUE" = "DUE";
  if (newDue <= 0) {
    statusVal = "PAID";
  } else if (newPaidAmount > 0) {
    statusVal = "PARTIAL";
  }

  const result = await prisma.$transaction(async (tx) => {
    const monthlyPayment = await tx.monthlyPayment.create({
      data: {
        musulliId: payload.musulliId,
        billingMonth: new Date(payload.billingMonth),
        expectedAmount: musulli.monthlyFee,
        paidAmount: newPaidAmount,
        dueAmount: Math.max(newDue, 0),
        status: statusVal,
      },
    });

    let paymentLog = null;
    if (amount > 0) {
      paymentLog = await tx.paymentLog.create({
        data: {
          monthlyPaymentId: monthlyPayment.id,
          musulliId: payload.musulliId,
          amount,
          note: payload.note,
        },
      });
    }

    const updatedMusulli = await tx.musulli.update({
      where: { id: payload.musulliId },
      data: {
        paymentDue: musulli.paymentDue + musulli.monthlyFee - amount,
        paidTill:
          statusVal === "PAID"
            ? new Date(payload.billingMonth)
            : musulli.paidTill,
      },
    });

    return {
      monthlyPayment,
      paymentLog,
      musulli: updatedMusulli,
    };
  });

  return result;
};

const updateMonthlyPayment = async (payload: IUpdateMonthlyPaymentPayload) => {
  const monthlyPayment = await prisma.monthlyPayment.findUnique({
    where: {
      id: payload.monthlyPaymentId,
    },
    include: {
      musulli: true,
    },
  });

  if (!monthlyPayment) {
    throw new AppError(status.NOT_FOUND, "Payment not found");
  }

  const newPaidAmount = monthlyPayment.paidAmount + payload.amount;
  const newDue = monthlyPayment.expectedAmount - newPaidAmount;

  let statusVal: "PAID" | "PARTIAL" | "DUE" = "DUE";
  if (newDue <= 0) {
    statusVal = "PAID";
  } else if (newPaidAmount > 0) {
    statusVal = "PARTIAL";
  }

  await prisma.monthlyPayment.update({
    where: {
      id: payload.monthlyPaymentId,
    },
    data: {
      paidAmount: newPaidAmount,
      dueAmount: Math.max(newDue, 0),
      status: statusVal,
    },
  });

  await prisma.paymentLog.create({
    data: {
      monthlyPaymentId: payload.monthlyPaymentId,
      musulliId: monthlyPayment.musulli.id,
      amount: payload.amount,
      note: payload.note,
    },
  });

  await prisma.musulli.update({
    where: {
      id: monthlyPayment.musulli.id,
    },
    data: {
      paymentDue: {
        decrement: payload.amount,
      },
      paidTill:
        statusVal === "PAID"
          ? monthlyPayment.billingMonth
          : monthlyPayment.musulli.paidTill,
    },
  });

  return true;
};

const getMusulliPaymentSummary = async (musulliId: string) => {
  const musulli = await prisma.musulli.findUnique({
    where: {
      id: musulliId,
    },
    include: {
      monthlyPayments: {
        orderBy: {
          billingMonth: "desc",
        },
      },
      paymentLogs: {
        orderBy: {
          paymentDate: "desc",
        },
      },
    },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found");
  }

  return {
    name: musulli.name,
    phone: musulli.phone,
    monthlyFee: musulli.monthlyFee,
    paidTill: musulli.paidTill,
    totalDue: musulli.paymentDue,
    payments: musulli.monthlyPayments,
    transactions: musulli.paymentLogs,
  };
};

const getMosquePaymentStats = async (mosqueId: string) => {
  const musullis = await prisma.musulli.findMany({
    where: {
      mosqueId,
    },
  });

  const totalMusulli = musullis.length;
  const totalDue = musullis.reduce((acc, item) => acc + item.paymentDue, 0);
  const totalExpectedPerMonth = musullis.reduce((acc, item) => acc + item.monthlyFee, 0);

  return {
    totalMusulli,
    totalDue,
    totalExpectedPerMonth,
  };
};

const getMusullis = async (adminId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await prisma.musulli.findMany({
    where: { mosqueId: mosque.id },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getSingleMusulli = async (adminId: string, musulliId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId: mosque.id },
    include: {
      monthlyPayments: {
        orderBy: {
          billingMonth: "desc",
        },
      },
      paymentLogs: {
        orderBy: { paymentDate: "desc" },
        take: 10,
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Musulli not found in your mosque");
  }

  return result;
};

const updateMusulli = async (adminId: string, musulliId: string, payload: IUpdateMusulliPayload) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const musulli = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId: mosque.id },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found");
  }

  const result = await prisma.musulli.update({
    where: { id: musulliId },
    data: payload,
  });

  return result;
};

const createMonthlyPaymentsForAllMusullis = async (billingMonth: Date | string) => {
  const billingMonthDate = new Date(billingMonth);
  const musullis = await prisma.musulli.findMany({
    where: { isActive: true },
  });

  const results = [];

  for (const musulli of musullis) {
    try {
      const existingPayment = await prisma.monthlyPayment.findFirst({
        where: {
          musulliId: musulli.id,
          billingMonth: billingMonthDate,
        },
      });

      if (!existingPayment) {
        const result = await prisma.$transaction(async (tx) => {
          const monthlyPayment = await tx.monthlyPayment.create({
            data: {
              musulliId: musulli.id,
              billingMonth: billingMonthDate,
              expectedAmount: musulli.monthlyFee,
              paidAmount: 0,
              dueAmount: musulli.monthlyFee,
              status: "DUE",
            },
          });

          const updatedMusulli = await tx.musulli.update({
            where: { id: musulli.id },
            data: {
              paymentDue: musulli.paymentDue + musulli.monthlyFee,
            },
          });

          return { monthlyPayment, musulli: updatedMusulli };
        });

        results.push({
          musulliId: musulli.id,
          success: true,
          data: result,
        });
      } else {
        results.push({
          musulliId: musulli.id,
          success: false,
          error: "Monthly payment already exists for this billing month",
        });
      }
    } catch (error) {
      results.push({
        musulliId: musulli.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
};

export const MusulliService = {
  createMusulli,
  createMonthlyPayment,
  createMonthlyPaymentsForAllMusullis,
  updateMonthlyPayment,
  getMusulliPaymentSummary,
  getMosquePaymentStats,
  getMusullis,
  getSingleMusulli,
  updateMusulli,
};
