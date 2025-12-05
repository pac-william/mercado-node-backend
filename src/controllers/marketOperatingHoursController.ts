import { Request, Response } from "express";
import { MarketOperatingHoursDTO, MarketOperatingHoursUpdateDTO, BulkMarketOperatingHoursDTO } from "../dtos/marketOperatingHoursDTO";
import { marketOperatingHoursService } from "../services/marketOperatingHoursService";
import { Logger } from "../utils/logger";

export class MarketOperatingHoursController {
    // Helper para adicionar campos de compatibilidade com o frontend
    private addCompatibilityFields(hours: any): any {
        return {
            ...hours,
            isOpen: !hours.isClosed,
            openTime: hours.startTime,
            closeTime: hours.endTime,
        };
    }

    private addCompatibilityFieldsArray(hoursArray: any[]): any[] {
        return hoursArray.map(h => this.addCompatibilityFields(h));
    }

    async createOperatingHours(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'createOperatingHours', 'body', req.body);
        try {
            // O service já faz o parse e transformação
            const operatingHours = await marketOperatingHoursService.createOperatingHours(req.body);
            Logger.successOperation('MarketOperatingHoursController', 'createOperatingHours');
            return res.status(201).json(this.addCompatibilityFields(operatingHours));
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'createOperatingHours', error);
            if (error instanceof Error && error.name === 'ZodError') {
                const zodError = error as any;
                // Pega a primeira mensagem de erro mais específica
                const firstError = zodError.errors?.[0];
                const errorMessage = firstError?.message || error.message;
                return res.status(400).json({ 
                    message: errorMessage,
                    receivedData: req.body, // Mostra o que foi recebido para debug
                    errors: zodError.errors 
                });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createBulkOperatingHours(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'createBulkOperatingHours', 'body', req.body);
        try {
            // O service já faz o parse e transformação
            await marketOperatingHoursService.createBulkOperatingHours(req.body);
            const allHours = await marketOperatingHoursService.getOperatingHoursByMarketId(req.body.marketId);
            Logger.successOperation('MarketOperatingHoursController', 'createBulkOperatingHours');
            return res.status(201).json({ 
                message: "Horários criados com sucesso", 
                hours: this.addCompatibilityFieldsArray(allHours) 
            });
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'createBulkOperatingHours', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getOperatingHoursById(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'getOperatingHoursById', 'params', req.params);
        try {
            const { id } = req.params;
            const operatingHours = await marketOperatingHoursService.getOperatingHoursById(id);
            
            if (!operatingHours) {
                return res.status(404).json({ message: "Horário de funcionamento não encontrado" });
            }

            Logger.successOperation('MarketOperatingHoursController', 'getOperatingHoursById');
            return res.status(200).json(this.addCompatibilityFields(operatingHours));
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'getOperatingHoursById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getOperatingHoursByMarketId(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'getOperatingHoursByMarketId', 'params', req.params);
        try {
            const { marketId } = req.params;
            const operatingHours = await marketOperatingHoursService.getOperatingHoursByMarketId(marketId);
            Logger.successOperation('MarketOperatingHoursController', 'getOperatingHoursByMarketId');
            return res.status(200).json(this.addCompatibilityFieldsArray(operatingHours));
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'getOperatingHoursByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getRegularOperatingHoursByMarketId(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'getRegularOperatingHoursByMarketId', 'params', req.params);
        try {
            const { marketId } = req.params;
            const operatingHours = await marketOperatingHoursService.getRegularOperatingHoursByMarketId(marketId);
            Logger.successOperation('MarketOperatingHoursController', 'getRegularOperatingHoursByMarketId');
            return res.status(200).json(this.addCompatibilityFieldsArray(operatingHours));
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'getRegularOperatingHoursByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getHolidayOperatingHoursByMarketId(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'getHolidayOperatingHoursByMarketId', 'params', req.params);
        try {
            const { marketId } = req.params;
            const operatingHours = await marketOperatingHoursService.getHolidayOperatingHoursByMarketId(marketId);
            Logger.successOperation('MarketOperatingHoursController', 'getHolidayOperatingHoursByMarketId');
            return res.status(200).json(this.addCompatibilityFieldsArray(operatingHours));
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'getHolidayOperatingHoursByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateOperatingHours(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'updateOperatingHours', 'params', req.params);
        try {
            const { id } = req.params;
            // O service já faz o parse e transformação
            const operatingHours = await marketOperatingHoursService.updateOperatingHours(id, req.body);
            Logger.successOperation('MarketOperatingHoursController', 'updateOperatingHours');
            return res.status(200).json(this.addCompatibilityFields(operatingHours));
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'updateOperatingHours', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteOperatingHours(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'deleteOperatingHours', 'params', req.params);
        try {
            const { id } = req.params;
            await marketOperatingHoursService.deleteOperatingHours(id);
            Logger.successOperation('MarketOperatingHoursController', 'deleteOperatingHours');
            return res.status(200).json({ message: "Horário de funcionamento deletado com sucesso" });
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'deleteOperatingHours', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteOperatingHoursByMarketId(req: Request, res: Response) {
        Logger.controller('MarketOperatingHours', 'deleteOperatingHoursByMarketId', 'params', req.params);
        try {
            const { marketId } = req.params;
            await marketOperatingHoursService.deleteOperatingHoursByMarketId(marketId);
            Logger.successOperation('MarketOperatingHoursController', 'deleteOperatingHoursByMarketId');
            return res.status(200).json({ message: "Todos os horários de funcionamento do mercado foram deletados com sucesso" });
        } catch (error) {
            Logger.errorOperation('MarketOperatingHoursController', 'deleteOperatingHoursByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

