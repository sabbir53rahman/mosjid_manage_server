import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { PaymentLogService } from "./paymentLog.service";

const collectFee = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const result = await PaymentLogService.collectFee(adminId, req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Fee collected successfully",
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
  collectFee,
  getPaymentLogs,
};
