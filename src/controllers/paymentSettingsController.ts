import { Request, Response } from "express";
import { PaymentSettingsDTO, PaymentSettingsUpdateDTO, GeneratePixQRCodeDTO } from "../dtos/paymentSettingsDTO";
import { paymentSettingsService } from "../services/paymentSettingsService";
import { Logger } from "../utils/logger";

export class PaymentSettingsController {
    async createPaymentSettings(req: Request, res: Response) {
        Logger.controller('PaymentSettings', 'createPaymentSettings', 'body', req.body);
        try {
            const dto = PaymentSettingsDTO.parse(req.body);
            const paymentSettings = await paymentSettingsService.createPaymentSettings(dto);
            Logger.successOperation('PaymentSettingsController', 'createPaymentSettings');
            return res.status(201).json(paymentSettings);
        } catch (error) {
            Logger.errorOperation('PaymentSettingsController', 'createPaymentSettings', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getPaymentSettingsByMarketId(req: Request, res: Response) {
        Logger.controller('PaymentSettings', 'getPaymentSettingsByMarketId', 'params', req.params);
        try {
            const { marketId } = req.params;
            const paymentSettings = await paymentSettingsService.getPaymentSettingsByMarketId(marketId);
            
            if (!paymentSettings) {
                return res.status(404).json({ message: "Configurações de pagamento não encontradas" });
            }

            Logger.successOperation('PaymentSettingsController', 'getPaymentSettingsByMarketId');
            return res.status(200).json(paymentSettings);
        } catch (error) {
            Logger.errorOperation('PaymentSettingsController', 'getPaymentSettingsByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updatePaymentSettings(req: Request, res: Response) {
        Logger.controller('PaymentSettings', 'updatePaymentSettings', 'params', req.params);
        try {
            const { marketId } = req.params;
            const dto = PaymentSettingsUpdateDTO.parse(req.body);
            const paymentSettings = await paymentSettingsService.updatePaymentSettings(marketId, dto);
            Logger.successOperation('PaymentSettingsController', 'updatePaymentSettings');
            return res.status(200).json(paymentSettings);
        } catch (error) {
            Logger.errorOperation('PaymentSettingsController', 'updatePaymentSettings', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async upsertPaymentSettings(req: Request, res: Response) {
        Logger.controller('PaymentSettings', 'upsertPaymentSettings', 'body', req.body);
        try {
            const dto = PaymentSettingsDTO.parse(req.body);
            const paymentSettings = await paymentSettingsService.upsertPaymentSettings(dto);
            Logger.successOperation('PaymentSettingsController', 'upsertPaymentSettings');
            return res.status(200).json(paymentSettings);
        } catch (error) {
            Logger.errorOperation('PaymentSettingsController', 'upsertPaymentSettings', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getAcceptedPaymentMethods(req: Request, res: Response) {
        Logger.controller('PaymentSettings', 'getAcceptedPaymentMethods', 'params', req.params);
        try {
            const { marketId } = req.params;
            const paymentMethods = await paymentSettingsService.getAcceptedPaymentMethods(marketId);
            
            if (!paymentMethods) {
                return res.status(404).json({ 
                    message: "Configurações de pagamento não encontradas ou mercado inativo",
                    acceptsCreditCard: false,
                    acceptsDebitCard: false,
                    acceptsPix: false,
                    acceptsCash: false,
                    acceptsMealVoucher: false,
                    acceptsFoodVoucher: false,
                });
            }

            Logger.successOperation('PaymentSettingsController', 'getAcceptedPaymentMethods');
            return res.status(200).json(paymentMethods);
        } catch (error) {
            Logger.errorOperation('PaymentSettingsController', 'getAcceptedPaymentMethods', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async generatePixQRCode(req: Request, res: Response) {
        Logger.controller('PaymentSettings', 'generatePixQRCode', 'params', req.params);
        try {
            const { marketId } = req.params;
            const dto = GeneratePixQRCodeDTO.parse(req.body);
            const pixQRCode = await paymentSettingsService.generatePixQRCode(marketId, dto);
            Logger.successOperation('PaymentSettingsController', 'generatePixQRCode');
            return res.status(200).json(pixQRCode);
        } catch (error) {
            Logger.errorOperation('PaymentSettingsController', 'generatePixQRCode', error);
            if (error instanceof Error && error.name === 'ZodError') {
                return res.status(400).json({ message: error.message, errors: (error as any).errors });
            }
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

