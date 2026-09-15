import express from "express";
import cookieParser from "cookie-parser";

import mediaRoutes from "./routes/media.route.js";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Media Service is running"
    });
});

// Routes
app.use("/api/media", mediaRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(400).json({ success: false, message: err.message || "Internal server error" });
});

export default app;