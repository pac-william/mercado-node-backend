import { Request, Response } from "express";
import { CampaignDTO, CampaignUpdateDTO } from "../dtos/campaignDTO";
import { campaignService } from "../services/campaignService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class CampaignController {
    async createCampaign(req: Request, res: Response) {
        Logger.controller('Campaign', 'createCampaign', 'body', req.body);
        try {
            const campaignDTO = CampaignDTO.parse(req.body);
            const campaign = await campaignService.createCampaign(campaignDTO);
            return res.status(201).json(campaign);
        } catch (error: any) {
            if (error.message?.includes("Slot") || error.message?.includes("já está ocupado")) {
                return res.status(400).json({ message: error.message });
            }
            if (error.name === 'ZodError') {
                return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCampaignById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.getCampaignById(id);
            
            if (!campaign) {
                return res.status(404).json({ message: "Campanha não encontrada" });
            }
            return res.status(200).json(campaign);
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCampaignsByMarket(req: Request, res: Response) {
        try {
            const { marketId } = req.params;
            
            if (!marketId) {
                return res.status(400).json({ message: "marketId é obrigatório" });
            }

            const { status, page, size } = QueryBuilder.from(req.query)
                .withString('status')
                .withNumber('page', 1)
                .withNumber('size', 10)
                .build();

            const campaigns = await campaignService.getCampaignsByMarket(
                marketId,
                status as any,
                page,
                size
            );
            return res.status(200).json(campaigns);
        } catch (error) {
            Logger.errorOperation('CampaignController', 'getCampaignsByMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getActiveCampaignsForCarousel(req: Request, res: Response) {
        try {
            const { marketId } = QueryBuilder.from(req.query)
                .withString('marketId')
                .build();

            const campaigns = await campaignService.getActiveCampaignsForCarousel(marketId);
            return res.status(200).json(campaigns);
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const campaignUpdateDTO = CampaignUpdateDTO.parse(req.body);
            const campaign = await campaignService.updateCampaign(id, campaignUpdateDTO);
            return res.status(200).json(campaign);
        } catch (error: any) {
            if (error.message?.includes("Slot") || error.message?.includes("já está ocupado")) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message?.includes("não encontrada")) {
                return res.status(404).json({ message: error.message });
            }
            if (error.name === 'ZodError') {
                return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async activateCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.activateCampaign(id);
            return res.status(200).json(campaign);
        } catch (error: any) {

            if (error.message?.includes("Slot") || error.message?.includes("já está ocupado")) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message?.includes("não encontrada")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deactivateCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.deactivateCampaign(id);
            return res.status(200).json(campaign);
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await campaignService.deleteCampaign(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async expireCampaigns(req: Request, res: Response) {
        try {
            const expiredCount = await campaignService.expireCampaigns();
            return res.status(200).json({ expiredCount });
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const campaignController = new CampaignController();

