import express from 'express';
import {
  getDashboardSummary,
  getDashboardAnalytics,
} from '../controllers/dashboardController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboardSummary);
router.get('/analytics', getDashboardAnalytics);

export default router;
