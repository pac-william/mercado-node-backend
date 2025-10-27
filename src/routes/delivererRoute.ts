import { Router } from 'express';
import { DelivererController } from '../controllers/delivererController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const delivererController = new DelivererController();

// Rotas públicas
router.get('/', validateToken, delivererController.getDeliverers);
router.get('/active', validateToken, delivererController.getActiveDeliverers);
router.get('/:id', validateToken, delivererController.getDelivererById);

// Rotas protegidas
router.post('/', validateToken, delivererController.createDeliverer);
router.put('/:id', validateToken, delivererController.updateDeliverer);
router.patch('/:id', validateToken, delivererController.updateDelivererPartial);
router.delete('/:id', validateToken, delivererController.deleteDeliverer);

export default router;
