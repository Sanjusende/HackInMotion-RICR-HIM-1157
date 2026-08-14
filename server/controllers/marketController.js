import Farm from '../models/Farm.js';
import MarketPrice from '../models/MarketPrice.js';
import ApiResponse from '../utils/apiResponse.js';
import { fetchCropMarketData } from '../services/market/marketDataService.js';

export const getCurrentMarketData = async (req, res, next) => {
  try {
    const requestedCrop = req.query.crop;
    let cropName = requestedCrop;
    let farm = null;

    try {
      farm = await Farm.findOne({ userId: req.user._id });
      if (!cropName) {
        cropName = farm?.currentCrop || 'Wheat';
      }
    } catch (dbErr) {
      if (!cropName) cropName = 'Wheat';
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
      console.warn('Market log save failed (non-blocking):', saveErr.message);
    }

    return ApiResponse.success(res, data, 'Current market price data loaded successfully');
  } catch (error) {
    next(error);
  }
};

export const getMarketHistory = async (req, res, next) => {
  try {
    const cropName = req.query.crop || 'Wheat';
    const period = req.query.period || '7d';
    
    // Pagination parameters
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    // Query database for historical prices logged
    const filter = { crop: new RegExp(`^${cropName}$`, 'i') };
    const totalCount = await MarketPrice.countDocuments(filter);
    
    let historySeries = await MarketPrice.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // If no custom entries in DB, fall back to historical stubs from Service helper
    if (!historySeries || historySeries.length === 0) {
      const data = await fetchCropMarketData(cropName);
      let fullMockSeries = data.history7d;
      if (period === '30d') fullMockSeries = data.history30d;
      if (period === '90d') fullMockSeries = data.history90d;
      
      // Perform server-side pagination mock slice
      historySeries = fullMockSeries.slice(skip, skip + limit);
    }

    return ApiResponse.success(
      res,
      {
        crop: cropName,
        period,
        page,
        limit,
        totalCount: totalCount || historySeries.length,
        series: historySeries
      },
      'Market price history loaded successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getMarketTrend = async (req, res, next) => {
  try {
    const cropName = req.query.crop || 'Wheat';
    const data = await fetchCropMarketData(cropName);

    return ApiResponse.success(res, {
      crop: data.crop,
      currentPrice: data.currentPrice,
      trend: data.trend,
      changePercent: data.changePercent,
      displayText: data.displayText,
      sellingInsightText: data.sellingInsightText
    }, 'Market trend insights loaded successfully');
  } catch (error) {
    next(error);
  }
};

export const getNearbyMarkets = async (req, res, next) => {
  try {
    const cropName = req.query.crop || 'Wheat';
    const data = await fetchCropMarketData(cropName);

    return ApiResponse.success(res, data.nearbyMarkets || [], 'Nearby market prices loaded successfully');
  } catch (error) {
    next(error);
  }
};

function farmLocationToMandi(user) {
  return 'Indore Mandi';
}
