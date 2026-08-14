/**
 * Scientific Crop Suitability Recommendation Engine
 * Calculates crop compatibility scoring based on Soil NPK, pH, Temperature, Rainfall, and Season.
 */

const CROP_PROFILES = [
  {
    name: 'Wheat',
    seasons: ['Rabi'],
    soilTypes: ['Black Soil', 'Clay Soil', 'Loamy Soil'],
    tempRange: { min: 10, max: 25 },
    rainfallRange: { min: 30, max: 100 },
    npkIdeal: { N: 100, P: 50, K: 40 },
    pHRange: { min: 6.0, max: 7.5 },
    reasoning: 'Optimal temperature window for high protein grain formation. Soil has good clay retention.',
  },
  {
    name: 'Rice',
    seasons: ['Kharif'],
    soilTypes: ['Clay Soil', 'Loamy Soil'],
    tempRange: { min: 20, max: 35 },
    rainfallRange: { min: 150, max: 350 },
    npkIdeal: { N: 100, P: 45, K: 40 },
    pHRange: { min: 5.5, max: 6.8 },
    reasoning: 'High water-retention clayey soil matches current monsoonal precipitation index.',
  },
  {
    name: 'Maize',
    seasons: ['Kharif', 'Rabi'],
    soilTypes: ['Loamy Soil', 'Sandy Soil', 'Black Soil'],
    tempRange: { min: 18, max: 32 },
    rainfallRange: { min: 50, max: 150 },
    npkIdeal: { N: 110, P: 50, K: 40 },
    pHRange: { min: 5.5, max: 7.5 },
    reasoning: 'Strong NPK uptake response with moderate water demand.',
  },
  {
    name: 'Soybean',
    seasons: ['Kharif'],
    soilTypes: ['Black Soil', 'Clay Soil', 'Loamy Soil'],
    tempRange: { min: 15, max: 32 },
    rainfallRange: { min: 60, max: 110 },
    npkIdeal: { N: 30, P: 70, K: 50 }, // Leguminous crop, fixes N, needs higher P
    pHRange: { min: 6.0, max: 7.5 },
    reasoning: 'Matches high organic carbon requirements and clay loam consistency.',
  },
  {
    name: 'Cotton',
    seasons: ['Kharif'],
    soilTypes: ['Black Soil', 'Loamy Soil'],
    tempRange: { min: 20, max: 35 },
    rainfallRange: { min: 50, max: 120 },
    npkIdeal: { N: 90, P: 50, K: 45 },
    pHRange: { min: 5.8, max: 8.0 },
    reasoning: 'Deep root structure fits deep black soils with excellent moisture holding capacity.',
  },
  {
    name: 'Potato',
    seasons: ['Rabi'],
    soilTypes: ['Loamy Soil', 'Sandy Soil'],
    tempRange: { min: 10, max: 22 },
    rainfallRange: { min: 30, max: 80 },
    npkIdeal: { N: 120, P: 90, K: 120 },
    pHRange: { min: 5.0, max: 6.5 },
    reasoning: 'Sandy loam provides ideal aeration for tuber expansion and disease avoidance.',
  },
];

/**
 * Calculates suitability percentage for each crop profile
 */
export const calculateCropSuitability = ({ N, P, K, pH, temperature, rainfall, season, soilType }) => {
  const recommendations = [];

  for (const crop of CROP_PROFILES) {
    let score = 100;
    const diagnostics = [];

    // 1. Season Compatibility (weight: 20 points)
    const isSeasonMatch = crop.seasons.map(s => s.toLowerCase()).includes(season.toLowerCase());
    if (!isSeasonMatch) {
      score -= 20;
      diagnostics.push(`Off-season: preferred season is ${crop.seasons.join('/')}`);
    }

    // 2. Soil Type Compatibility (weight: 15 points)
    const isSoilMatch = crop.soilTypes.map(s => s.toLowerCase()).includes(soilType.toLowerCase());
    if (!isSoilMatch) {
      score -= 15;
      diagnostics.push(`Sub-optimal soil texture (preferred: ${crop.soilTypes.join(', ')})`);
    }

    // 3. pH Compatibility (weight: 15 points)
    if (pH < crop.pHRange.min) {
      const penalty = Math.min(15, (crop.pHRange.min - pH) * 10);
      score -= penalty;
      diagnostics.push(`Soil is too acidic for optimal nutrient uptake (ideal pH ${crop.pHRange.min}-${crop.pHRange.max})`);
    } else if (pH > crop.pHRange.max) {
      const penalty = Math.min(15, (pH - crop.pHRange.max) * 10);
      score -= penalty;
      diagnostics.push(`Soil is too alkaline (ideal pH ${crop.pHRange.min}-${crop.pHRange.max})`);
    }

    // 4. Temperature Suitability (weight: 15 points)
    if (temperature < crop.tempRange.min) {
      const diff = crop.tempRange.min - temperature;
      score -= Math.min(15, diff * 1.5);
      diagnostics.push(`Temperature is below germination minimum (${crop.tempRange.min}°C)`);
    } else if (temperature > crop.tempRange.max) {
      const diff = temperature - crop.tempRange.max;
      score -= Math.min(15, diff * 1.5);
      diagnostics.push(`High temperatures may induce heat stress during reproductive stages`);
    }

    // 5. Rainfall/Water requirement (weight: 15 points)
    if (rainfall < crop.rainfallRange.min) {
      score -= 10;
      diagnostics.push(`Rainfall is low; supplemental irrigation will be required`);
    } else if (rainfall > crop.rainfallRange.max) {
      score -= 10;
      diagnostics.push(`High rainfall might cause waterlogging / fungal root issues`);
    }

    // 6. NPK deviation calculation (weight: 20 points)
    const nDiff = Math.abs(crop.npkIdeal.N - N) / crop.npkIdeal.N;
    const pDiff = Math.abs(crop.npkIdeal.P - P) / crop.npkIdeal.P;
    const kDiff = Math.abs(crop.npkIdeal.K - K) / crop.npkIdeal.K;

    const npkScoreLoss = Math.min(20, (nDiff + pDiff + kDiff) * 8);
    score -= npkScoreLoss;

    if (nDiff > 0.4) diagnostics.push(`Nitrogen level deviates from ideal ${crop.npkIdeal.N} kg/ha`);
    if (pDiff > 0.4) diagnostics.push(`Phosphorus level deviates from ideal ${crop.npkIdeal.P} kg/ha`);
    if (kDiff > 0.4) diagnostics.push(`Potassium level deviates from ideal ${crop.npkIdeal.K} kg/ha`);

    // Ensure score bounds
    const finalScore = Math.max(10, Math.min(100, Math.round(score)));

    recommendations.push({
      crop: crop.name,
      score: finalScore,
      season: crop.seasons[0],
      soilType: crop.soilTypes[0],
      reasoning: crop.reasoning,
      diagnostics: diagnostics.length > 0 ? diagnostics : ['Soil and climate are fully optimized for this crop'],
    });
  }

  // Sort by highest suitability score
  return recommendations.sort((a, b) => b.score - a.score);
};
