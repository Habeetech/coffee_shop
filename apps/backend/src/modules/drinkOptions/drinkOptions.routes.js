import * as drinkOptionsController from "./drinkOptions.controller.js";
import { createDrinkOptions, updateDrinksOptions, deleteGroupItemSchema, deleteGroupSchema } from "./drinkOptions.schema.js";
import { Router } from "express";
import validate from "../../middleware/validate.js";
import allowRoles from "../../middleware/allowRoles.js";
import authorize from "../../middleware/authorize.js";

const router = Router();

router.get("/", drinkOptionsController.getOptions);
router.post("/", authorize, allowRoles("admin", "manager"), validate(createDrinkOptions), drinkOptionsController.addOptions);
router.put("/", authorize, allowRoles("admin", "manager"), validate(updateDrinksOptions), drinkOptionsController.updateOptions);
router.delete("/:groupName/:itemId", authorize, allowRoles("admin", "manager"), validate(deleteGroupItemSchema), drinkOptionsController.deleteOptionItem)
router.delete("/:groupName", authorize, allowRoles("admin", "manager"), validate(deleteGroupSchema), drinkOptionsController.deleteOptions)

export default router;