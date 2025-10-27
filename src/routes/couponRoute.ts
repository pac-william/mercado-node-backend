import { Router } from 'express';
import { couponController } from '../controllers/couponController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Rotas públicas
router.post('/validate', validateToken, couponController.validateCoupon);

// Rotas protegidas (apenas admins de mercado)
router.post('/', validateToken, couponController.createCoupon);
router.get('/', validateToken, couponController.getCoupons);
router.get('/:id', validateToken, couponController.getCouponById);
router.put('/:id', validateToken, couponController.updateCoupon);
router.delete('/:id', validateToken, couponController.deleteCoupon);

export default router; 