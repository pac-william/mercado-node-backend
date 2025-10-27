import { z } from "zod";

export const OrderItemDTO = z.object({
    productId: z.string({ message: "ID do produto é obrigatório" }),
    quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" }),
    price: z.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
});

export const OrderDTO = z.object({
    marketId: z.string({ error: "ID do mercado é obrigatório" }),
    addressId: z.string({ error: "ID do endereço é obrigatório" }),
    items: z.array(z.object({
        productId: z.string({ error: "ID do produto é obrigatório" }),
        quantity: z.number().int().positive({ error: "Quantidade deve ser um número inteiro positivo" }),
        price: z.number().positive({ error: "Preço deve ser um número positivo" })
    }), { error: "Itens do pedido são obrigatórios" }),
    paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PIX", "CASH"], { error: "Método de pagamento inválido" }),
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
    addressId?: string;
    status: string;
    total: number;
    discount?: number | null;
    paymentMethod?: string;
    items: Array<{
        id: string;
        productId: string;
        quantity: number;
        price: number;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
};

export const toOrderResponseDTO = (o: any): OrderResponseDTO => ({
    id: String(o.id),
    userId: String(o.userId),
    marketId: String(o.marketId),
    delivererId: o.delivererId ? String(o.delivererId) : null,
    couponId: o.couponId ? String(o.couponId) : null,
    addressId: o.addressId ? String(o.addressId) : undefined,
    status: o.status,
    total: o.total,
    discount: o.discount,
    paymentMethod: o.paymentMethod,
    items: o.items?.map((item: any) => ({
        id: String(item.id),
        productId: String(item.productId),
        quantity: item.quantity,
        price: item.price,
    })) || [],
    createdAt: o.createdAt ? (o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)) : undefined,
    updatedAt: o.updatedAt ? (o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt)) : undefined,
}); 