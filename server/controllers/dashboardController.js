import Farm from '../models/Farm.js';
import CropHealth from '../models/CropHealth.js';
import CommunityReport from '../models/CommunityReport.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';
import { evaluateIrrigation } from '../services/irrigation/irrigationEngine.js';
import { evaluateWeatherRisks } from '../services/weather/weatherRiskEngine.js';
import { fetchCropMarketData } from '../services/market/marketDataService.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });

    if (!farm) {
      return res.status(200).json({
        success: true,
        profileComplete: false,
        message: 'Farm profile not set up yet.',
        data: null
      });
    }

    const lat = farm.location?.lat || 22.7196;
    const lng = farm.location?.lng || 75.8577;

    // 1. Fetch Weather Data (with per-card error resilience)
    let weatherData = null;
    let weatherError = null;
    try {
      weatherData = await fetchOpenMeteoWeather(lat, lng);
    } catch (err) {
      weatherError = 'Unable to refresh live weather data';
    }

    // 2. Evaluate Irrigation & Weather Risk
    let irrigationCard = null;
    let weatherAlertCard = null;

    if (weatherData) {
      const irrigationResult = evaluateIrrigation(farm, weatherData);
      const riskResult = evaluateWeatherRisks(weatherData, farm.currentCrop);

      irrigationCard = {
        decision: irrigationResult.decision,
        reasoning: irrigationResult.reasoning,
        confidence: irrigationResult.confidence,
        crop: farm.currentCrop,
        growthStage: farm.growthStage
      };

      weatherAlertCard = {
        hasRisk: riskResult.hasRisk,
        risks: riskResult.risks
      };
    } else {
      irrigationCard = { error: weatherError || 'Weather data unavailable' };
      weatherAlertCard = { hasRisk: false, error: weatherError };
    }

    // 3. Fetch Crop Health (latest report)
    let cropHealthCard = null;
    try {
      const latestReport = await CropHealth.findOne({ farmId: farm._id }).sort({ reportedAt: -1 });
      if (latestReport) {
        cropHealthCard = {
          hasReport: true,
          possibleIssue: latestReport.possibleIssue,
          confidence: latestReport.confidence,
          nextAction: latestReport.nextAction,
          imageUrl: latestReport.imageUrl,
          reportedAt: latestReport.reportedAt
        };
      } else {
        cropHealthCard = {
          hasReport: false,
          message: 'No critical issue detected.'
        };
      }
    } catch (err) {
      cropHealthCard = { error: 'Unable to fetch crop health summary' };
    }

    // 4. Fetch Market Intelligence summary
    let marketCard = null;
    try {
      const marketData = await fetchCropMarketData(farm.currentCrop);
      marketCard = {
        crop: farm.currentCrop,
        currentPrice: marketData.currentPrice,
        unit: marketData.unit,
        trend: marketData.trend,
        changePercent: marketData.changePercent,
        displayText: marketData.displayText,
        sellingInsightText: marketData.sellingInsightText,
        updatedAt: marketData.date
      };
    } catch (err) {
      marketCard = { error: 'Market data unavailable' };
    }

    // 5. Community Disease Alert
    let communityAlertCard = null;
    try {
      const nearbyAlert = await CommunityReport.findOne({ crop: farm.currentCrop }).sort({ lastReportedAt: -1 });
      if (nearbyAlert) {
        communityAlertCard = {
          active: true,
          title: 'Crop Health Alert Near You',
          message: `${nearbyAlert.reportCount} nearby farmers have reported similar ${farm.currentCrop} crop symptoms in the last 48 hours.`,
          distanceKm: nearbyAlert.nearbyDistanceKm || 2.4,
          reportsCount: nearbyAlert.reportCount,
          recommended: `Inspect your ${farm.currentCrop} crop and monitor lower leaf surface for symptoms.`
        };
      }
    } catch (err) {
      communityAlertCard = null;
    }

    // 6. Fertilizer Plan Shortcut
    const fertilizerCard = {
      crop: farm.currentCrop,
      growthStage: farm.growthStage,
      summaryText: `Your ${farm.currentCrop} crop is currently in the ${farm.growthStage} stage. Recommended nutrient applications available.`
    };

    return res.status(200).json({
      success: true,
      profileComplete: true,
      data: {
        farm: {
          id: farm._id,
          name: farm.name,
          locationDisplay: farm.location?.display,
          currentCrop: farm.currentCrop,
          growthStage: farm.growthStage,
          soilType: farm.soilType,
          landSize: farm.landSize
        },
        todaysAction: irrigationCard,
        weatherAlert: weatherAlertCard,
        cropHealth: cropHealthCard,
        market: marketCard,
        communityAlert: communityAlertCard,
        fertilizerShortcut: fertilizerCard
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate dashboard summary'
    });
  }
};
