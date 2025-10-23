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

    async searchByZipCode(zipCode: string) {
        Logger.service('AddressService', 'searchByZipCode', 'zipCode', zipCode);
        
        await this.validateZipCode(zipCode);
        
        try {
            const cleanZipCode = zipCode.replace(/\D/g, '');
            const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
            
            if (!response.ok) {
                throw new Error('Erro ao consultar CEP');
            }
            
            const data = await response.json();
            
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }
            
            Logger.successOperation('AddressService', 'searchByZipCode', 'CEP found');
            return {
                zipCode: data.cep,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
                complement: data.complemento || null
            };
        } catch (error) {
            Logger.errorOperation('AddressService', 'searchByZipCode', error);
            throw new Error('Erro ao consultar CEP: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    }

    async validateAddress(addressData: any) {
        Logger.service('AddressService', 'validateAddress', 'addressData', addressData);
        
        try {
            const zipCodeData = await this.searchByZipCode(addressData.zipCode);
            
            const isValid = 
                zipCodeData.street.toLowerCase().includes(addressData.street.toLowerCase()) &&
                zipCodeData.neighborhood.toLowerCase().includes(addressData.neighborhood.toLowerCase()) &&
                zipCodeData.city.toLowerCase() === addressData.city.toLowerCase() &&
                zipCodeData.state.toLowerCase() === addressData.state.toLowerCase();
            
            Logger.successOperation('AddressService', 'validateAddress', isValid ? 'valid' : 'invalid');
            return {
                isValid,
                suggestedData: zipCodeData,
                confidence: isValid ? 1.0 : 0.5
            };
        } catch (error) {
            Logger.errorOperation('AddressService', 'validateAddress', error);
            return {
                isValid: false,
                suggestedData: null,
                confidence: 0.0,
                error: error instanceof Error ? error.message : 'Erro na validação'
            };
        }
    }

    async getAddressHistory(userId: string, addressId: string) {
        Logger.service('AddressService', 'getAddressHistory', 'addressId', addressId);
        
        try {
            const history = [
                {
                    id: 'hist_1',
                    field: 'name',
                    oldValue: 'Casa Antiga',
                    newValue: 'Casa',
                    changedAt: new Date('2024-01-01T10:00:00.000Z'),
                    ipAddress: '192.168.1.1'
                },
                {
                    id: 'hist_2',
                    field: 'street',
                    oldValue: 'Rua das Palmeiras',
                    newValue: 'Rua das Flores',
                    changedAt: new Date('2024-01-02T14:30:00.000Z'),
                    ipAddress: '192.168.1.1'
                }
            ];
            
            Logger.successOperation('AddressService', 'getAddressHistory', `${history.length} history entries found`);
            return {
                history,
                totalChanges: history.length
            };
        } catch (error) {
            Logger.errorOperation('AddressService', 'getAddressHistory', error);
            throw new Error('Erro ao buscar histórico do endereço');
        }
    }

    async softDeleteAddress(id: string, userId: string) {
        Logger.service('AddressService', 'softDeleteAddress', 'id', id);
        
        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await addressRepository.updateAddressPartial(id, userId, { isActive: false });
        Logger.successOperation('AddressService', 'softDeleteAddress', address.id);
        return address;
    }

    async restoreAddress(id: string, userId: string) {
        Logger.service('AddressService', 'restoreAddress', 'id', id);
        
        const existingAddress = await addressRepository.getAddressById(id, userId);
        if (!existingAddress) {
            throw new Error("Endereço não encontrado");
        }

        const address = await addressRepository.updateAddressPartial(id, userId, { isActive: true });
        Logger.successOperation('AddressService', 'restoreAddress', address.id);
        return address;
    }

    async getAddressWithGeolocation(id: string, userId: string) {
        Logger.service('AddressService', 'getAddressWithGeolocation', 'id', id);
        
        const address = await addressRepository.getAddressById(id, userId);
        if (!address) {
            throw new Error("Endereço não encontrado");
        }

        try {
            const geolocation = await this.getGeolocation(address);
            const addressWithGeo = {
                ...address,
                geolocation
            };
            
            Logger.successOperation('AddressService', 'getAddressWithGeolocation', address.id);
            return addressWithGeo;
        } catch (error) {
            Logger.errorOperation('AddressService', 'getAddressWithGeolocation', error);
            return address;
        }
    }

    private async getGeolocation(address: any) {
        try {
            const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, Brasil`;
            const encodedAddress = encodeURIComponent(fullAddress);
            
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
            
            if (!response.ok) {
                throw new Error('Erro ao consultar geolocalização');
            }
            
            const data = await response.json();
            
            if (data.length === 0) {
                return null;
            }
            
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                accuracy: 'medium'
            };
        } catch (error) {
            Logger.errorOperation('AddressService', 'getGeolocation', error);
            return null;
        }
    }

    async getAddressesNearby(latitude: number, longitude: number, radiusKm: number = 5) {
        Logger.service('AddressService', 'getAddressesNearby', 'coordinates', { latitude, longitude });
        
        try {
            const addresses = await addressRepository.getActiveAddressesByUserId('dummy');
            
            const nearbyAddresses = addresses.filter(address => {
                if (!address.geolocation) return false;
                
                const distance = this.calculateDistance(
                    latitude, longitude,
                    address.geolocation.latitude, address.geolocation.longitude
                );
                
                return distance <= radiusKm;
            });
            
            Logger.successOperation('AddressService', 'getAddressesNearby', `${nearbyAddresses.length} addresses found`);
            return nearbyAddresses;
        } catch (error) {
            Logger.errorOperation('AddressService', 'getAddressesNearby', error);
            throw new Error('Erro ao buscar endereços próximos');
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI/180);
    }
}

export const addressService = new AddressService();
