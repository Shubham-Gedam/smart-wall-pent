import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth Service is running"
    });
});

// Routes
app.use("/api/auth", authRoutes);

export default app;