import * as authController from "./auth.controller.js"
import { Router } from "express";
import validate from "../../middleware/validate.js";
import { loginSchema } from "../users/user.schema.js";
import { registerSchema } from "../users/user.schema.js";
const router = Router()

router.post("/login", validate(loginSchema), authController.loginRequest)
router.post("/register", validate(registerSchema), authController.registerRequest)

export default router;