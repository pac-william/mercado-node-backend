import { z } from "zod";

// Validação de chave PIX
const pixKeyRegex = {
    CPF: /^\d{11}$/,
    CNPJ: /^\d{14}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+55\d{10,11}$/,
    RANDOM_KEY: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
};

const validatePixKey = (key: string, type: string): boolean => {
    switch (type) {
        case 'CPF':
            return pixKeyRegex.CPF.test(key);
        case 'CNPJ':
            return pixKeyRegex.CNPJ.test(key);
        case 'EMAIL':
            return pixKeyRegex.EMAIL.test(key);
        case 'PHONE':
            return pixKeyRegex.PHONE.test(key);
        case 'RANDOM_KEY':
            return pixKeyRegex.RANDOM_KEY.test(key);
        default:
            return false;
    }
};

export const PaymentSettingsDTO = z.object({
    marketId: z.string().min(1, { message: "ID do mercado é obrigatório" }),
    acceptsCreditCard: z.boolean().default(true),
    acceptsDebitCard: z.boolean().default(true),
    acceptsPix: z.boolean().default(true),
    acceptsCash: z.boolean().default(true),
    acceptsMealVoucher: z.boolean().default(false), // Vale Alimentação
    acceptsFoodVoucher: z.boolean().default(false), // Vale Refeição
    pixKey: z.string().optional().nullable(),
    pixKeyType: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM_KEY"]).optional().nullable(),
    pixMerchantName: z.string().optional().nullable(),
    pixMerchantCity: z.string().optional().nullable(),
    pixMerchantZipCode: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
}).refine((data) => {
    // Se aceita PIX, deve ter chave PIX configurada
    if (data.acceptsPix && !data.pixKey) {
        return false;
    }
    return true;
}, {
    message: "Se aceita PIX, é necessário configurar uma chave PIX (pixKey)"
}).refine((data) => {
    // Se tem chave PIX, deve ter tipo e validar formato
    if (data.pixKey && data.pixKeyType) {
        return validatePixKey(data.pixKey, data.pixKeyType);
    }
    return true;
}, {
    message: "Chave PIX inválida para o tipo especificado"
}).refine((data) => {
    // Se tem chave PIX, deve ter tipo
    if (data.pixKey && !data.pixKeyType) {
        return false;
    }
    return true;
}, {
    message: "Se configurar chave PIX, é necessário especificar o tipo (pixKeyType)"
});

export type PaymentSettingsDTO = z.infer<typeof PaymentSettingsDTO>;

export const PaymentSettingsUpdateDTO = PaymentSettingsDTO.partial().omit({ marketId: true });
export type PaymentSettingsUpdateDTO = z.infer<typeof PaymentSettingsUpdateDTO>;

// DTO para gerar QR Code PIX
export const GeneratePixQRCodeDTO = z.object({
    amount: z.number().positive({ message: "Valor deve ser positivo" }),
    description: z.string().optional(),
    orderId: z.string().optional(),
});
export type GeneratePixQRCodeDTO = z.infer<typeof GeneratePixQRCodeDTO>;

