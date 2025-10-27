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
  async getUserCart(userId: string): Promise<CartResponseDTO> {
    Logger.info('CartService', 'getUserCart', `userId: ${userId}`);

    let cart = await cartRepository.findByUserId(userId);

    Logger.info('CartService', 'getUserCart', `Cart encontrado: ${cart ? 'Sim' : 'Não'}`);

    if (!cart) {
      Logger.info('CartService', 'getUserCart', 'Criando novo carrinho');
      cart = await cartRepository.create(userId);
    }

    return this.formatCartResponse(cart);
  }

  async createCart(userId: string): Promise<CartResponseDTO> {
    // Verificar se já existe um carrinho para o usuário
    const existingCart = await cartRepository.findByUserId(userId);

    if (existingCart) {
      return this.formatCartResponse(existingCart);
    }

    // Criar novo carrinho
    const cart = await cartRepository.create(userId);
    return this.formatCartResponse(cart);
  }

  async addItem(userId: string, itemData: CreateCartItemDTO): Promise<CartItemResponseDTO> {
    try {
      Logger.info('CartService', 'addItem', JSON.stringify({ userId, productId: itemData.productId, quantity: itemData.quantity }));

      Logger.info('CartService', 'addItem', 'Buscando produto...');
      const product = await cartRepository.findProductById(itemData.productId);
      Logger.info('CartService', 'addItem', `Produto encontrado: ${product ? 'Sim' : 'Não'}`);

      if (!product) {
        Logger.warn('CartService', 'addItem', `Produto ${itemData.productId} não encontrado`);
        throw new NotFoundError('Produto não encontrado');
      }

      Logger.info('CartService', 'addItem', 'Buscando carrinho do usuário...');
      let cart = await cartRepository.findByUserId(userId);
      Logger.info('CartService', 'addItem', `Carrinho encontrado: ${cart ? 'Sim' : 'Não'}`);

      if (!cart) {
        Logger.info('CartService', 'addItem', 'Carrinho não encontrado, criando um novo');
        cart = await cartRepository.create(userId);
        Logger.info('CartService', 'addItem', `Carrinho criado com ID: ${cart.id}`);
      }

      Logger.info('CartService', 'addItem', 'Adicionando item ao carrinho...');
      const cartItem = await cartRepository.addItem(cart.id, itemData);
      Logger.info('CartService', 'addItem', 'Item adicionado ao carrinho com sucesso');

      Logger.info('CartService', 'addItem', 'Formatando resposta...');
      const formattedResponse = this.formatCartItemResponse(cartItem);
      Logger.success('CartService', 'addItem', 'Item adicionado com sucesso');

      return formattedResponse;
    } catch (error) {
      Logger.errorOperation('CartService', 'addItem', error);
      throw error;
    }
  }

  async addMultipleItems(userId: string, itemsData: AddMultipleItemsDTO): Promise<CartResponseDTO> {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    for (const item of itemsData.items) {
      const product = await cartRepository.findProductById(item.productId);
      if (!product) {
        throw new NotFoundError(`Produto com ID ${item.productId} não encontrado`);
      }
    }

    for (const item of itemsData.items) {
      await cartRepository.addItem(cart.id, item);
    }

    const updatedCart = await cartRepository.findCartWithItems(cart.id);
    return this.formatCartResponse(updatedCart!);
  }

  async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartItemResponseDTO> {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    const cartItem = await cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    const updatedItem = await cartRepository.updateItemQuantity(cartItemId, quantity);
    return this.formatCartItemResponse(updatedItem);
  }

  async removeItem(userId: string, cartItemId: string): Promise<void> {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    const cartItem = await cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    await cartRepository.removeItem(cartItemId);
  }

  async clearCart(userId: string): Promise<void> {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    await cartRepository.clearCart(cart.id);
  }

  async deleteCart(userId: string): Promise<void> {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    await cartRepository.deleteCart(cart.id);
  }

  private formatCartResponse(cart: any): CartResponseDTO {
    const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalValue = cart.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

    return {
      id: cart.id,
      userId: cart.userId,
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