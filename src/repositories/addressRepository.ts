import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

class AddressRepository {
    async createAddress(userId: string, addressDTO: AddressDTO) {
        Logger.repository('AddressRepository', 'createAddress', 'userId', userId);
        const address = await prisma.address.create({
            data: {
                ...addressDTO,
                userId,
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

    async updateAddress(id: string, userId: string, addressDTO: AddressDTO) {
        const address = await prisma.address.update({
            where: {
                id,
                userId
            },
            data: addressDTO,
        });
        return address;
    }

    async updateAddressPartial(id: string, userId: string, addressDTO: AddressUpdateDTO) {
        const address = await prisma.address.update({
            where: {
                id,
                userId
            },
            data: addressDTO,
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
}

export const addressRepository = new AddressRepository();
