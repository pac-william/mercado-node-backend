import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate, requireMarketAdmin, optionalAuth } from '../middleware/auth';

const router = Router();
const orderController = new OrderController();

router.get('/', optionalAuth, orderController.getOrders);
router.get('/:id', optionalAuth, orderController.getOrderById);
router.post('/', authenticate, requireMarketAdmin, orderController.createOrder);
router.put('/:id', authenticate, requireMarketAdmin, orderController.updateOrder);
router.post('/:id/assign-deliverer', authenticate, requireMarketAdmin, orderController.assignDeliverer);

export default router;
