const services = {
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:3000",
    project: process.env.PROJECT_SERVICE_URL || "http://localhost:3001",
    design: process.env.DESIGN_SERVICE_URL || "http://localhost:3002",
    media: process.env.MEDIA_SERVICE_URL || "http://localhost:3003",
    analytics: process.env.ANALYTICS_SERVICE_URL || "http://localhost:3004"
};

export default services;