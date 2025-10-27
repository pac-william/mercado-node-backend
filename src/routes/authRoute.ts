import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateToken, requireMarketAdmin } from '../middleware/validateToken';

const router = Router();

router.post('/register/user', authController.registerUser);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Rotas para Auth0
router.get('/auth0/:auth0Id', authController.getUserByAuth0Id);
router.post('/auth0/user', authController.getOrCreateUserByAuth0Id);
router.post('/link-auth0', authController.linkAuth0IdToUser);

// Rotas protegidas
router.post('/create-market', validateToken, authController.createMarket);
router.post('/link-user-to-market', validateToken, requireMarketAdmin(['MARKET_ADMIN']), authController.linkUserToMarket);
router.delete('/unlink-user-from-market/:userId', validateToken, requireMarketAdmin(['MARKET_ADMIN']), authController.unlinkUserFromMarket);

// Rotas de perfil do usuário
router.get('/me', validateToken, authController.getMe);
router.put('/me', validateToken, authController.updateMe);
router.patch('/me', validateToken, authController.updateMePartial);

// Rotas de funcionalidades de perfil
router.post('/me/upload-picture', validateToken, authController.uploadProfilePicture);
router.get('/me/history', validateToken, authController.getProfileHistory);
router.post('/me/request-email-confirmation', validateToken, authController.requestEmailConfirmation);
router.post('/me/confirm-email-change', validateToken, authController.confirmEmailChange);

export default router;