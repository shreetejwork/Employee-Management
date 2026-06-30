import express from 'express';
import { employeeController } from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', employeeController.getAll);
router.get('/next-id', employeeController.getNextId);
router.get('/:id', employeeController.getById);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

export default router;
