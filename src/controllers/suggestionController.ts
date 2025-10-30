import { Request, Response } from "express";
import aiProcessor from "../factory/aiProcessor";
import { suggestionService } from "../services/suggestionService";
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
            if (!req.user) {
                Logger.warn('SuggestionController', 'getSuggestions - Usuário não autenticado');
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { page, size } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .build();

            Logger.debug('SuggestionController', 'getSuggestions - Query parsed', { userId, page, size });

            const result = await suggestionService.getSuggestions(userId, page, size);
            
            Logger.successOperation('SuggestionController', 'getSuggestions');
            Logger.debug('SuggestionController', 'getSuggestions - Suggestions fetched', { 
                totalSuggestions: result.meta.total,
                currentPage: result.meta.page,
                totalPages: result.meta.totalPages
            });
            
            return res.status(200).json(result);
        } catch (error: any) {
            const errorDetails = {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code,
                status: error.status,
                response: error.response?.data || error.response,
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

    async createSuggestions(req: Request, res: Response) {
        Logger.controller('Suggestion', 'createSuggestions', 'req: Request, res: Response', { 
            body: req.body, 
            query: req.query,
            params: req.params 
        });
        
        try {
            if (!req.user) {
                Logger.warn('SuggestionController', 'createSuggestions - Usuário não autenticado');
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { task } = req.body;

            Logger.debug('SuggestionController', 'createSuggestions - Body parsed', { userId, task });

            if (!task) {
                Logger.warn('SuggestionController', 'createSuggestions - Task parameter missing', { body: req.body });
                return res.status(400).json({ message: "Tarefa não informada" });
            }

            Logger.debug('SuggestionController', 'createSuggestions - Starting AI processing', { task });
            const suggestionData = await aiProcessor.process(task);
            
            Logger.debug('SuggestionController', 'createSuggestions - Saving suggestion to database', { task });
            const savedSuggestion = await suggestionService.createSuggestion(userId, task, suggestionData);
            
            Logger.successOperation('SuggestionController', 'createSuggestions');
            Logger.debug('SuggestionController', 'createSuggestions - Suggestion saved', { 
                suggestionId: savedSuggestion.id,
                essentialProducts: suggestionData.essential_products?.length || 0,
                commonProducts: suggestionData.common_products?.length || 0,
                utensils: suggestionData.utensils?.length || 0,
                totalSearches: suggestionData.searchResults?.statistics?.totalSearches || 0,
                totalProductsFound: suggestionData.searchResults?.statistics?.totalProductsFound || 0
            });
            
            return res.status(201).json({ id: savedSuggestion.id });
        } catch (error: any) {
            const errorDetails = {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code,
                status: error.status,
                response: error.response?.data || error.response,
                task: req.body.task,
                timestamp: new Date().toISOString()
            };

            Logger.errorOperation('SuggestionController', 'createSuggestions', error, 'fetch failed');
            Logger.error('SuggestionController', 'createSuggestions - Detailed error info', errorDetails);
            
            return res.status(500).json({ 
                message: `Erro interno do servidor: ${error.message}`,
                error: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            });
        }
    }

    async getSuggestionById(req: Request, res: Response) {
        Logger.controller('Suggestion', 'getSuggestionById', 'req: Request, res: Response', { 
            body: req.body, 
            query: req.query,
            params: req.params 
        });
        
        try {
            if (!req.user) {
                Logger.warn('SuggestionController', 'getSuggestionById - Usuário não autenticado');
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { id } = req.params;

            Logger.debug('SuggestionController', 'getSuggestionById - Params parsed', { id, userId });

            if (!id) {
                Logger.warn('SuggestionController', 'getSuggestionById - ID parameter missing', { params: req.params });
                return res.status(400).json({ message: "ID não informado" });
            }

            Logger.debug('SuggestionController', 'getSuggestionById - Fetching suggestion from database', { id, userId });
            const suggestion = await suggestionService.getSuggestionById(id, userId);
            
            Logger.successOperation('SuggestionController', 'getSuggestionById');
            Logger.debug('SuggestionController', 'getSuggestionById - Suggestion fetched', { 
                suggestionId: suggestion.id,
                task: suggestion.task
            });
            
            return res.status(200).json(suggestion);
        } catch (error: any) {
            // Log detalhado do erro
            const errorDetails = {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code,
                status: error.status,
                response: error.response?.data || error.response,
                id: req.params.id,
                timestamp: new Date().toISOString()
            };

            Logger.errorOperation('SuggestionController', 'getSuggestionById', error, 'fetch failed');
            Logger.error('SuggestionController', 'getSuggestionById - Detailed error info', errorDetails);
            
            if (error.message === 'Sugestão não encontrada') {
                return res.status(404).json({ message: error.message });
            }
            
            return res.status(500).json({ 
                message: `Erro interno do servidor: ${error.message}`,
                error: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            });
        }
    }
}

export const suggestionController = new SuggestionController();