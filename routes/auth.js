import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;
