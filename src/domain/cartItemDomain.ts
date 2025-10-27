import { Product } from "./productDomain";

export class CartItem {
    constructor(
        public id: string,
        public cartId: string,
        public productId: string,
        public quantity: number,
        public product?: Product | null,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}
