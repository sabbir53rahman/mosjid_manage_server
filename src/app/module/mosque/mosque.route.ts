import { Router } from "express";
import { MosqueController } from "./mosque.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import {  updatePrayerTimeSchema } from "./mosque.validation";

const router = Router();

router.post(
  "/",
  checkAuth('USER'),
  // validateRequest(createMosqueSchema),
  MosqueController.createMosque
);

router.get("/my-mosque",
  checkAuth("MOSQUE_ADMIN"),
  MosqueController.getMosqueDetails);

router.get("/", MosqueController.getAllMosques);

router.put(
  "/prayer-times",
  checkAuth("MOSQUE_ADMIN"),
  validateRequest(updatePrayerTimeSchema),
  MosqueController.updatePrayerTime
);

export const MosqueRoutes = router;
