import { Meta } from "../domain/metaDomain";
import { SubCategoryPaginatedResponse } from "../domain/subcategoryDomain";
import { SubcategoryDTO, SubcategoryUpdateDTO } from "../dtos/subcategoryDTO";
import { subcategoryRepository } from "../repositories/subcategoryRepository";

class SubcategoryService {
    async createSubcategory(data: SubcategoryDTO) {
        return await subcategoryRepository.createSubcategory(data);
    }

    async getSubcategories(page: number, size: number, categoryId?: string, name?: string) {
        const count = await subcategoryRepository.count(categoryId, name);
        const subcategories = await subcategoryRepository.getSubcategories(page, size, categoryId, name);
        return new SubCategoryPaginatedResponse(
            subcategories,
            new Meta(page, size, count, Math.ceil(count / size), count)
        );
    }

    async getSubcategoryById(id: string) {
        return await subcategoryRepository.getSubcategoryById(id);
    }

    async updateSubcategory(id: string, data: SubcategoryDTO) {
        return await subcategoryRepository.updateSubcategory(id, data);
    }

    async updateSubcategoryPartial(id: string, data: SubcategoryUpdateDTO) {
        return await subcategoryRepository.updateSubcategoryPartial(id, data);
    }

    async deleteSubcategory(id: string) {
        return await subcategoryRepository.deleteSubcategory(id);
    }
}

export const subcategoryService = new SubcategoryService();

