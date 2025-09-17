import { Router } from 'express';
import { DelivererController } from '../controllers/delivererController';

const router = Router();
const delivererController = new DelivererController();

router.get('/', delivererController.getDeliverers);
router.post('/', delivererController.createDeliverer);
router.get('/active', delivererController.getActiveDeliverers);
router.get('/:id', delivererController.getDelivererById);
router.put('/:id', delivererController.updateDeliverer);
router.patch('/:id', delivererController.updateDelivererPartial);
router.delete('/:id', delivererController.deleteDeliverer);

export default router;