import { AddressCreateDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { addressRepository } from "../repositories/addressRepository";
import { Logger } from "../utils/logger";

class AddressService {
    async createAddress(userId: string, addressDTO: AddressCreateDTO) {
        Logger.service('AddressService', 'createAddress', 'userId', userId);
        
        const addressCount = await addressRepository.getAddressCountByUserId(userId);
        if (addressCount >= 3) {
            throw new Error("Limite máximo de 3 endereços por usuário");
        }

        if (addressDTO.isFavorite) {
            await this.unsetAllFavorites(userId);
        }

        const address = await addressRepository.createAddress(userId, addressDTO);
        Logger.successOperation('AddressService', 'createAddress', address.id);
        return address;
    }

    async getAddressesByUserId(userId: string, page: number = 1, size: number = 10) {
        Logger.service('AddressService', 'getAddressesByUserId', 'userId', userId);
        
        const addresses = await addressRepository.getAddressesByUserId(userId, page, size);
        const total = await addressRepository.getAddressCountByUserId(userId);
        const favorites = addresses.filter(addr => addr.isFavorite).length;
        const active = addresses.filter(addr => addr.isActive).length;
        
        Logger.successOperation('AddressService', 'getAddressesByUserId', `${addresses.length} addresses found`);
        return { addresses, total, favorites, active };
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

    async updateAddress(id: string, userId: string, addressDTO: AddressCreateDTO) {
        Logger.service('AddressService', 'updateAddress', 'id', id);
        
        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        if (addressDTO.isFavorite) {
            await this.unsetAllFavorites(userId);
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

        if (addressUpdateDTO.isFavorite) {
            await this.unsetAllFavorites(userId);
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

    async setFavoriteAddress(id: string, userId: string, isFavorite: boolean) {
        Logger.service('AddressService', 'setFavoriteAddress', 'id', id);
        
        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        if (isFavorite) {
            await this.unsetAllFavorites(userId);
        }

        const address = await addressRepository.setFavoriteAddress(id, userId, isFavorite);
        Logger.successOperation('AddressService', 'setFavoriteAddress', address.id);
        return address;
    }

    async getFavoriteAddressByUserId(userId: string) {
        Logger.service('AddressService', 'getFavoriteAddressByUserId', 'userId', userId);
        
        const address = await addressRepository.getFavoriteAddressByUserId(userId);
        Logger.successOperation('AddressService', 'getFavoriteAddressByUserId', address ? address.id : 'none');
        return address;
    }

    async getActiveAddressesByUserId(userId: string) {
        Logger.service('AddressService', 'getActiveAddressesByUserId', 'userId', userId);
        
        const addresses = await addressRepository.getActiveAddressesByUserId(userId);
        Logger.successOperation('AddressService', 'getActiveAddressesByUserId', `${addresses.length} addresses found`);
        return addresses;
    }

    async validateZipCode(zipCode: string) {
        const zipCodeRegex = /^\d{5}-?\d{3}$/;
        if (!zipCodeRegex.test(zipCode)) {
            throw new Error("CEP deve ter formato válido (00000-000)");
        }
        return true;
    }

    async validateAddressLimit(userId: string) {
        const addressCount = await addressRepository.getAddressCountByUserId(userId);
        if (addressCount >= 3) {
            throw new Error("Limite máximo de 3 endereços por usuário");
        }
        return true;
    }

    private async unsetAllFavorites(userId: string) {
        await addressRepository.setFavoriteAddress('', userId, false);
    }

    async getAddressesByZipCode(zipCode: string) {
        Logger.service('AddressService', 'getAddressesByZipCode', 'zipCode', zipCode);
        
        await this.validateZipCode(zipCode);
        const addresses = await addressRepository.getAddressesByZipCode(zipCode);
        Logger.successOperation('AddressService', 'getAddressesByZipCode', `${addresses.length} addresses found`);
        return addresses;
    }

    async getAddressesByCity(city: string, state: string) {
        Logger.service('AddressService', 'getAddressesByCity', 'city', city);
        
        const addresses = await addressRepository.getAddressesByCity(city, state);
        Logger.successOperation('AddressService', 'getAddressesByCity', `${addresses.length} addresses found`);
        return addresses;
    }
}

export const addressService = new AddressService();
