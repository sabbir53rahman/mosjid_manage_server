import { z } from "zod";

export const createMusulliSchema = z.object({
  body: z.object({
    name: z.string(),
    phone: z.string(),
    image: z.string().optional(),
    monthlyFee: z.number().min(0),
    startMonth: z.number().min(1).max(12),
    startYear: z.number(),
    paidTillMonth: z.number().min(1).max(12).optional(),
    paidTillYear: z.number().optional(),
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
    isActive: z.boolean().optional(),
  }),
});
