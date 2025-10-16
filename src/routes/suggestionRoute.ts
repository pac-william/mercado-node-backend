import { Router } from 'express';
import { suggestionController } from '../controllers/suggestionController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.get('/', optionalAuth, suggestionController.getSuggestions);
router.post('/', optionalAuth, suggestionController.createSuggestions);
router.get('/:id', optionalAuth, suggestionController.getSuggestionById);

export default router;
