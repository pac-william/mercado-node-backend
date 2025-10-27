import { Request, Response } from "express";
import { addMultipleItemsSchema, createCartItemSchema } from "../dtos/cartDTO";
import { CartService } from "../services/cartService";
import { Logger } from "../utils/logger";

export class CartController {
    private cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }

    async getUserCart(req: Request, res: Response) {
        Logger.controller('Cart', 'getUserCart', 'query', req.query);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const userId = req.user.id;

            const cart = await this.cartService.getUserCart(userId);
            Logger.successOperation('CartController', 'getUserCart');
            return res.status(200).json(cart);
        } catch (error) {
            Logger.errorOperation('CartController', 'getUserCart', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async addItem(req: Request, res: Response) {
        Logger.controller('Cart', 'addItem', 'req: Request, res: Response', { body: req.body });
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const itemData = createCartItemSchema.parse(req.body);
            const cartItem = await this.cartService.addItem(userId, itemData);
            Logger.successOperation('CartController', 'addItem');
            return res.status(201).json(cartItem);
        } catch (error) {
            Logger.errorOperation('CartController', 'addItem', error);
            if (error instanceof Error && error.message === "Produto não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async addMultipleItems(req: Request, res: Response) {
        Logger.controller('Cart', 'addMultipleItems', 'req: Request, res: Response', { body: req.body });
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const itemsData = addMultipleItemsSchema.parse(req.body);
            const cart = await this.cartService.addMultipleItems(userId, itemsData);
            Logger.successOperation('CartController', 'addMultipleItems');
            return res.status(201).json(cart);
        } catch (error) {
            Logger.errorOperation('CartController', 'addMultipleItems', error);
            if (error instanceof Error && error.message.includes("não encontrado")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateItemQuantity(req: Request, res: Response) {
        Logger.controller('Cart', 'updateItemQuantity', 'query', req.query);
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { cartItemId } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                return res.status(400).json({ message: "Quantidade deve ser pelo menos 1" });
            }

            const cartItem = await this.cartService.updateItemQuantity(userId, cartItemId, quantity);
            Logger.successOperation('CartController', 'updateItemQuantity');
            return res.status(200).json(cartItem);
        } catch (error) {
            Logger.errorOperation('CartController', 'updateItemQuantity', error);
            if (error instanceof Error && (error.message === "Item não encontrado no carrinho" || error.message === "Acesso negado")) {
                return res.status(error.message === "Item não encontrado no carrinho" ? 404 : 403).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async removeItem(req: Request, res: Response) {
        Logger.controller('Cart', 'removeItem', 'query', req.query);
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { cartItemId } = req.params;
            await this.cartService.removeItem(userId, cartItemId);
            Logger.successOperation('CartController', 'removeItem');
            return res.status(204).send();
        } catch (error) {
            Logger.errorOperation('CartController', 'removeItem', error);
            if (error instanceof Error && (error.message === "Item não encontrado no carrinho" || error.message === "Acesso negado")) {
                return res.status(error.message === "Item não encontrado no carrinho" ? 404 : 403).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async clearCart(req: Request, res: Response) {
        Logger.controller('Cart', 'clearCart', 'query', req.query);
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            await this.cartService.clearCart(userId);
            Logger.successOperation('CartController', 'clearCart');
            return res.status(204).send();
        } catch (error) {
            Logger.errorOperation('CartController', 'clearCart', error);
            if (error instanceof Error && error.message === "Carrinho não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteCart(req: Request, res: Response) {
        Logger.controller('Cart', 'deleteCart', 'query', req.query);
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            await this.cartService.deleteCart(userId);
            Logger.successOperation('CartController', 'deleteCart');
            return res.status(204).send();
        } catch (error) {
            Logger.errorOperation('CartController', 'deleteCart', error);
            if (error instanceof Error && error.message === "Carrinho não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const cartController = new CartController();
