import express from 'express';
import { companyController } from '../controllers/companyController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', companyController.getInfo);
router.put('/addresses', authMiddleware, companyController.updateAddresses);

export default router;
