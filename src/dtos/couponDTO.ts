import { z } from "zod";

export const CouponDTO = z.object({
    code: z.string().min(1, "Código do cupom é obrigatório"),
    name: z.string().min(1, "Nome do cupom é obrigatório"),
    description: z.string().optional(),
    type: z.enum(["PERCENTAGE", "FIXED"], { error: "Tipo deve ser PERCENTAGE ou FIXED" }),
    value: z.number().positive("Valor deve ser positivo"),
    minOrderValue: z.number().positive("Valor mínimo do pedido deve ser positivo").optional(),
    maxDiscount: z.number().positive("Desconto máximo deve ser positivo").optional(),
    usageLimit: z.number().int().positive("Limite de uso deve ser um número inteiro positivo").optional(),
    isActive: z.boolean().default(true),
    validFrom: z.date().optional(),
    validUntil: z.date().optional(),
    marketId: z.string().optional()
});

export type CouponDTO = z.infer<typeof CouponDTO>;

export const CouponUpdateDTO = CouponDTO.partial();
export type CouponUpdateDTO = z.infer<typeof CouponUpdateDTO>;

export const CouponValidationDTO = z.object({
    code: z.string().min(1, "Código do cupom é obrigatório"),
    orderValue: z.number().positive("Valor do pedido deve ser positivo")
});

export type CouponValidationDTO = z.infer<typeof CouponValidationDTO>;

export type CouponResponseDTO = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    type: string;
    value: number;
    minOrderValue?: number | null;
    maxDiscount?: number | null;
    usageLimit?: number | null;
    usedCount: number;
    isActive: boolean;
    validFrom: Date;
    validUntil?: Date | null;
    marketId?: string | null;
    market?: {
        id: string;
        name: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
};

export const toCouponResponseDTO = (coupon: any): CouponResponseDTO => ({
    id: coupon.id,
    code: coupon.code,
    name: coupon.name,
    description: coupon.description,
    type: coupon.type,
    value: coupon.value,
    minOrderValue: coupon.minOrderValue,
    maxDiscount: coupon.maxDiscount,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    isActive: coupon.isActive,
    validFrom: coupon.validFrom,
    validUntil: coupon.validUntil,
    marketId: coupon.marketId,
    market: coupon.market ? {
        id: coupon.market.id,
        name: coupon.market.name
    } : null,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt
}); 