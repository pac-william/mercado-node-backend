import { Request, Response } from "express";
import { MarketDTO, MarketUpdateDTO, toMarketResponseDTO } from "../dtos/marketDTO";
import { marketService } from "../services/marketService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class MarketController {
    async getMarkets(req: Request, res: Response) {
        Logger.controller('Market', 'getMarkets', 'query', req.query);
        try {
            const { page, size, name, address } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('name')
                .withString('address')
                .build();

            const markets = await marketService.getMarkets(page, size, name, address);
            Logger.successOperation('MarketController', 'getMarkets');
            return res.status(200).json({
                markets: markets.markets.map(toMarketResponseDTO),
                meta: markets.meta,
            });
        } catch (error) {
            Logger.errorOperation('MarketController', 'getMarkets', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createMarket(req: Request, res: Response) {
        Logger.controller('Market', 'createMarket', 'req: Request, res: Response', { body: req.body });
        try {
            const marketDTO = MarketDTO.parse(req.body);
            const market = await marketService.createMarket(marketDTO);
            Logger.successOperation('MarketController', 'createMarket');
            return res.status(201).json(toMarketResponseDTO(market));
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
            return res.status(200).json(toMarketResponseDTO(market));
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
            return res.status(200).json(toMarketResponseDTO(market));
        } catch (error) {
            Logger.errorOperation('MarketController', 'updateMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMarketPartial(req: Request, res: Response) {
        Logger.controller('Market', 'updateMarketPartial', 'query', req.query);
        try {
            const { id } = req.params;
            const marketUpdateDTO = MarketUpdateDTO.parse(req.body);
            const market = await marketService.updateMarketPartial(id, marketUpdateDTO);
            Logger.successOperation('MarketController', 'updateMarketPartial');
            return res.status(200).json(toMarketResponseDTO(market));
        } catch (error) {
            Logger.errorOperation('MarketController', 'updateMarketPartial', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteMarket(req: Request, res: Response) {
        Logger.controller('Market', 'deleteMarket', 'query', req.query);
        try {
            const { id } = req.params;
            const market = await marketService.deleteMarket(id);
            Logger.successOperation('MarketController', 'deleteMarket');
            return res.status(200).json(toMarketResponseDTO(market));
        } catch (error) {
            Logger.errorOperation('MarketController', 'deleteMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const marketController = new MarketController();
