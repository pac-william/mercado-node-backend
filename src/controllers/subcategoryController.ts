import { Request, Response } from "express";
import { SubcategoryDTO, SubcategoryUpdateDTO } from "../dtos/subcategoryDTO";
import { subcategoryService } from "../services/subcategoryService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

class SubcategoryController {
    async getSubcategories(req: Request, res: Response) {
        Logger.controller('Subcategory', 'getSubcategories', 'query', req.query);
        try {
            const { page, size, categoryId, name } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('categoryId')
                .withString('name')
                .build();

            const subcategories = await subcategoryService.getSubcategories(page, size, categoryId, name);
            Logger.successOperation('SubcategoryController', 'getSubcategories');
            return res.status(200).json({
                subcategories: subcategories.subcategories,
                meta: subcategories.meta,
            });
        } catch (error) {
            Logger.errorOperation('SubcategoryController', 'getSubcategories', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getSubcategoryById(req: Request, res: Response) {
        Logger.controller('Subcategory', 'getSubcategoryById', 'params', req.params);
        try {
            const { id } = req.params;
            const subcategory = await subcategoryService.getSubcategoryById(id);
            Logger.successOperation('SubcategoryController', 'getSubcategoryById');
            if (!subcategory) {
                return res.status(404).json({ message: "Subcategoria não encontrada" });
            }
            return res.status(200).json(subcategory);
        } catch (error) {
            Logger.errorOperation('SubcategoryController', 'getSubcategoryById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createSubcategory(req: Request, res: Response) {
        Logger.controller('Subcategory', 'createSubcategory', 'body', req.body);
        try {
            const data = SubcategoryDTO.parse(req.body);
            const subcategory = await subcategoryService.createSubcategory(data);
            Logger.successOperation('SubcategoryController', 'createSubcategory');
            return res.status(201).json(subcategory);
        } catch (error) {
            Logger.errorOperation('SubcategoryController', 'createSubcategory', error);
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                return res.status(409).json({ message: "Subcategoria com este nome já existe" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateSubcategory(req: Request, res: Response) {
        Logger.controller('Subcategory', 'updateSubcategory', 'request received', { params: req.params, body: req.body });
        try {
            const { id } = req.params;
            const data = SubcategoryDTO.parse(req.body);
            const subcategory = await subcategoryService.updateSubcategory(id, data);
            Logger.successOperation('SubcategoryController', 'updateSubcategory');
            return res.status(200).json(subcategory);
        } catch (error) {
            Logger.errorOperation('SubcategoryController', 'updateSubcategory', error);
            if (error instanceof Error && error.message === "Subcategoria não encontrada") {
                return res.status(404).json({ message: "Subcategoria não encontrada" });
            }
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                return res.status(409).json({ message: "Subcategoria com este nome já existe" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateSubcategoryPartial(req: Request, res: Response) {
        Logger.controller('Subcategory', 'updateSubcategoryPartial', 'request received', { params: req.params, body: req.body });
        try {
            const { id } = req.params;
            const data = SubcategoryUpdateDTO.parse(req.body);
            const subcategory = await subcategoryService.updateSubcategoryPartial(id, data);
            Logger.successOperation('SubcategoryController', 'updateSubcategoryPartial');
            return res.status(200).json(subcategory);
        } catch (error) {
            Logger.errorOperation('SubcategoryController', 'updateSubcategoryPartial', error);
            if (error instanceof Error && error.message === "Subcategoria não encontrada") {
                return res.status(404).json({ message: "Subcategoria não encontrada" });
            }
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                return res.status(409).json({ message: "Subcategoria com este nome já existe" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteSubcategory(req: Request, res: Response) {
        Logger.controller('Subcategory', 'deleteSubcategory', 'params', req.params);
        try {
            const { id } = req.params;
            const subcategory = await subcategoryService.deleteSubcategory(id);
            Logger.successOperation('SubcategoryController', 'deleteSubcategory');
            return res.status(200).json(subcategory);
        } catch (error) {
            Logger.errorOperation('SubcategoryController', 'deleteSubcategory', error);
            if (error instanceof Error && error.message === "Subcategoria não encontrada") {
                return res.status(404).json({ message: "Subcategoria não encontrada" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const subcategoryController = new SubcategoryController();

