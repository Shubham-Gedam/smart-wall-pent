import { createProxyMiddleware } from "http-proxy-middleware";
import services from "../config/services.config.js";

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:4200";

function proxyOptions(target, prefix) {
    return {
        target,
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        pathRewrite: (path) => prefix + path,
        on: {
            proxyRes: (proxyRes) => {
                // http-proxy-middleware forwards the target's raw response headers,
                // which overwrites whatever cors() set on the gateway response.
                // Force the correct single-origin header here instead.
                proxyRes.headers["access-control-allow-origin"] = allowedOrigin;
                proxyRes.headers["access-control-allow-credentials"] = "true";
            }
        }
    };
}

export function registerProxyRoutes(app) {
    app.use("/api/auth", createProxyMiddleware(proxyOptions(services.auth, "/api/auth")));
    app.use("/api/projects", createProxyMiddleware(proxyOptions(services.project, "/api/projects")));
    app.use("/api/colors", createProxyMiddleware(proxyOptions(services.design, "/api/colors")));
    app.use("/api/patterns", createProxyMiddleware(proxyOptions(services.design, "/api/patterns")));
    app.use("/api/system-config", createProxyMiddleware(proxyOptions(services.design, "/api/system-config")));
    app.use("/api/media", createProxyMiddleware(proxyOptions(services.media, "/api/media")));
    app.use("/api/events", createProxyMiddleware(proxyOptions(services.analytics, "/api/events")));
    app.use("/api/feedback", createProxyMiddleware(proxyOptions(services.analytics, "/api/feedback")));
    app.use("/api/analytics", createProxyMiddleware(proxyOptions(services.analytics, "/api/analytics")));
}