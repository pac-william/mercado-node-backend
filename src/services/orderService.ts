import { Meta } from "../domain/metaDomain";
import { OrderPaginatedResponse } from "../domain/orderDomain";
import { AssignDelivererDTO, OrderDTO, OrderUpdateDTO } from "../dtos/orderDTO";
import { cartRepository } from '../repositories/cartRepository';
import { orderRepository } from "../repositories/orderRepository";
import { Logger } from '../utils/logger';
import { prisma } from '../utils/prisma';
import { couponService } from './couponService';
import { notifyNewOrder, notifyOrderStatusUpdate } from './orderNotificationService';

class OrderService {
    async createOrder(userId: string, orderDTO: OrderDTO) {
        Logger.info('OrderService', 'createOrder', `Creating order for user ${userId}`);

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const market = await prisma.market.findUnique({ where: { id: orderDTO.marketId } });
        if (!market) {
            throw new Error('Mercado não encontrado');
        }

        const address = await prisma.address.findUnique({ where: { id: orderDTO.addressId } });
        if (!address) {
            throw new Error('Endereço não encontrado');
        }

        const productIds = orderDTO.items.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        const foundProductIds = new Set(products.map(p => p.id));
        for (const item of orderDTO.items) {
            if (!foundProductIds.has(item.productId)) {
                throw new Error(`Produto com ID ${item.productId} não encontrado`);
            }
        }

        let discount = 0;
        let couponId = null;

        // Calcular o total inicial dos itens
        let initialTotal = 0;
        for (const item of orderDTO.items) {
            initialTotal += item.price * item.quantity;
        }

        if (orderDTO.couponCode) {
            try {
                const couponResult = await couponService.applyCouponToOrder(
                    orderDTO.couponCode,
                    initialTotal,
                    orderDTO.marketId
                );
                discount = couponResult.discount;
                couponId = couponResult.coupon.id;
                initialTotal = couponResult.finalValue;
            } catch (error) {
                throw new Error(`Erro ao aplicar cupom: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }
        }

        const orderData = {
            ...orderDTO,
            userId,
            total: initialTotal,
            discount,
            couponId
        };

        const order = await orderRepository.createOrder(orderData);
        
        const cart = await cartRepository.findByUserId(userId);
        if (cart) {
            await cartRepository.clearCart(cart.id);
            Logger.info('OrderService', 'createOrder', 'Cart cleared after order creation');
        }

        notifyNewOrder(userId, order.id, order.total, market.name).catch((error) => {
            Logger.errorOperation('OrderService', 'notifyNewOrder', error.message);
        });

        return order;
    }

    async getOrders(page: number, size: number, status?: string, userId?: string, marketId?: string, delivererId?: string) {
        const count = await orderRepository.countOrders(status, userId, marketId, delivererId);
        const orders = await orderRepository.getOrders(page, size, status, userId, marketId, delivererId);
        return new OrderPaginatedResponse(orders, new Meta(page, size, count, Math.ceil(count / size), count));
    }

    async getOrderById(id: string) {
        return await orderRepository.getOrderById(id);
    }

    async updateOrder(id: string, orderUpdateDTO: OrderUpdateDTO) {
        const currentOrder = await orderRepository.getOrderById(id);
        if (!currentOrder) {
            throw new Error('Pedido não encontrado');
        }

        const oldStatus = currentOrder.status;
        const order = await orderRepository.updateOrder(id, orderUpdateDTO);
        if (orderUpdateDTO.status && orderUpdateDTO.status !== oldStatus) {
            notifyOrderStatusUpdate(
                currentOrder.userId,
                order.id,
                orderUpdateDTO.status as any,
                oldStatus as any
            ).catch((error) => {
                Logger.errorOperation('OrderService', 'notifyOrderStatusUpdate', error.message);
            });
        }

        return order;
    }

    async assignDeliverer(orderId: string, assignDelivererDTO: AssignDelivererDTO) {
        return await orderRepository.assignDeliverer(orderId, assignDelivererDTO.delivererId);
    }
}

export const orderService = new OrderService();