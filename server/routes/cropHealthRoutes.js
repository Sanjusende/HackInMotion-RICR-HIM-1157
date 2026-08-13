import express from 'express';
import { analyzeCropHealth, getCropHealthHistory } from '../controllers/cropHealthController.js';
import protect from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', uploadSingleImage, analyzeCropHealth);
router.get('/history', getCropHealthHistory);

export default router;
