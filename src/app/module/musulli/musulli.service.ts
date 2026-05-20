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

const getMusullis = async (mosqueId: string) => {
  const result = await prisma.musulli.findMany({
    where: { mosqueId },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getSingleMusulli = async (mosqueId: string, musulliId: string) => {
  const result = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId },
    include: {
      monthlyFees: {
        orderBy: [
          { year: "desc" },
          { month: "desc" },
        ],
      },
      transactions: {
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

const updateMusulli = async (mosqueId: string, musulliId: string, payload: IUpdateMusulliPayload) => {
  const musulli = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId },
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
