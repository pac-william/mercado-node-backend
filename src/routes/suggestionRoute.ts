import { Router } from 'express';
import { suggestionController } from '../controllers/suggestionController';
import { validateToken } from '../middleware/validateToken';

const router = Router();


router.get('/', validateToken, suggestionController.getSuggestions);
router.post('/', validateToken, suggestionController.createSuggestions);
router.get('/:id', validateToken, suggestionController.getSuggestionById);

export default router;
