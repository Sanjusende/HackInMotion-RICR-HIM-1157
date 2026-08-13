/**
 * Crop Health Heuristic/Vision Decision Support Engine (F06)
 * Quality Rule: Never claim definitive medical/agricultural diagnosis.
 * Always return non-definitive phrasing ("possible issue", "may indicate").
 */
export const evaluateCropHealth = (descriptionStr = '', cropName = 'Wheat') => {
  const desc = descriptionStr.toLowerCase();

  let possibleIssue = 'Possible Leaf Discoloration / Early Stress Indication';
  let confidence = 'Moderate Indication';
  let whatToCheck = 'Inspect underside of leaves for small spots, rust pustules, or insect clusters.';
  let nextAction = 'Monitor the affected section daily. Isolate infected leaves if spots spread rapidly.';

  if (desc.includes('yellow') || desc.includes('rust') || desc.includes('spot')) {
    possibleIssue = `Possible Yellow Rust / Folia Fungus Indication on ${cropName}`;
    confidence = 'Moderate Indication (75%)';
    whatToCheck = 'Check if yellow powdery dust rubs off onto fingers or if yellow streaks align with leaf veins.';
    nextAction = 'Avoid over-head sprinkler irrigation on affected patch and consult local Krishi Vigyan Kendra (KVK) for recommended organic/chemical spray.';
  } else if (desc.includes('hole') || desc.includes('worm') || desc.includes('caterpillar') || desc.includes('pest')) {
    possibleIssue = `Possible Stem Borer / Foliage Pest Activity on ${cropName}`;
    confidence = 'Possible Pest Indication (70%)';
    whatToCheck = 'Look for small caterpillars near stem nodes or visible chew marks on leaf margins.';
    nextAction = 'Set up pheromone traps or apply neem-based spray as a preventive bio-control step.';
  } else if (desc.includes('wilt') || desc.includes('dry') || desc.includes('curling') || desc.includes('brown')) {
    possibleIssue = `Possible Moisture Stress or Root Wilt Indication`;
    confidence = 'Possible Issue (65%)';
    whatToCheck = 'Check soil moisture depth near root zone and inspect lower stem for discoloration.';
    nextAction = 'Ensure light irrigation during early morning and verify soil drainage.';
  } else if (desc.includes('healthy') || desc.includes('normal') || desc.includes('green')) {
    possibleIssue = `No Critical Issue Detected (Healthy ${cropName} Canopy)`;
    confidence = 'High Confidence (90%)';
    whatToCheck = 'Routine weekly observation of leaf tips and growth rate.';
    nextAction = 'Continue standard irrigation and fertilizer schedule according to growth stage.';
  }

  return {
    possibleIssue,
    confidence,
    whatToCheck,
    nextAction
  };
};
