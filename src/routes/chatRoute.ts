import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const chatController = new ChatController();

// Rotas específicas devem vir antes das rotas com parâmetros
router.post('/', validateToken, chatController.findOrCreateChat);
router.get('/user', validateToken, chatController.getChatsByUserId);
router.get('/user/unread-count', validateToken, chatController.getUnreadMessagesCount);
router.get('/market/:marketId', validateToken, chatController.getChatsByMarketId);
router.get('/market/:marketId/unread-count', validateToken, chatController.getUnreadMessagesCountByMarketId);
router.post('/:chatId/messages', validateToken, chatController.createMessage);
router.get('/:chatId/messages', validateToken, chatController.getMessagesByChatId);
router.patch('/:chatId/status', validateToken, chatController.updateChatStatus);
router.post('/:chatId/read', validateToken, chatController.markMessagesAsRead);
router.get('/:chatId', validateToken, chatController.getChatByChatId);

export default router;
