/**
 * Weather Risk Engine (F05)
 * Analyzes weather conditions for 3 farming-relevant weather risks:
 * 1. Heavy Rain Risk (expected rainfall >= 40mm)
 * 2. Extreme Heat Risk (temperature >= 40°C)
 * 3. Frost Risk (temperature <= 3°C)
 */
export const evaluateWeatherRisks = (weatherData, cropName = 'crop') => {
  const risks = [];

  const expectedRainfallMm = weatherData.rainfallMm || 0;
  const tempMax = weatherData.temperature || (weatherData.forecast && weatherData.forecast[0]?.tempMax) || 25;
  const tempMin = (weatherData.forecast && weatherData.forecast[0]?.tempMin) || tempMax - 10;

  // 1. Heavy Rain Risk
  if (expectedRainfallMm >= 40 || (weatherData.rainProbability >= 80 && expectedRainfallMm >= 30)) {
    risks.push({
      type: 'Heavy Rain',
      riskLevel: 'High',
      farmerMessage: 'Heavy Rain Risk detected for your region.',
      recommendedAction: 'Check drainage in fields and avoid unnecessary irrigation.',
      alertPriority: 'High'
    });
  }

  // 2. Extreme Heat Risk
  if (tempMax >= 40) {
    risks.push({
      type: 'Extreme Heat',
      riskLevel: 'Medium-High',
      farmerMessage: `Your ${cropName} may face heat stress today (temp ${tempMax}°C).`,
      recommendedAction: 'Adjust irrigation timing to early morning/evening and consider crop shade if applicable.',
      alertPriority: 'Medium'
    });
  }

  // 3. Frost Risk
  if (tempMin <= 3) {
    risks.push({
      type: 'Frost Risk',
      riskLevel: 'High',
      farmerMessage: `Frost risk for your ${cropName} tonight (min temp ${tempMin}°C).`,
      recommendedAction: 'Apply protective crop covering or delay sensitive field operations.',
      alertPriority: 'High'
    });
  }

  return {
    hasRisk: risks.length > 0,
    risks
  };
};
