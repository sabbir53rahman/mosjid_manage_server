import { Router } from "express";
import { MosqueController } from "./mosque.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createMosqueSchema, updatePrayerTimeSchema } from "./mosque.validation";

const router = Router();

router.post(
  "/",
  checkAuth("SUPER_ADMIN"),
  validateRequest(createMosqueSchema),
  MosqueController.createMosque
);

router.get("/my-mosque", checkAuth("MOSQUE_ADMIN", "STAFF", "SUPER_ADMIN"), MosqueController.getMosqueDetails);

router.put(
  "/prayer-times",
  checkAuth("MOSQUE_ADMIN", "STAFF"),
  validateRequest(updatePrayerTimeSchema),
  MosqueController.updatePrayerTime
);

export const MosqueRoutes = router;
