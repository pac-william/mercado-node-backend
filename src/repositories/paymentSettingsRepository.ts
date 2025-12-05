import { PaymentSettings } from "../domain/paymentSettingsDomain";
import { PaymentSettingsDTO, PaymentSettingsUpdateDTO } from "../dtos/paymentSettingsDTO";
import { prisma } from "../utils/prisma";

class PaymentSettingsRepository {
    async createPaymentSettings(dto: PaymentSettingsDTO) {
        const paymentSettings = await prisma.paymentSettings.create({
            data: {
                marketId: dto.marketId,
                acceptsCreditCard: dto.acceptsCreditCard,
                acceptsDebitCard: dto.acceptsDebitCard,
                acceptsPix: dto.acceptsPix,
                acceptsCash: dto.acceptsCash,
                acceptsMealVoucher: dto.acceptsMealVoucher,
                acceptsFoodVoucher: dto.acceptsFoodVoucher,
                pixKey: dto.pixKey ?? null,
                pixKeyType: dto.pixKeyType ?? null,
                pixMerchantName: dto.pixMerchantName ?? null,
                pixMerchantCity: dto.pixMerchantCity ?? null,
                pixMerchantZipCode: dto.pixMerchantZipCode ?? null,
                isActive: dto.isActive,
            },
        });
        return paymentSettings;
    }

    async getPaymentSettingsByMarketId(marketId: string) {
        const paymentSettings = await prisma.paymentSettings.findUnique({
            where: { marketId },
        });
        return paymentSettings;
    }

    async updatePaymentSettings(marketId: string, dto: PaymentSettingsUpdateDTO) {
        const paymentSettings = await prisma.paymentSettings.update({
            where: { marketId },
            data: {
                ...(dto.acceptsCreditCard !== undefined && { acceptsCreditCard: dto.acceptsCreditCard }),
                ...(dto.acceptsDebitCard !== undefined && { acceptsDebitCard: dto.acceptsDebitCard }),
                ...(dto.acceptsPix !== undefined && { acceptsPix: dto.acceptsPix }),
                ...(dto.acceptsCash !== undefined && { acceptsCash: dto.acceptsCash }),
                ...(dto.acceptsMealVoucher !== undefined && { acceptsMealVoucher: dto.acceptsMealVoucher }),
                ...(dto.acceptsFoodVoucher !== undefined && { acceptsFoodVoucher: dto.acceptsFoodVoucher }),
                ...(dto.pixKey !== undefined && { pixKey: dto.pixKey ?? null }),
                ...(dto.pixKeyType !== undefined && { pixKeyType: dto.pixKeyType ?? null }),
                ...(dto.pixMerchantName !== undefined && { pixMerchantName: dto.pixMerchantName ?? null }),
                ...(dto.pixMerchantCity !== undefined && { pixMerchantCity: dto.pixMerchantCity ?? null }),
                ...(dto.pixMerchantZipCode !== undefined && { pixMerchantZipCode: dto.pixMerchantZipCode ?? null }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
        return paymentSettings;
    }

    async upsertPaymentSettings(dto: PaymentSettingsDTO) {
        const paymentSettings = await prisma.paymentSettings.upsert({
            where: { marketId: dto.marketId },
            update: {
                acceptsCreditCard: dto.acceptsCreditCard,
                acceptsDebitCard: dto.acceptsDebitCard,
                acceptsPix: dto.acceptsPix,
                acceptsCash: dto.acceptsCash,
                acceptsMealVoucher: dto.acceptsMealVoucher,
                acceptsFoodVoucher: dto.acceptsFoodVoucher,
                pixKey: dto.pixKey ?? null,
                pixKeyType: dto.pixKeyType ?? null,
                pixMerchantName: dto.pixMerchantName ?? null,
                pixMerchantCity: dto.pixMerchantCity ?? null,
                pixMerchantZipCode: dto.pixMerchantZipCode ?? null,
                isActive: dto.isActive,
            },
            create: {
                marketId: dto.marketId,
                acceptsCreditCard: dto.acceptsCreditCard,
                acceptsDebitCard: dto.acceptsDebitCard,
                acceptsPix: dto.acceptsPix,
                acceptsCash: dto.acceptsCash,
                acceptsMealVoucher: dto.acceptsMealVoucher,
                acceptsFoodVoucher: dto.acceptsFoodVoucher,
                pixKey: dto.pixKey ?? null,
                pixKeyType: dto.pixKeyType ?? null,
                pixMerchantName: dto.pixMerchantName ?? null,
                pixMerchantCity: dto.pixMerchantCity ?? null,
                pixMerchantZipCode: dto.pixMerchantZipCode ?? null,
                isActive: dto.isActive,
            },
        });
        return paymentSettings;
    }

    toDomain(d: any): PaymentSettings {
        return new PaymentSettings(
            d.id,
            d.marketId,
            d.acceptsCreditCard,
            d.acceptsDebitCard,
            d.acceptsPix,
            d.acceptsCash,
            d.acceptsMealVoucher,
            d.acceptsFoodVoucher,
            d.pixKey,
            d.pixKeyType,
            d.pixMerchantName,
            d.pixMerchantCity,
            d.pixMerchantZipCode,
            d.isActive,
            d.createdAt,
            d.updatedAt,
        );
    }
}

export const paymentSettingsRepository = new PaymentSettingsRepository();

