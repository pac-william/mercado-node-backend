import { ProductDTO, ProductUpdateDTO } from "../dtos/productDTO";
import { prisma } from "../utils/prisma";

class ProductRepository {
    async createProduct(productDTO: ProductDTO) {
        const product = await prisma.product.create({
            data: productDTO,
        });
        return product;
    }

    async getProducts(page: number, size: number, marketId?: string) {
        const where = marketId ? { marketId } : {};
        
        const products = await prisma.product.findMany({
            where,
            skip: (page - 1) * size,
            take: size,
            include: {
                market: true,
            },
        });
        return products;
    }

    async getProductById(id: string) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                market: true,
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
            },
        });
        return product;
    }

    async deleteProduct(id: string) {
        const product = await prisma.product.delete({
            where: { id },
            include: {
                market: true,
            },
        });
        return product;
    }
}

export const productRepository = new ProductRepository();