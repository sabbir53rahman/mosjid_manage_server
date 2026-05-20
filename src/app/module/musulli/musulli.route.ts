import { Router } from "express";
import { MusulliController } from "./musulli.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { updateMusulliSchema } from "./musulli.validation";

const router = Router();

router.post(
  "/",
  // checkAuth("MOSQUE_ADMIN"),
  // validateRequest(createMusulliSchema),
  MusulliController.createMusulli
);

router.get("/", checkAuth("MOSQUE_ADMIN"), MusulliController.getMusullis);

router.get("/:id", checkAuth("MOSQUE_ADMIN"), MusulliController.getSingleMusulli);

router.put(
  "/:id",
  checkAuth("MOSQUE_ADMIN"),
  validateRequest(updateMusulliSchema),
  MusulliController.updateMusulli
);

export const MusulliRoutes = router;
