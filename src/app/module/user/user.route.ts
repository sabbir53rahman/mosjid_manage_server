import { Router } from "express";
import { UserController } from "./user.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";

const router = Router();

router.get("/me", checkAuth(), UserController.getMyProfile);

export const UserRoutes = router;
