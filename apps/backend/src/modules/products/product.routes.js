import { Router } from "express";
import { createProductSchema } from "../products/product.schema.js"
import { updateProductSchema } from "../products/product.schema.js";
import * as productController from "../products/product.controller.js"
import { querySchema } from "../products/product.schema.js";
import validate from "../../middleware/validate.js"
import allowRoles from "../../middleware/allowRoles.js";
import authorize from "../../middleware/authorize.js";

const router = Router()

router.get("/", validate(querySchema), productController.getProducts);
router.get("/:id", productController.getAProduct);
router.post("/", authorize, allowRoles("manager", "admin"), validate(createProductSchema), productController.addproduct);
router.put("/:id", authorize, allowRoles("manager", "admin"), validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", authorize, allowRoles("manager", "admin"), productController.deleteProduct);

export default router;