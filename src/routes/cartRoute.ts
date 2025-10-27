import { Router } from 'express';
import { cartController } from '../controllers/cartController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

router.use(validateToken);

router.get('/', cartController.getUserCart);
router.post('/items', cartController.addItem);
router.post('/items/multiple', cartController.addMultipleItems);
router.put('/items/:cartItemId', cartController.updateItemQuantity);
router.delete('/items/:cartItemId', cartController.removeItem);
router.delete('/', cartController.clearCart);
router.delete('/delete', cartController.deleteCart);

export default router;
