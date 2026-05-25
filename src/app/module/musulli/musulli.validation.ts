import { z } from "zod";

export const createMusulliSchema = z.object({
  body: z.object({
    name: z.string(),
    phone: z.string(),
    image: z.string().optional(),
    monthlyFee: z.number().min(0),
    joinedAt: z.string().or(z.date()),
    paidTill: z.string().or(z.date()).optional(),
    paymentDue: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateMusulliSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
    monthlyFee: z.number().min(0).optional(),
    joinedAt: z.string().or(z.date()).optional(),
    paidTill: z.string().or(z.date()).optional(),
    paymentDue: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createMonthlyPaymentSchema = z.object({
  body: z.object({
    billingMonth: z.string().or(z.date()),
    amount: z.number().min(0).optional(),
    note: z.string().optional(),
  }),
});

export const updateMonthlyPaymentSchema = z.object({
  body: z.object({
    amount: z.number().min(1),
    note: z.string().optional(),
  }),
});

export const createMonthlyPaymentsForAllSchema = z.object({
  body: z.object({
    billingMonth: z.string().or(z.date()),
  }),
});
