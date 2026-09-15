import express from "express";

import * as colorController from "../controllers/color.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", colorController.getAllColorsController);
router.get("/:id", colorController.getColorByIdController);

// Admin-only routes
router.post("/", authMiddleware, adminOnly, colorController.createColorController);
router.put("/:id", authMiddleware, adminOnly, colorController.updateColorController);
router.delete("/:id", authMiddleware, adminOnly, colorController.deleteColorController);

export default router;