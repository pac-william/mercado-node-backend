import { prisma } from "../utils/prisma";

class AiRepository {
    async createAiSearch(userId: string | null, prompt: string, aiResponse: string) {
        const aiSearch = await prisma.aiSearch.create({
            data: {
                userId: userId || null,
                prompt,
                aiResponse,
            },
        });
        return aiSearch;
    }

    async getAiSearches(userId: string, page: number = 1, size: number = 10) {
        const searches = await prisma.aiSearch.findMany({
            where: { userId },
            skip: (page - 1) * size,
            take: size,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
        return searches;
    }

    async countAiSearches(userId: string) {
        const count = await prisma.aiSearch.count({
            where: { userId },
        });
        return count;
    }
}

export const aiRepository = new AiRepository();
