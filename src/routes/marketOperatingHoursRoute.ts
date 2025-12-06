import { Router } from 'express';
import { MarketOperatingHoursController } from '../controllers/marketOperatingHoursController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const marketOperatingHoursController = new MarketOperatingHoursController();

// Rotas públicas (sem autenticação) - para consulta de horários
router.get('/market/:marketId', marketOperatingHoursController.getOperatingHoursByMarketId.bind(marketOperatingHoursController));
router.get('/market/:marketId/regular', marketOperatingHoursController.getRegularOperatingHoursByMarketId.bind(marketOperatingHoursController));
router.get('/market/:marketId/holidays', marketOperatingHoursController.getHolidayOperatingHoursByMarketId.bind(marketOperatingHoursController));

// Rotas protegidas - usando bind para manter o contexto do this
router.post('/', validateToken, marketOperatingHoursController.createOperatingHours.bind(marketOperatingHoursController));
router.post('/bulk', validateToken, marketOperatingHoursController.createBulkOperatingHours.bind(marketOperatingHoursController));
router.get('/:id', validateToken, marketOperatingHoursController.getOperatingHoursById.bind(marketOperatingHoursController));
router.put('/:id', validateToken, marketOperatingHoursController.updateOperatingHours.bind(marketOperatingHoursController));
router.patch('/:id', validateToken, marketOperatingHoursController.updateOperatingHours.bind(marketOperatingHoursController));
router.delete('/:id', validateToken, marketOperatingHoursController.deleteOperatingHours.bind(marketOperatingHoursController));
router.delete('/market/:marketId', validateToken, marketOperatingHoursController.deleteOperatingHoursByMarketId.bind(marketOperatingHoursController));

export default router;

