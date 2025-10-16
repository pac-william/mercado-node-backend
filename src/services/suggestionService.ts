import { suggestionRepository } from "../repositories/suggestionRepository";
import { Logger } from "../utils/logger";

export class SuggestionService {
    async createSuggestion(task: string, data: any) {
        Logger.debug('SuggestionService', 'createSuggestion', { task });
        
        const suggestion = await suggestionRepository.create(task, data);
        
        Logger.successOperation('SuggestionService', 'createSuggestion');
        return suggestion;
    }

    async getSuggestionById(id: string) {
        Logger.debug('SuggestionService', 'getSuggestionById', { id });
        
        const suggestion = await suggestionRepository.findById(id);
        
        if (!suggestion) {
            throw new Error('Sugestão não encontrada');
        }

        Logger.successOperation('SuggestionService', 'getSuggestionById');
        return suggestion;
    }
}

export const suggestionService = new SuggestionService();
