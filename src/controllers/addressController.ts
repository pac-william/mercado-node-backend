import { Request, Response } from "express";
import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { addressRepository } from "../repositories/addressRepository";
import { addressService } from "../services/addressService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class AddressController {
    async getAddresses(req: Request, res: Response) {
        Logger.controller('Address', 'getAddresses', 'query', req.query);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { page, size } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .build();

            const data = await addressService.getAddressesByUserId(userId, page, size);
            Logger.successOperation('AddressController', 'getAddresses');
            return res.status(200).json(data);
        } catch (error) {
            Logger.errorOperation('AddressController', 'getAddresses', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createAddress(req: Request, res: Response) {
        Logger.controller('Address', 'createAddress', 'body', req.body);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const addressDTO = AddressDTO.parse(req.body);
            const address = await addressService.createAddress(addressDTO, userId);
            Logger.successOperation('AddressController', 'createAddress');
            return res.status(201).json(address);
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
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { id } = req.params;
            const address = await addressService.getAddressById(id, userId);
            Logger.successOperation('AddressController', 'getAddressById');
            return res.status(200).json(address);
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
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { id } = req.params;
            const addressDTO = AddressDTO.parse(req.body);
            
            // Verificar se é endereço de usuário ou mercado
            const existingAddress = await addressRepository.getAddressById(id);
            if (!existingAddress) {
                return res.status(404).json({ message: "Endereço não encontrado" });
            }
            
            // Se é endereço de mercado, atualizar sem userId
            // Se é endereço de usuário, atualizar com userId
            const addressUserId = existingAddress.userId ? userId : undefined;
            const address = await addressService.updateAddress(id, addressDTO, addressUserId);
            Logger.successOperation('AddressController', 'updateAddress');
            return res.status(200).json(address);
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
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { id } = req.params;
            const addressUpdateDTO = AddressUpdateDTO.parse(req.body);
            
            // Verificar se é endereço de usuário ou mercado
            const existingAddress = await addressRepository.getAddressById(id);
            if (!existingAddress) {
                return res.status(404).json({ message: "Endereço não encontrado" });
            }
            
            // Se é endereço de mercado, atualizar sem userId
            // Se é endereço de usuário, atualizar com userId
            const addressUserId = existingAddress.userId ? userId : undefined;
            const address = await addressService.updateAddressPartial(id, addressUpdateDTO, addressUserId);
            Logger.successOperation('AddressController', 'updateAddressPartial');
            return res.status(200).json(address);
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
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { id } = req.params;
            const address = await addressService.deleteAddress(id, userId);
            Logger.successOperation('AddressController', 'deleteAddress');
            return res.status(200).json(address);
        } catch (error) {
            Logger.errorOperation('AddressController', 'deleteAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const addressController = new AddressController();
