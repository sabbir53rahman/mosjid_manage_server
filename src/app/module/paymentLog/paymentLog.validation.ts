import { z } from "zod";

export const collectPaymentSchema = z.object({
  body: z.object({
    musulliId: z.string(),
    amount: z.number().min(1),
    paidMonth: z.string().or(z.date()),
    note: z.string().optional(),
  }),
});
