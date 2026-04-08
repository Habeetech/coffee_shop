import { Router } from "express";
import * as paymentController from "./payment.controller.js"

const router = Router();
router.patch("/update", paymentController.updatePaymentIntent);
router.post("/create", paymentController.createPaymentIntent )

export default router;