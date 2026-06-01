import { z } from "zod";

export const createMusulliSchema = z.object({
  body: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string().optional(),
    image: z.string().optional(),
    monthlyFee: z.number().min(0),
    joinedAt: z.string().or(z.date()),
    isActive: z.boolean().optional(),
  }),
});

export const updateMusulliSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    image: z.string().optional(),
    monthlyFee: z.number().min(0).optional(),
    joinedAt: z.string().or(z.date()).optional(),
    isActive: z.boolean().optional(),
  }),
});
