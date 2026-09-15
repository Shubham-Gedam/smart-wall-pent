import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

export function adminOnly(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }
    next();
}