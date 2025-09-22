import { Router } from 'express';
import { suggestionController } from '../controllers/suggestionController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.get('/', optionalAuth, suggestionController.getSuggestions);

export default router;
