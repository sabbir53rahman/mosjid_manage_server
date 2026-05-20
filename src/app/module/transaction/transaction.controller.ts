import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { TransactionService } from "./transaction.service";
import AppError from "../../errorHelpers/appError";

const collectFee = catchAsync(async (req: Request, res: Response) => {
  const mosqueId = req.user.mosqueId;
  if (!mosqueId) {
    throw new AppError(status.BAD_REQUEST, "User is not associated with any mosque");
  }
  const adminName = req.user.name;
  const result = await TransactionService.collectFee(mosqueId, adminName, req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Fee collected successfully",
    data: result,
  });
});

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const mosqueId = req.user.mosqueId;
  if (!mosqueId) {
    throw new AppError(status.BAD_REQUEST, "User is not associated with any mosque");
  }
  const result = await TransactionService.getTransactions(mosqueId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Transactions fetched successfully",
    data: result,
  });
});

export const TransactionController = {
  collectFee,
  getTransactions,
};
