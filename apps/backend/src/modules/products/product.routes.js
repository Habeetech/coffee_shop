import { Router } from "express";
import { createProductSchema } from "../products/product.schema.js"
import { updateProductSchema } from "../products/product.schema.js";
import * as productController from "../products/product.controller.js"
import { querySchema } from "../products/product.schema.js";
import validate from "../../middleware/validate.js"

const router = Router()

router.get("/", validate(querySchema), productController.getProducts);
router.get("/:id", productController.getAProduct);
router.post("/", validate(createProductSchema), productController.addproduct);
router.put("/:id", validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;