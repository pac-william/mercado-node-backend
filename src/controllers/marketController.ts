import { Request, Response } from "express";
import { MarketCreateDTO, MarketDTO, MarketUpdateDTO } from "../dtos/marketDTO";
import { marketService } from "../services/marketService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class MarketController {
    async getMarkets(req: Request, res: Response) {
        Logger.controller('Market', 'getMarkets', 'query', req.query);
        try {
            const { page, size, name, address, ownerId, managersIds } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('name')
                .withString('address')
                .withString('ownerId')
                .withArray('managersIds')
                .build();

            const markets = await marketService.getMarkets(page, size, name, address, ownerId, managersIds);
            Logger.successOperation('MarketController', 'getMarkets');
            return res.status(200).json(markets);
        } catch (error: any) {
            Logger.errorOperation('MarketController', 'getMarkets', error);
            return res.status(500).json({ 
                message: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async createMarket(req: Request, res: Response) {
        Logger.controller('Market', 'createMarket', 'req: Request, res: Response', { body: req.body });
        try {
            const marketCreateDTO = MarketCreateDTO.parse(req.body);
            const market = await marketService.createMarket(marketCreateDTO);
            Logger.successOperation('MarketController', 'createMarket');
            return res.status(201).json(market);
        } catch (error) {
            Logger.errorOperation('MarketController', 'createMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getMarketById(req: Request, res: Response) {
        Logger.controller('Market', 'getMarketById', 'query', req.query);
        try {
            const { id } = req.params;
            const market = await marketService.getMarketById(id);
            Logger.successOperation('MarketController', 'getMarketById');
            return res.status(200).json(market);
        } catch (error) {
            Logger.errorOperation('MarketController', 'getMarketById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMarket(req: Request, res: Response) {
        Logger.controller('Market', 'updateMarket', 'query', req.query);
        try {
            const { id } = req.params;
            const marketDTO = MarketDTO.parse(req.body);
            const market = await marketService.updateMarket(id, marketDTO);
            Logger.successOperation('MarketController', 'updateMarket');
            return res.status(200).json(market);
        } catch (error) {
            Logger.errorOperation('MarketController', 'updateMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMarketPartial(req: Request, res: Response) {
        Logger.controller('Market', 'updateMarketPartial', 'body', req.body);
        try {
            const { id } = req.params;
            const marketUpdateDTO = MarketUpdateDTO.parse(req.body);
            Logger.controller('MarketController', 'updateMarketPartial', `Updating market ${id}`, marketUpdateDTO);
            const market = await marketService.updateMarketPartial(id, marketUpdateDTO);
            Logger.successOperation('MarketController', 'updateMarketPartial');
            return res.status(200).json(market);
        } catch (error) {
            Logger.errorOperation('MarketController', 'updateMarketPartial', error);
            console.error('Error updating market partial:', error);
            if (error instanceof Error) {
                if (error.message === "Endereço não encontrado") {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes("Unique constraint") || error.message.includes("duplicate key")) {
                    return res.status(409).json({ message: "Já existe um mercado com este endereço" });
                }
                if (error.message.includes("Record to update not found")) {
                    return res.status(404).json({ message: "Mercado não encontrado" });
                }
                // Retornar a mensagem de erro específica para debug
                return res.status(500).json({ message: error.message || "Erro interno do servidor" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteMarket(req: Request, res: Response) {
        Logger.controller('Market', 'deleteMarket', 'query', req.query);
        try {
            const { id } = req.params;
            const market = await marketService.deleteMarket(id);
            Logger.successOperation('MarketController', 'deleteMarket');
            return res.status(200).json(market);
        } catch (error) {
            Logger.errorOperation('MarketController', 'deleteMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const marketController = new MarketController();
