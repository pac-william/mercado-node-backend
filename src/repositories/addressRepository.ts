import { Prisma } from "@prisma/client";
import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

class AddressRepository {
    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? prisma;
    }

    async createAddress(addressDTO: AddressDTO, userId?: string | null, tx?: Prisma.TransactionClient) {
        Logger.repository('AddressRepository', 'createAddress', 'userId', userId || 'market');
        const client = this.getClient(tx);
        const address = await client.address.create({
            data: {
                ...addressDTO,
                userId: userId ?? null,
                marketId: userId ? null : null, // Será atualizado após criar o mercado se for mercado
            },
        });
        return address;
    }

    async getAddressesByUserId(userId: string, page: number = 1, size: number = 10) {
        const addresses = await prisma.address.findMany({
            where: { userId },
            skip: (page - 1) * size,
            take: size,
            orderBy: [
                { isFavorite: 'desc' },
                { createdAt: 'desc' }
            ],
        });
        return addresses;
    }

    async getAddressById(id: string, userId?: string) {
        if (userId) {
            return await prisma.address.findFirst({
                where: {
                    id,
                    userId
                },
            });
        }
        return await prisma.address.findUnique({
            where: { id }
        });
    }

    async getAddressCountByUserId(userId: string) {
        Logger.repository('AddressRepository', 'getAddressCountByUserId', 'userId', userId);
        const count = await prisma.address.count({
            where: { userId }
        });
        return count;
    }

    async updateAddress(id: string, addressDTO: AddressDTO, userId?: string | null, tx?: Prisma.TransactionClient) {
        const client = this.getClient(tx);
        // Se userId for fornecido, verificar que o endereço pertence ao usuário
        // Se não, atualizar diretamente (pode ser endereço de mercado)
        const whereClause = userId 
            ? { id, userId }
            : { id };
            
        const address = await client.address.update({
            where: whereClause,
            data: addressDTO,
        });
        return address;
    }

    async updateAddressPartial(id: string, addressUpdateDTO: AddressUpdateDTO, userId?: string | null, tx?: Prisma.TransactionClient) {
        const client = this.getClient(tx);
        const whereClause = userId 
            ? { id, userId }
            : { id };
            
        const address = await client.address.update({
            where: whereClause,
            data: addressUpdateDTO,
        });
        return address;
    }

    async deleteAddress(id: string, userId: string) {
        const address = await prisma.address.delete({
            where: {
                id,
                userId
            },
        });
        return address;
    }

    async unsetFavorite(userId: string, tx?: Prisma.TransactionClient) {
        const client = this.getClient(tx);
        await client.address.updateMany({
            where: {
                userId,
                isFavorite: true,
            },
            data: {
                isFavorite: false,
            },
        });
    }
}

export const addressRepository = new AddressRepository();
