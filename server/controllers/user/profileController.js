import mongoose from "mongoose";
import FarmerProfile from "../../models/FarmerProfile.js";

/**
 * POST /api/profile
 * Creates a new farmer profile for the authenticated user.
 */
export const createProfile = async (req, res) => {
  try {
    const {
      phone,
      profileImage,
      gender,
      dateOfBirth,
      state,
      district,
      village,
      experienceYears,
      preferredLanguage,
      bio
    } = req.body;

    // 1. One profile per user - check duplicate profile
    const existingProfile = await FarmerProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }

    // 2. Validate required fields
    if (!phone || !state || !district || !village) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing. Please provide phone, state, district, and village."
      });
    }

    // 3. Create the profile
    const newProfile = await FarmerProfile.create({
      userId: req.user.id,
      phone,
      profileImage: profileImage || "",
      gender,
      dateOfBirth,
      state,
      district,
      village,
      experienceYears: experienceYears || 0,
      preferredLanguage,
      bio
    });

    return res.status(201).json({
      success: true,
      message: "Farmer profile created successfully",
      data: { profile: newProfile }
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * GET /api/profile/me
 * Retrieves the logged-in user's profile.
 */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Farmer profile retrieved successfully",
      data: { profile }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * GET /api/profile/:id
 * Admin only - retrieves a profile by its database ID.
 */
export const getProfileById = async (req, res) => {
  try {
    // 1. Admin authorization check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required."
      });
    }

    const { id } = req.params;

    // 2. Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID format"
      });
    }

    // 3. Find and check existence
    const profile = await FarmerProfile.findById(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Farmer profile retrieved successfully",
      data: { profile }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * GET /api/profile
 * Admin only - retrieves all profiles with pagination support.
 */
export const getAllProfiles = async (req, res) => {
  try {
    // 1. Admin authorization check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required."
      });
    }

    // 2. Pagination parsing
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await FarmerProfile.countDocuments();
    const profiles = await FarmerProfile.find()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Profiles retrieved successfully",
      data: {
        profiles,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * PUT /api/profile
 * Updates the logged-in user's profile.
 */
export const updateProfile = async (req, res) => {
  try {
    // 1. Find profile first to ensure it exists
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // 2. Prepare update object (exclude userId updates)
    const updates = { ...req.body };
    delete updates.userId;

    // 3. Update with Mongoose schema validation enabled
    const updatedProfile = await FarmerProfile.findOneAndUpdate(
      { userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Farmer profile updated successfully",
      data: { profile: updatedProfile }
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * DELETE /api/profile
 * Deletes the logged-in user's profile.
 */
export const deleteProfile = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    await profile.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Farmer profile deleted successfully",
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};
