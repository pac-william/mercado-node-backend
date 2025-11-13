import { Request, Response } from "express";
import { DeliverySettingsDTO, DeliverySettingsUpdateDTO } from "../dtos/deliverySettingsDTO";
import { deliverySettingsService } from "../services/deliverySettingsService";
import { Logger } from "../utils/logger";

export class DeliverySettingsController {
    async getDeliverySettingsByMarketId(req: Request, res: Response) {
        Logger.controller('DeliverySettings', 'getDeliverySettingsByMarketId', 'params', req.params);
        try {
            const { marketId } = req.params;
            const deliverySettings = await deliverySettingsService.getDeliverySettingsByMarketId(marketId);
            
            if (!deliverySettings) {
                return res.status(404).json({ message: "Configurações de entrega não encontradas" });
            }

            Logger.successOperation('DeliverySettingsController', 'getDeliverySettingsByMarketId');
            return res.status(200).json(deliverySettings);
        } catch (error) {
            Logger.errorOperation('DeliverySettingsController', 'getDeliverySettingsByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createDeliverySettings(req: Request, res: Response) {
        Logger.controller('DeliverySettings', 'createDeliverySettings', 'body', req.body);
        try {
            const deliverySettingsDTO = DeliverySettingsDTO.parse(req.body);
            const deliverySettings = await deliverySettingsService.createDeliverySettings(deliverySettingsDTO);
            Logger.successOperation('DeliverySettingsController', 'createDeliverySettings');
            return res.status(201).json(deliverySettings);
        } catch (error) {
            Logger.errorOperation('DeliverySettingsController', 'createDeliverySettings', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateDeliverySettings(req: Request, res: Response) {
        Logger.controller('DeliverySettings', 'updateDeliverySettings', 'params', req.params);
        try {
            const { marketId } = req.params;
            const deliverySettingsUpdateDTO = DeliverySettingsUpdateDTO.parse(req.body);
            const deliverySettings = await deliverySettingsService.updateDeliverySettings(marketId, deliverySettingsUpdateDTO);
            Logger.successOperation('DeliverySettingsController', 'updateDeliverySettings');
            return res.status(200).json(deliverySettings);
        } catch (error) {
            Logger.errorOperation('DeliverySettingsController', 'updateDeliverySettings', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async upsertDeliverySettings(req: Request, res: Response) {
        Logger.controller('DeliverySettings', 'upsertDeliverySettings', 'body', req.body);
        try {
            const deliverySettingsDTO = DeliverySettingsDTO.parse(req.body);
            const deliverySettings = await deliverySettingsService.upsertDeliverySettings(deliverySettingsDTO);
            Logger.successOperation('DeliverySettingsController', 'upsertDeliverySettings');
            return res.status(200).json(deliverySettings);
        } catch (error) {
            Logger.errorOperation('DeliverySettingsController', 'upsertDeliverySettings', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

