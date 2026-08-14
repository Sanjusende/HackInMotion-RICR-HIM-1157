import express from 'express';
import {
  analyzeCropHealth,
  getCropHealthHistory,
  downloadCropHealthPdf,
} from '../controllers/cropHealthController.js';
import protect from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', uploadLimiter, uploadSingleImage, analyzeCropHealth);
router.get('/history', getCropHealthHistory);
router.get('/:id/pdf', downloadCropHealthPdf);

export default router;
