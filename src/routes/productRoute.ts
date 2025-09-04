import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/markets/:marketId', productController.getProductsByMarket);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.patch('/:id', productController.updateProductPartial);
router.delete('/:id', productController.deleteProduct);

export default router;
