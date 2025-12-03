import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

router.post('/register', notificationController.registerToken.bind(notificationController));
router.post('/unregister', notificationController.unregisterToken.bind(notificationController));

router.post('/notify', validateToken, notificationController.sendNotification.bind(notificationController));
router.post('/notify-user/:userId', validateToken, notificationController.sendNotificationToUser.bind(notificationController));
router.post('/notify-new-order', validateToken, notificationController.notifyNewOrder.bind(notificationController));

router.post('/notify-device/:deviceId', validateToken, notificationController.sendNotificationToDevice.bind(notificationController));
router.get('/user/:userId/tokens', validateToken, notificationController.getUserTokens.bind(notificationController));
router.get('/device/:deviceId/tokens', validateToken, notificationController.getDeviceTokens.bind(notificationController));
router.post('/associate-user', notificationController.associateTokenToUser.bind(notificationController));

router.post('/test', notificationController.testNotification.bind(notificationController));

// Rotas de notificações salvas (requerem autenticação)
router.get('/', validateToken, notificationController.getNotifications.bind(notificationController));
router.get('/unread/count', validateToken, notificationController.getUnreadCount.bind(notificationController));
router.patch('/:id/read', validateToken, notificationController.markAsRead.bind(notificationController));
router.patch('/read-all', validateToken, notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', validateToken, notificationController.deleteNotification.bind(notificationController));
router.delete('/read', validateToken, notificationController.deleteReadNotifications.bind(notificationController));

export default router;

