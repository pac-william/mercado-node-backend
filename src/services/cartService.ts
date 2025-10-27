import {
    AddMultipleItemsDTO,
    CartItemResponseDTO,
    CartResponseDTO,
    CreateCartItemDTO
} from '../dtos/cartDTO';
import { CartRepository } from '../repositories/cartRepository';
import { ForbiddenError, NotFoundError } from '../utils/errors';

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getUserCart(userId: string): Promise<CartResponseDTO> {
    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    return this.formatCartResponse(cart);
  }

  async addItem(userId: string, itemData: CreateCartItemDTO): Promise<CartItemResponseDTO> {
    const product = await this.cartRepository.findProductById(itemData.productId);
    if (!product) {
      throw new NotFoundError('Produto não encontrado');
    }

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    const cartItem = await this.cartRepository.addItem(cart.id, itemData);
    
    return this.formatCartItemResponse(cartItem);
  }

  async addMultipleItems(userId: string, itemsData: AddMultipleItemsDTO): Promise<CartResponseDTO> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    for (const item of itemsData.items) {
      const product = await this.cartRepository.findProductById(item.productId);
      if (!product) {
        throw new NotFoundError(`Produto com ID ${item.productId} não encontrado`);
      }
    }

    for (const item of itemsData.items) {
      await this.cartRepository.addItem(cart.id, item);
    }

    const updatedCart = await this.cartRepository.findCartWithItems(cart.id);
    return this.formatCartResponse(updatedCart!);
  }

  async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartItemResponseDTO> {
    const cartItem = await this.cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    const updatedItem = await this.cartRepository.updateItemQuantity(cartItemId, quantity);
    return this.formatCartItemResponse(updatedItem);
  }

  async removeItem(userId: string, cartItemId: string): Promise<void> {
    const cartItem = await this.cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    await this.cartRepository.removeItem(cartItemId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    await this.cartRepository.clearCart(cart.id);
  }

  async deleteCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    await this.cartRepository.deleteCart(cart.id);
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
