import { Order } from "../domain/orderDomain";
import { OrderDTO, OrderUpdateDTO } from "../dtos/orderDTO";
import { prisma } from "../utils/prisma";

class OrderRepository {
    async createOrder(orderDTO: OrderDTO) {
        const { items, ...orderData } = orderDTO;
        
        const order = await prisma.order.create({
            data: {
                ...orderData,
                total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            },
            include: {
                user: true,
                market: true,
                deliverer: true,
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        return order;
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
            },
            include: {
                user: true,
                market: true,
                deliverer: true,
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        return orders.map((order) => new Order(
            order.id,
            order.userId,
            order.marketId,
            order.status,
            order.total,
            order.deliveryAddress,
            order.delivererId ?? undefined,
        ));
    }

    async getOrderById(id: string) {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                market: true,
                deliverer: true,
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        return order;
    }

    async updateOrder(id: string, orderUpdateDTO: OrderUpdateDTO) {
        const order = await prisma.order.update({
            where: { id },
            data: orderUpdateDTO,
            include: {
                user: true,
                market: true,
                deliverer: true,
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        return order;
    }

    async assignDeliverer(orderId: string, delivererId: string) {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { 
                delivererId,
                status: "OUT_FOR_DELIVERY"
            },
            include: {
                user: true,
                market: true,
                deliverer: true,
                items: {
                    include: {
                        product: true,
                    }
                }
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
