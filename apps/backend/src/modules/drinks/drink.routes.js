import { Router } from "express";
import * as drinkController from "./drink.controller.js";

const router = Router()

router.get("/", drinkController.getDrinks);

export default router;