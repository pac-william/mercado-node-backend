import { Router } from 'express';
import { couponController } from '../controllers/couponController';
import { authenticate, requireMarketAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/validate', optionalAuth, couponController.validateCoupon);

// Rotas protegidas (apenas admins de mercado)
router.post('/', authenticate, requireMarketAdmin, couponController.createCoupon);
router.get('/', authenticate, requireMarketAdmin, couponController.getCoupons);
router.get('/:id', authenticate, requireMarketAdmin, couponController.getCouponById);
router.put('/:id', authenticate, requireMarketAdmin, couponController.updateCoupon);
router.delete('/:id', authenticate, requireMarketAdmin, couponController.deleteCoupon);

export default router; 