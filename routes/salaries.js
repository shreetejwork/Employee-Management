import express from 'express';
import { salaryController } from '../controllers/salaryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/history', salaryController.getHistory);
router.get('/prefill', salaryController.prefill);
router.post('/generate', salaryController.generate);
router.post('/send-email', salaryController.sendEmail);

export default router;
