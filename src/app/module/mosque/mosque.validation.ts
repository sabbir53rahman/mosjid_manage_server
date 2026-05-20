import { z } from "zod";


// export interface ICreateMosquePayload {
//   name: string;
//   slug: string;
//   address: string;
//   phone?: string;
//   logo?: string;
// }

export const createMosqueSchema = z.object({
  body: z.object({
    name: z.string(),
    address: z.string(),
    slug: z.string(),
    phone: z.string().optional(),
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
