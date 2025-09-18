import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authenticate, requireMarketAdmin, optionalAuth, requireMarketOwnership } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, productController.getProducts);
router.get('/markets/:marketId', optionalAuth, productController.getProductsByMarket);
router.get('/:id', optionalAuth, productController.getProductById);
router.post('/', authenticate, requireMarketAdmin, productController.createProduct);
router.put('/:id', authenticate, requireMarketAdmin, requireMarketOwnership, productController.updateProduct);
router.patch('/:id', authenticate, requireMarketAdmin, requireMarketOwnership, productController.updateProductPartial);
router.delete('/:id', authenticate, requireMarketAdmin, requireMarketOwnership, productController.deleteProduct);

export default router;
