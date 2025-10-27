import { Router } from 'express';
import { productController } from '../controllers/productController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Rotas públicas (sem autenticação)
router.get('/', productController.getProducts);
router.get('/markets/:marketId', productController.getProductsByMarket);
router.get('/:id', productController.getProductById);

// Rotas protegidas
router.post('/', validateToken, productController.createProduct);
router.put('/:id', validateToken, productController.updateProduct);
router.patch('/:id', validateToken, productController.updateProductPartial);
router.delete('/:id', validateToken, productController.deleteProduct);

export default router;
