import { Prisma } from "@prisma/client";
import { Order } from "../domain/orderDomain";
import { OrderItem } from "../domain/orderItemDomain";
import { OrderDTO, OrderUpdateDTO } from "../dtos/orderDTO";
import { prisma } from "../utils/prisma";

class OrderRepository {
    async createOrder(
        orderDTO: OrderDTO & { userId: string; total: number; discount?: number; couponId?: string | null },
        txClient?: Prisma.TransactionClient,
    ) {
        const { items } = orderDTO;

        const createOrderWithClient = async (client: Prisma.TransactionClient) => {
            const order = await client.order.create({
                data: {
                    userId: orderDTO.userId,
                    marketId: orderDTO.marketId,
                    addressId: orderDTO.addressId,
                    paymentMethod: orderDTO.paymentMethod,
                    status: "PENDING",
                    total: orderDTO.total,
                    discount: orderDTO.discount || null,
                    couponId: orderDTO.couponId || null,
                },
            });

            if (items && items.length > 0) {
                await client.orderItem.createMany({
                    data: items.map((item) => ({
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                });
            }

            return order;
        };

        const order = txClient
            ? await createOrderWithClient(txClient)
            : await prisma.$transaction(async (tx) => createOrderWithClient(tx));

        // Buscar os items criados para retornar o order completo
        const orderItems = await prisma.orderItem.findMany({
            where: { orderId: order.id }
        });

        return {
            ...order,
            items: orderItems.map(item => new OrderItem(
                item.id,
                item.orderId,
                item.productId,
                item.quantity,
                item.price,
                undefined,
                item.createdAt,
                item.updatedAt,
            ))
        };
    }

    async getOrders(page: number, size: number, status?: string, userId?: string, marketId?: string, delivererId?: string) {
        const orders = await prisma.order.findMany({
            where: {
                status: status as any,
                userId,
                marketId,
                delivererId,
            },
            skip: (page - 1) * size,
            take: size,
            orderBy: {
                createdAt: 'desc',
            }
        });

        // Buscar os items de todos os pedidos de uma vez
        const orderIds = orders.map(order => order.id);
        const items = await prisma.orderItem.findMany({
            where: {
                orderId: { in: orderIds }
            }
        });

        // Agrupar items por orderId
        const itemsByOrderId = items.reduce((acc, item) => {
            if (!acc[item.orderId]) {
                acc[item.orderId] = [];
            }
            acc[item.orderId].push(item);
            return acc;
        }, {} as Record<string, typeof items>);

        return orders.map((order) => {
            const orderItems = itemsByOrderId[order.id] || [];
            return new Order(
                order.id,
                order.userId,
                order.marketId,
                order.status,
                order.total,
                orderItems.map(item => new OrderItem(
                    item.id,
                    item.orderId,
                    item.productId,
                    item.quantity,
                    item.price,
                    undefined,
                    item.createdAt,
                    item.updatedAt,
                )),
                order.delivererId ?? undefined,
                order.couponId ?? undefined,
                order.discount ?? undefined,
                order.paymentMethod ?? undefined,
                order.addressId ?? undefined,
                order.createdAt,
                order.updatedAt,
            );
        });
    }

    async getOrderById(id: string) {
        const order = await prisma.order.findUnique({
            where: { id }
        });

        if (!order) {
            return null;
        }

        // Buscar os items do pedido
        const items = await prisma.orderItem.findMany({
            where: { orderId: id }
        });

        return {
            ...order,
            items: items.map(item => new OrderItem(
                item.id,
                item.orderId,
                item.productId,
                item.quantity,
                item.price,
                undefined,
                item.createdAt,
                item.updatedAt,
            ))
        };
    }

    async updateOrder(id: string, orderUpdateDTO: OrderUpdateDTO) {
        const order = await prisma.order.update({
            where: { id },
            data: orderUpdateDTO
        });
        return order;
    }

    async assignDeliverer(orderId: string, delivererId: string) {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                delivererId,
                status: "OUT_FOR_DELIVERY"
            }
        });
        return order;
    }

    async countOrders(status?: string, userId?: string, marketId?: string, delivererId?: string) {
        const count = await prisma.order.count({
            where: {
                status: status as any,
                userId,
                marketId,
                delivererId,
            },
        });
        return count;
    }
}

export const orderRepository = new OrderRepository();
