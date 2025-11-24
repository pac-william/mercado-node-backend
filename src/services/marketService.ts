import { Meta } from "../domain/metaDomain";
import { MarketCreateDTO, MarketDTO, MarketUpdateDTO } from "../dtos/index";
import { marketAddressRepository } from "../repositories/marketAddressRepository";
import { marketRepository } from "../repositories/marketRepository";
import { prisma } from "../utils/prisma";

class MarketService {
    async createMarket(marketCreateDTO: MarketCreateDTO) {
        const market = await prisma.$transaction(async (tx) => {
            const createdMarket = await tx.market.create({
                data: {
                    name: marketCreateDTO.name,
                    profilePicture: marketCreateDTO.profilePicture,
                    ownerId: marketCreateDTO.ownerId,
                    managersIds: marketCreateDTO.managersIds || [],
                }
            });

            const address = await marketAddressRepository.createMarketAddress(
                marketCreateDTO.address,
                createdMarket.id,
                tx
            );

            await tx.market.update({
                where: { id: createdMarket.id },
                data: { addressId: address.id }
            });

            return createdMarket;
        });

        return market;
    }

    async getMarkets(
        page: number,
        size: number,
        name?: string,
        address?: string,
        ownerId?: string,
        managersIds?: string[],
        userLatitude?: number,
        userLongitude?: number
    ) {
        const count = await marketRepository.count(name, address, ownerId, managersIds);
        const marketsData = await marketRepository.getMarkets(
            page,
            size,
            name,
            address,
            ownerId,
            managersIds,
            userLatitude,
            userLongitude
        );
        const markets = marketsData.map((m: any) => ({
            id: m.id,
            name: m.name,
            address: m.address,
            profilePicture: m.profilePicture,
            bannerImage: m.bannerImage || '',
            ownerId: m.ownerId,
            managersIds: m.managersIds,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            latitude: m.latitude,
            longitude: m.longitude,
            distance: m.distance,
        }));
        const totalPages = count > 0 ? Math.ceil(count / size) : 0;
        const meta = new Meta(page, size, count, totalPages, count);
        return {
            markets,
            meta: {
                page: meta.page,
                size: meta.size,
                total: meta.total,
                totalPages: meta.totalPages,
                totalItems: meta.totalItems,
            },
        };
    }

    async getMarketById(id: string) {
        return await marketRepository.getMarketById(id);
    }

    async updateMarket(id: string, marketDTO: MarketDTO) {
        return await marketRepository.updateMarket(id, marketDTO);
    }

    async updateMarketPartial(id: string, marketUpdateDTO: MarketUpdateDTO) {
        return await marketRepository.updateMarketPartial(id, marketUpdateDTO);
    }

    async deleteMarket(id: string) {
        return await marketRepository.deleteMarket(id);
    }
}

export const marketService = new MarketService();
