import { Router } from 'express';
import { PaymentSettingsController } from '../controllers/paymentSettingsController';
import { validateToken } from '../middleware/validateToken';

const router = Router();
const paymentSettingsController = new PaymentSettingsController();

// Rota pública - formas de pagamento aceitas (para checkout)
router.get('/market/:marketId/accepted-methods', paymentSettingsController.getAcceptedPaymentMethods.bind(paymentSettingsController));

// Rotas protegidas
router.get('/market/:marketId', validateToken, paymentSettingsController.getPaymentSettingsByMarketId.bind(paymentSettingsController));
router.post('/', validateToken, paymentSettingsController.createPaymentSettings.bind(paymentSettingsController));
router.put('/market/:marketId', validateToken, paymentSettingsController.updatePaymentSettings.bind(paymentSettingsController));
router.patch('/market/:marketId', validateToken, paymentSettingsController.updatePaymentSettings.bind(paymentSettingsController));
router.post('/upsert', validateToken, paymentSettingsController.upsertPaymentSettings.bind(paymentSettingsController));
router.post('/market/:marketId/pix/qrcode', validateToken, paymentSettingsController.generatePixQRCode.bind(paymentSettingsController));

export default router;

