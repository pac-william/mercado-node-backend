import { Meta } from "../domain/metaDomain";
import { OrderPaginatedResponse } from "../domain/orderDomain";
import { OrderDTO, OrderUpdateDTO, AssignDelivererDTO } from "../dtos/orderDTO";
import { orderRepository } from "../repositories/orderRepository";
import { couponService } from './couponService';

class OrderService {
    async createOrder(orderDTO: OrderDTO) {
        let total = 0;
        let discount = 0;
        let couponId = null;

        // Calcular total dos itens
        for (const item of orderDTO.items) {
            total += item.price * item.quantity;
        }

        // Aplicar cupom se fornecido
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

        return await orderRepository.createOrder(orderData);
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