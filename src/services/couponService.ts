import { couponRepository } from "../repositories/couponRepository";
import { CouponDTO, CouponUpdateDTO, CouponValidationDTO } from "../dtos/couponDTO";

class CouponService {
    async createCoupon(data: CouponDTO) {
        const existingCoupon = await couponRepository.getByCode(data.code);
        if (existingCoupon) {
            throw new Error("Já existe um cupom com este código");
        }

        return await couponRepository.create(data);
    }

    async getCoupons(page: number = 1, size: number = 10, marketId?: string, isActive?: boolean) {
        return await couponRepository.get(page, size, marketId, isActive);
    }

    async getCouponById(id: string) {
        const coupon = await couponRepository.getById(id);
        if (!coupon) {
            throw new Error("Cupom não encontrado");
        }
        return coupon;
    }

    async updateCoupon(id: string, data: CouponUpdateDTO) {
        const existingCoupon = await couponRepository.getById(id);
        if (!existingCoupon) {
            throw new Error("Cupom não encontrado");
        }

        if (data.code && data.code !== existingCoupon.code) {
            const couponWithSameCode = await couponRepository.getByCode(data.code);
            if (couponWithSameCode && couponWithSameCode.id !== id) {
                throw new Error("Já existe um cupom com este código");
            }
        }

        return await couponRepository.update(id, data);
    }

    async deleteCoupon(id: string) {
        const existingCoupon = await couponRepository.getById(id);
        if (!existingCoupon) {
            throw new Error("Cupom não encontrado");
        }

        return await couponRepository.delete(id);
    }

    async validateCoupon(code: string, orderValue: number, marketId?: string) {
        return await couponRepository.validateCoupon(code, orderValue, marketId);
    }

    async calculateDiscount(couponCode: string, orderValue: number, marketId?: string) {
        const coupon = await couponRepository.validateCoupon(couponCode, orderValue, marketId);
        const discount = await couponRepository.calculateDiscount(coupon, orderValue);
        
        return {
            coupon,
            discount,
            finalValue: orderValue - discount
        };
    }

    async applyCouponToOrder(couponCode: string, orderValue: number, marketId?: string) {
        const result = await this.calculateDiscount(couponCode, orderValue, marketId);
        await couponRepository.applyCoupon(result.coupon.id);
        
        return result;
    }
}

export const couponService = new CouponService(); 