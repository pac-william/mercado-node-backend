
import { categoriesRepository } from "../repositories/categoriesRepository";
import { productRepository } from "../repositories/productRepository";

class CategoriesService {
    async get() {
        return await categoriesRepository.get();
    }

    async getProductsByCategory(categoryId: string, page: number = 1, size: number = 10) {
        const count = await productRepository.countProducts(undefined, undefined, undefined, undefined, categoryId);
        const products = await productRepository.getProducts(page, size, undefined, undefined, undefined, undefined, categoryId);
        return { products, count };
    }
}

export const categoriesService = new CategoriesService();
