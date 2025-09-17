import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate, requireMarketAdmin } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/register/user', authController.registerUser);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Rotas protegidas
router.post('/create-market', authenticate, authController.createMarket);
router.post('/link-user-to-market', authenticate, requireMarketAdmin, authController.linkUserToMarket);
router.delete('/unlink-user-from-market/:userId', authenticate, requireMarketAdmin, authController.unlinkUserFromMarket);

export default router;
