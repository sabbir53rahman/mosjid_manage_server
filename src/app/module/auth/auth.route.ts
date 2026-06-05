import { Router } from "express";
import { authController } from "./auth.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/me", checkAuth("USER", "MOSQUE_ADMIN", "SUPER_ADMIN"), authController.getMe);

export const AuthRoutes = router;
