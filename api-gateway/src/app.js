import express from "express";
import cors from "cors";

import { registerProxyRoutes } from "./routes/proxy.routes.js";

const app = express();

// CORS - single place for the whole system now
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true
}));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Gateway is running"
    });
});

// Proxy everything else to the right microservice
registerProxyRoutes(app);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

export default app;