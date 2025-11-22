import { Request, Response } from "express";
import { AddressDTO, AddressUpdateDTO } from "../dtos/addressDTO";
import { marketAddressService } from "../services/marketAddressService";
import { Logger } from "../utils/logger";

export class MarketAddressController {
    async createMarketAddress(req: Request, res: Response) {
        Logger.controller('MarketAddress', 'createMarketAddress', 'body', req.body);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { marketId } = req.params;
            const addressDTO = AddressDTO.parse(req.body);
            const address = await marketAddressService.createMarketAddress(addressDTO, marketId);
            Logger.successOperation('MarketAddressController', 'createMarketAddress');
            return res.status(201).json(address);
        } catch (error) {
            Logger.errorOperation('MarketAddressController', 'createMarketAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getMarketAddressByMarketId(req: Request, res: Response) {
        Logger.controller('MarketAddress', 'getMarketAddressByMarketId', 'params', req.params);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { marketId } = req.params;
            const address = await marketAddressService.getMarketAddressByMarketId(marketId);
            Logger.successOperation('MarketAddressController', 'getMarketAddressByMarketId');
            return res.status(200).json(address);
        } catch (error) {
            Logger.errorOperation('MarketAddressController', 'getMarketAddressByMarketId', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getMarketAddressById(req: Request, res: Response) {
        Logger.controller('MarketAddress', 'getMarketAddressById', 'params', req.params);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const address = await marketAddressService.getMarketAddressById(id);
            Logger.successOperation('MarketAddressController', 'getMarketAddressById');
            return res.status(200).json(address);
        } catch (error) {
            Logger.errorOperation('MarketAddressController', 'getMarketAddressById', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMarketAddress(req: Request, res: Response) {
        Logger.controller('MarketAddress', 'updateMarketAddress', 'body', req.body);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const addressDTO = AddressDTO.parse(req.body);
            const address = await marketAddressService.updateMarketAddress(id, addressDTO);
            Logger.successOperation('MarketAddressController', 'updateMarketAddress');
            return res.status(200).json(address);
        } catch (error) {
            Logger.errorOperation('MarketAddressController', 'updateMarketAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMarketAddressPartial(req: Request, res: Response) {
        Logger.controller('MarketAddress', 'updateMarketAddressPartial', 'body', req.body);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            const addressUpdateDTO = AddressUpdateDTO.parse(req.body);
            const address = await marketAddressService.updateMarketAddressPartial(id, addressUpdateDTO);
            Logger.successOperation('MarketAddressController', 'updateMarketAddressPartial');
            return res.status(200).json(address);
        } catch (error) {
            Logger.errorOperation('MarketAddressController', 'updateMarketAddressPartial', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteMarketAddress(req: Request, res: Response) {
        Logger.controller('MarketAddress', 'deleteMarketAddress', 'params', req.params);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { id } = req.params;
            await marketAddressService.deleteMarketAddress(id);
            Logger.successOperation('MarketAddressController', 'deleteMarketAddress');
            return res.status(204).send();
        } catch (error) {
            Logger.errorOperation('MarketAddressController', 'deleteMarketAddress', error);
            if (error instanceof Error && error.message === "Endereço não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const marketAddressController = new MarketAddressController();

