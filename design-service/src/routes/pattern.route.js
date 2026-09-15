import express from "express";

import * as patternController from "../controllers/pattern.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", patternController.getAllPatternsController);
router.get("/:id", patternController.getPatternByIdController);

// Admin-only routes
router.post("/", authMiddleware, adminOnly, patternController.createPatternController);
router.put("/:id", authMiddleware, adminOnly, patternController.updatePatternController);
router.delete("/:id", authMiddleware, adminOnly, patternController.deletePatternController);

export default router;