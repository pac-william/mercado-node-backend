import { Prisma } from "@prisma/client";
import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

class MarketAddressRepository {
    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? prisma;
    }

    async createMarketAddress(addressDTO: AddressDTO, marketId: string, tx?: Prisma.TransactionClient) {
        Logger.repository('MarketAddressRepository', 'createMarketAddress', 'marketId', marketId);
        const client = this.getClient(tx);
        const { isFavorite, isActive, ...marketAddressData } = addressDTO;
        const address = await client.marketAddress.create({
            data: {
                ...marketAddressData,
                marketId,
            },
        });
        return address;
    }

    async getMarketAddressByMarketId(marketId: string) {
        Logger.repository('MarketAddressRepository', 'getMarketAddressByMarketId', 'marketId', marketId);
        return await prisma.marketAddress.findUnique({
            where: { marketId }
        });
    }

    async getMarketAddressById(id: string) {
        Logger.repository('MarketAddressRepository', 'getMarketAddressById', 'id', id);
        return await prisma.marketAddress.findUnique({
            where: { id }
        });
    }

    async updateMarketAddress(id: string, addressDTO: AddressDTO, tx?: Prisma.TransactionClient) {
        const client = this.getClient(tx);
        Logger.repository('MarketAddressRepository', 'updateMarketAddress', 'id', id);
        
        const addressExists = await client.marketAddress.findUnique({
            where: { id }
        });
        
        if (!addressExists) {
            throw new Error("Endereço não encontrado");
        }
        
        const { isFavorite, isActive, ...marketAddressData } = addressDTO;
        const address = await client.marketAddress.update({
            where: { id },
            data: marketAddressData,
        });
        return address;
    }

    async updateMarketAddressPartial(id: string, addressUpdateDTO: AddressUpdateDTO, tx?: Prisma.TransactionClient) {
        const client = this.getClient(tx);
        Logger.repository('MarketAddressRepository', 'updateMarketAddressPartial', 'id', id);
        
        const addressExists = await client.marketAddress.findUnique({
            where: { id }
        });
        
        if (!addressExists) {
            throw new Error("Endereço não encontrado");
        }
        
        const { isFavorite, isActive, ...marketAddressData } = addressUpdateDTO;
        const address = await client.marketAddress.update({
            where: { id },
            data: marketAddressData,
        });
        return address;
    }

    async deleteMarketAddress(id: string, tx?: Prisma.TransactionClient) {
        const client = this.getClient(tx);
        Logger.repository('MarketAddressRepository', 'deleteMarketAddress', 'id', id);
        await client.marketAddress.delete({
            where: { id }
        });
    }
}

export const marketAddressRepository = new MarketAddressRepository();

