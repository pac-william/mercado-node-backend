import { prisma } from "../utils/prisma";
import { CategoriesDTO, CategoriesUpdateDTO } from "../dtos/categoriesDTO";

class CategoriesRepository {

    async get() {
        return await prisma.categories.findMany();
    }

    async create(data: CategoriesDTO) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return await prisma.categories.create({
            data: {
                name: data.name,
                slug: slug
            }
        });
    }

    async update(id: string, data: CategoriesDTO) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return await prisma.categories.update({
            where: { id },
            data: {
                name: data.name,
                slug: slug
            }
        });
    }

    async updatePartial(id: string, data: CategoriesUpdateDTO) {
        const updateData: any = { ...data };
        if (data.name) {
            updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        return await prisma.categories.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        return await prisma.categories.delete({
            where: { id }
        });
    }

    async findById(id: string) {
        return await prisma.categories.findUnique({
            where: { id }
        });
    }

}

export const categoriesRepository = new CategoriesRepository();
