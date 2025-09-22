import { Request, Response } from "express";
import aiProcessor from "../factory/aiProcessor";
import { Logger } from "../utils/logger";

export class SuggestionController {
    async getSuggestions(req: Request, res: Response) {
        Logger.controller('Suggestion', 'getSuggestions', 'req: Request, res: Response', { body: req.body });
        try {
            const product = await aiProcessor.process();
            Logger.successOperation('SuggestionController', 'getSuggestions');
            return res.status(201).json(product);
        } catch (error) {
            Logger.errorOperation('SuggestionController', 'getSuggestions', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const suggestionController = new SuggestionController();