import express from 'express';
import {
  getCurrentMarketData,
  getMarketHistory,
  getMarketTrend,
  getNearbyMarkets
} from '../controllers/marketController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/current', getCurrentMarketData);
router.get('/history', getMarketHistory);
router.get('/trend', getMarketTrend);
router.get('/nearby', getNearbyMarkets);

export default router;
