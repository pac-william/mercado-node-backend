import { Router } from 'express';
import { cartItemController } from '../controllers/cartItemController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

router.post('/:cartId/items', validateToken, cartItemController.createCartItem);
router.get('/:cartId/items', validateToken, cartItemController.getCartItemsByCartId);
router.get('/items/:id', validateToken, cartItemController.getCartItemById);
router.put('/items/:id', validateToken, cartItemController.updateCartItemQuantity);
router.delete('/items/:id', validateToken, cartItemController.deleteCartItem);

export default router;
