import { Router } from 'express';
import { ReportsController } from '../controllers/reportsController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const reportsController = new ReportsController();

router.get('/markets/:marketId/summary', validateToken, reportsController.getMarketSummary);

export default router;


