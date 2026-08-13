import express from 'express';
import { handleVoiceQuery, getVoiceHistory } from '../controllers/voiceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/query', handleVoiceQuery);
router.get('/history', getVoiceHistory);

export default router;
