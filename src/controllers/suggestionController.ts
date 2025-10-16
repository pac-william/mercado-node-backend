import { Request, Response } from "express";
import aiProcessor from "../factory/aiProcessor";
import { suggestionService } from "../services/suggestionService";
import { Logger } from "../utils/logger";

export class SuggestionController {
    async createSuggestions(req: Request, res: Response) {
        Logger.controller('Suggestion', 'createSuggestions', 'req: Request, res: Response', { 
            body: req.body, 
            query: req.query,
            params: req.params 
        });
        
        try {
            const { task } = req.body;

            Logger.debug('SuggestionController', 'createSuggestions - Body parsed', { task });

            if (!task) {
                Logger.warn('SuggestionController', 'createSuggestions - Task parameter missing', { body: req.body });
                return res.status(400).json({ message: "Tarefa não informada" });
            }

            Logger.debug('SuggestionController', 'createSuggestions - Starting AI processing', { task });
            const suggestionData = await aiProcessor.process(task);
            
            Logger.debug('SuggestionController', 'createSuggestions - Saving suggestion to database', { task });
            const savedSuggestion = await suggestionService.createSuggestion(task, suggestionData);
            
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
            const { id } = req.params;

            Logger.debug('SuggestionController', 'getSuggestionById - Params parsed', { id });

            if (!id) {
                Logger.warn('SuggestionController', 'getSuggestionById - ID parameter missing', { params: req.params });
                return res.status(400).json({ message: "ID não informado" });
            }

            Logger.debug('SuggestionController', 'getSuggestionById - Fetching suggestion from database', { id });
            const suggestion = await suggestionService.getSuggestionById(id);
            
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