import express from "express";

import { registerController, loginController, logoutController } from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();


// Public routes
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController); 

// Protected route
router.get("/me", authMiddleware, (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    });

});




export default router;