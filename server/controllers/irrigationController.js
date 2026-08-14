import Farm from '../models/Farm.js';
import ApiResponse from '../utils/apiResponse.js';
import Irrigation from '../models/Irrigation.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';
import { evaluateIrrigation } from '../services/irrigation/irrigationEngine.js';
import { evaluateWeatherRisks } from '../services/weather/weatherRiskEngine.js';

export const analyzeIrrigation = async (req, res) => {
  try {
    let farm = null;
    if (req.body.farmId) {
      farm = await Farm.findById(req.body.farmId);
      if (farm && farm.userId.toString() !== req.user._id.toString()) {
        return ApiResponse.error(
          res,
          'Forbidden: You do not own this farm resource',
          403,
          'FORBIDDEN'
        );
      }
    }
    if (!farm) {
      farm = await Farm.findOne({ userId: req.user._id });
    }

    if (!farm) {
      return ApiResponse.error(
        res,
        'Farm profile not found. Please complete farm setup first.',
        400,
        'FARM_PROFILE_REQUIRED'
      );
    }

    const lat = farm.location?.lat || 22.7196;
    const lng = farm.location?.lng || 75.8577;

    const weatherData = await fetchOpenMeteoWeather(lat, lng);

    const irrigationResult = evaluateIrrigation(farm, weatherData);
    const riskResult = evaluateWeatherRisks(weatherData, farm.currentCrop);

    const record = await Irrigation.create({
      farmId: farm._id,
      date: new Date(),
      decision: irrigationResult.decision,
      reasoning: irrigationResult.reasoning,
      confidence: irrigationResult.confidence,
    });

    return ApiResponse.success(
      res,
      {
        id: record._id,
        farm: {
          id: farm._id,
          name: farm.name,
          crop: farm.currentCrop,
          stage: farm.growthStage,
          location: farm.location?.display,
        },
        decision: irrigationResult.decision,
        reasoning: irrigationResult.reasoning,
        confidence: irrigationResult.confidence,
        weather: {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          rainProbability: weatherData.rainProbability,
          rainfallMm: weatherData.rainfallMm,
          condition: weatherData.weatherCondition,
        },
        risks: riskResult,
      },
      'Irrigation evaluated successfully'
    );
  } catch (error) {
    console.error('Irrigation analysis error:', error);
    return ApiResponse.error(res, 'Failed to evaluate irrigation decision', 500, 'SERVER_ERROR');
  }
};

export const getIrrigationHistory = async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });
    if (!farm) {
      return ApiResponse.success(res, [], 'Irrigation history retrieved successfully');
    }

    const history = await Irrigation.find({ farmId: farm._id }).sort({ date: -1 }).limit(20);

    return ApiResponse.success(res, history, 'Irrigation history retrieved successfully');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch irrigation history', 500, 'SERVER_ERROR');
  }
};
