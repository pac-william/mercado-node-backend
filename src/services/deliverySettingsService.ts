import { DeliverySettings } from "../domain/deliverySettingsDomain";
import { DeliverySettingsDTO, DeliverySettingsUpdateDTO } from "../dtos/deliverySettingsDTO";
import { deliverySettingsRepository } from "../repositories/deliverySettingsRepository";

class DeliverySettingsService {
    async createDeliverySettings(deliverySettingsDTO: DeliverySettingsDTO) {
        const deliverySettings = await deliverySettingsRepository.createDeliverySettings(deliverySettingsDTO);
        return deliverySettingsRepository.toDomain(deliverySettings);
    }

    async getDeliverySettingsByMarketId(marketId: string) {
        const deliverySettings = await deliverySettingsRepository.getDeliverySettingsByMarketId(marketId);
        if (!deliverySettings) return null;
        return deliverySettingsRepository.toDomain(deliverySettings);
    }

    async updateDeliverySettings(marketId: string, deliverySettingsDTO: DeliverySettingsUpdateDTO) {
        const deliverySettings = await deliverySettingsRepository.updateDeliverySettings(marketId, deliverySettingsDTO);
        return deliverySettingsRepository.toDomain(deliverySettings);
    }

    async upsertDeliverySettings(deliverySettingsDTO: DeliverySettingsDTO) {
        const deliverySettings = await deliverySettingsRepository.upsertDeliverySettings(deliverySettingsDTO);
        return deliverySettingsRepository.toDomain(deliverySettings);
    }
}

export const deliverySettingsService = new DeliverySettingsService();

