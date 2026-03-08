import { Router } from "express";
import * as buscuitController from "./buscuit.controller.js";
import { createBuscuitSchema, updateBuscuitSchema } from "./buscuit.schema.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.get("/", buscuitController.getBuscuits);
router.get("/:id", buscuitController.getABuscuit);
router.post("/", validate(createBuscuitSchema), buscuitController.addBuscuit);
router.put("/:id", validate(updateBuscuitSchema.partial()), buscuitController.updateBuscuit);
router.delete("/:id", buscuitController.deleteBuscuit);

export default router;