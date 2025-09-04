import { Router } from 'express';
import { CategoriesController } from '../controllers/categoriesController';
const router = Router();


const categoriesController = new CategoriesController();

router.get('/', categoriesController.get);


export default router;
