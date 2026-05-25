import { Router } from "express";
import { MusulliController } from "./musulli.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createMusulliSchema,
  updateMusulliSchema,
  createMonthlyPaymentSchema,
  updateMonthlyPaymentSchema,
  createMonthlyPaymentsForAllSchema,
} from "./musulli.validation";

const router = Router();

router.post(
  "/",
  checkAuth("MOSQUE_ADMIN"),
  // validateRequest(createMusulliSchema),
  MusulliController.createMusulli
);

router.get("/", checkAuth("MOSQUE_ADMIN"), MusulliController.getMusullis);

router.get("/stats", checkAuth("MOSQUE_ADMIN"), MusulliController.getMosquePaymentStats);

router.post(
  "/create-monthly-payments-for-all",
  checkAuth("SUPER_ADMIN"),
  // validateRequest(createMonthlyPaymentsForAllSchema),
  MusulliController.createMonthlyPaymentsForAll
);

router.get("/:id", checkAuth("MOSQUE_ADMIN"), MusulliController.getSingleMusulli);

router.get("/:id/payment-summary", checkAuth("MOSQUE_ADMIN"), MusulliController.getMusulliPaymentSummary);

router.post(
  "/:id/monthly-payment",
  checkAuth("MOSQUE_ADMIN"),
  // validateRequest(createMonthlyPaymentSchema),
  MusulliController.createMonthlyPayment
);

router.put(
  "/monthly-payment/:monthlyPaymentId",
  checkAuth("MOSQUE_ADMIN"),
  // validateRequest(updateMonthlyPaymentSchema),
  MusulliController.updateMonthlyPayment
);

router.put(
  "/:id",
  checkAuth("MOSQUE_ADMIN"),
  // validateRequest(updateMusulliSchema),
  MusulliController.updateMusulli
);

export const MusulliRoutes = router;
