import { Router } from "express";
import * as drinkController from "./drink.controller.js";
import { createDrinkSchema } from "../../modules/drinks/drink.schema.js"
import { updateDrinkSchema } from "../../modules/drinks/drink.schema.js";
import validate from "../../middleware/validate.js"

const router = Router()

router.get("/", drinkController.getDrinks);
router.get("/:id", drinkController.getADrink);
router.post("/", validate(createDrinkSchema), drinkController.addDrink);
router.put("/:id", validate(updateDrinkSchema.partial()), drinkController.updateDrink);
router.delete("/:id", drinkController.deleteDrink);

export default router;