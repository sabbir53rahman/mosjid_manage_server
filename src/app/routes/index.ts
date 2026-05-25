import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { MosqueRoutes } from "../module/mosque/mosque.route";
import { MusulliRoutes } from "../module/musulli/musulli.route";
import { PaymentLogRoutes } from "../module/paymentLog/paymentLog.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/mosques", MosqueRoutes);
router.use("/musullis", MusulliRoutes);
router.use("/paymentLogs", PaymentLogRoutes);

export const IndexRoutes = router;
