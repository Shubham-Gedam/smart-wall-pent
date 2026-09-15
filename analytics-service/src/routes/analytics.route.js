import express from "express";

import { getKPIsController } from "../controllers/analytics.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/kpis", authMiddleware, adminOnly, getKPIsController);

export default router;