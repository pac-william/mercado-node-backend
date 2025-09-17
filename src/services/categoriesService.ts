
import { categoriesRepository } from "../repositories/categoriesRepository";
import { productRepository } from "../repositories/productRepository";
import { CategoriesDTO, CategoriesUpdateDTO } from "../dtos/categoriesDTO";

class CategoriesService {
    async get() {
        return await categoriesRepository.get();
    }

    async getProductsByCategory(categoryId: string, page: number = 1, size: number = 10) {
        const count = await productRepository.countProducts(undefined, undefined, undefined, undefined, categoryId);
        const products = await productRepository.getProducts(page, size, undefined, undefined, undefined, undefined, categoryId);
        return { products, count };
    }

    async createCategory(data: CategoriesDTO) {
        return await categoriesRepository.create(data);
    }

    async updateCategory(id: string, data: CategoriesDTO) {
        const existingCategory = await categoriesRepository.findById(id);
        if (!existingCategory) {
            throw new Error("Categoria não encontrada");
        }
        return await categoriesRepository.update(id, data);
    }

    async updateCategoryPartial(id: string, data: CategoriesUpdateDTO) {
        const existingCategory = await categoriesRepository.findById(id);
        if (!existingCategory) {
            throw new Error("Categoria não encontrada");
        }
        return await categoriesRepository.updatePartial(id, data);
    }

    async deleteCategory(id: string) {
        const existingCategory = await categoriesRepository.findById(id);
        if (!existingCategory) {
            throw new Error("Categoria não encontrada");
        }
        return await categoriesRepository.delete(id);
    }
}

export const categoriesService = new CategoriesService();
