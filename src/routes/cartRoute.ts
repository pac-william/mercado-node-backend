import { Router } from 'express';
import { cartController } from '../controllers/cartController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

router.get('/', validateToken, cartController.getUserCart);
router.post('/', validateToken, cartController.createCart);
router.post('/items', validateToken, cartController.addItem);
router.post('/items/multiple', validateToken, cartController.addMultipleItems);
router.put('/items/:cartItemId', validateToken, cartController.updateItemQuantity);
router.delete('/items/:cartItemId', validateToken, cartController.removeItem);
router.delete('/', validateToken, cartController.clearCart);
router.delete('/delete', validateToken, cartController.deleteCart);

export default router;
