export interface ICollectFeePayload {
  monthlyPaymentId: string;
  amount: number;
  month : Date;
  note?: string;
}
