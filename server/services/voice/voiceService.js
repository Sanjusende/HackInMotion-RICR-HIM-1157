import { fetchOpenMeteoWeather } from '../weather/openMeteoService.js';
import { evaluateIrrigation } from '../irrigation/irrigationEngine.js';
import { fetchCropMarketData } from '../market/marketDataService.js';
import { normalizeLanguage } from '../../models/VoiceQuery.js';


const DEFAULT_FARM_CONTEXT = {
  crop: 'Wheat',
  location: 'Indore, Madhya Pradesh',
  landSize: '5 acres',
  latitude: 22.7196,
  longitude: 75.8577,
  growthStage: 'Vegetative',
};

// ------------------------------------------------------
// Supported Intent Types
// ------------------------------------------------------

const INTENTS = Object.freeze({
  IRRIGATION: 'IRRIGATION',
  WEATHER: 'WEATHER',
  MARKET: 'MARKET',
  GENERAL: 'GENERAL',
});

// ------------------------------------------------------
// Normalize User Input
// ------------------------------------------------------

const normalizeQuery = (queryText = '') => {
  return String(queryText)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

// Language normalization is imported from VoiceQuery model to avoid duplication

// ------------------------------------------------------
// Detect Query Intent
// ------------------------------------------------------

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

  if (irrigationKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.IRRIGATION;
  }

  if (weatherKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.WEATHER;
  }

  if (marketKeywords.some((keyword) => query.includes(keyword))) {
    return INTENTS.MARKET;
  }

  return INTENTS.GENERAL;
};

// ------------------------------------------------------
// Resolve Farm Context
// ------------------------------------------------------

const resolveFarmContext = (farm) => {
  const crop =
    typeof farm?.currentCrop === 'string' && farm.currentCrop.trim()
      ? farm.currentCrop.trim()
      : DEFAULT_FARM_CONTEXT.crop;

  const location =
    typeof farm?.location?.display === 'string' &&
    farm.location.display.trim()
      ? farm.location.display.trim()
      : DEFAULT_FARM_CONTEXT.location;

  const landSizeValue =
    farm?.landSize?.value !== undefined &&
    farm?.landSize?.value !== null
      ? farm.landSize.value
      : DEFAULT_FARM_CONTEXT.landSize.split(' ')[0];

  const landSizeUnit =
    typeof farm?.landSize?.unit === 'string' &&
    farm.landSize.unit.trim()
      ? farm.landSize.unit.trim()
      : 'acres';

  const latitude =
    Number.isFinite(Number(farm?.location?.lat))
      ? Number(farm.location.lat)
      : DEFAULT_FARM_CONTEXT.latitude;

  const longitude =
    Number.isFinite(Number(farm?.location?.lng))
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

// ------------------------------------------------------
// Safe Service Execution
// ------------------------------------------------------

const fetchContextData = async (context, farm) => {
  const farmForIrrigation =
    farm || {
      currentCrop: context.crop,
      growthStage: context.growthStage,
    };

  const [weatherResult, marketResult] = await Promise.allSettled([
    fetchOpenMeteoWeather(context.latitude, context.longitude),
    fetchCropMarketData(context.crop),
  ]);

  const weather =
    weatherResult.status === 'fulfilled'
      ? weatherResult.value
      : null;

  const market =
    marketResult.status === 'fulfilled'
      ? marketResult.value
      : null;

  if (!weather) {
    console.error(
      '[VoiceAssistant] Weather service failed:',
      weatherResult.reason
    );
  }

  if (!market) {
    console.error(
      '[VoiceAssistant] Market service failed:',
      marketResult.reason
    );
  }

  let irrigation = null;

  if (weather) {
    try {
      irrigation = evaluateIrrigation(farmForIrrigation, weather);
    } catch (error) {
      console.error(
        '[VoiceAssistant] Irrigation engine failed:',
        error
      );
    }
  }

  return {
    weather,
    market,
    irrigation,
  };
};

// ------------------------------------------------------
// Safe Value Helpers
// ------------------------------------------------------

const getWeatherValue = (weather, key, fallback = 0) => {
  const value = Number(weather?.[key]);

  return Number.isFinite(value) ? value : fallback;
};

const getMarketPrice = (market) => {
  const price = Number(market?.currentPrice);

  return Number.isFinite(price) ? price : 0;
};

const getMarketTrend = (market) => {
  return market?.trend
    ? String(market.trend)
    : 'stable';
};

// ------------------------------------------------------
// Irrigation Response
// ------------------------------------------------------

const buildIrrigationResponse = ({
  language,
  crop,
  location,
  growthStage,
  weather,
  irrigation,
}) => {
  const rainProbability = getWeatherValue(
    weather,
    'rainProbability'
  );

  const rainfallMm = getWeatherValue(
    weather,
    'rainfallMm'
  );

  const shouldNotIrrigate =
    irrigation?.decision === 'DONT_IRRIGATE';

  switch (language) {
    case 'hi-IN':
      return shouldNotIrrigate
        ? `Aapke ${crop} khet ke liye aaj irrigation ki zarurat nahi hai. ${location} mein lagbhag ${rainfallMm}mm baarish expected hai.`
        : `Aapke ${crop} khet (${growthStage} stage) ke liye aaj irrigation dena recommended hai. Rain probability ${rainProbability}% hai.`;

    case 'mr-IN':
      return shouldNotIrrigate
        ? `तुमच्या ${crop} पिकासाठी आज सिंचनाची गरज नाही. ${location} परिसरात सुमारे ${rainfallMm}mm पाऊस अपेक्षित आहे.`
        : `तुमच्या ${crop} पिकासाठी आज सिंचन करणे योग्य राहील. पावसाची शक्यता ${rainProbability}% आहे.`;

    case 'gu-IN':
      return shouldNotIrrigate
        ? `તમારા ${crop} પાક માટે આજે સિંચાઈની જરૂર નથી. ${location} વિસ્તારમાં લગભગ ${rainfallMm}mm વરસાદની શક્યતા છે.`
        : `તમારા ${crop} પાક માટે આજે સિંચાઈ કરવાની ભલામણ છે. વરસાદની શક્યતા ${rainProbability}% છે.`;

    case 'pa-IN':
      return shouldNotIrrigate
        ? `ਤੁਹਾਡੇ ${crop} ਖੇਤ ਲਈ ਅੱਜ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ। ${location} ਵਿੱਚ ਲਗਭਗ ${rainfallMm}mm ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।`
        : `ਤੁਹਾਡੇ ${crop} ਖੇਤ ਲਈ ਅੱਜ ਸਿੰਚਾਈ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${rainProbability}% ਹੈ।`;

    default:
      return shouldNotIrrigate
        ? `Irrigation is not required for your ${crop} field today. Approximately ${rainfallMm}mm rainfall is expected in ${location}.`
        : `Irrigation is recommended for your ${crop} field today. Rain probability is ${rainProbability}%.`;
  }
};

// ------------------------------------------------------
// Weather Response
// ------------------------------------------------------

const buildWeatherResponse = ({
  language,
  location,
  weather,
}) => {
  const temperature = getWeatherValue(
    weather,
    'temperature'
  );

  const rainProbability = getWeatherValue(
    weather,
    'rainProbability'
  );

  const rainfallMm = getWeatherValue(
    weather,
    'rainfallMm'
  );

  switch (language) {
    case 'hi-IN':
      return `${location} mein aaj temperature ${temperature}°C hai. Baarish ki probability ${rainProbability}% hai aur expected rainfall ${rainfallMm}mm hai.`;

    case 'mr-IN':
      return `${location} मध्ये आज तापमान ${temperature}°C आहे. पावसाची शक्यता ${rainProbability}% असून अपेक्षित पाऊस ${rainfallMm}mm आहे.`;

    case 'gu-IN':
      return `${location} માં આજે તાપમાન ${temperature}°C છે. વરસાદની શક્યતા ${rainProbability}% છે અને અપેક્ષિત વરસાદ ${rainfallMm}mm છે.`;

    case 'pa-IN':
      return `${location} ਵਿੱਚ ਅੱਜ ਤਾਪਮਾਨ ${temperature}°C ਹੈ। ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${rainProbability}% ਹੈ ਅਤੇ ਲਗਭਗ ${rainfallMm}mm ਮੀਂਹ ਦੀ ਉਮੀਦ ਹੈ।`;

    default:
      return `The current temperature in ${location} is ${temperature}°C. Rain probability is ${rainProbability}% with approximately ${rainfallMm}mm expected rainfall.`;
  }
};

// ------------------------------------------------------
// Market Response
// ------------------------------------------------------

const buildMarketResponse = ({
  language,
  crop,
  location,
  market,
}) => {
  const currentPrice = getMarketPrice(market);
  const trend = getMarketTrend(market);
  const marketName = market?.market || 'local mandi';

  switch (language) {
    case 'hi-IN':
      return `Aaj ${location} mein ${crop} ka current market price ₹${currentPrice} per quintal hai. Recent market trend ${trend.toLowerCase()} hai.`;

    case 'mr-IN':
      return `आज ${location} मध्ये ${crop} चा सध्याचा बाजारभाव ₹${currentPrice} प्रति क्विंटल आहे. बाजाराचा अलीकडील ट्रेंड ${trend} आहे.`;

    case 'gu-IN':
      return `આજે ${location} માં ${crop} નો વર્તમાન બજાર ભાવ ₹${currentPrice} પ્રતિ ક્વિન્ટલ છે. બજારનો તાજેતરનો ટ્રેન્ડ ${trend} છે.`;

    case 'pa-IN':
      return `ਅੱਜ ${location} ਵਿੱਚ ${crop} ਦੀ ਮੌਜੂਦਾ ਮੰਡੀ ਕੀਮਤ ₹${currentPrice} ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ। ਮਾਰਕੀਟ ਦਾ ਹਾਲੀਆ ਰੁਝਾਨ ${trend} ਹੈ।`;

    default:
      return `Today's current market price for ${crop} at ${marketName} is ₹${currentPrice} per quintal. Recent market trend: ${trend}.`;
  }
};

// ------------------------------------------------------
// General Farm Response
// ------------------------------------------------------

const buildGeneralResponse = ({
  language,
  crop,
  location,
  landSize,
  weather,
  market,
}) => {
  const temperature = getWeatherValue(
    weather,
    'temperature'
  );

  const currentPrice = getMarketPrice(market);
  const weatherCondition =
    weather?.weatherCondition || 'stable';

  switch (language) {
    case 'hi-IN':
      return `Aapke ${landSize} ke ${crop} farm, ${location} mein abhi weather ${weatherCondition} hai. Temperature ${temperature}°C hai aur mandi price ₹${currentPrice}/quintal hai.`;

    case 'mr-IN':
      return `${location} येथील ${landSize} ${crop} शेतासाठी सध्या हवामान ${weatherCondition} आहे. तापमान ${temperature}°C आणि बाजारभाव ₹${currentPrice}/क्विंटल आहे.`;

    case 'gu-IN':
      return `${location} ખાતે ${landSize} ${crop} ફાર્મ માટે હાલમાં હવામાન ${weatherCondition} છે. તાપમાન ${temperature}°C અને બજાર ભાવ ₹${currentPrice}/ક્વિન્ટલ છે.`;

    case 'pa-IN':
      return `${location} ਵਿੱਚ ਤੁਹਾਡੇ ${landSize} ${crop} ਖੇਤ ਲਈ ਇਸ ਸਮੇਂ ਮੌਸਮ ${weatherCondition} ਹੈ। ਤਾਪਮਾਨ ${temperature}°C ਅਤੇ ਮੰਡੀ ਕੀਮਤ ₹${currentPrice}/ਕੁਇੰਟਲ ਹੈ।`;

    default:
      return `For your ${landSize} ${crop} farm in ${location}, the current weather is ${weatherCondition} with a temperature of ${temperature}°C. The current market price is ₹${currentPrice}/quintal.`;
  }
};

// ------------------------------------------------------
// Main Voice Assistant Engine
// ------------------------------------------------------

export const processVoiceQuery = async (
  queryText,
  languageStr = 'hi-IN',
  farm = null
) => {
  const normalizedQuery = normalizeQuery(queryText);

  if (!normalizedQuery) {
    throw new Error('Voice query cannot be empty.');
  }

  const language = normalizeLanguage(languageStr);
  const context = resolveFarmContext(farm);
  const intent = detectIntent(normalizedQuery);

  console.info(
    `[VoiceAssistant] Processing query | intent=${intent} | language=${language}`
  );

  const {
    weather,
    market,
    irrigation,
  } = await fetchContextData(context, farm);

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

      weatherTemp: weather
        ? getWeatherValue(weather, 'temperature')
        : null,

      rainProbability: weather
        ? getWeatherValue(weather, 'rainProbability')
        : null,

      rainfallMm: weather
        ? getWeatherValue(weather, 'rainfallMm')
        : null,

      irrigationDecision:
        irrigation?.decision || null,

      marketPrice:
        market
          ? getMarketPrice(market)
          : null,

      marketTrend:
        market
          ? getMarketTrend(market)
          : null,
    },
  };
}
