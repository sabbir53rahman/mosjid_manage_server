import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICollectFeePayload } from "./paymentLog.interface";

const collectFee = async (adminId: string, payload: ICollectFeePayload) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const monthlyPayment = await prisma.monthlyPayment.findUnique({
    where: { id: payload.monthlyPaymentId },
    include: { musulli: true },
  });

  if (!monthlyPayment) {
    throw new AppError(status.NOT_FOUND, "Monthly payment not found");
  }

  if (monthlyPayment.musulli.mosqueId !== mosque.id) {
    throw new AppError(status.FORBIDDEN, "This monthly payment does not belong to your mosque");
  }

  const newPaidAmount = monthlyPayment.paidAmount + payload.amount;
  const newDue = monthlyPayment.expectedAmount - newPaidAmount;

  let statusVal: "PAID" | "PARTIAL" | "DUE" = "DUE";
  if (newDue <= 0) {
    statusVal = "PAID";
  } else if (newPaidAmount > 0) {
    statusVal = "PARTIAL";
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedMonthlyPayment = await tx.monthlyPayment.update({
      where: { id: payload.monthlyPaymentId },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: Math.max(newDue, 0),
        status: statusVal,
      },
    });

    const paymentLog = await tx.paymentLog.create({
      data: {
        monthlyPaymentId: payload.monthlyPaymentId,
        musulliId: monthlyPayment.musulliId,
        amount: payload.amount,
        note: payload.note,
      },
    });

    await tx.musulli.update({
      where: { id: monthlyPayment.musulliId },
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

    return paymentLog;
  });

  return result;
};

const getPaymentLogs = async (adminId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await prisma.paymentLog.findMany({
    where: {
      musulli: {
        mosqueId: mosque.id,
      },
    },
    include: {
      musulli: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      monthlyPayment: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  return result;
};

export const PaymentLogService = {
  collectFee,
  getPaymentLogs,
};
