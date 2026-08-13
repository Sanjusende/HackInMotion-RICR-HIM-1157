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

    const engineResult = evaluateCropHealth(
      description || '',
      farm.currentCrop
    );

    const log = await CropHealth.create({
      farmId: farm._id,
      imageUrl,
      description: observationDescription,
      possibleIssue: engineResult.possibleIssue,
      confidence: engineResult.confidence,
      whatToCheck: engineResult.whatToCheck,
      nextAction: engineResult.nextAction,
      location: farmLocation,
      reportedAt: new Date()
    });

    const hasIssue =
      !engineResult.possibleIssue.includes('No Critical Issue');

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
      data: log
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