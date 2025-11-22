import { MarketPaginatedResponse } from "../domain/marketDomain";
import { Meta } from "../domain/metaDomain";
import { MarketDTO, MarketCreateDTO, MarketUpdateDTO } from "../dtos/index";
import { addressRepository } from "../repositories/addressRepository";
import { marketRepository } from "../repositories/marketRepository";
import { prisma } from "../utils/prisma";

class MarketService {
    async createMarket(marketCreateDTO: MarketCreateDTO) {
        // Criar o mercado e o endereço em uma transação
        const market = await prisma.$transaction(async (tx) => {
            // Criar o endereço primeiro (sem userId, será endereço de mercado)
            const address = await addressRepository.createAddress(marketCreateDTO.address, null, tx);

            // Criar o mercado com o addressId
            const createdMarket = await tx.market.create({
                data: {
                    name: marketCreateDTO.name,
                    addressId: address.id,
                    profilePicture: marketCreateDTO.profilePicture,
                    ownerId: marketCreateDTO.ownerId,
                    managersIds: marketCreateDTO.managersIds || [],
                }
            });

            // Atualizar o endereço para associar ao mercado
            await tx.address.update({
                where: { id: address.id },
                data: { marketId: createdMarket.id }
            });

            return createdMarket;
        });

        return market;
    }

    async getMarkets(page: number, size: number, name?: string, address?: string, ownerId?: string, managersIds?: string[]) {
        const count = await marketRepository.count(name, address, ownerId, managersIds);
        const markets = await marketRepository.getMarkets(page, size, name, address, ownerId, managersIds);
        return new MarketPaginatedResponse(markets, new Meta(page, size, count, Math.ceil(count / size), count));
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
