import { Request, Response } from "express";
import { AddressCreateDTO, AddressUpdateDTO, toAddressResponseDTO, toAddressListResponseDTO } from "../dtos/addressDTO";
import { addressService } from "../services/addressService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class AddressController {
    async getAddresses(req: Request, res: Response) {
        Logger.controller('Address', 'getAddresses', 'query', req.query);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { page, size } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .build();

            const result = await addressService.getAddressesByUserId(userId, page, size);
            Logger.successOperation('AddressController', 'getAddresses');
            return res.status(200).json(toAddressListResponseDTO(result.addresses, result.total, result.favorites, result.active));
        } catch (error) {
            Logger.errorOperation('AddressController', 'getAddresses', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createAddress(req: Request, res: Response) {
        Logger.controller('Address', 'createAddress', 'body', req.body);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const addressDTO = AddressCreateDTO.parse(req.body);
            const address = await addressService.createAddress(userId, addressDTO);
            Logger.successOperation('AddressController', 'createAddress', address.id);
            return res.status(201).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'createAddress', error);
            if (error instanceof Error && error.message === "Limite máximo de 3 endereços por usuário") {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getAddressById(req: Request, res: Response) {
        Logger.controller('Address', 'getAddressById', 'params', req.params);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const address = await addressService.getAddressById(id, userId);
            Logger.successOperation('AddressController', 'getAddressById', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'getAddressById', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateAddress(req: Request, res: Response) {
        Logger.controller('Address', 'updateAddress', 'body', req.body);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const addressDTO = AddressCreateDTO.parse(req.body);
            const address = await addressService.updateAddress(id, userId, addressDTO);
            Logger.successOperation('AddressController', 'updateAddress', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'updateAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateAddressPartial(req: Request, res: Response) {
        Logger.controller('Address', 'updateAddressPartial', 'body', req.body);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const addressUpdateDTO = AddressUpdateDTO.parse(req.body);
            const address = await addressService.updateAddressPartial(id, userId, addressUpdateDTO);
            Logger.successOperation('AddressController', 'updateAddressPartial', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'updateAddressPartial', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteAddress(req: Request, res: Response) {
        Logger.controller('Address', 'deleteAddress', 'params', req.params);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const address = await addressService.deleteAddress(id, userId);
            Logger.successOperation('AddressController', 'deleteAddress', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'deleteAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async setFavoriteAddress(req: Request, res: Response) {
        Logger.controller('Address', 'setFavoriteAddress', 'body', req.body);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const { isFavorite } = req.body;
            const address = await addressService.setFavoriteAddress(id, userId, isFavorite);
            Logger.successOperation('AddressController', 'setFavoriteAddress', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'setFavoriteAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getFavoriteAddress(req: Request, res: Response) {
        Logger.controller('Address', 'getFavoriteAddress', 'query', req.query);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const address = await addressService.getFavoriteAddressByUserId(userId);
            Logger.successOperation('AddressController', 'getFavoriteAddress', address ? address.id : 'none');
            return res.status(200).json(address ? toAddressResponseDTO(address) : null);
        } catch (error) {
            Logger.errorOperation('AddressController', 'getFavoriteAddress', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getActiveAddresses(req: Request, res: Response) {
        Logger.controller('Address', 'getActiveAddresses', 'query', req.query);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const addresses = await addressService.getActiveAddressesByUserId(userId);
            Logger.successOperation('AddressController', 'getActiveAddresses', `${addresses.length} addresses found`);
            return res.status(200).json(addresses.map(toAddressResponseDTO));
        } catch (error) {
            Logger.errorOperation('AddressController', 'getActiveAddresses', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async searchByZipCode(req: Request, res: Response) {
        Logger.controller('Address', 'searchByZipCode', 'params', req.params);
        try {
            const { zipCode } = req.params;
            const result = await addressService.searchByZipCode(zipCode);
            Logger.successOperation('AddressController', 'searchByZipCode', zipCode);
            return res.status(200).json(result);
        } catch (error) {
            Logger.errorOperation('AddressController', 'searchByZipCode', error);
            if (error instanceof Error && error.message.includes("CEP não encontrado")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async validateAddress(req: Request, res: Response) {
        Logger.controller('Address', 'validateAddress', 'body', req.body);
        try {
            const result = await addressService.validateAddress(req.body);
            Logger.successOperation('AddressController', 'validateAddress', result.isValid ? 'valid' : 'invalid');
            return res.status(200).json(result);
        } catch (error) {
            Logger.errorOperation('AddressController', 'validateAddress', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getAddressHistory(req: Request, res: Response) {
        Logger.controller('Address', 'getAddressHistory', 'params', req.params);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const result = await addressService.getAddressHistory(userId, id);
            Logger.successOperation('AddressController', 'getAddressHistory', id);
            return res.status(200).json(result);
        } catch (error) {
            Logger.errorOperation('AddressController', 'getAddressHistory', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async softDeleteAddress(req: Request, res: Response) {
        Logger.controller('Address', 'softDeleteAddress', 'params', req.params);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const address = await addressService.softDeleteAddress(id, userId);
            Logger.successOperation('AddressController', 'softDeleteAddress', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'softDeleteAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async restoreAddress(req: Request, res: Response) {
        Logger.controller('Address', 'restoreAddress', 'params', req.params);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const address = await addressService.restoreAddress(id, userId);
            Logger.successOperation('AddressController', 'restoreAddress', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'restoreAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getAddressWithGeolocation(req: Request, res: Response) {
        Logger.controller('Address', 'getAddressWithGeolocation', 'params', req.params);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const address = await addressService.getAddressWithGeolocation(id, userId);
            Logger.successOperation('AddressController', 'getAddressWithGeolocation', address.id);
            return res.status(200).json(toAddressResponseDTO(address));
        } catch (error) {
            Logger.errorOperation('AddressController', 'getAddressWithGeolocation', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getAddressesNearby(req: Request, res: Response) {
        Logger.controller('Address', 'getAddressesNearby', 'query', req.query);
        try {
            const { latitude, longitude, radius } = req.query;
            const lat = parseFloat(latitude as string);
            const lng = parseFloat(longitude as string);
            const rad = radius ? parseFloat(radius as string) : 5;

            if (isNaN(lat) || isNaN(lng)) {
                return res.status(400).json({ message: "Latitude e longitude são obrigatórios" });
            }

            const addresses = await addressService.getAddressesNearby(lat, lng, rad);
            Logger.successOperation('AddressController', 'getAddressesNearby', `${addresses.length} addresses found`);
            return res.status(200).json(addresses.map(toAddressResponseDTO));
        } catch (error) {
            Logger.errorOperation('AddressController', 'getAddressesNearby', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const addressController = new AddressController();
