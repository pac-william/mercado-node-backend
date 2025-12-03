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
        userLongitude?: number,
        sort?: string,
        distance?: number
    ) {
        // Get all filtered and sorted markets (without pagination to count correctly)
        const allMarketsData = await marketRepository.getMarkets(
            1,
            999999, // Get all to count properly
            name,
            address,
            ownerId,
            managersIds,
            userLatitude,
            userLongitude,
            sort,
            distance
        );
        
        const totalCount = allMarketsData.length;
        
        // Apply pagination
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedMarketsData = allMarketsData.slice(startIndex, endIndex);
        
        const markets = paginatedMarketsData.map((m: any) => ({
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
        const totalPages = totalCount > 0 ? Math.ceil(totalCount / size) : 0;
        const meta = new Meta(page, size, totalCount, totalPages, totalCount);
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
