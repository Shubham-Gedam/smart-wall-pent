import express from "express";

import * as mediaController from "../controllers/media.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/upload", upload.single("image"), mediaController.uploadMediaController);
router.get("/", mediaController.getMyMediaController);
router.get("/:id", mediaController.getMediaByIdController);
router.delete("/:id", mediaController.deleteMediaController);

export default router;