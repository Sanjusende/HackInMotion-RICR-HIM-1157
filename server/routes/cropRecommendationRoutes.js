import express from 'express';
import { getCropRecommendations } from '../controllers/cropRecommendationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCropRecommendations);

export default router;
