/**
 * Scientific Irrigation Evapotranspiration (ET0) Engine
 * Based on FAO-56 Penman-Monteith & Hargreaves-Samani approximations
 */

const CROP_KC_COEFFICIENTS = {
  Wheat: {
    'Initial / Germination': 0.4,
    Vegetative: 1.15,
    Flowering: 1.15,
    'Yield Formation / Fruiting': 0.8,
    'Ripening / Harvesting': 0.25,
  },
  Rice: {
    'Initial / Germination': 1.05,
    Vegetative: 1.2,
    Flowering: 1.2,
    'Yield Formation / Fruiting': 0.9,
    'Ripening / Harvesting': 0.6,
  },
  Maize: {
    'Initial / Germination': 0.4,
    Vegetative: 1.2,
    Flowering: 1.2,
    'Yield Formation / Fruiting': 0.8,
    'Ripening / Harvesting': 0.35,
  },
  Soybean: {
    'Initial / Germination': 0.4,
    Vegetative: 1.15,
    Flowering: 1.15,
    'Yield Formation / Fruiting': 0.8,
    'Ripening / Harvesting': 0.3,
  },
  Cotton: {
    'Initial / Germination': 0.35,
    Vegetative: 1.15,
    Flowering: 1.15,
    'Yield Formation / Fruiting': 0.75,
    'Ripening / Harvesting': 0.3,
  },
  Potato: {
    'Initial / Germination': 0.5,
    Vegetative: 1.15,
    Flowering: 1.15,
    'Yield Formation / Fruiting': 0.75,
    'Ripening / Harvesting': 0.4,
  },
  Default: {
    'Initial / Germination': 0.4,
    Vegetative: 1.15,
    Flowering: 1.15,
    'Yield Formation / Fruiting': 0.8,
    'Ripening / Harvesting': 0.3,
  },
};

// Soil Available Water Capacity (AWC) by Soil Type
const SOIL_PROPERTIES = {
  'Black Soil': { fieldCapacityPct: 38, wiltingPointPct: 18, criticalDepletionPct: 50 },
  'Clay Soil': { fieldCapacityPct: 40, wiltingPointPct: 20, criticalDepletionPct: 50 },
  'Loamy Soil': { fieldCapacityPct: 28, wiltingPointPct: 13, criticalDepletionPct: 50 },
  'Sandy Soil': { fieldCapacityPct: 14, wiltingPointPct: 6, criticalDepletionPct: 50 },
  Default: { fieldCapacityPct: 30, wiltingPointPct: 15, criticalDepletionPct: 50 },
};

/**
 * Approximate Reference Evapotranspiration (ET0) using Hargreaves-Samani method
 */
export const calculateET0 = (tempMax, tempMin, humidity, windSpeed, latitude) => {
  const tempAvg = (tempMax + tempMin) / 2;
  const tempRange = tempMax - tempMin;

  // Day of year
  const now = new Date();
  const dayOfYear = now.getMonth() * 30.5 + now.getDate();

  // Solar declination (radians)
  const solarDecl = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);

  // Convert latitude to radians
  const latRad = (latitude * Math.PI) / 180;

  // Sunset hour angle (radians)
  const sunsetHourAngle = Math.acos(
    Math.max(-1.0, Math.min(1.0, -Math.tan(latRad) * Math.tan(solarDecl)))
  );

  // Eccentricity correction
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);

  // Extraterrestrial radiation Ra (MJ/m2/day)
  const Ra =
    37.6 *
    dr *
    (sunsetHourAngle * Math.sin(latRad) * Math.sin(solarDecl) +
      Math.cos(latRad) * Math.cos(solarDecl) * Math.sin(sunsetHourAngle));

  // Hargreaves-Samani formula: ET0 = 0.0023 * 0.408 * Ra * (tempAvg + 17.8) * sqrt(tempRange)
  let ET0 = 0.0023 * 0.408 * Ra * (tempAvg + 17.8) * Math.sqrt(Math.max(0.1, tempRange));

  // Adjust for high/low humidity and wind speed
  const windFactor = 1.0 + 0.05 * (windSpeed - 2.0); // Baseline wind 2m/s
  const humidityFactor = 1.0 - 0.003 * (humidity - 50.0); // Baseline humidity 50%
  ET0 = ET0 * windFactor * humidityFactor;

  return Math.max(0.5, Number(ET0.toFixed(2)));
};

/**
 * Smart Scientific Irrigation Evaluator
 */
export const evaluateIrrigation = (farm, weatherData) => {
  const cropName = farm.currentCrop || 'Wheat';
  const growthStage = farm.growthStage || 'Vegetative';
  const soilType = farm.soilType || 'Black Soil';
  const latitude = farm.location?.lat || 22.7196;

  const tempMax = weatherData?.temperature + 3 || 32;
  const tempMin = weatherData?.temperature - 5 || 21;
  const humidity = weatherData?.humidity ?? 65;
  const windSpeed = weatherData?.windSpeed ?? 12;
  const rainProbability = weatherData?.rainProbability ?? 0;
  const expectedRainfallMm = weatherData?.rainfallMm ?? 0;

  // 1. Calculate Reference Evapotranspiration (ET0)
  const ET0 = calculateET0(tempMax, tempMin, humidity, windSpeed, latitude);

  // 2. Lookup Crop Coefficient (Kc)
  const kcCoeffs = CROP_KC_COEFFICIENTS[cropName] || CROP_KC_COEFFICIENTS.Default;
  const Kc = kcCoeffs[growthStage] || 0.85;

  // 3. Compute Crop Water Need (ETc)
  // ETc = ET0 * Kc (mm/day)
  const cropWaterNeedMm = Number((ET0 * Kc).toFixed(2));

  // 4. Soil Properties & Depletion
  const soil = SOIL_PROPERTIES[soilType] || SOIL_PROPERTIES.Default;
  const awcVal = soil.fieldCapacityPct - soil.wiltingPointPct; // Available Water Capacity %

  // Effective precipitation (FAO standard estimate: 60% of precipitation > 5mm)
  const effectiveRainfallMm = expectedRainfallMm > 5 ? expectedRainfallMm * 0.6 : 0;

  // Water deficit calculation (ETc - effective rainfall)
  const waterDeficitMm = Math.max(0, cropWaterNeedMm - effectiveRainfallMm);

  // Soil moisture estimation based on humidity & weather condition
  // High humidity (~85%) keeps soil moist, dry conditions deplete it
  const humidityModifier = (85 - humidity) * 0.005;
  const estimatedDepletionFraction = Math.max(0.1, Math.min(0.9, 0.4 + humidityModifier + (waterDeficitMm / 20)));

  // Critical threshold depletion check
  const criticalFraction = soil.criticalDepletionPct / 100;
  const requiresWater = estimatedDepletionFraction >= criticalFraction;

  let decision = 'DONT_IRRIGATE';
  let confidence = 0.9;
  let summaryText = '';
  let actionableAdvice = '';

  if (requiresWater) {
    if (rainProbability >= 70 && effectiveRainfallMm >= waterDeficitMm) {
      decision = 'DONT_IRRIGATE';
      confidence = 0.95;
      summaryText = `High rain probability (${rainProbability}%) will supply ~${effectiveRainfallMm.toFixed(1)}mm of water, satisfying the daily requirement of ${cropWaterNeedMm}mm.`;
      actionableAdvice = `Postpone irrigation today. Expected natural precipitation will satisfy your ${cropName}'s water needs.`;
    } else {
      decision = 'IRRIGATE';
      confidence = Number((0.85 + (estimatedDepletionFraction - criticalFraction) * 0.3).toFixed(2));
      if (confidence > 0.98) confidence = 0.98;

      summaryText = `Soil depletion is at ${(estimatedDepletionFraction * 100).toFixed(0)}% (exceeding critical threshold of ${(criticalFraction * 100).toFixed(0)}%). ${cropName} (${growthStage}) has a daily water need of ${cropWaterNeedMm}mm.`;
      actionableAdvice = `Apply irrigation of approximately ${(waterDeficitMm).toFixed(1)} mm today to replenish soil moisture to field capacity.`;
    }
  } else {
    decision = 'DONT_IRRIGATE';
    confidence = Number((0.85 + (criticalFraction - estimatedDepletionFraction) * 0.3).toFixed(2));
    if (confidence > 0.98) confidence = 0.98;

    summaryText = `Soil moisture depletion is optimal at ${(estimatedDepletionFraction * 100).toFixed(0)}% (field capacity limit is ${(criticalFraction * 100).toFixed(0)}%).`;
    actionableAdvice = `No irrigation required. Maintain current soil moisture and check weather updates tomorrow.`;
  }

  return {
    decision,
    confidence,
    reasoning: {
      rainProbability,
      expectedRainfallMm,
      cropWaterNeedMm,
      ET0,
      Kc,
      soilDepletionPct: Math.round(estimatedDepletionFraction * 100),
      soilType,
      summaryText,
      actionableAdvice,
    },
  };
};
