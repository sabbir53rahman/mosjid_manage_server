export interface ICreateMusulliPayload {
  name: string;
  phone: string;
  image?: string;
  monthlyFee: number;
  startMonth: number;
  startYear: number;
  paidTillMonth?: number;
  paidTillYear?: number;
  paymentDue?: number;
  isActive?: boolean;
}

export type IUpdateMusulliPayload = Partial<ICreateMusulliPayload>;
