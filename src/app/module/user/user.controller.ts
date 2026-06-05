import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync.js";
import { UserService } from "./user.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getMyProfile(user.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

export const UserController = {
  getMyProfile,
};
