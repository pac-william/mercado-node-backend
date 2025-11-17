import { Campaign, CampaignStatus } from "../domain/campaignDomain";
import { CampaignDTO, CampaignUpdateDTO } from "../dtos/campaignDTO";
import { prisma } from "../utils/prisma";

class CampaignRepository {
    async createCampaign(campaignDTO: CampaignDTO) {
        await this.validateSlotAvailability(
            campaignDTO.marketId,
            campaignDTO.slot,
            campaignDTO.startDate,
            campaignDTO.endDate || null
        );

        const campaign = await prisma.campaign.create({
            data: {
                marketId: campaignDTO.marketId,
                title: campaignDTO.title,
                imageUrl: campaignDTO.imageUrl,
                slot: campaignDTO.slot,
                startDate: campaignDTO.startDate,
                endDate: campaignDTO.endDate || null,
                status: campaignDTO.status || "DRAFT",
            },
        });

        return this.mapToDomain(campaign);
    }

    async getCampaignById(id: string) {
        const campaign = await prisma.campaign.findUnique({
            where: { id },
        });

        if (!campaign) return null;
        return this.mapToDomain(campaign);
    }

    async getCampaignsByMarket(
        marketId: string,
        status?: CampaignStatus,
        page: number = 1,
        size: number = 10
    ) {
        const filter: any = {
            marketId,
        };

        if (status) {
            filter.status = status;
        }

        const campaigns = await prisma.campaign.findMany({
            where: filter,
            skip: (page - 1) * size,
            take: size,
            orderBy: [
                { slot: 'asc' },
                { startDate: 'asc' },
            ],
        });

        return campaigns.map((c: any) => this.mapToDomain(c));
    }

    async getActiveCampaignsForCarousel(marketId?: string) {
        const now = new Date();
        const filter: any = {
            status: { in: ["ACTIVE", "SCHEDULED"] },
            startDate: { lte: now },
            OR: [
                { endDate: null },
                { endDate: { gte: now } },
            ],
        };

        if (marketId) {
            filter.marketId = marketId;
        }

        const campaigns = await prisma.campaign.findMany({
            where: filter,
            orderBy: { slot: 'asc' },
        });

        return campaigns.map((c: any) => this.mapToDomain(c));
    }

    async updateCampaign(id: string, campaignUpdateDTO: CampaignUpdateDTO) {
        const existingCampaign = await prisma.campaign.findUnique({
            where: { id },
        });

        if (!existingCampaign) {
            throw new Error("Campanha não encontrada");
        }

        const slot = campaignUpdateDTO.slot ?? existingCampaign.slot;
        const startDate = campaignUpdateDTO.startDate ?? existingCampaign.startDate;
        const endDate = campaignUpdateDTO.endDate !== undefined 
            ? (campaignUpdateDTO.endDate || null)
            : existingCampaign.endDate;

        if (campaignUpdateDTO.slot || campaignUpdateDTO.startDate || campaignUpdateDTO.endDate !== undefined) {
            await this.validateSlotAvailability(
                existingCampaign.marketId,
                slot,
                startDate,
                endDate,
                id
            );
        }

        const campaign = await prisma.campaign.update({
            where: { id },
            data: {
                ...(campaignUpdateDTO.title && { title: campaignUpdateDTO.title }),
                ...(campaignUpdateDTO.imageUrl && { imageUrl: campaignUpdateDTO.imageUrl }),
                ...(campaignUpdateDTO.slot && { slot: campaignUpdateDTO.slot }),
                ...(campaignUpdateDTO.startDate && { startDate: campaignUpdateDTO.startDate }),
                ...(campaignUpdateDTO.endDate !== undefined && { endDate: campaignUpdateDTO.endDate || null }),
                ...(campaignUpdateDTO.status && { status: campaignUpdateDTO.status }),
            },
        });

        return this.mapToDomain(campaign);
    }

    async activateCampaign(id: string) {
        const campaign = await prisma.campaign.findUnique({
            where: { id },
        });

        if (!campaign) {
            throw new Error("Campanha não encontrada");
        }

        if (campaign.status === "ACTIVE") {
            return this.mapToDomain(campaign);
        }

        await this.validateSlotAvailability(
            campaign.marketId,
            campaign.slot,
            campaign.startDate,
            campaign.endDate,
            id
        );

        const now = new Date();
        let status: CampaignStatus = "ACTIVE";

        if (campaign.startDate > now) {
            status = "SCHEDULED";
        }

        const updatedCampaign = await prisma.campaign.update({
            where: { id },
            data: { status },
        });

        return this.mapToDomain(updatedCampaign);
    }

    async deactivateCampaign(id: string) {
        const campaign = await prisma.campaign.update({
            where: { id },
            data: { status: "DRAFT" },
        });

        return this.mapToDomain(campaign);
    }

    async deleteCampaign(id: string) {
        await prisma.campaign.delete({
            where: { id },
        });
    }

    async expireCampaigns() {
        const now = new Date();
        const expired = await prisma.campaign.updateMany({
            where: {
                status: { in: ["ACTIVE", "SCHEDULED"] },
                endDate: { lt: now },
            },
            data: {
                status: "EXPIRED",
            },
        });

        return expired.count;
    }

    async validateSlotAvailability(
        marketId: string,
        slot: number,
        startDate: Date,
        endDate: Date | null,
        excludeCampaignId?: string
    ) {
        if (slot < 1 || slot > 8) {
            throw new Error("Slot deve ser um número entre 1 e 8");
        }

        const filter: any = {
            slot,
            status: { in: ["ACTIVE", "SCHEDULED"] },
            id: excludeCampaignId ? { not: excludeCampaignId } : undefined,
        };

        const conflictingCampaigns = await prisma.campaign.findMany({
            where: filter,
        });

        for (const campaign of conflictingCampaigns) {
            const campaignStart = campaign.startDate;
            const campaignEnd = campaign.endDate;

            if (this.hasDateConflict(startDate, endDate, campaignStart, campaignEnd)) {
                throw new Error(
                    `Slot ${slot} já está ocupado no período de ${campaignStart.toISOString()} ` +
                    `até ${campaignEnd ? campaignEnd.toISOString() : "sem data de término"}`
                );
            }
        }
    }

    private hasDateConflict(
        start1: Date,
        end1: Date | null,
        start2: Date,
        end2: Date | null
    ): boolean {
        if (!end1 && !end2) {
            return true;
        }

        if (!end1) {
            return start1 <= (end2 || new Date());
        }

        if (!end2) {
            return (end1 || new Date()) >= start2;
        }

        return start1 < end2 && (end1 || new Date()) > start2;
    }

    private mapToDomain(campaign: any): Campaign {
        return new Campaign(
            campaign.id,
            campaign.marketId,
            campaign.title,
            campaign.imageUrl,
            campaign.slot,
            campaign.startDate,
            campaign.endDate,
            campaign.status as CampaignStatus,
            campaign.createdAt,
            campaign.updatedAt,
        );
    }
}

export const campaignRepository = new CampaignRepository();

