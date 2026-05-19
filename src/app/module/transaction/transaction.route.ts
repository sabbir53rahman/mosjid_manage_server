import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { collectFeeSchema } from "./transaction.validation";

const router = Router();

router.post(
  "/collect",
  checkAuth("MOSQUE_ADMIN", "STAFF"),
  validateRequest(collectFeeSchema),
  TransactionController.collectFee
);

router.get("/", checkAuth("MOSQUE_ADMIN", "STAFF"), TransactionController.getTransactions);

export const TransactionRoutes = router;
