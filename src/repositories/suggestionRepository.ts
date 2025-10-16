import { PrismaClient } from "@prisma/client";
import { Logger } from "../utils/logger";

const prisma = new PrismaClient();

export class SuggestionRepository {
    async create(task: string, data: any) {
        Logger.debug('SuggestionRepository', 'create', { task, dataSize: JSON.stringify(data).length });
        
        const suggestion = await prisma.suggestion.create({
            data: {
                task,
                data
            }
        });

        Logger.successOperation('SuggestionRepository', 'create');
        return suggestion;
    }

    async findById(id: string) {
        Logger.debug('SuggestionRepository', 'findById', { id });
        
        const suggestion = await prisma.suggestion.findUnique({
            where: { id }
        });

        if (!suggestion) {
            Logger.warn('SuggestionRepository', 'findById - Suggestion not found', { id });
            return null;
        }

        Logger.successOperation('SuggestionRepository', 'findById');
        return suggestion;
    }

    async findAll(page: number, size: number) {
        Logger.debug('SuggestionRepository', 'findAll', { page, size });
        
        const suggestions = await prisma.suggestion.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true
            }
        });

        Logger.successOperation('SuggestionRepository', 'findAll');
        return suggestions;
    }

    async count() {
        Logger.debug('SuggestionRepository', 'count');
        
        const count = await prisma.suggestion.count();
        
        Logger.successOperation('SuggestionRepository', 'count');
        return count;
    }
}

export const suggestionRepository = new SuggestionRepository();
