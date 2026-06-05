import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route.js";
import { UserRoutes } from "../module/user/user.route.js";
import { MosqueRoutes } from "../module/mosque/mosque.route.js";
import { MusulliRoutes } from "../module/musulli/musulli.route.js";
import { PaymentLogRoutes } from "../module/paymentLog/paymentLog.route.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/mosques", MosqueRoutes);
router.use("/musullis", MusulliRoutes);
router.use("/payments", PaymentLogRoutes);

export const IndexRoutes = router;
