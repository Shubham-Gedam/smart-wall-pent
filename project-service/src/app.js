import express from "express";
import cookieParser from "cookie-parser";

import projectRoutes from "./routes/project.route.js";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Project Service is running"
    });
});

// Routes
app.use("/api/projects", projectRoutes);

export default app;