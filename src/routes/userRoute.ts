import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, requireMarketAdmin, optionalAuth } from '../middleware/auth';

const router = Router();


router.get('/', optionalAuth, userController.getUsers);
router.get('/:id', optionalAuth, userController.getUserById);
router.post('/', authenticate, requireMarketAdmin, userController.createUser);
router.put('/:id', authenticate, requireMarketAdmin, userController.updateUser);
router.patch('/:id', authenticate, requireMarketAdmin, userController.updateUserPartial);
router.delete('/:id', authenticate, requireMarketAdmin, userController.deleteUser);

export default router;
