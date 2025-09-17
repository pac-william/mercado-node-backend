import { Request, Response } from "express";
import { aiService, AiSearchResult } from "../services/aiService";
import { productSearchService } from "../services/productSearchService";
import { aiRepository } from "../repositories/aiRepository";
import { Logger } from "../utils/logger";

export class AiController {
    /**
     * Endpoint principal para pesquisa de produtos com IA
     * POST /ai/produtos/pesquisar
     */
    async searchProducts(req: Request, res: Response) {
        Logger.controller('AI', 'searchProducts', 'body', req.body);
        
        try {
            const { prompt } = req.body;
            const userId = (req as any).user?.id || null; // Assumindo autenticação JWT

            if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Prompt é obrigatório e deve ser uma string não vazia"
                });
            }

            // 1. Consultar IA para obter ingredientes/produtos
            const aiResponse = await aiService.searchProducts(prompt);
            
            // 2. Buscar produtos correspondentes no banco de dados
            const productMatches = await productSearchService.searchProductsByAiItems(aiResponse.itens);
            
            // 3. Montar resposta final
            const finalResult: AiSearchResult = {
                contexto: aiResponse.contexto,
                produtos: productMatches
            };

            // 4. Salvar log da consulta
            try {
                await aiRepository.createAiSearch(
                    userId,
                    prompt,
                    JSON.stringify(aiResponse)
                );
            } catch (logError) {
                Logger.errorOperation('AiController', 'searchProducts', logError, 'Erro ao salvar log');
                // Não falha a operação por erro de log
            }

            Logger.successOperation('AiController', 'searchProducts');
            return res.status(200).json({
                success: true,
                data: finalResult
            });

        } catch (error) {
            Logger.errorOperation('AiController', 'searchProducts', error);
            
            if (error instanceof Error) {
                if (error.message.includes('IA')) {
                    return res.status(503).json({
                        success: false,
                        message: "Serviço de IA temporariamente indisponível"
                    });
                }
            }

            return res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    }

    /**
     * Endpoint para listar histórico de buscas do usuário
     * GET /ai/buscas
     */
    async getSearchHistory(req: Request, res: Response) {
        Logger.controller('AI', 'getSearchHistory', 'query', req.query);
        
        try {
            const userId = (req as any).user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Usuário não autenticado"
                });
            }

            const searches = await aiRepository.getAiSearches(userId, page, size);
            const total = await aiRepository.countAiSearches(userId);

            Logger.successOperation('AiController', 'getSearchHistory');
            return res.status(200).json({
                success: true,
                data: {
                    searches: searches.map(search => ({
                        id: search.id,
                        prompt: search.prompt,
                        aiResponse: JSON.parse(search.aiResponse),
                        createdAt: search.createdAt,
                        user: search.user
                    })),
                    meta: {
                        page,
                        size,
                        total,
                        totalPages: Math.ceil(total / size)
                    }
                }
            });

        } catch (error) {
            Logger.errorOperation('AiController', 'getSearchHistory', error);
            return res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    }

    /**
     * Endpoint para buscar produtos similares
     * GET /ai/produtos/similares/:productId
     */
    async getSimilarProducts(req: Request, res: Response) {
        Logger.controller('AI', 'getSimilarProducts', 'params', req.params);
        
        try {
            const { productId } = req.params;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: "ID do produto é obrigatório"
                });
            }

            const similarProducts = await productSearchService.findSimilarProducts(productId);

            Logger.successOperation('AiController', 'getSimilarProducts');
            return res.status(200).json({
                success: true,
                data: {
                    productId,
                    similarProducts: similarProducts.map(product => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        unit: product.unit,
                        market: product.market,
                        category: product.category
                    }))
                }
            });

        } catch (error) {
            Logger.errorOperation('AiController', 'getSimilarProducts', error);
            return res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    }

    /**
     * Endpoint para buscar produtos por categoria
     * GET /ai/produtos/categoria/:categoryName
     */
    async getProductsByCategory(req: Request, res: Response) {
        Logger.controller('AI', 'getProductsByCategory', 'params', req.params);
        
        try {
            const { categoryName } = req.params;

            if (!categoryName) {
                return res.status(400).json({
                    success: false,
                    message: "Nome da categoria é obrigatório"
                });
            }

            const products = await productSearchService.searchProductsByCategory(categoryName);

            Logger.successOperation('AiController', 'getProductsByCategory');
            return res.status(200).json({
                success: true,
                data: {
                    categoryName,
                    products: products.map(product => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        unit: product.unit,
                        market: product.market,
                        category: product.category
                    }))
                }
            });

        } catch (error) {
            Logger.errorOperation('AiController', 'getProductsByCategory', error);
            return res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    }
}

export const aiController = new AiController();
