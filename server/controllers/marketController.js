import Farm from '../models/Farm.js';
import MarketPrice from '../models/MarketPrice.js';
import { fetchCropMarketData } from '../services/market/marketDataService.js';

export const getCurrentMarketData = async (req, res) => {
  try {
    const requestedCrop = req.query.crop;
    let cropName = requestedCrop;

    if (!cropName) {
      try {
        const farm = await Farm.findOne({ userId: req.user._id });
        cropName = farm?.currentCrop || 'Wheat';
      } catch (dbErr) {
        cropName = 'Wheat';
      }
    }

    const marketLocation = farmLocationToMandi(req.user);
    const data = await fetchCropMarketData(cropName, marketLocation);

    // Save record to DB history (non-blocking)
    try {
      await MarketPrice.create({
        crop: data.crop,
        market: data.market,
        price: data.currentPrice,
        unit: 'Quintal',
        date: new Date(),
        trend: data.trend,
        changePercent: data.changePercent,
        source: data.source
      });
    } catch (saveErr) {
      // Ignore DB save error
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Market controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to Load Market Data... please try again later'
    });
  }
};

export const getMarketHistory = async (req, res) => {
  try {
    const cropName = req.query.crop || 'Wheat';
    const period = req.query.period || '7d';
    const data = await fetchCropMarketData(cropName);

    let historySeries = data.history7d;
    if (period === '30d') historySeries = data.history30d;
    if (period === '90d') historySeries = data.history90d;

    return res.status(200).json({
      success: true,
      crop: cropName,
      period,
      data: historySeries
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to load price history'
    });
  }
};

export const getMarketTrend = async (req, res) => {
  try {
    const cropName = req.query.crop || 'Wheat';
    const data = await fetchCropMarketData(cropName);

    return res.status(200).json({
      success: true,
      data: {
        crop: data.crop,
        currentPrice: data.currentPrice,
        trend: data.trend,
        changePercent: data.changePercent,
        displayText: data.displayText,
        sellingInsightText: data.sellingInsightText
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to load market trend'
    });
  }
};

export const getNearbyMarkets = async (req, res) => {
  try {
    const cropName = req.query.crop || 'Wheat';
    const data = await fetchCropMarketData(cropName);

    return res.status(200).json({
      success: true,
      data: data.nearbyMarkets || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to load nearby market comparison'
    });
  }
};

function farmLocationToMandi(user) {
  return 'Indore Mandi';
}
