import { Router } from "express";
import * as foodController from "./food.controller.js"
import { createFoodSchema } from "./food.schema.js"
import { updateFoodSchema } from "./food.schema.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.get("/", foodController.getFoods);
router.get("/:id", foodController.getAFood);
router.post("/", validate(createFoodSchema), foodController.addFood);
router.put("/:id", validate(updateFoodSchema.partial()), foodController.updateFood);
router.delete("/:id", foodController.deleteFood);

export default router;