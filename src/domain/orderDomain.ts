import { Meta } from "./metaDomain";
import { OrderItem } from "./orderItemDomain";

export class Order {
    constructor(
        public id: string,
        public userId: string,
        public marketId: string,
        public status: string,
        public total: number,
        public items?: OrderItem[],
        public delivererId?: string,
        public couponId?: string,
        public discount?: number,
        public paymentMethod?: string,
        public addressId?: string,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}

export class OrderPaginatedResponse {
    constructor(
        public orders: Order[],
        public meta: Meta,
    ) { }
}
