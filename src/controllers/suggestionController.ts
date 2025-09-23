import { Request, Response } from "express";
import aiProcessor from "../factory/aiProcessor";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class SuggestionController {
    async getSuggestions(req: Request, res: Response) {
        Logger.controller('Suggestion', 'getSuggestions', 'req: Request, res: Response', { 
            body: req.body, 
            query: req.query,
            params: req.params 
        });
        
        try {
            const { task } = QueryBuilder.from(req.query)
                .withString('task')
                .build();

            Logger.debug('SuggestionController', 'getSuggestions - Query parsed', { task });

            if (!task) {
                Logger.warn('SuggestionController', 'getSuggestions - Task parameter missing', { query: req.query });
                return res.status(400).json({ message: "Tarefa não informada" });
            }

            Logger.debug('SuggestionController', 'getSuggestions - Starting AI processing', { task });
            const product = await aiProcessor.process(task);
            
            Logger.successOperation('SuggestionController', 'getSuggestions');
            Logger.debug('SuggestionController', 'getSuggestions - AI processing completed', { 
                essentialProducts: product.essential_products?.length || 0,
                commonProducts: product.common_products?.length || 0,
                utensils: product.utensils?.length || 0,
                totalSearches: product.searchResults?.statistics?.totalSearches || 0,
                totalProductsFound: product.searchResults?.statistics?.totalProductsFound || 0
            });
            
            return res.status(201).json(product);
        } catch (error: any) {
            // Log detalhado do erro
            const errorDetails = {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code,
                status: error.status,
                response: error.response?.data || error.response,
                task: req.query.task,
                timestamp: new Date().toISOString()
            };

            Logger.errorOperation('SuggestionController', 'getSuggestions', error, 'fetch failed');
            Logger.error('SuggestionController', 'getSuggestions - Detailed error info', errorDetails);
            
            return res.status(500).json({ 
                message: `Erro interno do servidor: ${error.message}`,
                error: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            });
        }
    }
}

export const suggestionController = new SuggestionController();