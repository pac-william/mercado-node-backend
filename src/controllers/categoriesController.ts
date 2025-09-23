import { Request, Response } from "express";
import { CategoriesDTO, CategoriesUpdateDTO, toCategoryResponseDTO } from "../dtos/categoriesDTO";
import { toProductResponseDTO } from "../dtos/productDTO";
import { categoriesService } from "../services/categoriesService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class CategoriesController {
    async getCategories(req: Request, res: Response) {
        Logger.controller('Categories', 'getCategories', 'query', req.query);
        try {
            const { page, size, name } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('name')
                .build();

            const categories = await categoriesService.getCategories(page, size, name);
            Logger.successOperation('CategoriesController', 'getCategories');
            return res.status(200).json({
                categories: categories.categories.map(toCategoryResponseDTO),
                meta: categories.meta,
            });
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'getCategories', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCategoryById(req: Request, res: Response) {
        Logger.controller('Categories', 'getCategoryById', 'params', req.params);
        try {
            const { id } = req.params;
            const category = await categoriesService.getCategoryById(id);
            Logger.successOperation('CategoriesController', 'getCategoryById');
            return res.status(200).json(toCategoryResponseDTO(category));
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'getCategoryById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getProductsByCategory(req: Request, res: Response) {
        Logger.controller('Categories', 'getProductsByCategory', 'params', req.params);
        try {
            const { categoryId } = req.params;
            const { page, size } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .build();

            const result = await categoriesService.getProductsByCategory(categoryId, page, size);
            Logger.successOperation('CategoriesController', 'getProductsByCategory');
            return res.status(200).json({
                products: result.products.map(toProductResponseDTO),
                meta: {
                    page,
                    size,
                    total: result.count,
                    totalPages: Math.ceil(result.count / size),
                    count: result.count
                }
            });
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'getProductsByCategory', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createCategory(req: Request, res: Response) {
        Logger.controller('Categories', 'createCategory', 'body', req.body);
        try {
            const data = CategoriesDTO.parse(req.body);
            const category = await categoriesService.createCategory(data);
            Logger.successOperation('CategoriesController', 'createCategory');
            return res.status(201).json(toCategoryResponseDTO(category));
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'createCategory', error);
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                return res.status(409).json({ message: "Categoria com este nome já existe" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateCategory(req: Request, res: Response) {
        Logger.controller('Categories', 'updateCategory', 'request received', { params: req.params, body: req.body });
        try {
            const { id } = req.params;
            const data = CategoriesDTO.parse(req.body);
            const category = await categoriesService.updateCategory(id, data);
            Logger.successOperation('CategoriesController', 'updateCategory');
            return res.status(200).json(toCategoryResponseDTO(category));
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'updateCategory', error);
            if (error instanceof Error && error.message === "Categoria não encontrada") {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                return res.status(409).json({ message: "Categoria com este nome já existe" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateCategoryPartial(req: Request, res: Response) {
        Logger.controller('Categories', 'updateCategoryPartial', 'request received', { params: req.params, body: req.body });
        try {
            const { id } = req.params;
            const data = CategoriesUpdateDTO.parse(req.body);
            const category = await categoriesService.updateCategoryPartial(id, data);
            Logger.successOperation('CategoriesController', 'updateCategoryPartial');
            return res.status(200).json(toCategoryResponseDTO(category));
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'updateCategoryPartial', error);
            if (error instanceof Error && error.message === "Categoria não encontrada") {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                return res.status(409).json({ message: "Categoria com este nome já existe" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteCategory(req: Request, res: Response) {
        Logger.controller('Categories', 'deleteCategory', 'params', req.params);
        try {
            const { id } = req.params;
            const category = await categoriesService.deleteCategory(id);
            Logger.successOperation('CategoriesController', 'deleteCategory');
            return res.status(200).json(toCategoryResponseDTO(category));
        } catch (error) {
            Logger.errorOperation('CategoriesController', 'deleteCategory', error);
            if (error instanceof Error && error.message === "Categoria não encontrada") {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const categoriesController = new CategoriesController();
