import * as authController from "./auth.controller.js"
import { Router } from "express";
import validate from "../../middleware/validate.js";
import { loginSchema } from "../users/user.schema.js";
import { registerSchema } from "../users/user.schema.js";
import { forgotPasswordSchema } from "../users/user.schema.js";
import { resetPasswordSchema } from "../users/user.schema.js";
const router = Router()

router.post("/login", validate(loginSchema), authController.loginRequest)
router.post("/register", validate(registerSchema), authController.registerRequest)
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);

export default router;