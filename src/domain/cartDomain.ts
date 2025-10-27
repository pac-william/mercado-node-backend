import { Meta } from "./metaDomain";

export class CartItem {
    constructor(
        public id: string,
        public cartId: string,
        public productId: string,
        public quantity: number,
        public product?: any | null,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}

export class Cart {
    constructor(
        public id: string,
        public userId: string,
        public items: CartItem[] = [],
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}

export class CartResponse extends Cart {
    constructor(
        id: string,
        userId: string,
        items: CartItem[],
        public totalItems: number,
        public totalValue: number,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
    ) {
        super(id, userId, items, createdAt, updatedAt);
    }
}

export class CartItemResponse {
    constructor(
        public id: string,
        public productId: string,
        public quantity: number,
        public product: {
            id: string;
            name: string;
            price: number;
            unit: string;
            image: string | null;
            marketId: string;
        },
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class CartPaginatedResponse {
    constructor(
        public carts: Cart[],
        public meta: Meta,
    ) { }
}




