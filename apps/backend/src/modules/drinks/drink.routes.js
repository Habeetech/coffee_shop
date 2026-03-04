import { Router } from "express";
import * as drinkController from "./drink.controller.js";

const router = Router()

router.get("/", drinkController.getDrinks);
router.get("/:id", drinkController.getADrink);
router.post("/", drinkController.addDrink);
router.put("/:id", drinkController.updateDrink);
router.delete("/:id", drinkController.deleteDrink);

export default router;