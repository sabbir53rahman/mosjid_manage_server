import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { MosqueRoutes } from "../module/mosque/mosque.route";
import { MusulliRoutes } from "../module/musulli/musulli.route";
import { TransactionRoutes } from "../module/transaction/transaction.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/mosques", MosqueRoutes);
router.use("/musullis", MusulliRoutes);
router.use("/transactions", TransactionRoutes);

export const IndexRoutes = router;
