import mongoose from "mongoose";
import Farm from "../../models/Farm.js";

/**
 * POST /api/farms
 * Creates a new Farm profile associated with the logged-in user
 */
export const createFarm = async (req, res) => {
  try {
    const {
      farmName, state, district, village, latitude, longitude,
      landSize, landUnit, soilType, currentCrop, plannedCrop, irrigationMethod
    } = req.body;

    if (!farmName || !state || !district || !village || latitude === undefined || longitude === undefined || landSize === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing. Make sure farmName, state, district, village, latitude, longitude, and landSize are provided."
      });
    }

    const farm = await Farm.create({
      userId: req.user.id,
      farmName,
      state,
      district,
      village,
      latitude,
      longitude,
      landSize,
      landUnit: landUnit || "ACRE",
      soilType: soilType || "OTHER",
      currentCrop: currentCrop || "",
      plannedCrop: plannedCrop || "",
      irrigationMethod: irrigationMethod || "OTHER"
    });

    return res.status(201).json({
      success: true,
      message: "Farm profile created successfully",
      data: { farm }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * GET /api/farms
 * Retrieves all farms. Farmers get only their owned farms; Admin retrieves all.
 */
export const getFarms = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "ADMIN") {
      query.userId = req.user.id;
    }

    const farms = await Farm.find(query);
    return res.status(200).json({
      success: true,
      message: "Farms retrieved successfully",
      data: { farms }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * GET /api/farms/:id
 * Retrieves farm details by ID. Only accessible by the owner or Admin.
 */
export const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID format"
      });
    }

    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found"
      });
    }

    if (farm.userId.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own farms."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Farm details retrieved successfully",
      data: { farm }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * PUT /api/farms/:id
 * Updates farm details by ID. Only accessible by the owner or Admin.
 */
export const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID format"
      });
    }

    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found"
      });
    }

    if (farm.userId.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own farms."
      });
    }

    const updates = req.body;
    delete updates.userId; // Prevent transferring ownership

    const updatedFarm = await Farm.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      message: "Farm profile updated successfully",
      data: { farm: updatedFarm }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * DELETE /api/farms/:id
 * Deletes a farm profile. Only accessible by the owner or Admin.
 */
export const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farm ID format"
      });
    }

    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found"
      });
    }

    if (farm.userId.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own farms."
      });
    }

    await farm.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Farm profile deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};
