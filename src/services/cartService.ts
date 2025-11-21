import {
  AddMultipleItemsDTO,
  CartItemResponseDTO,
  CartResponseDTO,
  CreateCartItemDTO
} from '../dtos/cartDTO';
import { cartRepository } from '../repositories/cartRepository';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { Logger } from '../utils/logger';

export class CartService {
  async getUserCarts(userId: string): Promise<CartResponseDTO[]> {
    Logger.info('CartService', 'getUserCarts', `userId: ${userId}`);

    await cartRepository.deleteLegacyCarts(userId);
    const carts = await cartRepository.findByUserId(userId);
    const validCarts = carts.filter((cart) => cart.marketId);

    return validCarts.map((cart) => this.formatCartResponse(cart));
  }

  async createCart(userId: string, marketId: string): Promise<CartResponseDTO> {
    Logger.info('CartService', 'createCart', `userId: ${userId} marketId: ${marketId}`);

    let cart = await cartRepository.findByUserAndMarket(userId, marketId);
    if (!cart) {
      cart = await cartRepository.create(userId, marketId);
    }

    return this.formatCartResponse(cart);
  }

  async addItem(userId: string, itemData: CreateCartItemDTO): Promise<CartResponseDTO> {
    try {
      Logger.info('CartService', 'addItem', JSON.stringify({ userId, productId: itemData.productId, quantity: itemData.quantity }));

      Logger.info('CartService', 'addItem', 'Buscando produto...');
      const product = await cartRepository.findProductById(itemData.productId);
      Logger.info('CartService', 'addItem', `Produto encontrado: ${product ? 'Sim' : 'Não'}`);

      if (!product) {
        Logger.warn('CartService', 'addItem', `Produto ${itemData.productId} não encontrado`);
        throw new NotFoundError('Produto não encontrado');
      }

      Logger.info('CartService', 'addItem', 'Garantindo carrinho do mercado...');
      const cart = await this.ensureCartForMarket(userId, product.marketId);

      Logger.info('CartService', 'addItem', 'Adicionando item ao carrinho...');
      await cartRepository.addItem(cart.id, itemData);
      const updatedCart = await cartRepository.findCartWithItems(cart.id);

      Logger.success('CartService', 'addItem', 'Item adicionado com sucesso');

      if (!updatedCart) {
        throw new NotFoundError('Carrinho não encontrado após adicionar item');
      }

      return this.formatCartResponse(updatedCart);
    } catch (error) {
      Logger.errorOperation('CartService', 'addItem', error);
      throw error;
    }
  }

  async addMultipleItems(userId: string, itemsData: AddMultipleItemsDTO): Promise<CartResponseDTO[]> {
    const marketGroups = new Map<string, { cartId: string; items: CreateCartItemDTO[] }>();

    for (const item of itemsData.items) {
      const product = await cartRepository.findProductById(item.productId);
      if (!product) {
        throw new NotFoundError(`Produto com ID ${item.productId} não encontrado`);
      }

      const marketId = product.marketId;
      let group = marketGroups.get(marketId);

      if (!group) {
        const cart = await this.ensureCartForMarket(userId, marketId);
        group = { cartId: cart.id, items: [] };
        marketGroups.set(marketId, group);
      }

      group.items.push(item);
    }

    for (const group of marketGroups.values()) {
      for (const item of group.items) {
        await cartRepository.addItem(group.cartId, item);
      }
    }

    const updatedCarts: CartResponseDTO[] = [];
    for (const group of marketGroups.values()) {
      const cart = await cartRepository.findCartWithItems(group.cartId);
      if (cart) {
        updatedCarts.push(this.formatCartResponse(cart));
      }
    }

    return updatedCarts;
  }

  async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartResponseDTO> {
    const cartItem = await cartRepository.findItemById(cartItemId);

    if (!cartItem) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    await cartRepository.updateItemQuantity(cartItemId, quantity);

    const updatedCart = await cartRepository.findCartWithItems(cartItem.cartId);
    if (!updatedCart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    return this.formatCartResponse(updatedCart);
  }

  async removeItem(userId: string, cartItemId: string): Promise<void> {
    const cartItem = await cartRepository.findItemById(cartItemId);

    if (!cartItem) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    await cartRepository.removeItem(cartItemId);
    await this.deleteCartIfEmpty(cartItem.cartId);
  }

  async clearCart(userId: string, cartId: string): Promise<void> {
    const cart = await cartRepository.findCartWithItems(cartId);

    if (!cart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    if (cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    await cartRepository.clearCart(cartId);
    await this.deleteCartIfEmpty(cartId);
  }

  async deleteCart(userId: string, cartId: string): Promise<void> {
    const cart = await cartRepository.findCartWithItems(cartId);

    if (!cart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    if (cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    await cartRepository.deleteCart(cartId);
  }

  private async ensureCartForMarket(userId: string, marketId: string) {
    let cart = await cartRepository.findByUserAndMarket(userId, marketId);
    if (!cart) {
      cart = await cartRepository.create(userId, marketId);
    }
    return cart;
  }

  private async deleteCartIfEmpty(cartId: string) {
    const cart = await cartRepository.findCartWithItems(cartId);
    if (cart && cart.items.length === 0) {
      await cartRepository.deleteCart(cartId);
    }
  }

  private formatCartResponse(cart: any): CartResponseDTO {
    const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalValue = cart.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

    return {
      id: cart.id,
      userId: cart.userId,
      marketId: cart.marketId,
      items: cart.items.map((item: any) => this.formatCartItemResponse(item)),
      totalItems,
      totalValue,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
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

export const cartService = new CartService();