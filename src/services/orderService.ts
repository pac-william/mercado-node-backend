import { Meta } from "../domain/metaDomain";
import { OrderPaginatedResponse } from "../domain/orderDomain";
import { AssignDelivererDTO, OrderDTO, OrderUpdateDTO } from "../dtos/orderDTO";
import { addressRepository } from "../repositories/addressRepository";
import { cartRepository } from '../repositories/cartRepository';
import { marketRepository } from "../repositories/marketRepository";
import { orderRepository } from "../repositories/orderRepository";
import { productRepository } from "../repositories/productRepository";
import { userRepository } from "../repositories/userRepository";
import { Logger } from '../utils/logger';
import { couponService } from './couponService';

class OrderService {
    async createOrder(userId: string, orderDTO: OrderDTO) {
        Logger.info('OrderService', 'createOrder', `Creating order for user ${userId}`);

        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const market = await marketRepository.getMarketById(orderDTO.marketId);
        if (!market) {
            throw new Error('Mercado não encontrado');
        }

        const address = await addressRepository.getAddressById(orderDTO.addressId);
        if (!address) {
            throw new Error('Endereço não encontrado');
        }

        const productIds = orderDTO.items.map(item => item.productId);
        const products = await productRepository.getProductsByIds(productIds);

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