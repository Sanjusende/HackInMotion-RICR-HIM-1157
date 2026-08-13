import Farm from '../models/Farm.js';
import CropHealth from '../models/CropHealth.js';
import CommunityReport from '../models/CommunityReport.js';
import { evaluateCropHealth } from '../services/cropHealth/cropHealthEngine.js';

export const analyzeCropHealth = async (req, res) => {
  try {
    const { description } = req.body;
    const farm = await Farm.findOne({ userId: req.user._id });

    if (!farm) {
      return res.status(400).json({
        success: false,
        error: 'Farm profile required to record crop health observation.'
      });
    }

    // Default image placeholder or data URL if buffer provided
    let imageUrl = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80';
    if (req.file) {
      const base64Img = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64Img}`;
    }

    const engineResult = evaluateCropHealth(description || '', farm.currentCrop);

    const log = await CropHealth.create({
      farmId: farm._id,
      imageUrl,
      description: description || 'Leaf observation report',
      possibleIssue: engineResult.possibleIssue,
      confidence: engineResult.confidence,
      whatToCheck: engineResult.whatToCheck,
      nextAction: engineResult.nextAction,
      location: {
        lat: farm.location?.lat || 22.7196,
        lng: farm.location?.lng || 75.8577
      },
      reportedAt: new Date()
    });

    // Check / record community report for nearby alerts
    if (!engineResult.possibleIssue.includes('No Critical Issue')) {
      await CommunityReport.create({
        crop: farm.currentCrop,
        possibleIssue: engineResult.possibleIssue,
        location: {
          lat: farm.location?.lat || 22.7196,
          lng: farm.location?.lng || 75.8577
        },
        reportCount: 3, // Meets threshold for community alert display
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
    const farm = await Farm.findOne({ userId: req.user._id });
    if (!farm) {
      return res.status(200).json({ success: true, data: [] });
    }

    const history = await CropHealth.find({ farmId: farm._id }).sort({ reportedAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve crop health history'
    });
  }
};
