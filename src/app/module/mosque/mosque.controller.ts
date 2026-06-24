import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { MosqueService } from "./mosque.service";
import { uploadFileToCloudinary } from "../../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";

const createMosque = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user?.userId;
  if (!ownerId) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const { logo, ...mosqueData } = req.body;
  let logoUrl: string | undefined;

  if (logo) {
    const uploadResult = await uploadFileToCloudinary(logo, "mosque-logos");
    logoUrl = uploadResult.secure_url;
  }

  const result = await MosqueService.createMosque({
    mosqueData,
    ownerId,
    logoUrl,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Mosque created successfully",
    data: result,
  });
});

const getMosqueDetails = catchAsync(async (req: Request, res: Response) => {
  // Using the mosqueId from the logged-in admin's token
  const ownerId = req.user.userId;
  const result = await MosqueService.getMosqueDetails(ownerId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Mosque details fetched successfully",
    data: result,
  });
});


// search and pagination
const getAllMosques = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, search } = req.query;
  console.log(page, search);
  const result = await MosqueService.getAllMosques(search as string, page as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Mosques fetched successfully",
    data: result,
  });
});

const updatePrayerTime = catchAsync(async (req: Request, res: Response) => {
  const mosqueId = req.user.mosqueId;
  if (!mosqueId) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this user");
  }
  const result = await MosqueService.updatePrayerTime(mosqueId, req.body);

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
  getAllMosques,
  updatePrayerTime,
};


// 20000 * 12 = 240000