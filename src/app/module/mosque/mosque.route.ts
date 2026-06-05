import { Router } from "express";
import { MosqueController } from "./mosque.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {  updatePrayerTimeSchema } from "./mosque.validation.js";

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
