import { Router } from "express";
import { createOrderSchema, updateOrderSchema } from "./order.schema.js";
import * as orderController from "./order.controller.js";
import validate from "../../middleware/validate.js";
import authorize from "../../middleware/authorize.js";
import allowRoles from "../../middleware/allowRoles.js";

const router = Router();



router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/mine", authorize, orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.get("/", authorize, allowRoles("manager", "admin"), orderController.getAllOrders);
router.patch("/:id", authorize, allowRoles("manager", "admin"), validate(updateOrderSchema), orderController.updateOrder);
router.delete("/:id", authorize, allowRoles("manager", "admin"), orderController.deleteOrder);
export default router;