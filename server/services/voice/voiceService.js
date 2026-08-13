import { fetchOpenMeteoWeather } from '../weather/openMeteoService.js';
import { evaluateIrrigation } from '../irrigation/irrigationEngine.js';
import { fetchCropMarketData } from '../market/marketDataService.js';

/**
 * Context-aware Voice Assistant Engine (F11)
 * Combines Farm Profile + Weather + Irrigation + Market Data to construct
 * natural, farm-specific answers in English, Hindi, Marathi, Gujarati, or Punjabi.
 */
export const processVoiceQuery = async (queryText, languageStr = 'hi-IN', farm = null) => {
  const query = queryText.toLowerCase().trim();
  const lang = languageStr || 'hi-IN';

  const crop = farm?.currentCrop || 'Wheat';
  const location = farm?.location?.display || 'Indore, Madhya Pradesh';
  const landSize = farm ? `${farm.landSize?.value || 5} ${farm.landSize?.unit || 'acres'}` : '5 acres';

  const lat = farm?.location?.lat || 22.7196;
  const lng = farm?.location?.lng || 75.8577;

  // Fetch live context engines
  const weather = await fetchOpenMeteoWeather(lat, lng);
  const irrigation = evaluateIrrigation(farm || { currentCrop: crop, growthStage: 'Vegetative' }, weather);
  const market = await fetchCropMarketData(crop);

  let responseText = '';

  // Query Intent 1: Irrigation ("aaj paani dena chahiye?", "should I irrigate?")
  if (query.includes('irrigate') || query.includes('paani') || query.includes('pani') || query.includes('water')) {
    if (lang.startsWith('hi')) {
      responseText = irrigation.decision === 'DONT_IRRIGATE'
        ? `Aapke ${crop} khet ke liye aaj paani (irrigation) ki zarurat nahi hai, kyunki aapke area (${location}) mein ${weather.rainfallMm}mm baarish expected hai.`
        : `Aapke ${crop} khet (${farm?.growthStage || 'Vegetative'} stage) ke liye aaj paani dena chahiye, kyunki baarish ki sambhavna kam (${weather.rainProbability}%) hai.`;
    } else if (lang.startsWith('mr')) {
      responseText = irrigation.decision === 'DONT_IRRIGATE'
        ? `तुमच्या ${crop} पिकासाठी आज पाणी देण्याची गरज नाही, कारण ${location} परिसरात ${weather.rainfallMm}mm पाऊस अपेक्षित आहे.`
        : `तुमच्या ${crop} पिकासाठी आज पाणी देणे योग्य राहील, कारण पावसाची शक्यता कमी (${weather.rainProbability}%) आहे.`;
    } else if (lang.startsWith('gu')) {
      responseText = irrigation.decision === 'DONT_IRRIGATE'
        ? `તમારા ${crop} પાક માટે આજે સિંચાઈની જરૂર નથી, કારણ કે ${location} વિસ્તારમાં ${weather.rainfallMm}mm વરસાદની શક્યતા છે.`
        : `તમારા ${crop} પાક માટે આજે સિંચાઈ કરવી જોઈએ, કારણ કે વરસાદની શક્યતા ઓછી (${weather.rainProbability}%) છે.`;
    } else if (lang.startsWith('pa')) {
      responseText = irrigation.decision === 'DONT_IRRIGATE'
        ? `ਤੁਹਾਡੇ ${crop} ਖੇਤ ਲਈ ਅੱਜ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ, ਕਿਉਂਕਿ ${location} ਵਿੱਚ ${weather.rainfallMm}mm ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।`
        : `ਤੁਹਾਡੇ ${crop} ਖੇਤ ਲਈ ਅੱਜ ਸਿੰਚਾਈ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ, ਕਿਉਂਕਿ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਘੱਟ (${weather.rainProbability}%) ਹੈ।`;
    } else {
      responseText = irrigation.decision === 'DONT_IRRIGATE'
        ? `Irrigation is not required for your ${crop} field in ${location} today because ${weather.rainfallMm}mm rainfall is expected.`
        : `Irrigation is recommended for your ${crop} field today as rain probability is low (${weather.rainProbability}%).`;
    }
  }
  // Query Intent 2: Weather ("baarish hogi kya?", "will it rain?")
  else if (query.includes('baarish') || query.includes('rain') || query.includes('barish') || query.includes('weather') || query.includes('mausam')) {
    if (lang.startsWith('hi')) {
      responseText = `${location} mein aaj temperature ${weather.temperature}°C hai aur rain probability ${weather.rainProbability}% hai. Expected rainfall: ${weather.rainfallMm}mm.`;
    } else if (lang.startsWith('mr')) {
      responseText = `${location} मध्ये आज तापमान ${weather.temperature}°C असून पावसाची शक्यता ${weather.rainProbability}% आहे.`;
    } else {
      responseText = `The current temperature in ${location} is ${weather.temperature}°C with ${weather.rainProbability}% rain probability and ${weather.rainfallMm}mm expected rainfall.`;
    }
  }
  // Query Intent 3: Market Price ("price kya hai?", "market rate?")
  else if (query.includes('price') || query.includes('rate') || query.includes('bhav') || query.includes('daam') || query.includes('mandi') || query.includes('market')) {
    if (lang.startsWith('hi')) {
      responseText = `Aaj ${location} mein ${crop} ka current market price ₹${market.currentPrice} per quintal hai. Recent prices have been trending ${market.trend.toLowerCase()}.`;
    } else {
      responseText = `Today's current market price for ${crop} at ${market.market} is ₹${market.currentPrice} per quintal. Recent trend: ${market.trend}.`;
    }
  }
  // Query Intent 4: Crop Recommendation / General Advice
  else {
    if (lang.startsWith('hi')) {
      responseText = `Aapke ${location} khet (${landSize}) ke liye ${crop} ki vegetative condition achhi hai. Weather trend stable hai aur current price ₹${market.currentPrice}/quintal hai.`;
    } else {
      responseText = `For your ${landSize} ${crop} farm in ${location}, weather conditions are currently ${weather.weatherCondition} and mandi price is ₹${market.currentPrice}/quintal.`;
    }
  }

  return {
    queryText,
    language: lang,
    responseText,
    contextSnapshot: {
      crop,
      location,
      landSize,
      weatherTemp: weather.temperature,
      rainProbability: weather.rainProbability,
      rainfallMm: weather.rainfallMm,
      irrigationDecision: irrigation.decision,
      marketPrice: market.currentPrice,
      marketTrend: market.trend
    }
  };
};
