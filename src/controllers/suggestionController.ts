import { Request, Response } from "express";
import aiProcessor from "../factory/aiProcessor";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class SuggestionController {
    async getSuggestions(req: Request, res: Response) {
        Logger.controller('Suggestion', 'getSuggestions', 'req: Request, res: Response', { body: req.body });
        try {
            const { task } = QueryBuilder.from(req.query)
                .withString('task')
                .build();

            if (!task) {
                return res.status(400).json({ message: "Tarefa não informada" });
            }

            const product = await aiProcessor.process(task);
            Logger.successOperation('SuggestionController', 'getSuggestions');
            return res.status(201).json(product);
        } catch (error: any) {
            Logger.errorOperation('SuggestionController', `getSuggestions ${error.message}`, error);
            return res.status(500).json({ message: `Erro interno do servidor: ${error.message}` });
        }
    }
}

export const suggestionController = new SuggestionController();