export interface ICollectFeePayload {
  musulliId: string;
  month: number;
  year: number;
  amount: number;
  paymentDate: string;
  note?: string;
}
