import express from 'express';
import { analyzeIrrigation, getIrrigationHistory } from '../controllers/irrigationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeIrrigation);
router.get('/history', getIrrigationHistory);

export default router;
