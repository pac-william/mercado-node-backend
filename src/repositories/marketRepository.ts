import { Market } from "../domain/marketDomain";
import { MarketDTO, MarketUpdateDTO } from "../dtos/marketDTO";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

class MarketRepository {
    private buildFilter(name?: string, address?: string, ownerId?: string, managersIds?: string[]): any {
        const filter: any = {
            ownerId: { $ne: null, $exists: true }
        };

        if (ownerId) {
            filter.ownerId = ownerId;
        }

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (address) {
            filter.address = { $regex: address, $options: 'i' };
        }

        if (managersIds && managersIds.length > 0) {
            filter.managersIds = { $in: managersIds };
        }

        return filter;
    }

    async createMarket(marketDTO: MarketDTO) {
        const market = await prisma.market.create({
            data: marketDTO,
        });
        return market;
    }

    async getMarkets(page: number, size: number, name?: string, address?: string, ownerId?: string, managersIds?: string[]) {
        const filter = this.buildFilter(name, address, ownerId, managersIds);

        const marketsRaw = await prisma.market.findRaw({
            filter,
            options: {
                skip: (page - 1) * size,
                limit: size,
            }
        }) as unknown as any[];

        const markets = marketsRaw.map((doc: any) => ({
            id: doc._id?.$oid || doc._id,
            name: doc.name,
            address: doc.address,
            profilePicture: doc.profilePicture || '',
            ownerId: doc.ownerId?.$oid || doc.ownerId,
            managersIds: doc.managersIds?.map((id: any) => id?.$oid || id) || [],
            createdAt: doc.createdAt?.$date ? new Date(doc.createdAt.$date) : doc.createdAt,
            updatedAt: doc.updatedAt?.$date ? new Date(doc.updatedAt.$date) : doc.updatedAt,
        }));

        return markets.map((market) => new Market(
            market.id,
            market.name,
            market.address,
            market.profilePicture ?? '',
            market.ownerId,
            market.managersIds ?? [],
            market.createdAt,
            market.updatedAt,
        ));
    }

    async getMarketById(id: string) {
        const market = await prisma.market.findUnique({
            where: { id }
        });
        return market;
    }

    async updateMarket(id: string, marketDTO: MarketDTO) {
        const market = await prisma.market.update({
            where: { id },
            data: marketDTO,
        });
        return market;
    }

    async updateMarketPartial(id: string, marketUpdateDTO: MarketUpdateDTO) {
        const market = await prisma.market.update({
            where: { id },
            data: marketUpdateDTO,
        });
        return market;
    }

    async deleteMarket(id: string) {
        const market = await prisma.market.delete({
            where: { id },
        });
        return market;
    }

    async count(name?: string, address?: string, ownerId?: string, managersIds?: string[]) {
        const filter = this.buildFilter(name, address, ownerId, managersIds);

        const marketsRaw = await prisma.market.findRaw({
            filter,
        }) as unknown as any[];

        return marketsRaw.length;
    }
}

export const marketRepository = new MarketRepository();
