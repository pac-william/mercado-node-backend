import { Router } from 'express';
import { marketController } from '../controllers/marketController';

const router = Router();

router.post('/', marketController.createMarket);
router.get('/', marketController.getMarkets);
router.get('/:id', marketController.getMarketById);
router.put('/:id', marketController.updateMarket);
router.patch('/:id', marketController.updateMarketPartial);
router.delete('/:id', marketController.deleteMarket);

export default router;
