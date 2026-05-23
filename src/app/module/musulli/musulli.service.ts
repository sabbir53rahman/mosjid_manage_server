import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICreateMusulliPayload, IUpdateMusulliPayload } from "./musulli.interface";

const createMusulli = async (payload: ICreateMusulliPayload) => {
  const result = await prisma.musulli.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getMusullis = async (adminId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await prisma.musulli.findMany({
    where: { mosqueId: mosque.id },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getSingleMusulli = async (adminId: string, musulliId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId: mosque.id },
    include: {
      monthlyPayments: {
        orderBy: [
          { year: "desc" },
          { month: "desc" },
        ],
      },
      paymentLogs: {
        orderBy: { paymentDate: "desc" },
        take: 10,
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Musulli not found in your mosque");
  }

  return result;
};

const updateMusulli = async (adminId: string, musulliId: string, payload: IUpdateMusulliPayload) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const musulli = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId: mosque.id },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found");
  }

  const result = await prisma.musulli.update({
    where: { id: musulliId },
    data: payload,
  });

  return result;
};

export const MusulliService = {
  createMusulli,
  getMusullis,
  getSingleMusulli,
  updateMusulli,
};
