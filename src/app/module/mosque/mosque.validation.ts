import { z } from "zod";

export const createMosqueSchema = z.object({
  body: z.object({
    name: z.string(),
    slug: z.string(),
    address: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    logo: z.string().optional(),
  }),
});

export const updatePrayerTimeSchema = z.object({
  body: z.object({
    fajr: z.string(),
    zuhr: z.string(),
    asr: z.string(),
    maghrib: z.string(),
    isha: z.string(),
    jummah: z.string().optional(),
  }),
});
