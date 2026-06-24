//  const result = await MosqueService.createMosque(
//     mosqueData,
//     ownerId,
//     logoUrl,
//   );

export interface ICreateMosquePayload {
  ownerId: string;
  mosqueData: {
    name: string;
    slug: string;
    address: string;
    phone?: string;
  };
  logoUrl?: string;
}

export interface IUpdatePrayerTimePayload {
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah?: string;
}
