import { Product } from "../domain/productDomain";
import { ProductDTO, ProductUpdateDTO } from "../dtos/productDTO";
import { prisma } from "../utils/prisma";

class ProductRepository {
    async createProduct(productDTO: ProductDTO) {
        const product = await prisma.product.create({
            data: productDTO,
            include: {
                market: true,
                category: true,
            },
        });
        return product;
    }

    async getProducts(page: number, size: number, marketId?: string, name?: string, minPrice?: number, maxPrice?: number, categoryId?: string) {
        const products = await prisma.product.findMany({
            where: {
                marketId,
                categoryId,
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                },
            },
            skip: (page - 1) * size,
            take: size,
            orderBy: {
                name: 'asc',
            },
            include: {
                market: true,
                category: true,
            }
        });
        return products.map((product) => new Product(
            product.id,
            product.name,
            product.price,
            product.unit ?? "unidade",
            product.marketId,
            product.image ?? undefined,
            product.categoryId ?? undefined,
        ));
    }

    async getProductById(id: string) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                market: true,
                category: true,
            },
        });
        return product;
    }

    async updateProduct(id: string, productDTO: ProductDTO) {
        const product = await prisma.product.update({
            where: { id },
            data: productDTO,
            include: {
                market: true,
                category: true,
            },
        });
        return product;
    }

    async updateProductPartial(id: string, productUpdateDTO: ProductUpdateDTO) {
        const product = await prisma.product.update({
            where: { id },
            data: productUpdateDTO,
            include: {
                market: true,
                category: true,
            },
        });
        return product;
    }

    async deleteProduct(id: string) {
        const product = await prisma.product.delete({
            where: { id },
            include: {
                market: true,
                category: true,
            },
        });
        return product;
    }

    async countProducts(marketId?: string, name?: string, minPrice?: number, maxPrice?: number, categoryId?: string) {
        const products = await prisma.product.findMany({
            where: {
                marketId,
                categoryId,
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                },
            },
        });
        return products.length;
    }
}

export const productRepository = new ProductRepository();