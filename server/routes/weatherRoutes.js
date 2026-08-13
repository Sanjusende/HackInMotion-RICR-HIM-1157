import express from 'express';
import { getCurrentWeather, getWeatherForecast } from '../controllers/weatherController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);

export default router;
