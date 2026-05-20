// model Musulli {
//   id String @id @default(cuid())

//   mosqueId String

//   linkedUserId String? @unique

//   name String

//   phone Int

//   image String?

//   monthlyFee Float

//   startMonth Int
//   startYear  Int

//   paidTillMonth Int?
//   paidTillYear  Int?

//   paymentDue Float @default(0)

//   isActive Boolean @default(true)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   mosque Mosque @relation(fields: [mosqueId], references: [id], onDelete: Cascade)

//   linkedUser User? @relation(fields: [linkedUserId], references: [id])

//   monthlyPayments MonthlyPayment[]

//   paymentLogs PaymentLog[]

//   @@index([mosqueId])
//   @@index([phone])
// }

export interface ICreateMusulliPayload {
  mosqueId: string;
  linkedUserId?: string;
  name: string;
  phone: number;
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
