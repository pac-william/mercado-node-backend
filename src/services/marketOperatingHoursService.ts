import { MarketOperatingHours } from "../domain/marketOperatingHoursDomain";
import { 
    MarketOperatingHoursDTO, 
    MarketOperatingHoursDTOOutput, 
    MarketOperatingHoursUpdateDTO, 
    MarketOperatingHoursUpdateDTOOutput, 
    BulkMarketOperatingHoursDTO,
    MarketOperatingHoursDTOSchema,
    MarketOperatingHoursUpdateDTOSchema,
    BulkMarketOperatingHoursDTOSchema
} from "../dtos/marketOperatingHoursDTO";
import { marketOperatingHoursRepository } from "../repositories/marketOperatingHoursRepository";

class MarketOperatingHoursService {
    async createOperatingHours(dto: MarketOperatingHoursDTO): Promise<MarketOperatingHours> {
        // Parse e transforma o DTO
        const parsedDto = MarketOperatingHoursDTOSchema.parse(dto);
        const operatingHours = await marketOperatingHoursRepository.createOperatingHours(parsedDto);
        return marketOperatingHoursRepository.toDomain(operatingHours);
    }

    async createBulkOperatingHours(dto: BulkMarketOperatingHoursDTO): Promise<void> {
        // Parse e transforma o DTO
        const parsedDto = BulkMarketOperatingHoursDTOSchema.parse(dto);
        await marketOperatingHoursRepository.createBulkOperatingHours(parsedDto);
    }

    async getOperatingHoursById(id: string): Promise<MarketOperatingHours | null> {
        const operatingHours = await marketOperatingHoursRepository.getOperatingHoursById(id);
        if (!operatingHours) return null;
        return marketOperatingHoursRepository.toDomain(operatingHours);
    }

    async getOperatingHoursByMarketId(marketId: string): Promise<MarketOperatingHours[]> {
        const operatingHours = await marketOperatingHoursRepository.getOperatingHoursByMarketId(marketId);
        return marketOperatingHoursRepository.toDomainArray(operatingHours);
    }

    async getRegularOperatingHoursByMarketId(marketId: string): Promise<MarketOperatingHours[]> {
        const operatingHours = await marketOperatingHoursRepository.getRegularOperatingHoursByMarketId(marketId);
        return marketOperatingHoursRepository.toDomainArray(operatingHours);
    }

    async getHolidayOperatingHoursByMarketId(marketId: string): Promise<MarketOperatingHours[]> {
        const operatingHours = await marketOperatingHoursRepository.getHolidayOperatingHoursByMarketId(marketId);
        return marketOperatingHoursRepository.toDomainArray(operatingHours);
    }

    async updateOperatingHours(id: string, dto: MarketOperatingHoursUpdateDTO): Promise<MarketOperatingHours> {
        // Parse e transforma o DTO
        const parsedDto = MarketOperatingHoursUpdateDTOSchema.parse(dto);
        const operatingHours = await marketOperatingHoursRepository.updateOperatingHours(id, parsedDto);
        return marketOperatingHoursRepository.toDomain(operatingHours);
    }

    async deleteOperatingHours(id: string): Promise<void> {
        await marketOperatingHoursRepository.deleteOperatingHours(id);
    }

    async deleteOperatingHoursByMarketId(marketId: string): Promise<void> {
        await marketOperatingHoursRepository.deleteOperatingHoursByMarketId(marketId);
    }
}

export const marketOperatingHoursService = new MarketOperatingHoursService();

