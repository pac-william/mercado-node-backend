import { Router } from 'express';
import { DelivererController } from '../controllers/delivererController';

const router = Router();
const delivererController = new DelivererController();

// GET /api/v1/deliverers - Listar entregadores
router.get('/', delivererController.getDeliverers);

// POST /api/v1/deliverers - Cadastrar entregador
router.post('/', delivererController.createDeliverer);

// GET /api/v1/deliverers/active - Listar entregadores ativos
router.get('/active', delivererController.getActiveDeliverers);

// GET /api/v1/deliverers/:id - Buscar entregador por ID
router.get('/:id', delivererController.getDelivererById);

// PUT /api/v1/deliverers/:id - Atualizar entregador
router.put('/:id', delivererController.updateDeliverer);

// PATCH /api/v1/deliverers/:id - Atualizar parcialmente entregador
router.patch('/:id', delivererController.updateDelivererPartial);

// DELETE /api/v1/deliverers/:id - Desativar entregador
router.delete('/:id', delivererController.deleteDeliverer);

export default router;