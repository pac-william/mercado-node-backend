import { CartItemResponseDTO, CreateCartItemDTO, UpdateCartItemDTO } from "../dtos/cartItemDTO";
import { cartItemRepository } from "../repositories/cartItemRepository";
import { NotFoundError } from "../utils/errors";

class CartItemService {
    async createCartItem(cartId: string, cartItemDTO: CreateCartItemDTO) {
        const product = await cartItemRepository.findProductById(cartItemDTO.productId);
        
        if (!product) {
            throw new NotFoundError('Produto não encontrado');
        }

        const cartItem = await cartItemRepository.create(cartId, cartItemDTO);
        return this.formatCartItemResponse(cartItem);
    }

    async getCartItemById(id: string) {
        const cartItem = await cartItemRepository.findById(id);
        
        if (!cartItem) {
            throw new NotFoundError('Item do carrinho não encontrado');
        }

        return this.formatCartItemResponse(cartItem);
    }

    async updateCartItemQuantity(id: string, updateDTO: UpdateCartItemDTO) {
        const cartItem = await cartItemRepository.findById(id);
        
        if (!cartItem) {
            throw new NotFoundError('Item do carrinho não encontrado');
        }

        const updatedItem = await cartItemRepository.updateQuantity(id, updateDTO.quantity);
        return this.formatCartItemResponse(updatedItem);
    }

    async deleteCartItem(id: string) {
        const cartItem = await cartItemRepository.findById(id);
        
        if (!cartItem) {
            throw new NotFoundError('Item do carrinho não encontrado');
        }

        await cartItemRepository.delete(id);
    }

    async getCartItemsByCartId(cartId: string) {
        const cartItems = await cartItemRepository.findByCartId(cartId);
        return cartItems.map(item => this.formatCartItemResponse(item));
    }

    private formatCartItemResponse(cartItem: any): CartItemResponseDTO {
        return {
            id: cartItem.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            product: {
                id: cartItem.product.id,
                name: cartItem.product.name,
                price: cartItem.product.price,
                unit: cartItem.product.unit,
                image: cartItem.product.image,
                marketId: cartItem.product.marketId,
            },
            createdAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,
        };
    }
}

export const cartItemService = new CartItemService();
