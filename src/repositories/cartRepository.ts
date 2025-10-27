import { CreateCartItemDTO } from '../dtos/cartDTO';
import { prisma } from '../utils/prisma';

export class CartRepository {
  async findByUserId(userId: string) {
    return await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(userId: string) {
    return await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItem(cartId: string, itemData: CreateCartItemDTO) {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId: itemData.productId,
      },
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + itemData.quantity },
        include: {
          product: true,
        },
      });
    } else {
      return await prisma.cartItem.create({
        data: {
          cartId,
          productId: itemData.productId,
          quantity: itemData.quantity,
        },
        include: {
          product: true,
        },
      });
    }
  }

  async updateItemQuantity(cartItemId: string, quantity: number) {
    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeItem(cartItemId: string) {
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: string) {
    return await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async findItemById(cartItemId: string) {
    return await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        product: true,
        cart: true,
      },
    });
  }

  async findItemByProduct(cartId: string, productId: string) {
    return await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async findProductById(productId: string) {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async findCartWithItems(cartId: string) {
    return await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async deleteCart(cartId: string) {
    return await prisma.cart.delete({
      where: { id: cartId },
    });
  }
}
