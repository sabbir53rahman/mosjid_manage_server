import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICreateMosquePayload, IUpdatePrayerTimePayload } from "./mosque.interface";
import { Role } from "../../../generated/prisma/enums";

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

  await prisma.user.update({
    where: { id: payload.ownerId },
    data: {
      role: Role.MOSQUE_ADMIN,
    },
  });

  return result;
};

const getMosqueDetails = async (ownerId: string) => {
  const mosque = await prisma.mosque.findUnique({
    where: { ownerId },
    include: {
      prayerTime: true,
      _count: {
        select: {
          musullis: true,
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
