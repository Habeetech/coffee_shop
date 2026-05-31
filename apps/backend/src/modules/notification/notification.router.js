import { Router } from "express";
import * as notificationControllers from "./notification.controller.js"
import authorize from "../../middleware/authorize.js";


const router = Router();

router.get("/", authorize, notificationControllers.getUsersNotifications );
router.patch("/:id", authorize, notificationControllers.viewNotification);
router.delete("/:id", authorize, notificationControllers.deleteNotification);

export default router;