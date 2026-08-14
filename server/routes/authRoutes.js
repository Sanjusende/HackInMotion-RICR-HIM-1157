// routes/authRoutes.js

import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
    register,
    login,
    refresh,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
} from "../controllers/auth/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes with Input Validation
router.post(
    "/register",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").trim().isEmail().withMessage("Please enter a valid email address"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("phone").optional().trim().isMobilePhone().withMessage("Please enter a valid phone number")
    ],
    validateRequest,
    register
);

router.post(
    "/login",
    [
        body("email").trim().isEmail().withMessage("Please enter a valid email address"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    validateRequest,
    login
);

router.post("/refresh-token", refresh);
router.post("/logout", logout);

router.post(
    "/forgot-password",
    [
        body("email").trim().isEmail().withMessage("Please enter a valid email address")
    ],
    validateRequest,
    forgotPassword
);

router.post(
    "/reset-password",
    [
        body("token").notEmpty().withMessage("Reset token is required"),
        body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long")
    ],
    validateRequest,
    resetPassword
);

// Protected Route
router.get("/me", authMiddleware, getMe);

export default router;