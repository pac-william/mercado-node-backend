import { Router } from 'express';
import { categoriesController } from '../controllers/categoriesController';
import { authenticate, requireMarketAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.get('/', optionalAuth, categoriesController.get);
router.get('/:categoryId/products', optionalAuth, categoriesController.getProductsByCategory);

// Rotas protegidas
router.post('/', authenticate, requireMarketAdmin, categoriesController.createCategory);
router.put('/:id', authenticate, requireMarketAdmin, categoriesController.updateCategory);
router.patch('/:id', authenticate, requireMarketAdmin, categoriesController.updateCategoryPartial);
router.delete('/:id', authenticate, requireMarketAdmin, categoriesController.deleteCategory);

export default router;
