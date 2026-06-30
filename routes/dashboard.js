import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);

export default router;
