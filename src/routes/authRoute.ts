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

// Rotas de perfil do usuário
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateMe);
router.patch('/me', authenticate, authController.updateMePartial);

// Rotas de funcionalidades de perfil
router.post('/me/upload-picture', authenticate, authController.uploadProfilePicture);
router.get('/me/history', authenticate, authController.getProfileHistory);
router.post('/me/request-email-confirmation', authenticate, authController.requestEmailConfirmation);
router.post('/me/confirm-email-change', authController.confirmEmailChange);

export default router;
