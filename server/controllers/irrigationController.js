import Farm from '../models/Farm.js';
import Irrigation from '../models/Irrigation.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';
import { evaluateIrrigation } from '../services/irrigation/irrigationEngine.js';
import { evaluateWeatherRisks } from '../services/weather/weatherRiskEngine.js';

export const analyzeIrrigation = async (req, res) => {
  try {
    let farm = null;
    if (req.body.farmId) {
      farm = await Farm.findById(req.body.farmId);
    }
    if (!farm) {
      farm = await Farm.findOne({ userId: req.user._id });
    }

    if (!farm) {
      return res.status(400).json({
        success: false,
        error: 'Farm profile not found. Please complete farm setup first.'
      });
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
      confidence: irrigationResult.confidence
    });

    return res.status(200).json({
      success: true,
      data: {
        id: record._id,
        farm: {
          id: farm._id,
          name: farm.name,
          crop: farm.currentCrop,
          stage: farm.growthStage,
          location: farm.location?.display
        },
        decision: irrigationResult.decision,
        reasoning: irrigationResult.reasoning,
        confidence: irrigationResult.confidence,
        weather: {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          rainProbability: weatherData.rainProbability,
          rainfallMm: weatherData.rainfallMm,
          condition: weatherData.weatherCondition
        },
        risks: riskResult
      }
    });
  } catch (error) {
    console.error('Irrigation analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to evaluate irrigation decision'
    });
  }
};

export const getIrrigationHistory = async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });
    if (!farm) {
      return res.status(200).json({ success: true, data: [] });
    }

    const history = await Irrigation.find({ farmId: farm._id }).sort({ date: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch irrigation history'
    });
  }
};
