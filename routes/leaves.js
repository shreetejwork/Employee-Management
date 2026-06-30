import express from 'express';
import { leaveController } from '../controllers/leaveController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', leaveController.getAll);
router.get('/balances/:employeeId', leaveController.getBalances);
router.post('/', leaveController.create);
router.put('/:id/approve', leaveController.approve);
router.put('/:id/reject', leaveController.reject);

export default router;
