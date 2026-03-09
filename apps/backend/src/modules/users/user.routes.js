import { Router } from "express"
import * as userController from "./user.controller.js";
import { updateUserSchema } from "./user.schema.js";
import { changePasswordSchema } from "./user.schema.js";
import validate from "../../middleware/validate.js";
import allowRoles from "../../middleware/allowRoles.js"

const router = Router()

router.get("/", allowRoles("admin"), userController.getUsers)

router.get("/mine", userController.getMyProfile)
router.put("/mine/changepassword", validate(changePasswordSchema), userController.changePassword)

router.put("/mine", validate(updateUserSchema), userController.updateMyProfile)
router.delete("/mine", userController.deleteMyProfile)

router.get("/:id", allowRoles("admin"), userController.getAUser)
router.put("/:id", allowRoles("admin"), userController.changeUserRole)
router.delete("/:id", allowRoles("admin"), userController.deleteAUser)


export default router;