/**
 * Configurable Crop Daily Water Needs (in mm) by crop type & growth stage
 */
const CROP_WATER_NEEDS = {
  Wheat: { 'Initial / Germination': 3.0, Vegetative: 4.5, Flowering: 5.5, 'Yield Formation / Fruiting': 4.0, 'Ripening / Harvesting': 2.0 },
  Rice: { 'Initial / Germination': 6.0, Vegetative: 9.0, Flowering: 11.0, 'Yield Formation / Fruiting': 8.0, 'Ripening / Harvesting': 3.0 },
  Maize: { 'Initial / Germination': 3.5, Vegetative: 5.5, Flowering: 7.0, 'Yield Formation / Fruiting': 5.0, 'Ripening / Harvesting': 2.5 },
  Soybean: { 'Initial / Germination': 3.0, Vegetative: 5.0, Flowering: 6.5, 'Yield Formation / Fruiting': 4.5, 'Ripening / Harvesting': 2.0 },
  Cotton: { 'Initial / Germination': 3.5, Vegetative: 6.0, Flowering: 7.5, 'Yield Formation / Fruiting': 5.5, 'Ripening / Harvesting': 2.5 },
  Potato: { 'Initial / Germination': 3.0, Vegetative: 4.5, Flowering: 5.0, 'Yield Formation / Fruiting': 4.0, 'Ripening / Harvesting': 2.0 },
  Default: { 'Initial / Germination': 3.0, Vegetative: 5.0, Flowering: 6.0, 'Yield Formation / Fruiting': 4.5, 'Ripening / Harvesting': 2.0 }
};

const P_THRESHOLD = 70; // 70% rain probability threshold
const P_LOW_THRESHOLD = 30; // 30% low rain probability threshold

/**
 * Smart Irrigation Engine (F04)
 * Returns decision (IRRIGATE | DONT_IRRIGATE | NEED_MORE_INFO)
 * with full input transparency and explanation copy.
 */
export const evaluateIrrigation = (farm, weatherData) => {
  if (!weatherData || typeof weatherData.rainProbability !== 'number' || typeof weatherData.rainfallMm !== 'number') {
    return {
      decision: 'NEED_MORE_INFO',
      confidence: 0.5,
      reasoning: {
        rainProbability: weatherData?.rainProbability ?? null,
        expectedRainfallMm: weatherData?.rainfallMm ?? null,
        cropWaterNeedMm: 5.0,
        thresholdsUsed: { P_THRESHOLD, P_LOW_THRESHOLD },
        summaryText: 'Insufficient weather data available to calculate irrigation safely.',
        actionableAdvice: 'Check back once weather connection is refreshed.'
      }
    };
  }

  const cropName = farm.currentCrop || 'Wheat';
  const growthStage = farm.growthStage || 'Vegetative';
  const cropNeedsObj = CROP_WATER_NEEDS[cropName] || CROP_WATER_NEEDS.Default;
  const cropWaterNeedMm = cropNeedsObj[growthStage] || 5.0;

  const rainProbability = weatherData.rainProbability;
  const expectedRainfallMm = weatherData.rainfallMm;

  let decision = 'IRRIGATE';
  let confidence = 0.9;
  let summaryText = '';
  let actionableAdvice = '';

  // Rule 1: High rain probability & sufficient rainfall expected -> DON'T IRRIGATE
  if (rainProbability >= P_THRESHOLD && expectedRainfallMm >= cropWaterNeedMm) {
    decision = 'DONT_IRRIGATE';
    confidence = 0.95;
    summaryText = `${rainProbability}% rain probability with ${expectedRainfallMm}mm expected rainfall meets your ${cropName}'s daily requirement of ${cropWaterNeedMm}mm.`;
    actionableAdvice = `Rain expected today. Save water and electricity — do not irrigate your ${cropName} field today.`;
  }
  // Rule 2: Low rain probability & dry conditions -> IRRIGATE
  else if (rainProbability < P_LOW_THRESHOLD && expectedRainfallMm < 2) {
    decision = 'IRRIGATE';
    confidence = 0.92;
    summaryText = `Low rain chance (${rainProbability}%) and dry weather. Your ${cropName} (${growthStage} stage) requires ~${cropWaterNeedMm}mm water today.`;
    actionableAdvice = `Irrigate your ${cropName} field today to prevent moisture stress and preserve crop yield.`;
  }
  // Rule 3: Moderate rain probability -> Default to protecting crop, with note
  else {
    decision = 'IRRIGATE';
    confidence = 0.8;
    summaryText = `Moderate rain probability (${rainProbability}%, ~${expectedRainfallMm}mm expected). Your ${cropName} requires ${cropWaterNeedMm}mm water.`;
    actionableAdvice = `Light/moderate irrigation recommended to maintain soil moisture without risk of waterlogging.`;
  }

  return {
    decision,
    confidence,
    reasoning: {
      rainProbability,
      expectedRainfallMm,
      cropWaterNeedMm,
      thresholdsUsed: { P_THRESHOLD, P_LOW_THRESHOLD },
      summaryText,
      actionableAdvice
    }
  };
};
