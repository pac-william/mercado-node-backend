import { DeliverySettings } from "../domain/deliverySettingsDomain";
import { DeliverySettingsDTO, DeliverySettingsUpdateDTO } from "../dtos/deliverySettingsDTO";
import { prisma } from "../utils/prisma";

class DeliverySettingsRepository {
    async createDeliverySettings(deliverySettingsDTO: DeliverySettingsDTO) {
        const deliverySettings = await prisma.deliverySettings.create({
            data: deliverySettingsDTO,
        });
        return deliverySettings;
    }

    async getDeliverySettingsByMarketId(marketId: string) {
        const deliverySettings = await prisma.deliverySettings.findUnique({
            where: { marketId },
        });
        return deliverySettings;
    }

    async updateDeliverySettings(marketId: string, deliverySettingsDTO: DeliverySettingsUpdateDTO) {
        const deliverySettings = await prisma.deliverySettings.update({
            where: { marketId },
            data: deliverySettingsDTO,
        });
        return deliverySettings;
    }

    async upsertDeliverySettings(deliverySettingsDTO: DeliverySettingsDTO) {
        const deliverySettings = await prisma.deliverySettings.upsert({
            where: { marketId: deliverySettingsDTO.marketId },
            update: {
                deliveryRadius: deliverySettingsDTO.deliveryRadius,
                deliveryFee: deliverySettingsDTO.deliveryFee,
                allowsPickup: deliverySettingsDTO.allowsPickup,
            },
            create: deliverySettingsDTO,
        });
        return deliverySettings;
    }

    toDomain(d: any): DeliverySettings {
        return new DeliverySettings(
            d.id,
            d.marketId,
            d.deliveryRadius,
            d.deliveryFee,
            d.allowsPickup,
            d.createdAt,
            d.updatedAt,
        );
    }
}

export const deliverySettingsRepository = new DeliverySettingsRepository();

