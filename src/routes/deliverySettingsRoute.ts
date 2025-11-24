import { Router } from 'express';
import { DeliverySettingsController } from '../controllers/deliverySettingsController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const deliverySettingsController = new DeliverySettingsController();

// Rotas protegidas
router.get('/market/:marketId', validateToken, deliverySettingsController.getDeliverySettingsByMarketId);
router.post('/', validateToken, deliverySettingsController.createDeliverySettings);
router.put('/market/:marketId', validateToken, deliverySettingsController.updateDeliverySettings);
router.patch('/market/:marketId', validateToken, deliverySettingsController.updateDeliverySettings);
router.post('/upsert', validateToken, deliverySettingsController.upsertDeliverySettings);

export default router;

