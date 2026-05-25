import { Router } from "express";
import { PaymentLogController } from "./paymentLog.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { collectFeeSchema } from "./paymentLog.validation";

const router = Router();

router.post(
  "/collect",
  checkAuth("MOSQUE_ADMIN"),
  // validateRequest(collectFeeSchema),
  PaymentLogController.collectFee
);

router.get("/", checkAuth("MOSQUE_ADMIN"), PaymentLogController.getPaymentLogs);

export const PaymentLogRoutes = router;
