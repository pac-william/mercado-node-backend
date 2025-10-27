import { Product } from "./productDomain";

export class OrderItem {
    constructor(
        public id: string,
        public orderId: string,
        public productId: string,
        public quantity: number,
        public price: number,
        public product?: Product | null,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}




