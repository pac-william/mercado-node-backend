import { Router } from 'express';
import { marketController } from '../controllers/marketController';
import { authenticate, requireMarketAdmin, optionalAuth, requireMarketOwnership } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, marketController.getMarkets);
router.get('/:id', optionalAuth, marketController.getMarketById);
router.post('/', authenticate, requireMarketAdmin, marketController.createMarket);
router.put('/:id', authenticate, requireMarketAdmin, requireMarketOwnership, marketController.updateMarket);
router.patch('/:id', authenticate, requireMarketAdmin, requireMarketOwnership, marketController.updateMarketPartial);
router.delete('/:id', authenticate, requireMarketAdmin, requireMarketOwnership, marketController.deleteMarket);

export default router;
