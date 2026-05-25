import { z } from "zod";

export const collectFeeSchema = z.object({
  body: z.object({
    monthlyPaymentId: z.string(),
    amount: z.number().min(1),
    note: z.string().optional(),
  }),
});
