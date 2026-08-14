export const CROP_DISEASES = {
  Wheat: [
    {
      disease: 'Yellow Rust',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '25%',
      causes: [
        'Puccinia striiformis fungal infection',
        'Cool temperature with high humidity',
        'Overuse of nitrogen fertilizers',
      ],
      treatment: [
        'Foliar spray of Propiconazole (Tilt 25 EC) at 1 ml/liter.',
        'Remove infected weed hosts from field borders.',
      ],
      prevention: [
        'Cultivate rust-resistant seed varieties like HD 2967 or HD 3086.',
        'Maintain optimal seed spacing.',
        'Avoid excessive nitrogen application.',
      ],
      fertilizerRecommendation:
        'Apply Potassium-rich fertilizers (Muriate of Potash) to build cell wall resilience against fungi.',
      irrigationRecommendation:
        'Minimize overhead sprinkler irrigation to keep crop foliage dry; use border strip irrigation instead.',
    },
    {
      disease: 'Loose Smut',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '45%',
      causes: ['Ustilago nuda tritici fungal spores', 'Infected seed stock usage'],
      treatment: [
        'Uproot and burn infected smutted heads immediately.',
        'Spray Carboxin (Vitavax 75 WP) at 2g/kg seed or foliar spray.',
      ],
      prevention: [
        'Use certified disease-free seeds.',
        'Treat seeds with systemic fungicides like Tebuconazole before sowing.',
      ],
      fertilizerRecommendation: 'Maintain balanced NPK ratio (120:60:40) to boost crop vigor.',
      irrigationRecommendation: 'Avoid waterlogging; maintain standard field drainage.',
    },
  ],
  Rice: [
    {
      disease: 'Bacterial Leaf Blight',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '40%',
      causes: [
        'Xanthomonas oryzae pv. oryzae bacteria',
        'Wind and rain splashes promoting infection',
        'Excessive nitrogen fertilizer',
      ],
      treatment: [
        'Spray Streptocycline (6g) + Copper Oxychloride (500g) in 200 liters of water per acre.',
        'Drain excess water from the field.',
      ],
      prevention: [
        'Cultivate resistant rice varieties.',
        'Avoid crop damage/injury during transplanting.',
      ],
      fertilizerRecommendation:
        'Temporarily suspend nitrogen application; apply additional potash.',
      irrigationRecommendation:
        'Keep water level low (1-2 cm) or dry the field for 2-3 days to inhibit bacterial spread.',
    },
    {
      disease: 'Blast',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '50%',
      causes: ['Magnaporthe oryzae fungus', 'High night relative humidity', 'Frequent rainfall'],
      treatment: [
        'Apply Tricyclazole 75 WP at 0.6 g/liter of water.',
        'Avoid spraying during direct mid-day sunlight.',
      ],
      prevention: [
        'Use split doses of nitrogen fertilizer.',
        'Practice proper crop rotation with legumes.',
      ],
      fertilizerRecommendation:
        'Apply balanced NPK with silicon fertilizers to toughen leaf epidermis.',
      irrigationRecommendation:
        'Keep fields continuously flooded during critical vegetative phases to suppress fungal sporulation.',
    },
  ],
  Tomato: [
    {
      disease: 'Early Blight',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '35%',
      causes: [
        'Fungal pathogen Alternaria solani',
        'Warm temperature and humid conditions',
        'Wet foliage for prolonged periods',
      ],
      treatment: [
        'Spray Mancozeb at 2g/L or Chlorothalonil at 2g/L water.',
        'Prune lower leaves to improve airflow.',
      ],
      prevention: [
        'Mulch the soil surface to prevent soil splash.',
        'Ensure 3-year crop rotation.',
        'Space plants at least 2 feet apart.',
      ],
      fertilizerRecommendation:
        'Ensure sufficient Calcium and Nitrogen levels to boost plant immune responses.',
      irrigationRecommendation:
        'Drip irrigate at the plant base; avoid overhead watering to prevent wet leaves.',
    },
    {
      disease: 'Late Blight',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '65%',
      causes: ['Phytophthora infestans oomycete', 'Cool, wet, cloudy weather'],
      treatment: [
        'Apply Metalaxyl-Mancozeb combination fungicide immediately.',
        'Remove and burn severely infested plants.',
      ],
      prevention: [
        'Plant resistant varieties.',
        'Scout field borders regularly for wild solanaceous weeds.',
      ],
      fertilizerRecommendation:
        'Apply phosphorus-rich foliar sprays to support root system stress.',
      irrigationRecommendation:
        'Suspend watering temporarily during persistent rainy/cloudy periods.',
    },
  ],
  Potato: [
    {
      disease: 'Early Blight',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '25%',
      causes: ['Alternaria solani fungus', 'Alternating wet and dry canopy conditions'],
      treatment: [
        'Apply Mancozeb (2g/L) or Copper Oxychloride (3g/L) foliar spray.',
        'De-leaf lower canopy.',
      ],
      prevention: ['Rotate crops with non-solanaceous crops.', 'Destroy volunteer potato plants.'],
      fertilizerRecommendation:
        'Provide adequate organic compost and nitrogen to prevent early leaf senescence.',
      irrigationRecommendation:
        'Irrigate early in the morning so foliage dries quickly during the day.',
    },
    {
      disease: 'Late Blight',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '60%',
      causes: ['Phytophthora infestans oomycete', 'Wet soil conditions with cool winds'],
      treatment: ['Apply Metalaxyl-Mancozeb immediately.', 'Harvest infected tubers separately.'],
      prevention: [
        'Plant certified disease-free seed tubers.',
        'Practice high hilling to protect tubers from spores.',
      ],
      fertilizerRecommendation: 'Apply potassium to reduce blight severity and bulb rot.',
      irrigationRecommendation: 'Avoid evening watering. Ensure soil drains completely.',
    },
  ],
  Cotton: [
    {
      disease: 'Fusarium Wilt',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '35%',
      causes: [
        'Fusarium oxysporum f. sp. vasinfectum soil-borne fungus',
        'Poor soil drainage',
        'Acidic sandy soils',
      ],
      treatment: [
        'Apply Carbendazim drenching (0.1%) around infected root zones.',
        'Uproot dead plants.',
      ],
      prevention: [
        'Amend soil with lime to raise pH.',
        'Cultivate wilt-resistant varieties.',
        'Use crop rotation with cereals.',
      ],
      fertilizerRecommendation: 'Incorporate organic manures and potash to reduce wilt severity.',
      irrigationRecommendation:
        'Avoid excessive irrigation; implement raised bed planting to ensure drainage.',
    },
  ],
  Soybean: [
    {
      disease: 'Soybean Rust',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '55%',
      causes: [
        'Phakopsora pachyrhizi fungal pathogen',
        'Prolonged leaf wetness',
        'Moderate temperatures',
      ],
      treatment: [
        'Spray Pyraclostrobin or Tebuconazole foliar fungicides.',
        'Monitor field closely after first bloom.',
      ],
      prevention: ['Plant early-maturing varieties.', 'Space rows wider for sunlight penetration.'],
      fertilizerRecommendation: 'Ensure adequate potash application during pod-filling stage.',
      irrigationRecommendation: 'Water in afternoon to minimize overnight leaf wetness duration.',
    },
  ],
  Maize: [
    {
      disease: 'Common Rust',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '20%',
      causes: ['Puccinia sorghi fungus', 'Cool temperatures and high humidity'],
      treatment: [
        'Foliar application of Mancozeb at 2g/L if symptoms appear early.',
        'Weed control.',
      ],
      prevention: ['Choose rust-resistant hybrids.', 'Rotate with soybeans or wheat.'],
      fertilizerRecommendation: 'Ensure balanced nitrogen-phosphorus ratios to build sturdy stems.',
      irrigationRecommendation: 'Drip or furrow irrigation; avoid sprinkler systems.',
    },
  ],
  Onion: [
    {
      disease: 'Purple Blotch',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '30%',
      causes: ['Alternaria porri fungus', 'Warm, wet weather conditions'],
      treatment: [
        'Spray Mancozeb (2.5g/L) or Propiconazole (1ml/L).',
        'Ensure proper bulb aeration.',
      ],
      prevention: ['Use healthy bulb sets.', 'Burn crop residues after harvest.'],
      fertilizerRecommendation:
        'Apply sulfur-rich fertilizers to enhance natural defense compounds.',
      irrigationRecommendation: 'Drip irrigation; avoid watering during late evening.',
    },
  ],
  Chilli: [
    {
      disease: 'Anthracnose',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '40%',
      causes: ['Colletotrichum capsici fungus', 'Splashing rain, warm weather'],
      treatment: [
        'Spray Copper Oxychloride (3g/L) or Carbendazim (1g/L).',
        'Remove spotted fruits.',
      ],
      prevention: ['Treat seeds with Captan or Thiram.', 'Clear wild solanaceous weeds.'],
      fertilizerRecommendation: 'Apply balanced NPK plus micronutrient foliar spray (Zinc, Boron).',
      irrigationRecommendation: 'Avoid sprinkler systems; water through furrow method.',
    },
  ],
  Brinjal: [
    {
      disease: 'Phomopsis Blight',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '45%',
      causes: ['Phomopsis vexans fungal pathogen', 'High temperature and humidity'],
      treatment: ['Spray Zineb or Mancozeb at 2.5g/L.', 'Remove infected leaves and fruits.'],
      prevention: ['Use resistant varieties.', 'Practice 3-year crop rotation.'],
      fertilizerRecommendation: 'Apply rich organic compost and potash.',
      irrigationRecommendation: 'Provide furrow irrigation; avoid water stagnation.',
    },
  ],
  Sugarcane: [
    {
      disease: 'Red Rot',
      health: 'Diseased',
      severity: 'High',
      affectedArea: '60%',
      causes: [
        'Colletotrichum falcatum fungus',
        'Use of infected seed setts',
        'Waterlogging in fields',
      ],
      treatment: [
        'Uproot and burn infected sugarcane clumps.',
        'Drench soil with Carbendazim (0.1%).',
      ],
      prevention: [
        'Use healthy seed setts from nursery.',
        'Practice crop rotation with green manure crops.',
      ],
      fertilizerRecommendation: 'Apply potash at planting time to promote stem strength.',
      irrigationRecommendation:
        'Provide efficient drainage; do not let irrigation water flow from diseased fields to healthy ones.',
    },
  ],
  Mustard: [
    {
      disease: 'White Rust',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '25%',
      causes: ['Albugo candida fungus', 'Cool, moist weather during flowering'],
      treatment: ['Foliar spray of Metalaxyl-Mancozeb at 2g/L.', 'Destroy wild cruciferous weeds.'],
      prevention: [
        'Sow crops early (by mid-October).',
        'Practice crop rotation with non-crucifers.',
      ],
      fertilizerRecommendation: 'Ensure balanced fertilization; avoid excess nitrogen.',
      irrigationRecommendation: 'Irrigate carefully to avoid long standing water.',
    },
  ],
  Groundnut: [
    {
      disease: 'Tikka Leaf Spot',
      health: 'Diseased',
      severity: 'Medium',
      affectedArea: '35%',
      causes: ['Cercospora arachidicola fungus', 'High humidity and wet soil surface'],
      treatment: ['Foliar spray of Carbendazim (1g/L) + Mancozeb (2g/L).', 'Clear bottom leaves.'],
      prevention: ['Use disease-free seeds.', 'Rotate with maize or sorghum.'],
      fertilizerRecommendation: 'Apply gypsum to provide calcium for pod growth and strength.',
      irrigationRecommendation: 'Maintain wet-dry intervals; do not over-water.',
    },
  ],
};

export const CROP_HEALTHY_DEFAULTS = {
  health: 'Healthy',
  disease: 'None',
  severity: 'None',
  affectedArea: '0%',
  causes: [
    'Optimal micro-climate conditions',
    'Balanced soil nutrients',
    'Excellent crop management',
  ],
  treatment: ['No chemical treatment required.', 'Maintain standard organic maintenance.'],
  prevention: [
    'Continue routine crop scouting.',
    'Apply preventive neem oil spray (1%) every 14 days.',
  ],
  fertilizerRecommendation:
    'Continue regular balanced NPK fertilization schedule according to growth stage.',
  irrigationRecommendation:
    'Maintain standard crop-specific irrigation interval based on soil moisture sensors.',
};
