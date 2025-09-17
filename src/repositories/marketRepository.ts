import { Market } from "../domain/marketDomain";
import { MarketDTO, MarketUpdateDTO } from "../dtos/marketDTO";
import { prisma } from "../utils/prisma";

class MarketRepository {
    async createMarket(marketDTO: MarketDTO) {
        const market = await prisma.market.create({
            data: marketDTO,
        });
        return market;
    }

    async getMarkets(page: number, size: number, name?: string, address?: string) {
        const markets = await prisma.market.findMany({
            skip: (page - 1) * size,
            take: size,
            where: {
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
                address: address ? { contains: address, mode: 'insensitive' } : undefined,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
        return markets.map((market) => new Market(
            market.id,
            market.name,
            market.address,
            market.profilePicture ?? '',
        ));
    }

    async getMarketById(id: string) {
        const market = await prisma.market.findUnique({
            where: { id },
            include: {
                products: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
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
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
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
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
        });
        return market;
    }

    async deleteMarket(id: string) {
        const market = await prisma.market.delete({
            where: { id },
            include: {
                products: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
        });
        return market;
    }

    async count(name?: string, address?: string) {
        const count = await prisma.market.count({
            where: {
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
                address: address ? { contains: address, mode: 'insensitive' } : undefined,
            },
        });
        return count;
    }
}

export const marketRepository = new MarketRepository();
