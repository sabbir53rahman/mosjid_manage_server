import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { MusulliService } from "./musulli.service";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";

const createMusulli = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;

  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await MusulliService.createMusulli({
    ...req.body,
    mosqueId: mosque.id,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Musulli created successfully",
    data: result,
  });
});

const getMusullis = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const result = await MusulliService.getMusullis(adminId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musullis fetched successfully",
    data: result,
  });
});

const getSingleMusulli = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const id = req.params.id as string;
  const result = await MusulliService.getSingleMusulli(adminId, id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musulli details fetched successfully",
    data: result,
  });
});

const updateMusulli = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const id = req.params.id as string;
  const result = await MusulliService.updateMusulli(adminId, id, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musulli updated successfully",
    data: result,
  });
});

const deleteMusulli = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const id = req.params.id as string;
  const result = await MusulliService.deleteMusulli(adminId, id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musulli deleted successfully",
    data: result,
  });
});

export const MusulliController = {
  createMusulli,
  getMusullis,
  getSingleMusulli,
  updateMusulli,
  deleteMusulli,
};
