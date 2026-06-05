import { Router } from "express";
import { PaymentLogController } from "./paymentLog.controller";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/collect",
  checkAuth("MOSQUE_ADMIN"),
  // validateRequest(collectPaymentSchema),
  PaymentLogController.collectPayment
);

router.get("/", checkAuth("MOSQUE_ADMIN"), PaymentLogController.getPaymentLogs);

export const PaymentLogRoutes = router;
