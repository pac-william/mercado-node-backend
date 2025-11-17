import { Campaign, CampaignStatus } from "../domain/campaignDomain";
import { CampaignDTO, CampaignUpdateDTO } from "../dtos/campaignDTO";
import { campaignRepository } from "../repositories/campaignRepository";

class CampaignService {
    async createCampaign(campaignDTO: CampaignDTO): Promise<Campaign> {
        return await campaignRepository.createCampaign(campaignDTO);
    }

    async getCampaignById(id: string): Promise<Campaign | null> {
        return await campaignRepository.getCampaignById(id);
    }

    async getCampaignsByMarket(
        marketId: string,
        status?: CampaignStatus,
        page: number = 1,
        size: number = 10
    ): Promise<Campaign[]> {
        return await campaignRepository.getCampaignsByMarket(marketId, status, page, size);
    }

    async getActiveCampaignsForCarousel(marketId?: string): Promise<Campaign[]> {
        return await campaignRepository.getActiveCampaignsForCarousel(marketId);
    }

    async updateCampaign(id: string, campaignUpdateDTO: CampaignUpdateDTO): Promise<Campaign> {
        return await campaignRepository.updateCampaign(id, campaignUpdateDTO);
    }

    async activateCampaign(id: string): Promise<Campaign> {
        return await campaignRepository.activateCampaign(id);
    }

    async deactivateCampaign(id: string): Promise<Campaign> {
        return await campaignRepository.deactivateCampaign(id);
    }

    async deleteCampaign(id: string): Promise<void> {
        await campaignRepository.deleteCampaign(id);
    }

    async expireCampaigns(): Promise<number> {
        return await campaignRepository.expireCampaigns();
    }
}

export const campaignService = new CampaignService();

