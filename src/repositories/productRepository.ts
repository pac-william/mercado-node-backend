import { Category, SubCategory } from "../domain/categoryDomain";
import { Product } from "../domain/productDomain";
import { ProductDTO, ProductUpdateDTO } from "../dtos/productDTO";
import { prisma } from "../utils/prisma";

class ProductRepository {
    async createProduct(productDTO: ProductDTO) {
        const product = await prisma.product.create({
            data: productDTO,
        });
        return product;
    }

    async getProducts(
        page: number,
        size: number,
        marketId?: string,
        name?: string,
        minPrice?: number,
        maxPrice?: number,
        categoryIds: string[] = []
    ) {
        const normalizedCategoryIds = Array.isArray(categoryIds) ? categoryIds.filter(Boolean) : [];

        const products = await prisma.product.findMany({
            where: {
                marketId,
                categoryId: normalizedCategoryIds.length > 0 ? { in: normalizedCategoryIds } : undefined,
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
            }
        });

        const productCategoryIds = Array.from(new Set(products.map((p) => p.categoryId).filter(Boolean))) as string[];
        const categoriesRaw = productCategoryIds.length > 0
            ? await prisma.categories.findMany({ where: { id: { in: productCategoryIds } } })
            : [];
        const categoryById = new Map(
            categoriesRaw.map((c) => [
                c.id,
                new Category(
                    c.id,
                    c.name,
                    c.slug,
                    c.description ?? "",
                    (c.subCategories ?? []).map((sc) => new SubCategory(sc.name, sc.slug, sc.description ?? "")),
                    c.createdAt,
                    c.updatedAt,
                ),
            ])
        );

        return products.map((p) => new Product(
            p.id,
            p.name,
            p.price,
            p.unit ?? "unidade",
            p.marketId,
            p.image ?? null,
            p.categoryId ?? undefined,
            p.sku ?? null,
            p.categoryId ? categoryById.get(p.categoryId) ?? null : null,
        ));
    }

    async getProductById(id: string) {
        const p = await prisma.product.findUnique({
            where: { id },
        });
        if (!p) return null;

        let category: Category | null = null;
        if (p.categoryId) {
            const c = await prisma.categories.findUnique({ where: { id: p.categoryId } });
            if (c) {
                category = new Category(
                    c.id,
                    c.name,
                    c.slug,
                    c.description ?? "",
                    (c.subCategories ?? []).map((sc) => new SubCategory(sc.name, sc.slug, sc.description ?? "")),
                    c.createdAt,
                    c.updatedAt,
                );
            }
        }

        return new Product(
            p.id,
            p.name,
            p.price,
            p.unit ?? "unidade",
            p.marketId,
            p.image ?? null,
            p.categoryId ?? undefined,
            p.sku ?? null,
            category,
        );
    }

    async updateProduct(id: string, productDTO: ProductDTO) {
        const product = await prisma.product.update({
            where: { id },
            data: productDTO,
        });
        return product;
    }

    async updateProductPartial(id: string, productUpdateDTO: ProductUpdateDTO) {
        const product = await prisma.product.update({
            where: { id },
            data: productUpdateDTO,
        });
        return product;
    }

    async deleteProduct(id: string) {
        const product = await prisma.product.delete({
            where: { id },
        });
        return product;
    }

    async countProducts(
        marketId?: string,
        name?: string,
        minPrice?: number,
        maxPrice?: number,
        categoryIds: string[] = []
    ) {
        const normalizedCategoryIds = Array.isArray(categoryIds) ? categoryIds.filter(Boolean) : [];

        const products = await prisma.product.findMany({
            where: {
                marketId,
                categoryId: normalizedCategoryIds.length > 0 ? { in: normalizedCategoryIds } : undefined,
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