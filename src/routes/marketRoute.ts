import { Router } from 'express';
import { marketController } from '../controllers/marketController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Rotas públicas
router.get('/',  marketController.getMarkets);
router.get('/:id',  marketController.getMarketById);

// Rotas protegidas
router.post('/', validateToken, marketController.createMarket);
router.put('/:id', validateToken, marketController.updateMarket);
router.patch('/:id', validateToken, marketController.updateMarketPartial);
router.delete('/:id', validateToken, marketController.deleteMarket);

export default router;
