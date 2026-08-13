import express from 'express';
import { getMyFarm, createOrUpdateFarm, getFarmById } from '../controllers/farmController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMyFarm);
router.get('/:id', getFarmById);
router.post('/', createOrUpdateFarm);
router.put('/:id', createOrUpdateFarm);

export default router;
