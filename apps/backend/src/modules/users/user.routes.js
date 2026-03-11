import { Router } from "express"
import * as userController from "./user.controller.js";
import { updateUserSchema } from "./user.schema.js";
import { changePasswordSchema } from "./user.schema.js";
import { changeUserRoleSchema } from "./user.schema.js";
import { deleteUserSchema } from "./user.schema.js";
import asyncHandler from "../../middleware/asyncHandler.js"
import validate from "../../middleware/validate.js";
import allowRoles from "../../middleware/allowRoles.js"

const router = Router()

router.get("/", allowRoles("admin"), userController.getUsers)
router.get("/mine", userController.getMyProfile)
router.put("/mine/changepassword", validate(changePasswordSchema), userController.changePassword)

router.put("/mine", validate(updateUserSchema), asyncHandler(userController.updateMyProfile))
router.delete("/mine", userController.deleteMyProfile)

router.get("/:id", allowRoles("admin"), userController.getAUser)
router.patch("/:id/role", allowRoles("admin"), validate(changeUserRoleSchema), userController.changeUserRole)
router.delete("/:id", allowRoles("admin"), validate(deleteUserSchema), userController.deleteAUser)


export default router;