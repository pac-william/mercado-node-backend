import { Meta } from "../domain/metaDomain";
import { SuggestionListItem, SuggestionPaginatedResponse } from "../domain/suggestionDomain";
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

    async getSuggestions(page: number, size: number) {
        Logger.debug('SuggestionService', 'getSuggestions', { page, size });
        
        const count = await suggestionRepository.count();
        const suggestionsData = await suggestionRepository.findAll(page, size);
        
        const suggestions = suggestionsData.map((s: any) => new SuggestionListItem(s.id));
        
        Logger.successOperation('SuggestionService', 'getSuggestions');
        return new SuggestionPaginatedResponse(suggestions, new Meta(page, size, count, Math.ceil(count / size), count));
    }
}

export const suggestionService = new SuggestionService();
