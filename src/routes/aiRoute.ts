import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

// Middleware de autenticação (assumindo que você tem um middleware de JWT)
// const authenticateToken = require('../middleware/auth'); // Descomente quando implementar

// Endpoint principal para pesquisa de produtos com IA
router.post('/produtos/pesquisar', aiController.searchProducts);

// Endpoint para histórico de buscas do usuário
router.get('/buscas', aiController.getSearchHistory);

// Endpoint para produtos similares
router.get('/produtos/similares/:productId', aiController.getSimilarProducts);

// Endpoint para produtos por categoria
router.get('/produtos/categoria/:categoryName', aiController.getProductsByCategory);

export default router;
