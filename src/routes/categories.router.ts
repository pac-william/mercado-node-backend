import { Router } from 'express';
import { categoriesController } from '../controllers/categoriesController';

const router = Router();

// Rotas públicas (sem autenticação)
router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);
router.get('/:categoryId/products', categoriesController.getProductsByCategory);
router.post('/', categoriesController.createCategory);
router.put('/:id', categoriesController.updateCategory);
router.patch('/:id', categoriesController.updateCategoryPartial);
router.delete('/:id', categoriesController.deleteCategory);

export default router;
