import { Router } from "express";
import * as imagekitController from "./imagekit.controller.js"
import multer from "multer"
import authorize from "../../middleware/authorize.js"

const router = Router();
const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage});

router.post("/profile-image", authorize, upload.single("image"), imagekitController.uploadFile)

export default router;