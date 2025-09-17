import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate, requireMarketAdmin, optionalAuth } from '../middleware/auth';

const router = Router();
const orderController = new OrderController();

// Rotas públicas 
router.get('/', optionalAuth, orderController.getOrders);
router.get('/:id', optionalAuth, orderController.getOrderById);

// Rotas protegidas
router.post('/', authenticate, requireMarketAdmin, orderController.createOrder);
router.put('/:id', authenticate, requireMarketAdmin, orderController.updateOrder);
router.post('/:id/assign-deliverer', authenticate, requireMarketAdmin, orderController.assignDeliverer);

export default router;
