import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const orderController = new OrderController();

// Rotas públicas 
router.get('/', validateToken, orderController.getOrders);
router.get('/:id', validateToken, orderController.getOrderById);

// Rotas protegidas
router.post('/', validateToken, orderController.createOrder);
router.put('/:id', validateToken, orderController.updateOrder);
router.post('/:id/assign-deliverer', validateToken, orderController.assignDeliverer);

export default router;
