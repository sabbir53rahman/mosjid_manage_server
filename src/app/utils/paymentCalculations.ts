/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  startOfMonth,
  isBefore,
  isSameMonth,
  addMonths,
  format,
} from "date-fns";
import type { Musulli, PaymentLog } from "../../generated/prisma/client.js";

export interface MusulliWithCalculations extends Musulli {
  totalMonths: number;
  expectedAmount: number;
  dueAmount: number;
  paidMonths: number;
  paidTill: Date | null;
  dueMonths: string[];
}

export const calculateTotalMonths = (joinedAt: Date): number => {
  const now = new Date();
  const joined = new Date(joinedAt);

  const yearsDiff = now.getFullYear() - joined.getFullYear();
  const monthsDiff = now.getMonth() - joined.getMonth();

  return yearsDiff * 12 + monthsDiff + 1;
};

export const calculateExpectedAmount = (monthlyFee: number, joinedAt: Date): number => {
  const totalMonths = calculateTotalMonths(joinedAt);
  return totalMonths * monthlyFee;
};

export const calculateDue = (monthlyFee: number, joinedAt: Date, totalPaid: number): number => {
  const expectedAmount = calculateExpectedAmount(monthlyFee, joinedAt);
  return Math.max(expectedAmount - totalPaid, 0);
};

export const calculatePaidMonths = (monthlyFee: number, totalPaid: number): number => {
  if (monthlyFee <= 0) return 0;
  return Math.floor(totalPaid / monthlyFee);
};

export const getDueMonths = (
  joinedAt: Date,
  paymentLogs: { paidMonth: Date }[],
): string[] => {
  const paidMonthsSet = new Set(
    paymentLogs.map((log) => format(log.paidMonth, "yyyy-MM"),
  ));

  const dueMonths: string[] = [];
  let current = startOfMonth(new Date(joinedAt));
  const now = startOfMonth(new Date());

  while (isBefore(current, now) || isSameMonth(current, now)) {
    const monthKey = format(current, "yyyy-MM");
    if (!paidMonthsSet.has(monthKey)) {
      dueMonths.push(monthKey);
    }
    current = addMonths(current, 1);
  }

  return dueMonths;
};

export const getMusulliWithCalculations = (
  musulli: Musulli & { paymentLogs?: PaymentLog[] },
): MusulliWithCalculations => {
  const currentDate = new Date();
  const joinedDate = new Date(musulli.joinedAt);

  const totalMonths =
    (currentDate.getFullYear() - joinedDate.getFullYear()) * 12 +
    (currentDate.getMonth() - joinedDate.getMonth()) +
    1;

  const expectedAmount = totalMonths * musulli.monthlyFee;
  const dueAmount = Math.max(expectedAmount - musulli.totalPaid, 0);
  const paidMonths = Math.floor(musulli.totalPaid / musulli.monthlyFee);

  let paidTill: Date | null = null;
  if (paidMonths > 0) {
    const paidDate = new Date(joinedDate);
    paidDate.setMonth(joinedDate.getMonth() + paidMonths - 1);
    paidTill = paidDate;
  }

  const dueMonths = getDueMonths(
    musulli.joinedAt,
    musulli.paymentLogs || [],
  );

  return {
    ...musulli,
    totalMonths,
    expectedAmount,
    dueAmount,
    paidMonths,
    paidTill,
    dueMonths,
  };
};
