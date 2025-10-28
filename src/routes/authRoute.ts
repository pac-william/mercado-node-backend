import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// Rotas públicas
router.post('/signup', authController.createUser);
router.post('/signin', authController.getToken);

export default router;
