import { MarketOperatingHours } from "../domain/marketOperatingHoursDomain";
import { MarketOperatingHoursDTOOutput, MarketOperatingHoursUpdateDTOOutput, BulkMarketOperatingHoursDTOOutput } from "../dtos/marketOperatingHoursDTO";
import { prisma } from "../utils/prisma";

class MarketOperatingHoursRepository {
    async createOperatingHours(dto: MarketOperatingHoursDTOOutput) {
        const operatingHours = await prisma.marketOperatingHours.create({
            data: {
                marketId: dto.marketId,
                dayOfWeek: dto.dayOfWeek ?? null,
                startTime: dto.startTime,
                endTime: dto.endTime,
                isHoliday: dto.isHoliday,
                holidayDate: dto.holidayDate ? new Date(dto.holidayDate) : null,
                isClosed: dto.isClosed,
            },
        });
        return operatingHours;
    }

    async createBulkOperatingHours(dto: BulkMarketOperatingHoursDTOOutput) {
        const data = dto.hours.map(hour => ({
            marketId: dto.marketId,
            dayOfWeek: hour.dayOfWeek ?? null,
            startTime: hour.startTime,
            endTime: hour.endTime,
            isHoliday: hour.isHoliday,
            holidayDate: hour.holidayDate ? new Date(hour.holidayDate) : null,
            isClosed: hour.isClosed,
        }));

        // Deletar horários existentes do mercado antes de criar novos
        await prisma.marketOperatingHours.deleteMany({
            where: { marketId: dto.marketId },
        });

        const operatingHours = await prisma.marketOperatingHours.createMany({
            data,
        });
        return operatingHours;
    }

    async getOperatingHoursById(id: string) {
        const operatingHours = await prisma.marketOperatingHours.findUnique({
            where: { id },
        });
        return operatingHours;
    }

    async getOperatingHoursByMarketId(marketId: string) {
        const operatingHours = await prisma.marketOperatingHours.findMany({
            where: { marketId },
            orderBy: [
                { isHoliday: 'asc' },
                { dayOfWeek: 'asc' },
                { holidayDate: 'asc' },
            ],
        });
        return operatingHours;
    }

    async getRegularOperatingHoursByMarketId(marketId: string) {
        const operatingHours = await prisma.marketOperatingHours.findMany({
            where: {
                marketId,
                isHoliday: false,
            },
            orderBy: { dayOfWeek: 'asc' },
        });
        return operatingHours;
    }

    async getHolidayOperatingHoursByMarketId(marketId: string) {
        const operatingHours = await prisma.marketOperatingHours.findMany({
            where: {
                marketId,
                isHoliday: true,
            },
            orderBy: { holidayDate: 'asc' },
        });
        return operatingHours;
    }

    async updateOperatingHours(id: string, dto: MarketOperatingHoursUpdateDTOOutput) {
        const operatingHours = await prisma.marketOperatingHours.update({
            where: { id },
            data: {
                ...(dto.dayOfWeek !== undefined && { dayOfWeek: dto.dayOfWeek ?? null }),
                ...(dto.startTime !== undefined && { startTime: dto.startTime }),
                ...(dto.endTime !== undefined && { endTime: dto.endTime }),
                ...(dto.isHoliday !== undefined && { isHoliday: dto.isHoliday }),
                ...(dto.holidayDate !== undefined && { holidayDate: dto.holidayDate ? new Date(dto.holidayDate) : null }),
                ...(dto.isClosed !== undefined && { isClosed: dto.isClosed }),
            },
        });
        return operatingHours;
    }

    async deleteOperatingHours(id: string) {
        await prisma.marketOperatingHours.delete({
            where: { id },
        });
    }

    async deleteOperatingHoursByMarketId(marketId: string) {
        await prisma.marketOperatingHours.deleteMany({
            where: { marketId },
        });
    }

    toDomain(d: any): MarketOperatingHours {
        return new MarketOperatingHours(
            d.id,
            d.marketId,
            d.dayOfWeek,
            d.startTime,
            d.endTime,
            d.isHoliday,
            d.holidayDate ? new Date(d.holidayDate) : null,
            d.isClosed,
            d.createdAt,
            d.updatedAt,
        );
    }

    toDomainArray(d: any[]): MarketOperatingHours[] {
        return d.map(item => this.toDomain(item));
    }
}

export const marketOperatingHoursRepository = new MarketOperatingHoursRepository();

