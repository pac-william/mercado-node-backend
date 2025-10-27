import { CartItem } from "../domain/cartItemDomain";
import { CreateCartItemDTO } from "../dtos/cartItemDTO";
import { prisma } from "../utils/prisma";

class CartItemRepository {
    async create(cartId: string, cartItemDTO: CreateCartItemDTO) {
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId,
                productId: cartItemDTO.productId,
            },
        });

        if (existingItem) {
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + cartItemDTO.quantity },
                include: {
                    product: true,
                },
            });
            return new CartItem(
                updatedItem.id,
                updatedItem.cartId,
                updatedItem.productId,
                updatedItem.quantity,
                updatedItem.product ? { ...updatedItem.product, categoryId: updatedItem.product.categoryId ?? undefined } : null,
                updatedItem.createdAt,
                updatedItem.updatedAt,
            );
        } else {
            const cartItem = await prisma.cartItem.create({
                data: {
                    cartId,
                    productId: cartItemDTO.productId,
                    quantity: cartItemDTO.quantity,
                },
                include: {
                    product: true,
                },
            });
            return new CartItem(
                cartItem.id,
                cartItem.cartId,
                cartItem.productId,
                cartItem.quantity,
                cartItem.product ? { ...cartItem.product, categoryId: cartItem.product.categoryId ?? undefined } : null,
                cartItem.createdAt,
                cartItem.updatedAt,
            );
        }
    }

    async findById(id: string) {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: {
                product: true,
                cart: true,
            },
        });
        
        if (!cartItem) {
            return null;
        }

        return new CartItem(
            cartItem.id,
            cartItem.cartId,
            cartItem.productId,
            cartItem.quantity,
            cartItem.product ? { ...cartItem.product, categoryId: cartItem.product.categoryId ?? undefined } : null,
            cartItem.createdAt,
            cartItem.updatedAt,
        );
    }

    async updateQuantity(id: string, quantity: number) {
        const cartItem = await prisma.cartItem.update({
            where: { id },
            data: { quantity },
            include: {
                product: true,
            },
        });
        
        return new CartItem(
            cartItem.id,
            cartItem.cartId,
            cartItem.productId,
            cartItem.quantity,
            cartItem.product ? { ...cartItem.product, categoryId: cartItem.product.categoryId ?? undefined } : null,
            cartItem.createdAt,
            cartItem.updatedAt,
        );
    }

    async delete(id: string) {
        return await prisma.cartItem.delete({
            where: { id },
        });
    }

    async findByCartId(cartId: string) {
        const cartItems = await prisma.cartItem.findMany({
            where: { cartId },
            include: {
                product: true,
            },
        });

        return cartItems.map(item => new CartItem(
            item.id,
            item.cartId,
            item.productId,
            item.quantity,
            item.product ? { ...item.product, categoryId: item.product.categoryId ?? undefined } : null,
            item.createdAt,
            item.updatedAt,
        ));
    }

    async findProductById(productId: string) {
        return await prisma.product.findUnique({
            where: { id: productId },
        });
    }
}

export const cartItemRepository = new CartItemRepository();
