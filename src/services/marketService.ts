import { MarketPaginatedResponse } from "../domain/marketDomain";
import { Meta } from "../domain/metaDomain";
import { MarketDTO, MarketUpdateDTO } from "../dtos/index";
import { marketRepository } from "../repositories/marketRepository";

class MarketService {
    async createMarket(marketDTO: MarketDTO) {
        return await marketRepository.createMarket(marketDTO);
    }

    async getMarkets(page: number, size: number, name?: string, address?: string) {
        const count = await marketRepository.count(name, address);
        const markets = await marketRepository.getMarkets(page, size, name, address);
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
