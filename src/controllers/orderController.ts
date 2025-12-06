import { Request, Response } from "express";
import { AssignDelivererDTO, OrderDTO, OrderUpdateDTO, toOrderResponseDTO } from "../dtos/orderDTO";
import { orderService } from "../services/orderService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class OrderController {
    async getOrders(req: Request, res: Response) {
        Logger.controller('Order', 'getOrders', 'query', req.query);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const { page, size, status, marketId, delivererId } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('status')
                .withString('marketId')
                .withString('delivererId')
                .build();

            const orders = await orderService.getOrders(page, size, status, userId, marketId, delivererId);
            Logger.successOperation('OrderController', 'getOrders');
            return res.status(200).json({
                orders: orders.orders.map(toOrderResponseDTO),
                meta: orders.meta,
            });
        } catch (error) {
            Logger.errorOperation('OrderController', 'getOrders', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createOrder(req: Request, res: Response) {
        Logger.controller('Order', 'createOrder', 'body', req.body);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const userId = req.user.id;
            const orderDTO = OrderDTO.parse(req.body);
            const order = await orderService.createOrder(userId, orderDTO);
            Logger.successOperation('OrderController', 'createOrder');
            return res.status(201).json(toOrderResponseDTO(order));
        } catch (error) {
            Logger.errorOperation('OrderController', 'createOrder', error);
            if (error instanceof Error) {
                if (error.message.includes('não encontrado')) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes('fechado') || error.message.includes('horário de funcionamento')) {
                    return res.status(400).json({ message: error.message });
                }
                if (error.message.includes('cupom') || error.message.includes('Cupom')) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getOrderById(req: Request, res: Response) {
        Logger.controller('Order', 'getOrderById', 'params', req.params);
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);
            if (!order) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }
            Logger.successOperation('OrderController', 'getOrderById');
            return res.status(200).json(toOrderResponseDTO(order));
        } catch (error) {
            Logger.errorOperation('OrderController', 'getOrderById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getOrdersByMarketId(req: Request, res: Response) {
        Logger.controller('Order', 'getOrdersByMarketId', 'params', req.params);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { marketId } = req.params;
            const { page, size, status, delivererId } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('status')
                .withString('delivererId')
                .build();

            const orders = await orderService.getOrders(page, size, status, undefined, marketId, delivererId);
            Logger.successOperation('OrderController', 'getOrdersByMarketId');
            return res.status(200).json({
                orders: orders.orders.map(toOrderResponseDTO),
                meta: orders.meta,
            });
        } catch (error) {
            Logger.errorOperation('OrderController', 'getOrdersByMarketId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateOrder(req: Request, res: Response) {
        Logger.controller('Order', 'updateOrder', 'params', req.params);
        try {
            const { id } = req.params;
            const orderUpdateDTO = OrderUpdateDTO.parse(req.body);
            const order = await orderService.updateOrder(id, orderUpdateDTO);
            Logger.successOperation('OrderController', 'updateOrder');
            return res.status(200).json(toOrderResponseDTO(order));
        } catch (error) {
            Logger.errorOperation('OrderController', 'updateOrder', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async assignDeliverer(req: Request, res: Response) {
        Logger.controller('Order', 'assignDeliverer', 'params', req.params);
        try {
            const { id } = req.params;
            const assignDelivererDTO = AssignDelivererDTO.parse(req.body);
            const order = await orderService.assignDeliverer(id, assignDelivererDTO);
            Logger.successOperation('OrderController', 'assignDeliverer');
            return res.status(200).json(toOrderResponseDTO(order));
        } catch (error) {
            Logger.errorOperation('OrderController', 'assignDeliverer', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const orderController = new OrderController();
