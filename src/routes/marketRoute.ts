import { Router } from 'express';
import { marketAddressController } from '../controllers/marketAddressController';
import { marketController } from '../controllers/marketController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Rotas públicas
router.get('/', marketController.getMarkets);
router.get('/:id', marketController.getMarketById);

// Rotas protegidas
router.post('/', validateToken, marketController.createMarket);
router.put('/:id', validateToken, marketController.updateMarket);
router.patch('/:id', validateToken, marketController.updateMarketPartial);
router.delete('/:id', validateToken, marketController.deleteMarket);

// Rotas de endereço do mercado (devem vir antes de /:id para evitar conflito)
router.get('/address/:id', validateToken, marketAddressController.getMarketAddressById);
router.put('/address/:id', validateToken, marketAddressController.updateMarketAddress);
router.patch('/address/:id', validateToken, marketAddressController.updateMarketAddressPartial);
router.delete('/address/:id', validateToken, marketAddressController.deleteMarketAddress);
router.post('/:marketId/address', validateToken, marketAddressController.createMarketAddress);
router.get('/:marketId/address', validateToken, marketAddressController.getMarketAddressByMarketId);

export default router;
