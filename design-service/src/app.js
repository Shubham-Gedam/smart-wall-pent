import express from "express";
import cookieParser from "cookie-parser";

import colorRoutes from "./routes/color.route.js";
import patternRoutes from "./routes/pattern.route.js";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Design Service is running"
    });
});

// Routes
app.use("/api/colors", colorRoutes);
app.use("/api/patterns", patternRoutes);

export default app;