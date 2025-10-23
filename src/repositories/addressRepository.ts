import { AddressCreateDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { prisma } from "../utils/prisma";

class AddressRepository {
    async createAddress(userId: string, addressDTO: AddressCreateDTO) {
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

    async getAddressById(id: string, userId: string) {
        const address = await prisma.address.findFirst({
            where: { 
                id,
                userId 
            },
        });
        return address;
    }

    async updateAddress(id: string, userId: string, addressDTO: AddressCreateDTO) {
        const address = await prisma.address.update({
            where: { 
                id,
                userId 
            },
            data: addressDTO,
        });
        return address;
    }

    async updateAddressPartial(id: string, userId: string, addressUpdateDTO: AddressUpdateDTO) {
        const address = await prisma.address.update({
            where: { 
                id,
                userId 
            },
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

    async getAddressCountByUserId(userId: string) {
        const count = await prisma.address.count({
            where: { userId },
        });
        return count;
    }

    async getFavoriteAddressByUserId(userId: string) {
        const address = await prisma.address.findFirst({
            where: { 
                userId,
                isFavorite: true,
                isActive: true 
            },
        });
        return address;
    }

    async setFavoriteAddress(id: string, userId: string, isFavorite: boolean) {
        if (isFavorite) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isFavorite: false },
            });
        }

        const address = await prisma.address.update({
            where: { 
                id,
                userId 
            },
            data: { isFavorite },
        });
        return address;
    }

    async getActiveAddressesByUserId(userId: string) {
        const addresses = await prisma.address.findMany({
            where: { 
                userId,
                isActive: true 
            },
            orderBy: [
                { isFavorite: 'desc' },
                { createdAt: 'desc' }
            ],
        });
        return addresses;
    }

    async getAddressesByZipCode(zipCode: string) {
        const addresses = await prisma.address.findMany({
            where: { zipCode },
        });
        return addresses;
    }

    async getAddressesByCity(city: string, state: string) {
        const addresses = await prisma.address.findMany({
            where: { 
                city,
                state 
            },
        });
        return addresses;
    }
}

export const addressRepository = new AddressRepository();
