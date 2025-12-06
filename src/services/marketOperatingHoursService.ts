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

    /**
     * Verifica se o mercado está aberto no momento atual
     * @param marketId ID do mercado
     * @returns true se o mercado está aberto, false caso contrário
     * Se não houver horários cadastrados, retorna true (permite pedidos)
     */
    async isMarketOpen(marketId: string): Promise<boolean> {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const currentDayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // Buscar todos os horários do mercado
        const allHours = await this.getOperatingHoursByMarketId(marketId);

        // Se não há horários cadastrados, permitir pedidos (não bloquear)
        if (allHours.length === 0) {
            return true;
        }

        // Primeiro, verificar se hoje é um feriado
        const holidayHours = allHours.filter(h => 
            h.isHoliday && 
            h.holidayDate && 
            new Date(h.holidayDate).toDateString() === today.toDateString()
        );

        if (holidayHours.length > 0) {
            // Se é feriado, verificar se está fechado
            const holidayHour = holidayHours[0];
            if (holidayHour.isClosed) {
                return false;
            }
            // Se não está fechado, verificar se está no horário
            return this.isTimeInRange(currentTime, holidayHour.startTime, holidayHour.endTime);
        }

        // Se não é feriado, verificar o horário do dia da semana
        const regularHours = allHours.filter(h => 
            !h.isHoliday && 
            h.dayOfWeek === currentDayOfWeek
        );

        if (regularHours.length === 0) {
            // Se não há horário cadastrado para este dia, considerar como fechado
            return false;
        }

        const regularHour = regularHours[0];
        
        // Se está fechado neste dia, retornar false
        if (regularHour.isClosed) {
            return false;
        }

        // Verificar se o horário atual está dentro do horário de funcionamento
        return this.isTimeInRange(currentTime, regularHour.startTime, regularHour.endTime);
    }

    /**
     * Verifica se um horário está dentro de um intervalo
     * @param currentTime Horário atual no formato HH:mm
     * @param startTime Horário de início no formato HH:mm
     * @param endTime Horário de fim no formato HH:mm
     * @returns true se o horário atual está dentro do intervalo
     */
    private isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const currentTotal = currentHour * 60 + currentMinute;
        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        return currentTotal >= startTotal && currentTotal <= endTotal;
    }
}

export const marketOperatingHoursService = new MarketOperatingHoursService();

