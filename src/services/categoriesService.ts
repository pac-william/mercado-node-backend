
import { categoriesRepository } from "../repositories/categoriesRepository";

class CategoriesService {
    async get() {
        return await categoriesRepository.get();
    }
}

export const categoriesService = new CategoriesService();
