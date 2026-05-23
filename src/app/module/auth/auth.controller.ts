import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenHelpers } from "../../utils/token";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  const { accessToken, refreshToken } = result;

  tokenHelpers.setAccessTokenCookie(res, accessToken);
  tokenHelpers.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  const { accessToken, refreshToken } = result;

  tokenHelpers.setAccessTokenCookie(res, accessToken);
  tokenHelpers.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

<<<<<<< HEAD
const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.getMe(req.user?.userId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User fetched successfully",
=======
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.body);

  tokenHelpers.setAccessTokenCookie(res, result.accessToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Token refreshed successfully",
>>>>>>> b5cfe3b147db0af18480da9601526a66c9d2163e
    data: result,
  });
});

<<<<<<< HEAD
export const authController = {
  registerUser,
  loginUser,
  getMe,
=======
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await authService.changePassword(userId, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const { cookieHelpers } = await import("../../utils/cookie");

  cookieHelpers.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  cookieHelpers.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const authController = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
  logout,
>>>>>>> b5cfe3b147db0af18480da9601526a66c9d2163e
};
