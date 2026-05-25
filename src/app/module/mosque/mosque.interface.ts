export interface ICreateMosquePayload {
  name: string;
  slug: string;
  address: string;
  phone?: string;
}

export interface IUpdatePrayerTimePayload {
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah?: string;
}
