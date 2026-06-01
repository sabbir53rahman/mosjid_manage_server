export interface ICreateMusulliPayload {
  mosqueId: string;
  name: string;
  phone: string;
  address?: string;
  image?: string;
  monthlyFee: number;
  joinedAt: Date | string;
  isActive?: boolean;
}

export type IUpdateMusulliPayload = Partial<Omit<ICreateMusulliPayload, "mosqueId">>;
