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

const createMonthlyPayment = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const musulliId = req.params.id as string;

  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const musulli = await prisma.musulli.findFirst({
    where: { id: musulliId, mosqueId: mosque.id },
  });

  if (!musulli) {
    throw new AppError(status.NOT_FOUND, "Musulli not found in your mosque");
  }

  const result = await MusulliService.createMonthlyPayment({
    musulliId,
    billingMonth: req.body.billingMonth,
    amount: req.body.amount,
    note: req.body.note,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Monthly payment created successfully",
    data: result,
  });
});

const updateMonthlyPayment = catchAsync(async (req: Request, res: Response) => {
  const monthlyPaymentId = req.params.monthlyPaymentId as string;
  const result = await MusulliService.updateMonthlyPayment({
    monthlyPaymentId,
    amount: req.body.amount,
    note: req.body.note,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Monthly payment updated successfully",
    data: result,
  });
});

const getMusulliPaymentSummary = catchAsync(async (req: Request, res: Response) => {
  const musulliId = req.params.id as string;
  const result = await MusulliService.getMusulliPaymentSummary(musulliId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Musulli payment summary fetched successfully",
    data: result,
  });
});

const getMosquePaymentStats = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;

  const mosque = await prisma.mosque.findUnique({
    where: { ownerId: adminId },
  });

  if (!mosque) {
    throw new AppError(status.NOT_FOUND, "Mosque not found for this admin");
  }

  const result = await MusulliService.getMosquePaymentStats(mosque.id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Mosque payment stats fetched successfully",
    data: result,
  });
});

const createMonthlyPaymentsForAll = catchAsync(async (req: Request, res: Response) => {
  const result = await MusulliService.createMonthlyPaymentsForAllMusullis(req.body.billingMonth);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Monthly payments creation process completed",
    data: result,
  });
});

export const MusulliController = {
  createMusulli,
  getMusullis,
  getSingleMusulli,
  updateMusulli,
  createMonthlyPayment,
  updateMonthlyPayment,
  getMusulliPaymentSummary,
  getMosquePaymentStats,
  createMonthlyPaymentsForAll,
};
