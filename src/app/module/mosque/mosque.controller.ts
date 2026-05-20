import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { MosqueService } from "./mosque.service";
import AppError from "../../errorHelpers/appError";

const createMosque = catchAsync(async (req: Request, res: Response) => {
  // const ownerId = req.user?.userId;
  // if (!ownerId) {
  //   throw new AppError(status.NOT_FOUND, "User not found");
  // }
  const result = await MosqueService.createMosque(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Mosque created successfully",
    data: result,
  });
});

const getMosqueDetails = catchAsync(async (req: Request, res: Response) => {
  // Using the mosqueId from the logged-in admin's token
  const ownerId = req.params.ownerId;
  const result = await MosqueService.getMosqueDetails(ownerId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Mosque details fetched successfully",
    data: result,
  });
});

const updatePrayerTime = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user.userId;
  const result = await MosqueService.updatePrayerTime(ownerId, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Prayer times updated successfully",
    data: result,
  });
});

export const MosqueController = {
  createMosque,
  getMosqueDetails,
  updatePrayerTime,
};
