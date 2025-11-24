import { Category } from "../domain/categoryDomain";
import { Product } from "../domain/productDomain";
import { SubCategory } from "../domain/subcategoryDomain";
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
        
        const where: any = {};
        if (marketId) where.marketId = marketId;
        if (normalizedCategoryIds.length > 0) where.categoryId = { in: normalizedCategoryIds };
        if (name) where.name = { contains: name, mode: 'insensitive' };
        
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        const products = await prisma.product.findMany({
            where,
            skip: (page - 1) * size,
            take: size,
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                price: true,
                unit: true,
                marketId: true,
                image: true,
                categoryId: true,
                sku: true,
                subCategoryId: true,
                subCategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        categoryId: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                isActive: true,
            }
        });

        const productCategoryIds = Array.from(new Set(products.map((p) => p.categoryId).filter(Boolean))) as string[];
        const categoriesRaw = productCategoryIds.length > 0
            ? await prisma.categories.findMany({
                where: { id: { in: productCategoryIds } },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    subCategories: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            description: true,
                            categoryId: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                }
            })
            : [];

        const categoryById = new Map(
            categoriesRaw.map((c) => [
                c.id,
                new Category(
                    c.id,
                    c.name,
                    c.slug,
                    c.description ?? "",
                    (c.subCategories ?? []).map((sc) => new SubCategory(
                        sc.id,
                        sc.name,
                        sc.slug,
                        sc.description ?? "",
                        sc.categoryId,
                        sc.createdAt,
                        sc.updatedAt,
                    )),
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
            p.subCategoryId ?? undefined,
            p.sku ?? null,
            p.categoryId ? categoryById.get(p.categoryId) ?? null : null,
            p.subCategory ? new SubCategory(
                p.subCategory.id,
                p.subCategory.name,
                p.subCategory.slug,
                p.subCategory.description ?? "",
                p.subCategory.categoryId,
                p.subCategory.createdAt,
                p.subCategory.updatedAt,
            ) : null,
            p.isActive ?? true,
        ));
    }

    async getProductsByIds(ids: string[]) {
        return await prisma.product.findMany({
            where: { id: { in: ids } }
        });
    }

    async getProductById(id: string) {
        const p = await prisma.product.findUnique({
            where: { id },
            include: {
                subCategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        categoryId: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        });
        if (!p) return null;

        let category: Category | null = null;
        if (p.categoryId) {
            const c = await prisma.categories.findUnique({
                where: { id: p.categoryId },
                include: {
                    subCategories: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            description: true,
                            categoryId: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            });
            if (c) {
                category = new Category(
                    c.id,
                    c.name,
                    c.slug,
                    c.description ?? "",
                    (c.subCategories ?? []).map((sc) => new SubCategory(
                        sc.id,
                        sc.name,
                        sc.slug,
                        sc.description ?? "",
                        sc.categoryId,
                        sc.createdAt,
                        sc.updatedAt,
                    )),
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
            p.subCategoryId ?? undefined,
            p.sku ?? null,
            category,
            p.subCategory ? new SubCategory(
                p.subCategory.id,
                p.subCategory.name,
                p.subCategory.slug,
                p.subCategory.description ?? "",
                p.subCategory.categoryId,
                p.subCategory.createdAt,
                p.subCategory.updatedAt,
            ) : null,
            p.isActive ?? true,
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

        const where: any = {};
        if (marketId) where.marketId = marketId;
        if (normalizedCategoryIds.length > 0) where.categoryId = { in: normalizedCategoryIds };
        if (name) where.name = { contains: name, mode: 'insensitive' };
        
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        return await prisma.product.count({ where });
    }
}

export const productRepository = new ProductRepository();