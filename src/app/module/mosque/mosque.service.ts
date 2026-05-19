import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICreateMosquePayload, IUpdatePrayerTimePayload } from "./mosque.interface";

const createMosque = async (payload: ICreateMosquePayload) => {
  const existingMosque = await prisma.mosque.findUnique({
    where: { slug: payload.slug },
  });

  if (existingMosque) {
    throw new AppError(status.BAD_REQUEST, "Mosque with this slug already exists");
  }

  const result = await prisma.mosque.create({
    data: payload,
  });

  return result;
};

const getMosqueDetails = async (mosqueId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { id: mosqueId },
    include: {
      prayerTime: true,
      _count: {
        select: {
          musullis: true,
          admins: true,
        },
      },
    },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found");
  }

  return mosque;
};

const updatePrayerTime = async (mosqueId: string, payload: IUpdatePrayerTimePayload) => {
  const mosque = await prisma.mosque.findUnique({
    where: { id: mosqueId },
    include: { prayerTime: true },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found");
  }

  let result;
  if (mosque.prayerTime) {
    result = await prisma.prayerTime.update({
      where: { mosqueId },
      data: payload,
    });
  } else {
    result = await prisma.prayerTime.create({
      data: {
        mosqueId,
        ...payload,
      },
    });
  }

  return result;
};

export const MosqueService = {
  createMosque,
  getMosqueDetails,
  updatePrayerTime,
};
