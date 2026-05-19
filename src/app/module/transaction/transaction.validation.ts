import { z } from "zod";

export const collectFeeSchema = z.object({
  body: z.object({
    musulliId: z.string(),
    month: z.number().min(1).max(12),
    year: z.number(),
    amount: z.number().min(1),
    paymentDate: z.string(),
    note: z.string().optional(),
  }),
});
