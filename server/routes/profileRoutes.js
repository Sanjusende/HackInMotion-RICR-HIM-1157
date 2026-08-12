import express from "express";
import {
  createProfile,
  getMyProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} from "../controllers/user/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(authMiddleware);

// Farmer/User own profile endpoints
router.post("/", createProfile);
router.get("/me", getMyProfile);
router.put("/", updateProfile);
router.delete("/", deleteProfile);

// Admin-only endpoints
router.get("/", getAllProfiles);
router.get("/:id", getProfileById);

export default router;
