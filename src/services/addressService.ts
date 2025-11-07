import { AddressPaginatedResponse } from "../domain/addressDomain";
import { Meta } from "../domain/metaDomain";
import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { addressRepository } from "../repositories/addressRepository";
import { Logger } from "../utils/logger";

class AddressService {
    async createAddress(userId: string, addressDTO: AddressDTO) {
        Logger.service('AddressService', 'createAddress', 'userId', userId);

        const addressCount = await addressRepository.getAddressCountByUserId(userId);
        if (addressCount >= 3) {
            throw new Error("Limite máximo de 3 endereços por usuário");
        }

        const address = await addressRepository.createAddress(userId, addressDTO);
        Logger.successOperation('AddressService', 'createAddress', address.id);
        return address;
    }

    async getAddressesByUserId(userId: string, page: number = 1, size: number = 10): Promise<AddressPaginatedResponse> {
        Logger.service('AddressService', 'getAddressesByUserId', 'userId', userId);

        const addresses = await addressRepository.getAddressesByUserId(userId, page, size);
        const total = await addressRepository.getAddressCountByUserId(userId);
        const favorites = addresses.filter((addr: any) => addr.isFavorite).length;
        const active = addresses.filter((addr: any) => addr.isActive).length;

        Logger.successOperation('AddressService', 'getAddressesByUserId', `${addresses.length} addresses found`);
        return new AddressPaginatedResponse(addresses, new Meta(page, size, total, Math.ceil(total / size), total));
    }

    async getAddressById(id: string, userId: string) {
        Logger.service('AddressService', 'getAddressById', 'id', id);

        const address = await addressRepository.getAddressById(id, userId);
        if (!address) {
            throw new Error("Endereço não encontrado");
        }

        Logger.successOperation('AddressService', 'getAddressById', address.id);
        return address;
    }

    async updateAddress(id: string, userId: string, addressDTO: AddressDTO) {
        Logger.service('AddressService', 'updateAddress', 'id', id);

        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await addressRepository.updateAddress(id, userId, addressDTO);
        Logger.successOperation('AddressService', 'updateAddress', address.id);
        return address;
    }

    async updateAddressPartial(id: string, userId: string, addressUpdateDTO: AddressUpdateDTO) {
        Logger.service('AddressService', 'updateAddressPartial', 'id', id);

        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await addressRepository.updateAddressPartial(id, userId, addressUpdateDTO);
        Logger.successOperation('AddressService', 'updateAddressPartial', address.id);
        return address;
    }

    async deleteAddress(id: string, userId: string) {
        Logger.service('AddressService', 'deleteAddress', 'id', id);

        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await addressRepository.deleteAddress(id, userId);
        Logger.successOperation('AddressService', 'deleteAddress', address.id);
        return address;
    }
}

export const addressService = new AddressService();
