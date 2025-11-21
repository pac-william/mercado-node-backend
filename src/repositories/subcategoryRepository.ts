import { SubCategory } from "../domain/subcategoryDomain";
import { SubcategoryDTO, SubcategoryUpdateDTO } from "../dtos/subcategoryDTO";
import { prisma } from "../utils/prisma";

class SubcategoryRepository {
    private generateSlug(name: string) {
        return name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }

    private mapToDomain(subcategory: any): SubCategory {
        return new SubCategory(
            subcategory.id,
            subcategory.name,
            subcategory.slug,
            subcategory.description ?? "",
            subcategory.categoryId,
            subcategory.createdAt,
            subcategory.updatedAt,
        );
    }

    async createSubcategory(data: SubcategoryDTO) {
        const slug = this.generateSlug(data.name);
        const subcategory = await prisma.subCategory.create({
            data: {
                name: data.name,
                slug,
                description: data.description || "",
                categoryId: data.categoryId,
            }
        });
        return this.mapToDomain(subcategory);
    }

    async getSubcategories(page: number, size: number, categoryId?: string, name?: string) {
        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (name) where.name = { contains: name, mode: 'insensitive' };

        const subcategories = await prisma.subCategory.findMany({
            where,
            skip: (page - 1) * size,
            take: size,
            orderBy: {
                name: 'asc',
            },
        });

        return subcategories.map((subcategory) => this.mapToDomain(subcategory));
    }

    async getSubcategoryById(id: string) {
        const subcategory = await prisma.subCategory.findUnique({
            where: { id }
        });
        if (!subcategory) return null;
        return this.mapToDomain(subcategory);
    }

    async updateSubcategory(id: string, data: SubcategoryDTO) {
        const slug = this.generateSlug(data.name);
        const subcategory = await prisma.subCategory.update({
            where: { id },
            data: {
                name: data.name,
                slug,
                description: data.description || "",
                categoryId: data.categoryId,
            }
        });
        return this.mapToDomain(subcategory);
    }

    async updateSubcategoryPartial(id: string, data: SubcategoryUpdateDTO) {
        const updateData: any = { ...data };
        if (data.name) {
            updateData.slug = this.generateSlug(data.name);
        }

        const subcategory = await prisma.subCategory.update({
            where: { id },
            data: updateData
        });
        return this.mapToDomain(subcategory);
    }

    async deleteSubcategory(id: string) {
        const subcategory = await prisma.subCategory.delete({
            where: { id }
        });
        return this.mapToDomain(subcategory);
    }

    async count(categoryId?: string, name?: string) {
        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (name) where.name = { contains: name, mode: 'insensitive' };
        return await prisma.subCategory.count({ where });
    }
}

export const subcategoryRepository = new SubcategoryRepository();

