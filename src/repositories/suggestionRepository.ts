import { PrismaClient } from "@prisma/client";
import { Logger } from "../utils/logger";

const prisma = new PrismaClient();

export class SuggestionRepository {
    async create(userId: string, task: string, data: any) {
        Logger.debug('SuggestionRepository', 'create', { userId, task, dataSize: JSON.stringify(data).length });
        
        const suggestion = await prisma.suggestion.create({
            data: {
                userId,
                task,
                data
            }
        });

        Logger.successOperation('SuggestionRepository', 'create');
        return suggestion;
    }

    async findById(id: string, userId: string) {
        Logger.debug('SuggestionRepository', 'findById', { id, userId });
        
        const suggestion = await prisma.suggestion.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!suggestion) {
            Logger.warn('SuggestionRepository', 'findById - Suggestion not found', { id, userId });
            return null;
        }

        Logger.successOperation('SuggestionRepository', 'findById');
        return suggestion;
    }

    async findAll(userId: string, page: number, size: number) {
        Logger.debug('SuggestionRepository', 'findAll', { userId, page, size });
        
        const suggestions = await prisma.suggestion.findMany({
            where: { userId },
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

    async count(userId: string) {
        Logger.debug('SuggestionRepository', 'count', { userId });
        
        const count = await prisma.suggestion.count({
            where: { userId }
        });
        
        Logger.successOperation('SuggestionRepository', 'count');
        return count;
    }

    async findAllByUserId(userId: string, page: number, size: number) {
        Logger.debug('SuggestionRepository', 'findAllByUserId', { userId, page, size });

        const suggestions = await prisma.suggestion.findMany({
            where: { userId },
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true
            }
        });

        Logger.successOperation('SuggestionRepository', 'findAllByUserId');
        return suggestions;
    }

    async countByUserId(userId: string) {
        Logger.debug('SuggestionRepository', 'countByUserId', { userId });

        const count = await prisma.suggestion.count({
            where: { userId }
        });

        Logger.successOperation('SuggestionRepository', 'countByUserId');
        return count;
    }
}

export const suggestionRepository = new SuggestionRepository();
