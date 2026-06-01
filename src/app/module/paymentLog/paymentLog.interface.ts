export interface ICollectPaymentPayload {
  musulliId: string;
  amount: number;
  paidMonth: Date | string;
  note?: string;
}
