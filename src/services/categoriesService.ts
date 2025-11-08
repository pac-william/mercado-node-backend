
import { CategoryPaginatedResponse } from "../domain/categoryDomain";
import { Meta } from "../domain/metaDomain";
import { CategoriesDTO, CategoriesUpdateDTO } from "../dtos/categoriesDTO";
import { categoriesRepository } from "../repositories/categoriesRepository";
import { productRepository } from "../repositories/productRepository";

class CategoriesService {
    async createCategory(data: CategoriesDTO) {
        return await categoriesRepository.createCategory(data);
    }

    async getCategories(page: number, size: number, name?: string) {
        const count = await categoriesRepository.count(name);
        const categories = await categoriesRepository.getCategories(page, size, name);
        return new CategoryPaginatedResponse(categories, new Meta(page, size, count, Math.ceil(count / size), count));
    }

    async getCategoryById(id: string) {
        return await categoriesRepository.getCategoryById(id);
    }

    async updateCategory(id: string, data: CategoriesDTO) {
        return await categoriesRepository.updateCategory(id, data);
    }

    async updateCategoryPartial(id: string, data: CategoriesUpdateDTO) {
        return await categoriesRepository.updateCategoryPartial(id, data);
    }

    async deleteCategory(id: string) {
        return await categoriesRepository.deleteCategory(id);
    }

    async getProductsByCategory(categoryId: string, page: number = 1, size: number = 10) {
        const categoriesFilter = [categoryId];
        const count = await productRepository.countProducts(undefined, undefined, undefined, undefined, categoriesFilter);
        const products = await productRepository.getProducts(page, size, undefined, undefined, undefined, undefined, categoriesFilter);
        return { products, count };
    }
}

export const categoriesService = new CategoriesService();
