import Farm from '../models/Farm.js';
import ApiResponse from '../utils/apiResponse.js';
import { reverseGeocode, forwardGeocode } from '../services/geocodingService.js';

// Get current user's farm profile
export const getMyFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm profile not found. Please setup your farm profile.',
      });
    }

    return res.status(200).json({
      success: true,
      data: farm,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve farm profile',
    });
  }
};

// Create or update farm profile
export const createOrUpdateFarm = async (req, res) => {
  try {
    const {
      name,
      lat,
      lng,
      manualLocation,
      landSize,
      landUnit,
      soilType,
      currentCrop,
      plannedCrop,
      growthStage,
      season,
    } = req.body;

    if (!currentCrop) {
      return res.status(400).json({
        success: false,
        error: 'Current crop is required',
      });
    }

    let locationData = {
      display: 'Indore, Madhya Pradesh',
      lat: 22.7196,
      lng: 75.8577,
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: '',
    };

    if (lat && lng) {
      const geoResult = await reverseGeocode(lat, lng);
      locationData = geoResult;
    } else if (manualLocation) {
      const geoResult = await forwardGeocode(manualLocation);
      locationData = {
        display: manualLocation,
        lat: geoResult.lat,
        lng: geoResult.lng,
        district: manualLocation,
        state: '',
      };
    }

    const farmPayload = {
      userId: req.user._id,
      name: name || 'My Farm',
      location: locationData,
      landSize: {
        value: Number(landSize) || 5,
        unit: landUnit || 'acres',
      },
      soilType: soilType || 'Unknown/Not sure',
      currentCrop: currentCrop || 'Wheat',
      plannedCrop: plannedCrop || '',
      growthStage: growthStage || 'Vegetative',
      season: season || 'Kharif',
    };

    let farm = await Farm.findOne({ userId: req.user._id });
    if (farm) {
      farm = await Farm.findByIdAndUpdate(farm._id, farmPayload, {
        new: true,
        runValidators: true,
      });
    } else {
      farm = await Farm.create(farmPayload);
    }

    return res.status(200).json({
      success: true,
      message: 'Farm profile saved successfully',
      data: farm,
    });
  } catch (error) {
    console.error('Error saving farm profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save farm profile',
    });
  }
};

// Get farm by ID
export const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return ApiResponse.error(res, 'Farm not found', 404, 'NOT_FOUND');
    }

    // Verify ownership (IDOR protection)
    if (farm.userId.toString() !== req.user._id.toString()) {
      return ApiResponse.error(
        res,
        'Forbidden: You do not own this farm resource',
        403,
        'FORBIDDEN'
      );
    }

    return ApiResponse.success(res, farm, 'Farm profile retrieved successfully');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch farm', 500, 'SERVER_ERROR');
  }
};
