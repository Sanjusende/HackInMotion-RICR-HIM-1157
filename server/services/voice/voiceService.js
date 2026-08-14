import { fetchOpenMeteoWeather } from '../weather/openMeteoService.js';
import { evaluateIrrigation } from '../irrigation/irrigationEngine.js';
import { fetchCropMarketData } from '../market/marketDataService.js';
import { normalizeLanguage } from '../../models/VoiceQuery.js';
import CropHealth from '../../models/CropHealth.js';
import { calculateCropSuitability } from '../cropRecommendation/cropRecommendationEngine.js';

const DEFAULT_FARM_CONTEXT = {
  crop: 'Wheat',
  location: 'Indore, Madhya Pradesh',
  landSize: '5 acres',
  latitude: 22.7196,
  longitude: 75.8577,
  growthStage: 'Vegetative',
};

// Supported Intent Types
const INTENTS = Object.freeze({
  IRRIGATION: 'IRRIGATION',
  WEATHER: 'WEATHER',
  MARKET: 'MARKET',
  DISEASE: 'DISEASE',
  CROP_RECOMMENDATION: 'CROP_RECOMMENDATION',
  GENERAL: 'GENERAL',
});

const normalizeQuery = (queryText = '') => {
  return String(queryText).toLowerCase().trim().replace(/\s+/g, ' ');
};

const detectIntent = (query) => {
  const irrigationKeywords = [
    'irrigate',
    'irrigation',
    'water',
    'paani',
    'pani',
    'सिंचाई',
    'पानी',
    'पाणी',
    'સિંચાઈ',
    'પાણી',
    'ਸਿੰਚਾਈ',
    'ਪਾਣੀ',
  ];

  const weatherKeywords = [
    'weather',
    'rain',
    'rainfall',
    'baarish',
    'barish',
    'mausam',
    'temperature',
    'forecast',
    'बारिश',
    'मौसम',
    'पाऊस',
    'हवामान',
    'વરસાદ',
    'હવામાન',
    'ਮੀਂਹ',
    'ਮੌਸਮ',
  ];

  const marketKeywords = [
    'price',
    'rate',
    'market',
    'mandi',
    'bhav',
    'daam',
    'भाव',
    'दाम',
    'मंडी',
    'बाजार',
    'बाजारभाव',
    'કિંમત',
    'મંડી',
    'બજાર',
    'ਕੀਮਤ',
    'ਮੰਡੀ',
  ];

  const diseaseKeywords = [
    'disease',
    'pest',
    'leaf',
    'spot',
    'blight',
    'rust',
    'rot',
    'infect',
    'illness',
    'treatment',
    'remedy',
    'belaari',
    'rog',
    'बीमारी',
    'रोग',
    'किडा',
    'रोगराई',
    'રોગ',
    'ਬੀਮਾਰੀ',
  ];

  const recommendKeywords = [
    'recommend',
    'suitability',
    'suitable',
    'NPK',
    'pH',
    'suggest',
    'sow',
    'ugaaye',
    'kismani',
    'उगाएं',
    'उत्पादन',
    'વાવણી',
    'ભલામણ',
    'ਬੀਜ',
  ];

  if (irrigationKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.IRRIGATION;
  }
  if (weatherKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.WEATHER;
  }
  if (marketKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.MARKET;
  }
  if (diseaseKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.DISEASE;
  }
  if (recommendKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.CROP_RECOMMENDATION;
  }

  return INTENTS.GENERAL;
};

const resolveFarmContext = (farm) => {
  const crop =
    typeof farm?.currentCrop === 'string' && farm.currentCrop.trim()
      ? farm.currentCrop.trim()
      : DEFAULT_FARM_CONTEXT.crop;

  const location =
    typeof farm?.location?.display === 'string' && farm.location.display.trim()
      ? farm.location.display.trim()
      : DEFAULT_FARM_CONTEXT.location;

  const landSizeValue =
    farm?.landSize?.value !== undefined && farm?.landSize?.value !== null
      ? farm.landSize.value
      : DEFAULT_FARM_CONTEXT.landSize.split(' ')[0];

  const landSizeUnit =
    typeof farm?.landSize?.unit === 'string' && farm.landSize.unit.trim()
      ? farm.landSize.unit.trim()
      : 'acres';

  const latitude = Number.isFinite(Number(farm?.location?.lat))
    ? Number(farm.location.lat)
    : DEFAULT_FARM_CONTEXT.latitude;

  const longitude = Number.isFinite(Number(farm?.location?.lng))
    ? Number(farm.location.lng)
    : DEFAULT_FARM_CONTEXT.longitude;

  const growthStage =
    typeof farm?.growthStage === 'string' && farm.growthStage.trim()
      ? farm.growthStage.trim()
      : DEFAULT_FARM_CONTEXT.growthStage;

  return {
    crop,
    location,
    landSize: `${landSizeValue} ${landSizeUnit}`,
    latitude,
    longitude,
    growthStage,
  };
};

const fetchContextData = async (context, farm) => {
  const farmForIrrigation = farm || {
    currentCrop: context.crop,
    growthStage: context.growthStage,
  };

  const [weatherResult, marketResult] = await Promise.allSettled([
    fetchOpenMeteoWeather(context.latitude, context.longitude),
    fetchCropMarketData(context.crop),
  ]);

  const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
  const market = marketResult.status === 'fulfilled' ? marketResult.value : null;

  let irrigation = null;
  if (weather) {
    try {
      irrigation = evaluateIrrigation(farmForIrrigation, weather);
    } catch (error) {
      console.error('[VoiceAssistant] Irrigation engine failed:', error);
    }
  }

  // Retrieve latest crop disease logs for user's farm
  let latestDiseaseReport = null;
  if (farm?._id) {
    try {
      latestDiseaseReport = await CropHealth.findOne({ farmId: farm._id }).sort({ reportedAt: -1 }).lean();
    } catch (err) {
      console.error('[VoiceAssistant] Crop health fetch failed:', err);
    }
  }

  // Calculate crop recommendations
  let cropRecommendations = null;
  try {
    cropRecommendations = calculateCropSuitability({
      N: 80,
      P: 40,
      K: 40,
      pH: 6.5,
      temperature: weather?.temperature || 28,
      rainfall: weather?.rainfallMm || 2.0,
      season: farm?.season || 'Kharif',
      soilType: farm?.soilType || 'Black Soil',
    });
  } catch (err) {
    console.error('[VoiceAssistant] Crop suitability calc failed:', err);
  }

  return {
    weather,
    market,
    irrigation,
    latestDiseaseReport,
    cropRecommendations,
  };
};

const getWeatherValue = (weather, key, fallback = 0) => {
  const value = Number(weather?.[key]);
  return Number.isFinite(value) ? value : fallback;
};

const getMarketPrice = (market) => {
  const price = Number(market?.currentPrice);
  return Number.isFinite(price) ? price : 0;
};

const getMarketTrend = (market) => {
  return market?.trend ? String(market.trend) : 'stable';
};

// Response Builders
const buildIrrigationResponse = ({ language, crop, location, growthStage, weather, irrigation }) => {
  const rainProbability = getWeatherValue(weather, 'rainProbability');
  const rainfallMm = getWeatherValue(weather, 'rainfallMm');
  const shouldNotIrrigate = irrigation?.decision === 'DONT_IRRIGATE';

  switch (language) {
    case 'hi-IN':
      return shouldNotIrrigate
        ? `Aapke ${crop} khet ke liye aaj irrigation ki zarurat nahi hai. ${location} mein lagbhag ${rainfallMm}mm baarish expected hai.`
        : `Aapke ${crop} khet (${growthStage} stage) ke liye aaj irrigation dena recommended hai. Rain probability ${rainProbability}% hai.`;
    default:
      return shouldNotIrrigate
        ? `Irrigation is not required for your ${crop} field today. Approximately ${rainfallMm}mm rainfall is expected in ${location}.`
        : `Irrigation is recommended for your ${crop} field today. Rain probability is ${rainProbability}%.`;
  }
};

const buildWeatherResponse = ({ language, location, weather }) => {
  const temperature = getWeatherValue(weather, 'temperature');
  const rainProbability = getWeatherValue(weather, 'rainProbability');
  const rainfallMm = getWeatherValue(weather, 'rainfallMm');

  switch (language) {
    case 'hi-IN':
      return `${location} mein aaj temperature ${temperature}°C hai. Baarish ki probability ${rainProbability}% hai aur expected rainfall ${rainfallMm}mm hai.`;
    default:
      return `The current temperature in ${location} is ${temperature}°C. Rain probability is ${rainProbability}% with approximately ${rainfallMm}mm expected rainfall.`;
  }
};

const buildMarketResponse = ({ language, crop, location, market }) => {
  const currentPrice = getMarketPrice(market);
  const trend = getMarketTrend(market);
  const marketName = market?.market || 'local mandi';

  switch (language) {
    case 'hi-IN':
      return `Aaj ${location} mein ${crop} ka current market price ₹${currentPrice} per quintal hai. Recent market trend ${trend.toLowerCase()} hai.`;
    default:
      return `Today's current market price for ${crop} at ${marketName} is ₹${currentPrice} per quintal. Recent market trend: ${trend}.`;
  }
};

const buildDiseaseResponse = ({ language, crop, latestDiseaseReport }) => {
  if (!latestDiseaseReport) {
    return language === 'hi-IN'
      ? `Aapke ${crop} crop ke liye koi disease scan nahi mila. Ek patte ka photo upload karke crop diagnosis check karein.`
      : `No recent leaf disease scans found for your ${crop} crop. Please upload a crop leaf image under Crop Health page.`;
  }

  const isHealthy = latestDiseaseReport.health === 'Healthy';
  if (isHealthy) {
    return language === 'hi-IN'
      ? `Aapka ${crop} crop safe hai. Pichla scan swasthya sthiti (Healthy) darshata hai.`
      : `Your ${crop} crop is healthy. The last diagnostic report detected no leaf disease.`;
  }

  switch (language) {
    case 'hi-IN':
      return `Pichle scan ke mutabik, aapke ${crop} crop mein ${latestDiseaseReport.disease} mila hai, jiska confidence ${latestDiseaseReport.confidence} hai. Treatment: ${latestDiseaseReport.nextAction}.`;
    default:
      return `According to the latest report, your ${crop} crop is affected by ${latestDiseaseReport.disease} (Confidence: ${latestDiseaseReport.confidence}). Recommended treatment is: ${latestDiseaseReport.nextAction}.`;
  }
};

const buildCropRecResponse = ({ language, soilType, season, cropRecommendations }) => {
  if (!cropRecommendations || cropRecommendations.length === 0) {
    return language === 'hi-IN'
      ? `Abhi recommendations ready nahi hain. Kripya soil type check karein.`
      : `Could not generate crop recommendations at this moment.`;
  }

  const topCrop = cropRecommendations[0];
  switch (language) {
    case 'hi-IN':
      return `${soilType} aur ${season} season ke liye sabse suitable crop ${topCrop.crop} hai, jiska compatibility score ${topCrop.score}% hai. Reasoning: ${topCrop.reasoning}`;
    default:
      return `For your ${soilType} and ${season} season, the top recommended crop is ${topCrop.crop} with a suitability score of ${topCrop.score}%. Reasoning: ${topCrop.reasoning}`;
  }
};

const buildGeneralResponse = ({ language, crop, location, landSize, weather, market }) => {
  const temperature = getWeatherValue(weather, 'temperature');
  const currentPrice = getMarketPrice(market);
  const weatherCondition = weather?.weatherCondition || 'stable';

  switch (language) {
    case 'hi-IN':
      return `Aapke ${landSize} ke ${crop} farm, ${location} mein abhi weather ${weatherCondition} hai. Temperature ${temperature}°C hai aur mandi price ₹${currentPrice}/quintal hai.`;
    default:
      return `For your ${landSize} ${crop} farm in ${location}, the current weather is ${weatherCondition} with a temperature of ${temperature}°C. The current market price is ₹${currentPrice}/quintal.`;
  }
};

export const processVoiceQuery = async (queryText, languageStr = 'hi-IN', farm = null) => {
  const normalizedQuery = normalizeQuery(queryText);

  if (!normalizedQuery) {
    throw new Error('Voice query cannot be empty.');
  }

  const language = normalizeLanguage(languageStr);
  const context = resolveFarmContext(farm);
  const intent = detectIntent(normalizedQuery);

  console.info(`[VoiceAssistant] Processing query | intent=${intent} | language=${language}`);

  const { weather, market, irrigation, latestDiseaseReport, cropRecommendations } = await fetchContextData(context, farm);

  let responseText = '';

  switch (intent) {
    case INTENTS.IRRIGATION:
      if (!weather || !irrigation) {
        responseText =
          language === 'hi-IN'
            ? 'Abhi irrigation decision lene ke liye weather data available nahi hai. Please thodi der baad try karein.'
            : 'Weather data is currently unavailable, so an irrigation decision cannot be made right now. Please try again later.';
      } else {
        responseText = buildIrrigationResponse({
          language,
          crop: context.crop,
          location: context.location,
          growthStage: context.growthStage,
          weather,
          irrigation,
        });
      }
      break;

    case INTENTS.WEATHER:
      if (!weather) {
        responseText =
          language === 'hi-IN'
            ? 'Abhi weather data available nahi hai. Please thodi der baad try karein.'
            : 'Weather data is currently unavailable. Please try again later.';
      } else {
        responseText = buildWeatherResponse({
          language,
          location: context.location,
          weather,
        });
      }
      break;

    case INTENTS.MARKET:
      if (!market) {
        responseText =
          language === 'hi-IN'
            ? `${context.crop} ka current mandi data abhi available nahi hai. Please thodi der baad try karein.`
            : `Current market data for ${context.crop} is currently unavailable. Please try again later.`;
      } else {
        responseText = buildMarketResponse({
          language,
          crop: context.crop,
          location: context.location,
          market,
        });
      }
      break;

    case INTENTS.DISEASE:
      responseText = buildDiseaseResponse({
        language,
        crop: context.crop,
        latestDiseaseReport,
      });
      break;

    case INTENTS.CROP_RECOMMENDATION:
      responseText = buildCropRecResponse({
        language,
        soilType: farm?.soilType || 'Black Soil',
        season: farm?.season || 'Kharif',
        cropRecommendations,
      });
      break;

    case INTENTS.GENERAL:
    default:
      responseText = buildGeneralResponse({
        language,
        crop: context.crop,
        location: context.location,
        landSize: context.landSize,
        weather,
        market,
      });
      break;
  }

  return {
    queryText,
    language,
    intent,
    responseText,
    contextSnapshot: {
      crop: context.crop,
      location: context.location,
      landSize: context.landSize,
      weatherTemp: weather ? getWeatherValue(weather, 'temperature') : null,
      rainProbability: weather ? getWeatherValue(weather, 'rainProbability') : null,
      rainfallMm: weather ? getWeatherValue(weather, 'rainfallMm') : null,
      irrigationDecision: irrigation?.decision || null,
      marketPrice: market ? getMarketPrice(market) : null,
      marketTrend: market ? getMarketTrend(market) : null,
      diseaseDetected: latestDiseaseReport?.disease || 'None',
      topCropRecommended: cropRecommendations?.[0]?.crop || 'None',
    },
  };
};
