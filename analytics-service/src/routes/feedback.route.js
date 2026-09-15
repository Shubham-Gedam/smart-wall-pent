import express from "express";

import { submitFeedbackController, getAllFeedbackController } from "../controllers/feedback.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, submitFeedbackController);
router.get("/", authMiddleware, adminOnly, getAllFeedbackController);

export default router;