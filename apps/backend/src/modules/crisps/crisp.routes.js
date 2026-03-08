import { Router } from "express";
import * as crispController from "./crisp.controller.js";
import { createCrispSchema, updateCrispSchema } from "./crisp.schema.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.get("/", crispController.getCrisps);
router.get("/:id", crispController.getACrisp);
router.post("/", validate(createCrispSchema), crispController.addCrisp);
router.put("/:id", validate(updateCrispSchema.partial()), crispController.updateCrisp);
router.delete("/:id", crispController.deleteCrisp);

export default router;