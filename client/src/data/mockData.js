import { Cpu, CloudRain, Sprout, TrendingUp, ShieldAlert, Award, FileText, Mic, MessageCircle, BarChart3 } from 'lucide-react';

// Centralised FAQ dataset
export const faqData = [
  {
    question: "How accurate are the AI crop recommendations?",
    answer: "Our recommendations are backed by historical climate patterns, local weather projections, and soil NPK chemistry inputs, achieving a proven historical yield recommendation accuracy rate of over 94%."
  },
  {
    question: "Do I need physical soil sensors to use KrishiMitra?",
    answer: "No, while sensors improve accuracy, you can easily enter details from standard lab soil cards or choose your regional estimates to get instant advisory recommendations."
  },
  {
    question: "Is there support for local regional languages?",
    answer: "Yes, KrishiMitra supports multiple languages including English, Hindi (हिन्दी), Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ), and Telugu (తెలుగు) directly in the settings."
  },
  {
    question: "How frequently is the weather forecast updated?",
    answer: "Our micro-climate weather forecasts update every hour, giving you immediate warnings about frost, rain patterns, and optimal crop spraying schedules."
  },
  {
    question: "Can I track my seasonal farming expenses?",
    answer: "Yes, the expense tracking module lets you split budgets across seeds, fertilizers, labor, and irrigation, generating structured reports at harvest."
  }
];

// Timeline steps for Solutions/Home Pages
export const timelineSteps = [
  {
    number: "1",
    title: "Register Account",
    description: "Create your free digital farmer account in under 60 seconds with simple location settings."
  },
  {
    number: "2",
    title: "Create Farm Profile",
    description: "Enter your farm size, primary soil texture parameters, and existing irrigation options."
  },
  {
    number: "3",
    title: "Receive AI Insights",
    description: "Our machine learning engine processes your soil profile to recommend optimal crops and sowing schedules."
  },
  {
    number: "4",
    title: "Improve Yield",
    description: "Follow real-time advisory alerts on fertilizer schedules and weather risks to maximize your profits."
  }
];

// Traditional vs Smart Farming comparison grid
export const comparisonMatrix = [
  {
    feature: "Crop Selection",
    traditional: "Based on guess work or ancestral patterns.",
    smart: "Determined by soil NPK analysis, climate matching, and AI recommendations."
  },
  {
    feature: "Irrigation Scheduling",
    traditional: "Fixed intervals or visual observation of dryness.",
    smart: "Automated schedules matching dynamic moisture sensors and weather forecasts."
  },
  {
    feature: "Fertilizer Application",
    traditional: "Uniform application, which often leads to soil acidity.",
    smart: "Targeted nitrogen, phosphorus, and potassium dosage tailored to soil health maps."
  },
  {
    feature: "Disease Management",
    traditional: "Reactive spraying after visible crop decay.",
    smart: "Early leaf anomaly detection via image scanning and predictive pathogen models."
  },
  {
    feature: "Market Pricing",
    traditional: "Selling at nearby markets at arbitrary rates.",
    smart: "Tracking pricing forecasts and historical peaks to sell produce at maximum profit."
  }
];

// Recharts: Soil health monthly metrics
export const soilTrendData = [
  { month: "Jan", pH: 6.2, NPK: 50, moisture: 40 },
  { month: "Feb", pH: 6.3, NPK: 55, moisture: 35 },
  { month: "Mar", pH: 6.5, NPK: 60, moisture: 30 },
  { month: "Apr", pH: 6.6, NPK: 65, moisture: 28 },
  { month: "May", pH: 6.7, NPK: 62, moisture: 25 },
  { month: "Jun", pH: 6.8, NPK: 68, moisture: 55 },
  { month: "Jul", pH: 6.8, NPK: 70, moisture: 75 },
  { month: "Aug", pH: 6.9, NPK: 75, moisture: 70 },
  { month: "Sep", pH: 6.8, NPK: 78, moisture: 62 }
];

// Recharts: Price predictions over next 6 months
export const priceForecastData = [
  { month: "Sep", Wheat: 2200, Rice: 2800, Sugarcane: 310 },
  { month: "Oct", Wheat: 2350, Rice: 2950, Sugarcane: 315 },
  { month: "Nov", Wheat: 2400, Rice: 3100, Sugarcane: 330 },
  { month: "Dec", Wheat: 2450, Rice: 3200, Sugarcane: 345 },
  { month: "Jan", Wheat: 2600, Rice: 3050, Sugarcane: 350 },
  { month: "Feb", Wheat: 2750, Rice: 3150, Sugarcane: 360 }
];

// Recharts: Crop yield comparative forecasts
export const yieldForecastData = [
  { year: "2022", Traditional: 12.4, SmartFarming: 12.8 },
  { year: "2023", Traditional: 12.1, SmartFarming: 13.5 },
  { year: "2024", Traditional: 12.6, SmartFarming: 14.8 },
  { year: "2025", Traditional: 11.9, SmartFarming: 15.6 },
  { year: "2026", Traditional: 12.5, SmartFarming: 17.2 }
];

// Recharts: Seasonal Farm Expenses Breakdown
export const expenseBreakdown = [
  { name: "Seeds", value: 20 },
  { name: "Fertilizers", value: 35 },
  { name: "Irrigation", value: 15 },
  { name: "Labor & Rent", value: 20 },
  { name: "Pesticides", value: 10 }
];

// Complete Features List
export const featuresList = [
  {
    icon: CloudRain,
    title: "Weather Intelligence",
    description: "Hour-by-hour local forecasting combined with historical weather registries to warn you about temperature drops or storms.",
    benefit: "Saves crops from sudden frost, high winds, and heavy rainfall."
  },
  {
    icon: Cpu,
    title: "AI Crop Recommendations",
    description: "Deep learning models select optimal crop sets matching soil textures, nutrient balances, and seasonal water indices.",
    benefit: "Improves sowing success rates and maximizes seasonal yield."
  },
  {
    icon: ShieldAlert,
    title: "Disease Anomaly Detector",
    description: "Upload leaf photos to scan and diagnose early plant symptoms, receiving precise remedial spraying guidelines.",
    benefit: "Controls pathogen outbreaks before major crop loss occurs."
  },
  {
    icon: Sprout,
    title: "Soil Nutrient Analyst",
    description: "Track Nitrogen (N), Phosphorus (P), Potassium (K), soil acidity, and organic carbon levels via easy-to-read charts.",
    benefit: "Eliminates guess work, preventing over-fertilization."
  },
  {
    icon: BarChart3,
    title: "Irrigation Planner",
    description: "Calculates evaporation indices, plant transpiration, and soil moisture levels to guide water application.",
    benefit: "Reduces overall farm water consumption by up to 40%."
  },
  {
    icon: TrendingUp,
    title: "Market Price Predictor",
    description: "Monitors supply-demand indices across nearest regional markets, forecasting upcoming commodity peaks.",
    benefit: "Ensures you sell your harvest at the highest possible rates."
  },
  {
    icon: Award,
    title: "Expense Tracker",
    description: "Log farm input expenses, rentals, seed costs, and harvest yields in a centralized financial register.",
    benefit: "Maintains clear audit books for easy credit approvals."
  },
  {
    icon: FileText,
    title: "Agronomy Reports",
    description: "Export summary crop cards, soil tests, and yield charts to PDF summaries with one click.",
    benefit: "Provides proof of crop health to banks and insurers."
  },
  {
    icon: Mic,
    title: "Voice Assistant",
    description: "Enables hands-free farming updates and daily alerts via simple spoken queries in regional languages.",
    benefit: "Easy accessibility for on-field updates while working."
  },
  {
    icon: MessageCircle,
    title: "AI Chatbot Expert",
    description: "A 24/7 virtual agronomist ready to answer crop health queries, seedling care, and insect controls.",
    benefit: "Instant expert support available at any time."
  }
];

// Testimonials Data
export const testimonials = [
  {
    name: "Ramesh Kumar",
    location: "Punjab, India",
    review: "Implementing KrishiMitra's NPK soil schedule increased my wheat yield by 28% while dropping fertilizer costs by nearly a third.",
    avatar: "👨‍🌾"
  },
  {
    name: "Anjali Deshmukh",
    location: "Maharashtra, India",
    review: "The smart weather notification saved my grape orchard from a severe frost warning. I was able to prepare protective cover sheets just in time.",
    avatar: "👩‍🌾"
  },
  {
    name: "Sukhdev Singh",
    location: "Haryana, India",
    review: "As a commercial farmer, having commodity price forecasts helped me store my rice for 3 weeks and sell it at an 18% higher rate.",
    avatar: "👨‍🌾"
  }
];

// Team profiles
export const teamList = [
  {
    name: "Dr. Rajesh Swaminathan",
    role: "Co-Founder & Agronomist",
    bio: "Ph.D. in Soil Sciences with 15+ years researching smart micro-nutrient crop schedules.",
    avatar: "👨‍🔬"
  },
  {
    name: "Neha Uprade",
    role: "Chief Technology Officer",
    bio: "Ex-ML Lead with a passion for designing scalable predictive systems for smallholder farms.",
    avatar: "👩‍💻"
  },
  {
    name: "Amit Sharma",
    role: "Product Lead",
    bio: "Dedicated to designing accessible voice and chatbot interfaces for multi-lingual rural users.",
    avatar: "👨‍💼"
  }
];
