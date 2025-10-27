import { Request, Response } from "express";
import { CreateCartItemDTO, UpdateCartItemDTO } from "../dtos/cartItemDTO";
import { cartItemService } from "../services/cartItemService";
import { Logger } from "../utils/logger";

export class CartItemController {
    async createCartItem(req: Request, res: Response) {
        Logger.controller('CartItem', 'createCartItem', 'body', req.body);
        try {
            const { cartId } = req.params;
            const cartItemDTO = CreateCartItemDTO.parse(req.body);
            
            const cartItem = await cartItemService.createCartItem(cartId, cartItemDTO);
            Logger.successOperation('CartItemController', 'createCartItem');
            return res.status(201).json(cartItem);
        } catch (error) {
            Logger.errorOperation('CartItemController', 'createCartItem', error);
            if (error instanceof Error && error.message === "Produto não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCartItemById(req: Request, res: Response) {
        Logger.controller('CartItem', 'getCartItemById', 'params', req.params);
        try {
            const { id } = req.params;
            const cartItem = await cartItemService.getCartItemById(id);
            Logger.successOperation('CartItemController', 'getCartItemById');
            return res.status(200).json(cartItem);
        } catch (error) {
            Logger.errorOperation('CartItemController', 'getCartItemById', error);
            if (error instanceof Error && error.message === "Item do carrinho não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateCartItemQuantity(req: Request, res: Response) {
        Logger.controller('CartItem', 'updateCartItemQuantity', 'params', req.params);
        try {
            const { id } = req.params;
            const updateDTO = UpdateCartItemDTO.parse(req.body);
            
            const cartItem = await cartItemService.updateCartItemQuantity(id, updateDTO);
            Logger.successOperation('CartItemController', 'updateCartItemQuantity');
            return res.status(200).json(cartItem);
        } catch (error) {
            Logger.errorOperation('CartItemController', 'updateCartItemQuantity', error);
            if (error instanceof Error && error.message === "Item do carrinho não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteCartItem(req: Request, res: Response) {
        Logger.controller('CartItem', 'deleteCartItem', 'params', req.params);
        try {
            const { id } = req.params;
            await cartItemService.deleteCartItem(id);
            Logger.successOperation('CartItemController', 'deleteCartItem');
            return res.status(204).send();
        } catch (error) {
            Logger.errorOperation('CartItemController', 'deleteCartItem', error);
            if (error instanceof Error && error.message === "Item do carrinho não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCartItemsByCartId(req: Request, res: Response) {
        Logger.controller('CartItem', 'getCartItemsByCartId', 'params', req.params);
        try {
            const { cartId } = req.params;
            const cartItems = await cartItemService.getCartItemsByCartId(cartId);
            Logger.successOperation('CartItemController', 'getCartItemsByCartId');
            return res.status(200).json(cartItems);
        } catch (error) {
            Logger.errorOperation('CartItemController', 'getCartItemsByCartId', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const cartItemController = new CartItemController();
