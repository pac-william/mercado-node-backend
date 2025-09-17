import { Request, Response } from "express";
import { DelivererDTO, DelivererUpdateDTO, toDelivererResponseDTO } from "../dtos/delivererDTO";
import { delivererService } from "../services/delivererService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class DelivererController {
    async getDeliverers(req: Request, res: Response) {
        Logger.controller('Deliverer', 'getDeliverers', 'query', req.query);
        try {
            const { page, size, status } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('status')
                .build();

            const deliverers = await delivererService.getDeliverers(page, size, status);
            Logger.successOperation('DelivererController', 'getDeliverers');
            return res.status(200).json({
                deliverers: deliverers.deliverers.map(toDelivererResponseDTO),
                meta: deliverers.meta,
            });
        } catch (error) {
            Logger.errorOperation('DelivererController', 'getDeliverers', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createDeliverer(req: Request, res: Response) {
        Logger.controller('Deliverer', 'createDeliverer', 'body', req.body);
        try {
            const delivererDTO = DelivererDTO.parse(req.body);
            const deliverer = await delivererService.createDeliverer(delivererDTO);
            Logger.successOperation('DelivererController', 'createDeliverer');
            return res.status(201).json(toDelivererResponseDTO(deliverer));
        } catch (error) {
            Logger.errorOperation('DelivererController', 'createDeliverer', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getDelivererById(req: Request, res: Response) {
        Logger.controller('Deliverer', 'getDelivererById', 'params', req.params);
        try {
            const { id } = req.params;
            const deliverer = await delivererService.getDelivererById(id);
            if (!deliverer) {
                return res.status(404).json({ message: "Entregador não encontrado" });
            }
            Logger.successOperation('DelivererController', 'getDelivererById');
            return res.status(200).json(toDelivererResponseDTO(deliverer));
        } catch (error) {
            Logger.errorOperation('DelivererController', 'getDelivererById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateDeliverer(req: Request, res: Response) {
        Logger.controller('Deliverer', 'updateDeliverer', 'params', req.params);
        try {
            const { id } = req.params;
            const delivererDTO = DelivererDTO.parse(req.body);
            const deliverer = await delivererService.updateDeliverer(id, delivererDTO);
            Logger.successOperation('DelivererController', 'updateDeliverer');
            return res.status(200).json(toDelivererResponseDTO(deliverer));
        } catch (error) {
            Logger.errorOperation('DelivererController', 'updateDeliverer', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateDelivererPartial(req: Request, res: Response) {
        Logger.controller('Deliverer', 'updateDelivererPartial', 'params', req.params);
        try {
            const { id } = req.params;
            const delivererUpdateDTO = DelivererUpdateDTO.parse(req.body);
            const deliverer = await delivererService.updateDelivererPartial(id, delivererUpdateDTO);
            Logger.successOperation('DelivererController', 'updateDelivererPartial');
            return res.status(200).json(toDelivererResponseDTO(deliverer));
        } catch (error) {
            Logger.errorOperation('DelivererController', 'updateDelivererPartial', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteDeliverer(req: Request, res: Response) {
        Logger.controller('Deliverer', 'deleteDeliverer', 'params', req.params);
        try {
            const { id } = req.params;
            const deliverer = await delivererService.deleteDeliverer(id);
            Logger.successOperation('DelivererController', 'deleteDeliverer');
            return res.status(200).json(toDelivererResponseDTO(deliverer));
        } catch (error) {
            Logger.errorOperation('DelivererController', 'deleteDeliverer', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getActiveDeliverers(req: Request, res: Response) {
        Logger.controller('Deliverer', 'getActiveDeliverers', 'query', req.query);
        try {
            const deliverers = await delivererService.getActiveDeliverers();
            Logger.successOperation('DelivererController', 'getActiveDeliverers');
            return res.status(200).json({
                deliverers: deliverers.map(toDelivererResponseDTO),
            });
        } catch (error) {
            Logger.errorOperation('DelivererController', 'getActiveDeliverers', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const delivererController = new DelivererController();
