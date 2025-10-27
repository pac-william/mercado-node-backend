import { Meta } from "./metaDomain";

export class Coupon {
    constructor(
        public id: string,
        public code: string,
        public name: string,
        public description?: string | null,
        public type: string = 'PERCENTAGE',
        public value: number = 0,
        public minOrderValue?: number | null,
        public maxDiscount?: number | null,
        public usageLimit?: number | null,
        public usedCount: number = 0,
        public isActive: boolean = true,
        public validFrom: Date = new Date(),
        public validUntil?: Date | null,
        public marketId?: string | null,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}

export class CouponPaginatedResponse {
    constructor(
        public coupons: Coupon[],
        public meta: Meta,
    ) { }
}




