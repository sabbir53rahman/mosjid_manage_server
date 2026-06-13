import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { CollectPaymentPayload } from "./paymentLog.interface";
import { getMusulliWithCalculations } from "../../utils/paymentCalculations";

const collectPayment = async (
  adminId: string,
  payload: CollectPaymentPayload
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

  if (payload.amount <= 0) {
    throw new AppError(status.BAD_REQUEST, "Amount must be greater than 0");
  }

  const { monthlyFee } = musulli;

  // Determine starting month:
  // If lastPaidMonth exists → next month after it
  // If null → the month musulli joined
  const getStartMonth = (): Date => {
    if (musulli.lastPaidMonth) {
      const next = new Date(musulli.lastPaidMonth);
      next.setMonth(next.getMonth() + 1);
      return new Date(next.getFullYear(), next.getMonth(), 1);
    }
    return new Date(musulli.joinedAt.getFullYear(), musulli.joinedAt.getMonth(), 1);
  };

  // Check if there's an existing partial payment log to carry forward
  const startMonth = getStartMonth();

  const existingPartial = await prisma.paymentLog.findUnique({
    where: {
      musulliId_paidMonth: {
        musulliId: musulli.id,
        paidMonth: startMonth,
      },
    },
  });

  // Already carried amount from previous partial payment
  const carriedAmount = existingPartial ? existingPartial.amount : 0;
  let remaining = payload.amount;
  let currentMonth = startMonth;
  let lastFullyPaidMonth: Date | null = null;

  const paymentLogsToCreate: {
    musulliId: string;
    amount: number;
    paidMonth: Date;
    isFullyPaid: boolean;
  }[] = [];

  let partialUpdateLog: { id: string; amount: number; isFullyPaid: boolean } | null = null;

  // If there's an existing partial log, try to complete it first
  if (existingPartial) {
    const needed = monthlyFee - carriedAmount;
    if (remaining >= needed) {
      // Complete the partial month
      partialUpdateLog = {
        id: existingPartial.id,
        amount: monthlyFee,
        isFullyPaid: true,
      };
      remaining -= needed;
      lastFullyPaidMonth = currentMonth;
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    } else {
      // Still not enough to complete partial month
      partialUpdateLog = {
        id: existingPartial.id,
        amount: carriedAmount + remaining,
        isFullyPaid: false,
      };
      remaining = 0;
    }
  }

  // Distribute remaining amount across subsequent months
  while (remaining > 0) {
    if (remaining >= monthlyFee) {
      paymentLogsToCreate.push({
        musulliId: musulli.id,
        amount: monthlyFee,
        paidMonth: currentMonth,
        isFullyPaid: true,
      });
      lastFullyPaidMonth = currentMonth;
      remaining -= monthlyFee;
    } else {
      // Partial payment for this month
      paymentLogsToCreate.push({
        musulliId: musulli.id,
        amount: remaining,
        paidMonth: currentMonth,
        isFullyPaid: false,
      });
      remaining = 0;
    }
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update existing partial log if applicable
    if (partialUpdateLog) {
      await tx.paymentLog.update({
        where: { id: partialUpdateLog.id },
        data: {
          amount: partialUpdateLog.amount,
          isFullyPaid: partialUpdateLog.isFullyPaid,
        },
      });
    }

    // Create new payment logs
    if (paymentLogsToCreate.length > 0) {
      await tx.paymentLog.createMany({
        data: paymentLogsToCreate,
      });
    }

    // Update musulli totalPaid and lastPaidMonth
    const updatedMusulli = await tx.musulli.update({
      where: { id: musulli.id },
      data: {
        totalPaid: { increment: payload.amount },
        // Only update lastPaidMonth if there are new fully paid months
        ...(lastFullyPaidMonth && { lastPaidMonth: lastFullyPaidMonth }),
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
      createdAt: "desc",
    },
  });

  return result;
};

export const PaymentLogService = {
  collectPayment,
  getPaymentLogs,
};
