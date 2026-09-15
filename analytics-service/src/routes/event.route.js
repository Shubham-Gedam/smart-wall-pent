import express from "express";

import { logEventController, getMyEventsController } from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", logEventController);
router.get("/", getMyEventsController);

export default router;