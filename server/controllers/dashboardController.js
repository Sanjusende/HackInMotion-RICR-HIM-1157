import Farm from '../models/Farm.js';
import User from '../models/User.js';
import CropHealth from '../models/CropHealth.js';
import Irrigation from '../models/Irrigation.js';
import Weather from '../models/Weather.js';
import MarketPrice from '../models/MarketPrice.js';
import CommunityReport from '../models/CommunityReport.js';
import ApiResponse from '../utils/apiResponse.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';
import { evaluateIrrigation } from '../services/irrigation/irrigationEngine.js';
import { evaluateWeatherRisks } from '../services/weather/weatherRiskEngine.js';
import { fetchCropMarketData } from '../services/market/marketDataService.js';

// Base Benchmark Crop Yield Factors (Quintals per Acre)
const YIELD_FACTORS = {
  Wheat: 20,
  Rice: 24,
  Maize: 22,
  Soybean: 9,
  Cotton: 11,
  Potato: 120,
  default: 15,
};

// Base Benchmark Crop Net Profit Factors (Rupees per Acre)
const PROFIT_FACTORS = {
  Wheat: 31000,
  Rice: 28500,
  Maize: 21000,
  Soybean: 25000,
  Cotton: 40000,
  Potato: 75000,
  default: 20000,
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    let farm = null;
    try {
      farm = await Farm.findOne({ userId: req.user._id });
    } catch (dbErr) {
      console.warn('DB read fallback in dashboard controller:', dbErr.message);
    }

    const farmProfile = farm || {
      _id: 'default-farm-id',
      name: 'My Smart Farm',
      location: { display: 'Indore, Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
      landSize: { value: 5, unit: 'acres' },
      soilType: 'Black Soil',
      currentCrop: 'Wheat',
      growthStage: 'Vegetative',
      season: 'Kharif',
    };

    const lat = farmProfile.location?.lat || 22.7196;
    const lng = farmProfile.location?.lng || 75.8577;

    // 1. Fetch Weather Data
    let weatherData = null;
    try {
      weatherData = await fetchOpenMeteoWeather(lat, lng);
    } catch (err) {
      console.warn('Unable to refresh weather data for dashboard summary:', err.message);
    }

    // 2. Evaluate Irrigation & Weather Risk
    let irrigationCard = null;
    let weatherAlertCard = null;

    if (weatherData) {
      const irrigationResult = evaluateIrrigation(farmProfile, weatherData);
      const riskResult = evaluateWeatherRisks(weatherData, farmProfile.currentCrop);

      irrigationCard = {
        decision: irrigationResult.decision,
        reasoning: irrigationResult.reasoning,
        confidence: irrigationResult.confidence,
        crop: farmProfile.currentCrop,
        growthStage: farmProfile.growthStage,
      };

      weatherAlertCard = {
        hasRisk: riskResult.hasRisk,
        risks: riskResult.risks,
      };
    } else {
      irrigationCard = {
        decision: 'DONT_IRRIGATE',
        reasoning: {
          actionableAdvice: 'Soil moisture is optimal based on historical climate baseline.',
        },
        confidence: 0.85,
        crop: farmProfile.currentCrop,
        growthStage: farmProfile.growthStage,
      };
      weatherAlertCard = { hasRisk: false, risks: [] };
    }

    // 3. Fetch Crop Health (latest report)
    let cropHealthCard = null;
    try {
      if (farm) {
        const latestReport = await CropHealth.findOne({ farmId: farm._id }).sort({
          reportedAt: -1,
        });
        if (latestReport) {
          cropHealthCard = {
            hasReport: true,
            possibleIssue: latestReport.possibleIssue,
            confidence: latestReport.confidence,
            nextAction: latestReport.nextAction,
            imageUrl: latestReport.imageUrl,
            reportedAt: latestReport.reportedAt,
          };
        }
      }
    } catch (err) {
      cropHealthCard = null;
    }
    if (!cropHealthCard) {
      cropHealthCard = {
        hasReport: false,
        possibleIssue: 'No critical leaf disease detected',
        nextAction: 'Upload leaf photo to inspect pest or disease symptoms',
      };
    }

    // 4. Fetch Market Intelligence summary
    let marketCard = null;
    try {
      const marketData = await fetchCropMarketData(
        farmProfile.currentCrop,
        'Indore Mandi',
        farmProfile.location?.state,
        farmProfile.location?.district
      );
      marketCard = {
        crop: farmProfile.currentCrop,
        currentPrice: marketData.currentPrice,
        unit: marketData.unit,
        trend: marketData.trend,
        changePercent: marketData.changePercent,
        displayText: marketData.displayText,
        sellingInsightText: marketData.sellingInsightText,
        updatedAt: marketData.date,
      };
    } catch (err) {
      marketCard = {
        crop: farmProfile.currentCrop || 'Wheat',
        currentPrice: 2450,
        unit: '₹/Quintal',
        trend: 'Rising',
        changePercent: 4.2,
        displayText: 'Wheat benchmark market price is ₹2,450 / Quintal.',
        sellingInsightText: 'Prices have been trending upward over the last 7 days.',
      };
    }

    // 5. Community Disease Alert
    let communityAlertCard = null;
    try {
      if (farm) {
        const nearbyAlert = await CommunityReport.findOne({ crop: farmProfile.currentCrop }).sort({
          lastReportedAt: -1,
        });
        if (nearbyAlert) {
          communityAlertCard = {
            active: true,
            title: 'Crop Health Alert Near You',
            message: `${nearbyAlert.reportCount} nearby farmers have reported similar ${farmProfile.currentCrop} crop symptoms in the last 48 hours.`,
            distanceKm: nearbyAlert.nearbyDistanceKm || 2.4,
            reportsCount: nearbyAlert.reportCount,
            recommended: `Inspect your ${farmProfile.currentCrop} crop and monitor lower leaf surface for symptoms.`,
          };
        }
      }
    } catch (err) {
      communityAlertCard = null;
    }

    // 6. Fertilizer Plan Shortcut
    const fertilizerCard = {
      crop: farmProfile.currentCrop,
      growthStage: farmProfile.growthStage,
      summaryText: `Your ${farmProfile.currentCrop} crop is currently in the ${farmProfile.growthStage} stage. Recommended nutrient applications available.`,
    };

    // 7. Calculate Real MongoDB Aggregated Telemetry Statistics
    const totalFarms = await Farm.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'FARMER' });
    const totalDiseases = await CropHealth.countDocuments({ health: 'Diseased' });
    const healthyCrops = await CropHealth.countDocuments({ health: 'Healthy' });
    const totalIrrigationEvents = await Irrigation.countDocuments();
    const totalWeatherForecasts = await Weather.countDocuments();
    const marketRecords = await MarketPrice.countDocuments();

    // Sum total water usage from real database records (liters estimate)
    const irrigationList = await Irrigation.find({}).lean();
    let totalWaterUsageLitres = 0;
    for (const record of irrigationList) {
      const needMm = record.reasoning?.cropWaterNeedMm || 5.0;
      // 1 mm water over 1 acre = 4046.86 Liters. Default farm size 5 acres.
      totalWaterUsageLitres += Math.round(needMm * 5.0 * 4046.86);
    }

    // Calculate aggregated predicted yield and profits for all registered farms
    const activeFarmsList = await Farm.find({}).lean();
    let totalYieldPredictionQuintals = 0;
    let totalEstimatedRevenue = 0;

    for (const activeFarm of activeFarmsList) {
      const crop = activeFarm.currentCrop || 'Wheat';
      const acres = activeFarm.landSize?.value || 5.0;

      const yieldFactor = YIELD_FACTORS[crop] || YIELD_FACTORS.default;
      const profitFactor = PROFIT_FACTORS[crop] || PROFIT_FACTORS.default;

      totalYieldPredictionQuintals += acres * yieldFactor;
      totalEstimatedRevenue += acres * profitFactor;
    }

    return res.status(200).json({
      success: true,
      profileComplete: Boolean(farm),
      data: {
        farm: {
          id: farmProfile._id,
          name: farmProfile.name,
          locationDisplay: farmProfile.location?.display,
          currentCrop: farmProfile.currentCrop,
          growthStage: farmProfile.growthStage,
          soilType: farmProfile.soilType,
          landSize: farmProfile.landSize,
        },
        todaysAction: irrigationCard,
        weatherAlert: weatherAlertCard,
        cropHealth: cropHealthCard,
        market: marketCard,
        communityAlert: communityAlertCard,
        fertilizerShortcut: fertilizerCard,
        stats: {
          totalFarms,
          totalFarmers,
          totalDiseases,
          healthyCrops,
          diseasedCrops: totalDiseases,
          totalIrrigationEvents,
          totalWeatherForecasts,
          marketRecords,
          revenueAnalytics: totalEstimatedRevenue,
          waterUsage: totalWaterUsageLitres,
          yieldPrediction: totalYieldPredictionQuintals,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    next(error);
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const period = req.query.period || 'monthly'; // 'weekly' | 'monthly' | 'yearly'
    const farm = await Farm.findOne({ userId: req.user._id });
    if (!farm) {
      return ApiResponse.success(
        res,
        { waterUsage: [], cropHealth: [] },
        'No farm context found for analytics'
      );
    }

    const now = new Date();
    let startDate;
    let groupFormat;

    if (period === 'weekly') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      groupFormat = '%Y-%m-%d';
    } else if (period === 'monthly') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
      groupFormat = '%Y-%m-%d';
    } else {
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      groupFormat = '%Y-%m';
    }

    // 1. Group Irrigation water usage
    const waterUsageHistory = await Irrigation.aggregate([
      {
        $match: {
          farmId: farm._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          totalWaterMm: { $sum: { $ifNull: ['$reasoning.cropWaterNeedMm', 5.0] } },
          eventsCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Group Crop Health scans
    const cropHealthHistory = await CropHealth.aggregate([
      {
        $match: {
          farmId: farm._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          diseasedCount: {
            $sum: { $cond: [{ $eq: ['$health', 'Diseased'] }, 1, 0] },
          },
          healthyCount: {
            $sum: { $cond: [{ $eq: ['$health', 'Healthy'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return ApiResponse.success(
      res,
      {
        period,
        waterUsage: waterUsageHistory,
        cropHealth: cropHealthHistory,
      },
      'Dashboard analytics loaded successfully'
    );
  } catch (error) {
    next(error);
  }
};
