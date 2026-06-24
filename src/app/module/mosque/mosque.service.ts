import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { ICreateMosquePayload, IUpdatePrayerTimePayload } from "./mosque.interface";
import { Role } from "../../../generated/prisma/enums";

const createMosque = async (payload: ICreateMosquePayload) => {
  const existingMosque = await prisma.mosque.findUnique({
    where: { slug: payload.mosqueData.slug },
  });

  if (existingMosque) {
    throw new AppError(status.BAD_REQUEST, "Mosque with this slug already exists");
  }

  const result = await prisma.mosque.create({
    data: {
      ...payload.mosqueData,
      ownerId: payload.ownerId,
      logo: payload.logoUrl,
    },
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

// search with name and add pagination

const getAllMosques = async (search?: string, page?: string, limit?: string) => {
  const pageNumber = page ? parseInt(page) : 1;
  const limitNumber = limit ? parseInt(limit) : 10;
  const skip = (pageNumber - 1) * limitNumber;

  const whereClause: any = {};

  if (search) {
    whereClause.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [mosques, total] = await prisma.$transaction([
    prisma.mosque.findMany({
      where: whereClause,
      skip,
      take: limitNumber,
      include: {
        prayerTime: true,
        _count: {
          select: {
            musullis: true,
          },
        },
      },
    }),

    prisma.mosque.count({ where: whereClause }),
  ]);

  return { mosques, total };
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
  getAllMosques,
  getMosqueDetails,
  updatePrayerTime,
};
