import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
import { PaymentLogService } from "./paymentLog.service.js";

const collectPayment = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const result = await PaymentLogService.collectPayment(adminId, req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Payment collected successfully",
    data: result,
  });
});

const getPaymentLogs = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const result = await PaymentLogService.getPaymentLogs(adminId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment logs fetched successfully",
    data: result,
  });
});

export const PaymentLogController = {
  collectPayment,
  getPaymentLogs,
};
