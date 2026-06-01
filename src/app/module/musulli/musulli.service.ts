/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICreateMusulliPayload, IUpdateMusulliPayload } from "./musulli.interface";
import { getMusulliWithCalculations } from "../../utils/paymentCalculations";

const createMusulli = async (payload: ICreateMusulliPayload) => {
  const result = await prisma.musulli.create({
    data: {
      ...payload,
      joinedAt: new Date(payload.joinedAt),
    },
  });

  return getMusulliWithCalculations(result);
};

const getMusullis = async (adminId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const musullis = await prisma.musulli.findMany({
    where: { mosqueId: mosque.id },
    orderBy: { createdAt: "desc" },
  });

  return musullis.map(getMusulliWithCalculations);
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
      paymentLogs: {
        orderBy: { paymentDate: "desc" },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Musulli not found in your mosque");
  }

  return getMusulliWithCalculations(result);
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

  const updateData: any = { ...payload };
  if (payload.joinedAt) {
    updateData.joinedAt = new Date(payload.joinedAt);
  }

  const result = await prisma.musulli.update({
    where: { id: musulliId },
    data: updateData,
  });

  return getMusulliWithCalculations(result);
};

const deleteMusulli = async (adminId: string, musulliId: string) => {
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

  await prisma.musulli.delete({
    where: { id: musulliId },
  });

  return { message: "Musulli deleted successfully" };
};

export const MusulliService = {
  createMusulli,
  getMusullis,
  getSingleMusulli,
  updateMusulli,
  deleteMusulli,
};
