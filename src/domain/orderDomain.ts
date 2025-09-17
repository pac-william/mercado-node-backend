import { Meta } from "./metaDomain";

export class Order {
    constructor(
        public id: string,
        public userId: string,
        public marketId: string,
        public status: string,
        public total: number,
        public deliveryAddress: string,
        public delivererId?: string,
    ) { }
}

export class OrderPaginatedResponse {
    constructor(
        public orders: Order[],
        public meta: Meta,
    ) { }
}
