import { prisma } from "../utils/prisma";
import { CouponDTO, CouponUpdateDTO } from "../dtos/couponDTO";

class CouponRepository {
    async create(data: CouponDTO) {
        return await prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                description: data.description,
                type: data.type,
                value: data.value,
                minOrderValue: data.minOrderValue,
                maxDiscount: data.maxDiscount,
                usageLimit: data.usageLimit,
                isActive: data.isActive,
                validFrom: data.validFrom || new Date(),
                validUntil: data.validUntil,
                marketId: data.marketId
            },
            include: {
                market: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async get(page: number = 1, size: number = 10, marketId?: string, isActive?: boolean) {
        const skip = (page - 1) * size;
        const where: any = {};
        
        if (marketId) {
            where.marketId = marketId;
        }
        
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [coupons, count] = await Promise.all([
            prisma.coupon.findMany({
                where,
                skip,
                take: size,
                include: {
                    market: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.coupon.count({ where })
        ]);

        return { coupons, count };
    }

    async getById(id: string) {
        return await prisma.coupon.findUnique({
            where: { id },
            include: {
                market: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async getByCode(code: string) {
        return await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
            include: {
                market: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async update(id: string, data: CouponUpdateDTO) {
        const updateData: any = { ...data };
        if (data.code) {
            updateData.code = data.code.toUpperCase();
        }

        return await prisma.coupon.update({
            where: { id },
            data: updateData,
            include: {
                market: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async delete(id: string) {
        return await prisma.coupon.delete({
            where: { id }
        });
    }

    async validateCoupon(code: string, orderValue: number, marketId?: string) {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            throw new Error("Cupom não encontrado");
        }

        if (!coupon.isActive) {
            throw new Error("Cupom inativo");
        }

        const now = new Date();
        if (coupon.validFrom > now) {
            throw new Error("Cupom ainda não é válido");
        }

        if (coupon.validUntil && coupon.validUntil < now) {
            throw new Error("Cupom expirado");
        }

        if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
            throw new Error(`Valor mínimo do pedido deve ser R$ ${coupon.minOrderValue.toFixed(2)}`);
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new Error("Cupom esgotado");
        }

        if (marketId && coupon.marketId && coupon.marketId !== marketId) {
            throw new Error("Cupom não é válido para este mercado");
        }

        return coupon;
    }

    async applyCoupon(couponId: string) {
        return await prisma.coupon.update({
            where: { id: couponId },
            data: {
                usedCount: {
                    increment: 1
                }
            }
        });
    }

    async calculateDiscount(coupon: any, orderValue: number) {
        let discount = 0;

        if (coupon.type === "PERCENTAGE") {
            discount = (orderValue * coupon.value) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else if (coupon.type === "FIXED") {
            discount = coupon.value;
            if (discount > orderValue) {
                discount = orderValue;
            }
        }

        return Math.round(discount * 100) / 100;
    }
}

export const couponRepository = new CouponRepository(); 