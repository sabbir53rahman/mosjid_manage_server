import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { MusulliService } from "./musulli.service";
import AppError from "../../errorHelpers/appError";

const createMusulli = catchAsync(async (req: Request, res: Response) => {
  const result = await MusulliService.createMusulli(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Musulli created successfully",
    data: result,
  });
});

const getMusullis = catchAsync(async (req: Request, res: Response) => {
<<<<<<< HEAD
  const adminId = req.user.userId;
  const result = await MusulliService.getMusullis(adminId);
=======
  const mosqueId = req.user.mosqueId;
  if (!mosqueId) {
    throw new AppError(status.BAD_REQUEST, "User is not associated with any mosque");
  }
  const result = await MusulliService.getMusullis(mosqueId);
>>>>>>> b5cfe3b147db0af18480da9601526a66c9d2163e

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musullis fetched successfully",
    data: result,
  });
});

const getSingleMusulli = catchAsync(async (req: Request, res: Response) => {
<<<<<<< HEAD
  const musulliId = req.user.userId;
=======
  const mosqueId = req.user.mosqueId;
  if (!mosqueId) {
    throw new AppError(status.BAD_REQUEST, "User is not associated with any mosque");
  }
>>>>>>> b5cfe3b147db0af18480da9601526a66c9d2163e
  const id = req.params.id as string;
  const result = await MusulliService.getSingleMusulli(musulliId, id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musulli details fetched successfully",
    data: result,
  });
});

const updateMusulli = catchAsync(async (req: Request, res: Response) => {
<<<<<<< HEAD
  const musulliId = req.user.userId;
=======
  const mosqueId = req.user.mosqueId;
  if (!mosqueId) {
    throw new AppError(status.BAD_REQUEST, "User is not associated with any mosque");
  }
>>>>>>> b5cfe3b147db0af18480da9601526a66c9d2163e
  const id = req.params.id as string;
  const result = await MusulliService.updateMusulli(musulliId, id, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musulli updated successfully",
    data: result,
  });
});

export const MusulliController = {
  createMusulli,
  getMusullis,
  getSingleMusulli,
  updateMusulli,
};
