import { Router } from 'express';
import { DelivererController } from '../controllers/delivererController';
import { authenticate, requireMarketAdmin, optionalAuth } from '../middleware/auth';

const router = Router();
const delivererController = new DelivererController();


router.get('/', optionalAuth, delivererController.getDeliverers);
router.get('/active', optionalAuth, delivererController.getActiveDeliverers);
router.get('/:id', optionalAuth, delivererController.getDelivererById);
router.post('/', authenticate, requireMarketAdmin, delivererController.createDeliverer);
router.put('/:id', authenticate, requireMarketAdmin, delivererController.updateDeliverer);
router.patch('/:id', authenticate, requireMarketAdmin, delivererController.updateDelivererPartial);
router.delete('/:id', authenticate, requireMarketAdmin, delivererController.deleteDeliverer);

export default router;
