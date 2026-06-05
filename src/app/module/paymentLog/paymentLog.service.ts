import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICollectPaymentPayload } from "./paymentLog.interface";
import { getMusulliWithCalculations } from "../../utils/paymentCalculations";

const collectPayment = async (
  adminId: string,
  payload: ICollectPaymentPayload
) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found");
  }

  const musulli = await prisma.musulli.findFirst({
    where: {
      id: payload.musulliId,
      mosqueId: mosque.id,
    },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found");
  }

  const paidMonthDate = new Date(payload.paidMonth);
  const firstDayOfMonth = new Date(paidMonthDate.getFullYear(), paidMonthDate.getMonth(), 1);

  const existingPayment = await prisma.paymentLog.findFirst({
    where: {
      musulliId: payload.musulliId,
      paidMonth: firstDayOfMonth,
    },
  });

  if (existingPayment) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment already collected for this month"
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.paymentLog.create({
      data: {
        musulliId: payload.musulliId,
        amount: payload.amount,
        paidMonth: firstDayOfMonth,
        note: payload.note,
      },
    });

    const updatedMusulli = await tx.musulli.update({
      where: {
        id: payload.musulliId,
      },
      data: {
        totalPaid: {
          increment: payload.amount,
        },
      },
    });

    return updatedMusulli;
  });

  return getMusulliWithCalculations(result);
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
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  return result;
};

export const PaymentLogService = {
  collectPayment,
  getPaymentLogs,
};
