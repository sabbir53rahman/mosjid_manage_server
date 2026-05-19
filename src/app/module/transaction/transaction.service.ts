import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICollectFeePayload } from "./transaction.interface";

const collectFee = async (mosqueId: string, collectedBy: string, payload: ICollectFeePayload) => {
  const { musulliId, month, year, amount, paymentDate, note } = payload;

  const musulli = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Find or create the MonthlyFee record
    let monthlyFee = await tx.monthlyFee.findUnique({
      where: {
        musulliId_month_year: {
          musulliId,
          month,
          year,
        },
      },
    });

    if (!monthlyFee) {
      monthlyFee = await tx.monthlyFee.create({
        data: {
          musulliId,
          month,
          year,
          expectedAmount: musulli.monthlyFee,
          paidAmount: amount,
          dueAmount: musulli.monthlyFee - amount,
        },
      });
    } else {
      monthlyFee = await tx.monthlyFee.update({
        where: { id: monthlyFee.id },
        data: {
          paidAmount: monthlyFee.paidAmount + amount,
          dueAmount: monthlyFee.dueAmount - amount < 0 ? 0 : monthlyFee.dueAmount - amount,
        },
      });
    }

    // Create the transaction record
    const transaction = await tx.transaction.create({
      data: {
        mosqueId,
        musulliId,
        monthlyFeeId: monthlyFee.id,
        amount,
        paymentDate: new Date(paymentDate),
        note,
        collectedBy,
      },
    });

    // Update musulli overall due (this is a simplified logic, ideally recalculate all dues)
    await tx.musulli.update({
      where: { id: musulliId },
      data: {
        paymentDue: {
          decrement: amount,
        },
        // We can also try to update paidTillMonth/Year if this month is fully paid,
        // but for simplicity, we just track the exact payments per month.
      },
    });

    return transaction;
  });

  return result;
};

const getTransactions = async (mosqueId: string) => {
  const result = await prisma.transaction.findMany({
    where: { mosqueId },
    include: {
      musulli: {
        select: {
          name: true,
          phone: true,
        },
      },
      monthlyFee: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  return result;
};

export const TransactionService = {
  collectFee,
  getTransactions,
};
