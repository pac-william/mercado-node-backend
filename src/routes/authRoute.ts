import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// Rotas públicas
router.post('/signup', authController.createUser);
router.post('/signin', authController.getToken);
router.post('/register/market', authController.registerMarket);
router.post('/create-market-for-user', authController.createMarketForUser);

export default router;