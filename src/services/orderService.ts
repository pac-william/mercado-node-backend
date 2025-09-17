import { Meta } from "../domain/metaDomain";
import { OrderPaginatedResponse } from "../domain/orderDomain";
import { OrderDTO, OrderUpdateDTO, AssignDelivererDTO } from "../dtos/orderDTO";
import { orderRepository } from "../repositories/orderRepository";

class OrderService {
    async createOrder(orderDTO: OrderDTO) {
        return await orderRepository.createOrder(orderDTO);
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