import Farm from '../models/Farm.js';
import CropHealth from '../models/CropHealth.js';
import CommunityReport from '../models/CommunityReport.js';
import { evaluateCropHealth } from '../services/cropHealth/cropHealthEngine.js';

const DEFAULT_LOCATION = {
  lat: 22.7196,
  lng: 75.8577
};

const DEFAULT_CROP_IMAGE =
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80';

export const analyzeCropHealth = async (req, res) => {
  try {
    const { description } = req.body;

    const farm = await Farm.findOne({
      userId: req.user._id
    });

    if (!farm) {
      return res.status(400).json({
        success: false,
        error: 'Farm profile required to record crop health observation.'
      });
    }

    let imageUrl = DEFAULT_CROP_IMAGE;

    if (req.file) {
      const base64Img = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64Img}`;
    }

    const farmLocation = {
      lat: farm.location?.lat || DEFAULT_LOCATION.lat,
      lng: farm.location?.lng || DEFAULT_LOCATION.lng
    };

    const observationDescription =
      description || 'Leaf observation report';

    const engineResult = await evaluateCropHealth(
      description || '',
      farm.currentCrop,
      req.file ? req.file.originalname : '',
      req.file ? req.file.buffer : null,
      req.file ? req.file.mimetype : ''
    );

    if (!engineResult.isValid) {
      return res.status(400).json({
        success: false,
        error: engineResult.message || 'Invalid crop image'
      });
    }

    const log = await CropHealth.create({
      farmId: farm._id,
      imageUrl,
      description: observationDescription,
      possibleIssue: engineResult.possibleIssue,
      confidence: `${engineResult.confidence}%`,
      whatToCheck: engineResult.whatToCheck,
      nextAction: engineResult.nextAction,
      location: farmLocation,
      reportedAt: new Date(),

      crop: engineResult.crop,
      health: engineResult.health,
      disease: engineResult.disease,
      severity: engineResult.severity,
      affectedArea: engineResult.affectedArea,
      causes: engineResult.causes,
      treatment: engineResult.treatment,
      prevention: engineResult.prevention,
      fertilizerRecommendation: engineResult.fertilizerRecommendation,
      irrigationRecommendation: engineResult.irrigationRecommendation,
      analysisTime: engineResult.analysisTime
    });

    const hasIssue =
      !engineResult.possibleIssue.includes('Healthy');

    if (hasIssue) {
      await CommunityReport.create({
        crop: farm.currentCrop,
        possibleIssue: engineResult.possibleIssue,
        location: farmLocation,
        reportCount: 3,
        nearbyDistanceKm: 2.4,
        lastReportedAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      data: log,
      crop: engineResult.crop,
      health: engineResult.health,
      disease: engineResult.disease,
      confidence: `${engineResult.confidence}%`,
      severity: engineResult.severity,
      affectedArea: engineResult.affectedArea,
      causes: engineResult.causes,
      treatment: engineResult.treatment,
      prevention: engineResult.prevention,
      fertilizerRecommendation: engineResult.fertilizerRecommendation,
      irrigationRecommendation: engineResult.irrigationRecommendation,
      analysisTime: engineResult.analysisTime
    });
  } catch (error) {
    console.error('Crop health analysis error:', error);

    return res.status(500).json({
      success: false,
      error: 'Analysis unavailable. Please retry or record observation manually.'
    });
  }
};

export const getCropHealthHistory = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      userId: req.user._id
    });

    if (!farm) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const history = await CropHealth
      .find({ farmId: farm._id })
      .sort({ reportedAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get crop health history error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve crop health history'
    });
  }
};