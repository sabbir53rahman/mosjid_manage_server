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
    // Find or create the MonthlyPayment record
    let monthlyPayment = await tx.monthlyPayment.findUnique({
      where: {
        musulliId_month_year: {
          musulliId,
          month,
          year,
        },
      },
    });

    if (!monthlyPayment) {
      const expectedAmount = musulli.monthlyFee;
      const dueAmount = expectedAmount - amount;
      const paymentStatus = amount >= expectedAmount ? "PAID" : amount > 0 ? "PARTIAL" : "DUE";

      monthlyPayment = await tx.monthlyPayment.create({
        data: {
          musulliId,
          month,
          year,
          expectedAmount,
          paidAmount: amount,
          dueAmount: dueAmount < 0 ? 0 : dueAmount,
          status: paymentStatus,
        },
      });
    } else {
      const totalPaid = monthlyPayment.paidAmount + amount;
      const dueAmount = monthlyPayment.expectedAmount - totalPaid;
      const paymentStatus = totalPaid >= monthlyPayment.expectedAmount ? "PAID" : totalPaid > 0 ? "PARTIAL" : "DUE";

      monthlyPayment = await tx.monthlyPayment.update({
        where: { id: monthlyPayment.id },
        data: {
          paidAmount: totalPaid,
          dueAmount: dueAmount < 0 ? 0 : dueAmount,
          status: paymentStatus,
        },
      });
    }

    // Create the payment log record
    const paymentLog = await tx.paymentLog.create({
      data: {
        musulliId,
        monthlyPaymentId: monthlyPayment.id,
        amount,
        paymentDate: new Date(paymentDate),
        note,
      },
    });

    // Update musulli overall due
    await tx.musulli.update({
      where: { id: musulliId },
      data: {
        paymentDue: {
          decrement: amount,
        },
      },
    });

    return paymentLog;
  });

  return result;
};

const getTransactions = async (mosqueId: string) => {
  const result = await prisma.paymentLog.findMany({
    where: {
      musulli: {
        mosqueId,
      },
    },
    include: {
      musulli: {
        select: {
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

export const TransactionService = {
  collectFee,
  getTransactions,
};
