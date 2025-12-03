import { Category } from "../domain/categoryDomain";
import { SubCategory } from "../domain/subcategoryDomain";
import { CategoriesDTO, CategoriesUpdateDTO } from "../dtos/categoriesDTO";
import { prisma } from "../utils/prisma";

class CategoriesRepository {
    async createCategory(data: CategoriesDTO) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const description = data.description || "";
        const existingCategory = await prisma.categories.findUnique({
            where: { name: data.name }
        });
        if (existingCategory) {
            if (existingCategory.slug !== slug || (existingCategory.description || "") !== description) {
                return await prisma.categories.update({
                    where: { id: existingCategory.id },
                    data: {
                        slug,
                        description
                    }
                });
            }
            return existingCategory;
        }
        const category = await prisma.categories.create({
            data: {
                name: data.name,
                slug: slug,
                description: description
            }
        });
        return category;
    }

    async getCategories(page: number, size: number, name?: string) {
        const categories = await prisma.categories.findMany({
            skip: (page - 1) * size,
            take: size,
            where: {
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
            },
            orderBy: {
                name: 'asc',
            },
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
                    },
                },
            },
        });
        return categories.map((category) => new Category(
            category.id,
            category.name,
            category.slug,
            category.description || "",
            (category.subCategories ?? []).map((sc) => new SubCategory(
                sc.id,
                sc.name,
                sc.slug,
                sc.description ?? "",
                sc.categoryId,
                sc.createdAt,
                sc.updatedAt,
            )),
            category.createdAt,
            category.updatedAt
        ));
    }

    async getCategoryById(id: string) {
        return await prisma.categories.findUnique({
            where: { id },
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
                    },
                },
            },
        });
    }

    async updateCategory(id: string, data: CategoriesDTO) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const category = await prisma.categories.update({
            where: { id },
            data: {
                name: data.name,
                slug: slug,
                description: data.description || ""
            }
        });
        return category;
    }

    async updateCategoryPartial(id: string, data: CategoriesUpdateDTO) {
        const updateData: any = { ...data };
        if (data.name) {
            updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        const category = await prisma.categories.update({
            where: { id },
            data: updateData
        });
        return category;
    }

    async deleteCategory(id: string) {
        const category = await prisma.categories.delete({
            where: { id }
        });
        return category;
    }

    async count(name?: string) {
        const count = await prisma.categories.count({
            where: {
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
            },
        });
        return count;
    }
}

export const categoriesRepository = new CategoriesRepository();
