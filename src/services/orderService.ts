import { Meta } from "../domain/metaDomain";
import { OrderPaginatedResponse } from "../domain/orderDomain";
import { OrderDTO, OrderUpdateDTO, AssignDelivererDTO } from "../dtos/orderDTO";
import { orderRepository } from "../repositories/orderRepository";
import { couponService } from './couponService';
import { cartRepository } from '../repositories/cartRepository';
import { prisma } from '../utils/prisma';
import { Logger } from '../utils/logger';

class OrderService {
    async createOrder(orderDTO: OrderDTO) {
        Logger.info('OrderService', 'createOrder', `Creating order for user ${orderDTO.userId}`);

        const user = await prisma.user.findUnique({ where: { id: orderDTO.userId } });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const market = await prisma.market.findUnique({ where: { id: orderDTO.marketId } });
        if (!market) {
            throw new Error('Mercado não encontrado');
        }

        for (const item of orderDTO.items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                throw new Error(`Produto com ID ${item.productId} não encontrado`);
            }
        }

        let total = 0;
        let discount = 0;
        let couponId = null;

        for (const item of orderDTO.items) {
            total += item.price * item.quantity;
        }

        if (orderDTO.couponCode) {
            try {
                const couponResult = await couponService.applyCouponToOrder(
                    orderDTO.couponCode,
                    total,
                    orderDTO.marketId
                );
                discount = couponResult.discount;
                couponId = couponResult.coupon.id;
                total = couponResult.finalValue;
            } catch (error) {
                throw new Error(`Erro ao aplicar cupom: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }
        }

        const orderData = {
            ...orderDTO,
            total,
            discount,
            couponId
        };

        const order = await orderRepository.createOrder(orderData);
        
        const cart = await cartRepository.findByUserId(orderDTO.userId);
        if (cart) {
            await cartRepository.clearCart(cart.id);
            Logger.info('OrderService', 'createOrder', 'Cart cleared after order creation');
        }

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
        return await orderRepository.updateOrder(id, orderUpdateDTO);
    }

    async assignDeliverer(orderId: string, assignDelivererDTO: AssignDelivererDTO) {
        return await orderRepository.assignDeliverer(orderId, assignDelivererDTO.delivererId);
    }
}

export const orderService = new OrderService();