import { Router } from 'express';
import { subcategoryController } from '../controllers/subcategoryController';

const router = Router();

router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);
router.post('/', subcategoryController.createSubcategory);
router.put('/:id', subcategoryController.updateSubcategory);
router.patch('/:id', subcategoryController.updateSubcategoryPartial);
router.delete('/:id', subcategoryController.deleteSubcategory);

export default router;

