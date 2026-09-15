import express from "express";

import * as projectController from "../controllers/project.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", projectController.createProjectController);
router.get("/", projectController.getMyProjectsController);

router.get("/admin/all", adminOnly, projectController.getAllProjectsAdminController);

router.get("/:id", projectController.getProjectByIdController);
router.get("/:id/download", projectController.downloadProjectImageController);
router.put("/:id", projectController.updateProjectController);
router.delete("/:id", projectController.deleteProjectController);

export default router;