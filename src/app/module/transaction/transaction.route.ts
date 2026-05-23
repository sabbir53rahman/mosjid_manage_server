import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { collectFeeSchema } from "./transaction.validation";

const router = Router();

router.post(
  "/collect",
<<<<<<< HEAD
  checkAuth("MOSQUE_ADMIN", ),
=======
  checkAuth("MOSQUE_ADMIN"),
>>>>>>> b5cfe3b147db0af18480da9601526a66c9d2163e
  validateRequest(collectFeeSchema),
  TransactionController.collectFee
);

router.get("/", checkAuth("MOSQUE_ADMIN"), TransactionController.getTransactions);

export const TransactionRoutes = router;
