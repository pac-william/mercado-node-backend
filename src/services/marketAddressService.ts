import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { marketAddressRepository } from "../repositories/marketAddressRepository";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

class MarketAddressService {
    async createMarketAddress(addressDTO: AddressDTO, marketId: string) {
        Logger.service('MarketAddressService', 'createMarketAddress', 'marketId', marketId);

        const address = await marketAddressRepository.createMarketAddress(addressDTO, marketId);
        Logger.successOperation('MarketAddressService', 'createMarketAddress', address.id);
        return address;
    }

    async getMarketAddressByMarketId(marketId: string) {
        Logger.service('MarketAddressService', 'getMarketAddressByMarketId', 'marketId', marketId);
        const address = await marketAddressRepository.getMarketAddressByMarketId(marketId);
        if (!address) {
            throw new Error("Endereço não encontrado");
        }
        Logger.successOperation('MarketAddressService', 'getMarketAddressByMarketId', address.id);
        return address;
    }

    async getMarketAddressById(id: string) {
        Logger.service('MarketAddressService', 'getMarketAddressById', 'id', id);
        const address = await marketAddressRepository.getMarketAddressById(id);
        if (!address) {
            throw new Error("Endereço não encontrado");
        }
        Logger.successOperation('MarketAddressService', 'getMarketAddressById', address.id);
        return address;
    }

    async updateMarketAddress(id: string, addressDTO: AddressDTO) {
        Logger.service('MarketAddressService', 'updateMarketAddress', 'id', id);

        const existingAddress = await marketAddressRepository.getMarketAddressById(id);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await marketAddressRepository.updateMarketAddress(id, addressDTO);
        Logger.successOperation('MarketAddressService', 'updateMarketAddress', address.id);
        return address;
    }

    async updateMarketAddressPartial(id: string, addressUpdateDTO: AddressUpdateDTO) {
        Logger.service('MarketAddressService', 'updateMarketAddressPartial', 'id', id);

        const existingAddress = await marketAddressRepository.getMarketAddressById(id);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await marketAddressRepository.updateMarketAddressPartial(id, addressUpdateDTO);
        Logger.successOperation('MarketAddressService', 'updateMarketAddressPartial', address.id);
        return address;
    }

    async deleteMarketAddress(id: string) {
        Logger.service('MarketAddressService', 'deleteMarketAddress', 'id', id);
        await marketAddressRepository.deleteMarketAddress(id);
        Logger.successOperation('MarketAddressService', 'deleteMarketAddress', id);
    }
}

export const marketAddressService = new MarketAddressService();





