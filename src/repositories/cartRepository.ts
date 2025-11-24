import { Prisma } from '@prisma/client';
import { CreateCartItemDTO } from '../dtos/cartDTO';
import { prisma } from '../utils/prisma';

class CartRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  async findByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);
    return await client.cart.findMany({
      where: { userId },
      include: {
        market: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async deleteLegacyCarts(userId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);
    return await client.cart.deleteMany({
      where: {
        userId,
        marketId: null,
      },
    });
  }

  async findByUserAndMarket(userId: string, marketId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);
    return await client.cart.findFirst({
      where: {
        userId,
        marketId,
      },
      include: {
        market: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(userId: string, marketId: string) {
    return await prisma.cart.create({
      data: { userId, marketId },
      include: {
        market: true,
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

  async clearCart(cartId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);
    return await client.cartItem.deleteMany({
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
        market: true,
      },
    });
  }

  async deleteCart(cartId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);
    return await client.cart.delete({
      where: { id: cartId },
    });
  }
}

export const cartRepository = new CartRepository();