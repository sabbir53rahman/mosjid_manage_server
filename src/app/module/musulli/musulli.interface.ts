export interface ICreateMusulliPayload {
  mosqueId: string;
  linkedUserId?: string;
  name: string;
  phone: string;
  image?: string;
  monthlyFee: number;
  joinedAt: Date | string;
  paidTill?: Date | string;
  paymentDue?: number;
  isActive?: boolean;
}

export type IUpdateMusulliPayload = Partial<ICreateMusulliPayload>;

export interface ICreateMonthlyPaymentPayload {
  musulliId: string;
  billingMonth: Date | string;
  amount?: number;
  note?: string;
}

export interface IUpdateMonthlyPaymentPayload {
  monthlyPaymentId: string;
  amount: number;
  note?: string;
}
