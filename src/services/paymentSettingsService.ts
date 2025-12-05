import { PaymentSettings, PixQRCode } from "../domain/paymentSettingsDomain";
import { PaymentSettingsDTO, PaymentSettingsUpdateDTO, GeneratePixQRCodeDTO } from "../dtos/paymentSettingsDTO";
import { paymentSettingsRepository } from "../repositories/paymentSettingsRepository";
import { generatePixString, generateQRCodeImage } from "../utils/pixQRCode";

class PaymentSettingsService {
    async createPaymentSettings(dto: PaymentSettingsDTO): Promise<PaymentSettings> {
        const paymentSettings = await paymentSettingsRepository.createPaymentSettings(dto);
        return paymentSettingsRepository.toDomain(paymentSettings);
    }

    async getPaymentSettingsByMarketId(marketId: string): Promise<PaymentSettings | null> {
        const paymentSettings = await paymentSettingsRepository.getPaymentSettingsByMarketId(marketId);
        if (!paymentSettings) return null;
        return paymentSettingsRepository.toDomain(paymentSettings);
    }

    async updatePaymentSettings(marketId: string, dto: PaymentSettingsUpdateDTO): Promise<PaymentSettings> {
        const paymentSettings = await paymentSettingsRepository.updatePaymentSettings(marketId, dto);
        return paymentSettingsRepository.toDomain(paymentSettings);
    }

    async upsertPaymentSettings(dto: PaymentSettingsDTO): Promise<PaymentSettings> {
        const paymentSettings = await paymentSettingsRepository.upsertPaymentSettings(dto);
        return paymentSettingsRepository.toDomain(paymentSettings);
    }

    async generatePixQRCode(marketId: string, dto: GeneratePixQRCodeDTO): Promise<PixQRCode> {
        // Busca as configurações do mercado
        const paymentSettings = await this.getPaymentSettingsByMarketId(marketId);
        
        if (!paymentSettings) {
            throw new Error("Configurações de pagamento não encontradas para este mercado");
        }

        if (!paymentSettings.acceptsPix) {
            throw new Error("Este mercado não aceita pagamento via PIX");
        }

        if (!paymentSettings.pixKey || !paymentSettings.pixKeyType) {
            throw new Error("Chave PIX não configurada para este mercado");
        }

        if (!paymentSettings.pixMerchantName || !paymentSettings.pixMerchantCity) {
            throw new Error("Dados do recebedor PIX incompletos (nome e cidade são obrigatórios)");
        }

        // Gera a string PIX
        const pixString = generatePixString(
            paymentSettings.pixKey,
            paymentSettings.pixKeyType,
            dto.amount,
            paymentSettings.pixMerchantName,
            paymentSettings.pixMerchantCity,
            dto.description || undefined,
            dto.orderId || undefined
        );

        // Gera a imagem do QR Code
        const qrCodeImage = await generateQRCodeImage(pixString);

        return new PixQRCode(
            pixString,
            qrCodeImage,
            dto.amount,
            dto.description || null,
            paymentSettings.pixKey,
            paymentSettings.pixKeyType
        );
    }
}

export const paymentSettingsService = new PaymentSettingsService();

