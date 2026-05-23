import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { MusulliService } from "./musulli.service";

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
  const musulliId = req.user.userId;
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
  const musulliId = req.user.userId;
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
