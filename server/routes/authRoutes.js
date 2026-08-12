// routes/authRoutes.js

import express from "express";

import {
    register,
    login,
    refresh,
    logout,
    getMe,
} from "../controllers/auth/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);

// Protected Route
router.get("/me", authMiddleware, getMe);

export default router;