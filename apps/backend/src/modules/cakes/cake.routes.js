import { Router } from "express";
import * as cakeController from "./cake.controller.js"
import { createCakeSchema } from "./cake.schema.js"
import { updateCakeSchema } from "./cake.schema.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.get("/", cakeController.getCakes);
router.get("/:id", cakeController.getACake);
router.post("/", validate(createCakeSchema), cakeController.addCake);
router.put("/:id", validate(updateCakeSchema.partial()), cakeController.updateCake);
router.delete("/:id", cakeController.deleteCake);

export default router;