import MarketPrice from '../../models/MarketPrice.js';
import { calculatePriceTrend } from '../../utils/calculateTrend.js';

// ------------------------------------------------------
// Base Benchmark Prices
// ------------------------------------------------------

const BASE_CROP_PRICES = Object.freeze({
  Wheat: 2450,
  Rice: 2200,
  Maize: 1950,
  Soybean: 4600,
  Cotton: 6800,
  Potato: 1400,
  Mustard: 5350,
  Sugarcane: 315,
  'Gram/Chickpea': 5100,
  Tomato: 1800,
  Onion: 2100,
});

// ------------------------------------------------------
// Configuration
// ------------------------------------------------------

const DEFAULT_CROP = 'Wheat';
const DEFAULT_MARKET = 'Indore Mandi';

const HISTORY_DAYS = 90;
const SHORT_TERM_DAYS = 7;
const MEDIUM_TERM_DAYS = 30;

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

const normalizeCropName = (cropName) => {
  if (typeof cropName !== 'string') {
    return DEFAULT_CROP;
  }

  const normalizedCrop = cropName.trim();

  if (!normalizedCrop) {
    return DEFAULT_CROP;
  }

  return Object.prototype.hasOwnProperty.call(
    BASE_CROP_PRICES,
    normalizedCrop
  )
    ? normalizedCrop
    : DEFAULT_CROP;
};

const normalizeMarketName = (marketLocation) => {
  if (
    typeof marketLocation !== 'string' ||
    !marketLocation.trim()
  ) {
    return DEFAULT_MARKET;
  }

  return marketLocation.trim();
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const getBenchmarkPrice = (crop) => {
  return BASE_CROP_PRICES[crop] || BASE_CROP_PRICES[DEFAULT_CROP];
};

// ------------------------------------------------------
// Generate Fallback Historical Data
// ------------------------------------------------------

const generateFallbackHistory = ({
  crop,
  market,
  basePrice,
}) => {
  const history90d = [];
  const today = new Date();

  for (
    let daysAgo = HISTORY_DAYS - 1;
    daysAgo >= 0;
    daysAgo--
  ) {
    const date = new Date(today);

    date.setDate(
      date.getDate() - daysAgo
    );

    const seasonalVariation =
      Math.sin(daysAgo / 5) *
      (basePrice * 0.03);

    const gradualTrend =
      (HISTORY_DAYS - 1 - daysAgo) *
      (basePrice * 0.001);

    const calculatedPrice =
      basePrice -
      seasonalVariation +
      gradualTrend;

    const price = Math.max(
      1,
      Math.round(calculatedPrice)
    );

    history90d.push({
      date: formatDate(date),
      price,
      unit: 'Quintal',
      market,
      crop,
    });
  }

  return history90d;
};

// ------------------------------------------------------
// Fetch Database Market History
// ------------------------------------------------------

const fetchMarketHistory = async (
  crop,
  market
) => {
  try {
    return await MarketPrice.find({
      crop,
      market,
    })
      .sort({ date: -1 })
      .limit(HISTORY_DAYS)
      .lean();
  } catch (error) {
    console.error(
      '[MarketService] Failed to fetch market history:',
      error.message
    );

    return [];
  }
};

// ------------------------------------------------------
// Normalize Database History
// ------------------------------------------------------

const normalizeMarketHistory = (records) => {
  return records
    .map((record) => ({
      date: formatDate(new Date(record.date)),
      price: Number(record.price),
      unit: record.unit || 'Quintal',
      market: record.market,
      crop: record.crop,
      trend: record.trend || 'Stable',
      changePercent:
        Number(record.changePercent) || 0,
      source: record.source || 'agmarknet',
    }))
    .filter(
      (record) =>
        Number.isFinite(record.price) &&
        record.price > 0
    )
    .sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );
};

// ------------------------------------------------------
// Nearby Market Comparison
// ------------------------------------------------------

const buildNearbyMarkets = ({
  market,
  currentPrice,
  changePercent,
}) => {
  const safeChangePercent =
    Number(changePercent) || 0;

  return [
    {
      market: `${market} (Main)`,
      price: currentPrice,
      distanceKm: 0,
      changePercent: safeChangePercent,
    },
    {
      market: 'Dewas Mandi',
      price: Math.round(
        currentPrice * 1.015
      ),
      distanceKm: 34,
      changePercent: Number(
        (safeChangePercent + 0.5).toFixed(2)
      ),
    },
    {
      market: 'Ujjain Mandi',
      price: Math.round(
        currentPrice * 0.99
      ),
      distanceKm: 55,
      changePercent: Number(
        (safeChangePercent - 0.8).toFixed(2)
      ),
    },
  ];
};

// ------------------------------------------------------
// Main Market Data Service
// ------------------------------------------------------

export const fetchCropMarketData = async (
  cropName = DEFAULT_CROP,
  marketLocation = DEFAULT_MARKET
) => {
  const crop = normalizeCropName(cropName);
  const market = normalizeMarketName(
    marketLocation
  );

  // ------------------------------------------
  // Fetch stored market data
  // ------------------------------------------

  const databaseRecords =
    await fetchMarketHistory(
      crop,
      market
    );

  let history90d =
    normalizeMarketHistory(
      databaseRecords
    );

  let dataSource = 'benchmark';
  let isLiveData = false;

  // ------------------------------------------
  // Database data available
  // ------------------------------------------

  if (history90d.length > 0) {
    dataSource =
      databaseRecords[0]?.source ||
      'agmarknet';

    isLiveData = true;
  }

  // ------------------------------------------
  // Fallback when DB has no data
  // ------------------------------------------

  if (history90d.length === 0) {
    history90d =
      generateFallbackHistory({
        crop,
        market,
        basePrice:
          getBenchmarkPrice(crop),
      });
  }

  // ------------------------------------------
  // Time range histories
  // ------------------------------------------

  const history7d =
    history90d.slice(
      -SHORT_TERM_DAYS
    );

  const history30d =
    history90d.slice(
      -MEDIUM_TERM_DAYS
    );

  // ------------------------------------------
  // Current Price
  // ------------------------------------------

  const latestRecord =
    history90d[
      history90d.length - 1
    ];

  const currentPrice =
    Number(latestRecord?.price) ||
    getBenchmarkPrice(crop);

  // ------------------------------------------
  // Price 7 Days Ago
  // ------------------------------------------

  const previousRecord =
    history90d.length >= SHORT_TERM_DAYS
      ? history90d[
          history90d.length -
            SHORT_TERM_DAYS
        ]
      : history90d[0];

  const price7DaysAgo =
    Number(previousRecord?.price) ||
    currentPrice;

  // ------------------------------------------
  // Calculate Trend
  // ------------------------------------------

  const trendResult =
    calculatePriceTrend(
      currentPrice,
      price7DaysAgo
    );

  // ------------------------------------------
  // Nearby Market Comparison
  // ------------------------------------------

  const nearbyMarkets =
    buildNearbyMarkets({
      market,
      currentPrice,
      changePercent:
        trendResult.changePercent,
    });

  // ------------------------------------------
  // Final Response
  // ------------------------------------------

  return {
    crop,
    market,

    currentPrice,

    unit: '₹/Quintal',

    date: formatDate(new Date()),

    trend: trendResult.trend,

    changePercent:
      trendResult.changePercent,

    displayText:
      trendResult.displayText,

    sellingInsightText:
      trendResult.sellingInsightText,

    history7d,
    history30d,
    history90d,

    nearbyMarkets,

    source: dataSource,

    isLiveData,

    dataStatus: isLiveData
      ? 'DATABASE'
      : 'BENCHMARK_FALLBACK',
  };
};