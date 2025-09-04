import { MarketDTO, MarketUpdateDTO } from "../dtos/marketDTO";
import { prisma } from "../utils/prisma";

class MarketRepository {
    async createMarket(marketDTO: MarketDTO) {
        const market = await prisma.market.create({
            data: marketDTO,
        });
        return market;
    }

    async getMarkets(page: number, size: number) {
        const markets = await prisma.market.findMany({
            skip: (page - 1) * size,
            take: size,
            include: {
                products: true,
            },
        });
        return markets;
    }

    async getMarketById(id: string) {
        const market = await prisma.market.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
        return market;
    }

    async updateMarket(id: string, marketDTO: MarketDTO) {
        const market = await prisma.market.update({
            where: { id },
            data: marketDTO,
            include: {
                products: true,
            },
        });
        return market;
    }

    async updateMarketPartial(id: string, marketUpdateDTO: MarketUpdateDTO) {
        const market = await prisma.market.update({
            where: { id },
            data: marketUpdateDTO,
            include: {
                products: true,
            },
        });
        return market;
    }

    async deleteMarket(id: string) {
        const market = await prisma.market.delete({
            where: { id },
            include: {
                products: true,
            },
        });
        return market;
    }
}

export const marketRepository = new MarketRepository();
