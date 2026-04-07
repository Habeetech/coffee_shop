import { Router } from "express"
import {createOrderSchema} from "./order.schema.js";
import * as orderController from "./order.controller.js"
import validate from "../../middleware/validate.js";

const router = Router();

router.post("/", validate(createOrderSchema), orderController.createOrder);


export default router;