import { z } from "zod";

export const OrderItemDTO = z.object({
    productId: z.string({ message: "ID do produto é obrigatório" }),
    quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" }),
    price: z.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
});

export const OrderDTO = z.object({
    userId: z.string({ error: "ID do usuário é obrigatório" }),
    marketId: z.string({ error: "ID do mercado é obrigatório" }),
    deliveryAddress: z.string({ error: "Endereço de entrega é obrigatório" }),
    items: z.array(z.object({
        productId: z.string({ error: "ID do produto é obrigatório" }),
        quantity: z.number().int().positive({ error: "Quantidade deve ser um número inteiro positivo" }),
        price: z.number().positive({ error: "Preço deve ser um número positivo" })
    }), { error: "Itens do pedido são obrigatórios" }),
    couponCode: z.string().optional() 
});

export type OrderDTO = z.infer<typeof OrderDTO>;
export type OrderItemDTO = z.infer<typeof OrderItemDTO>;

export const OrderUpdateDTO = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]).optional(),
    delivererId: z.string().optional(),
});

export type OrderUpdateDTO = z.infer<typeof OrderUpdateDTO>;

export const AssignDelivererDTO = z.object({
    delivererId: z.string({ message: "ID do entregador é obrigatório" }),
});

export type AssignDelivererDTO = z.infer<typeof AssignDelivererDTO>;

export type OrderResponseDTO = {
    id: string;
    userId: string;
    marketId: string;
    delivererId?: string | null;
    couponId?: string | null;
    coupon?: {
        id: string;
        code: string;
        name: string;
        type: string;
        value: number;
    } | null;
    status: string;
    total: number;
    discount?: number | null;
    deliveryAddress: string;
    items: Array<{
        id: string;
        productId: string;
        product: {
            id: string;
            name: string;
            price: number;
            unit: string;
        };
        quantity: number;
        price: number;
    }>;
    user?: {
        id: string;
        name: string;
        email: string;
    } | null;
    market?: {
        id: string;
        name: string;
        address: string;
    } | null;
    deliverer?: {
        id: string;
        name: string;
        phone: string;
        vehicle: {
            type: string;
            plate?: string | null;
        };
    } | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export const toOrderResponseDTO = (o: any): OrderResponseDTO => ({
    id: String(o.id),
    userId: String(o.userId),
    marketId: String(o.marketId),
    delivererId: o.delivererId ? String(o.delivererId) : null,
    couponId: o.couponId ? String(o.couponId) : null,
    coupon: o.coupon ? {
        id: String(o.coupon.id),
        code: o.coupon.code,
        name: o.coupon.name,
        type: o.coupon.type,
        value: o.coupon.value,
    } : null,
    status: o.status,
    total: o.total,
    discount: o.discount,
    deliveryAddress: o.deliveryAddress,
    items: o.items?.map((item: any) => ({
        id: String(item.id),
        productId: String(item.productId),
        product: {
            id: String(item.product.id),
            name: item.product.name,
            price: item.product.price,
            unit: item.product.unit,
        },
        quantity: item.quantity,
        price: item.price,
    })) || [],
    user: o.user ? {
        id: String(o.user.id),
        name: o.user.name,
        email: o.user.email,
    } : null,
    market: o.market ? {
        id: String(o.market.id),
        name: o.market.name,
        address: o.market.address,
    } : null,
    deliverer: o.deliverer ? {
        id: String(o.deliverer.id),
        name: o.deliverer.name,
        phone: o.deliverer.phone,
        vehicle: {
            type: o.deliverer.vehicle.type,
            plate: o.deliverer.vehicle.plate ?? null,
        },
    } : null,
    createdAt: o.createdAt ? (o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)) : undefined,
    updatedAt: o.updatedAt ? (o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt)) : undefined,
}); 