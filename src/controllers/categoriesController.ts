import { Request, Response } from "express";
import { categoriesService } from "../services/categoriesService";
import { toProductResponseDTO } from "../dtos/productDTO";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class CategoriesController {
    async get(_: Request, res: Response) {
        try {
            const categories = await categoriesService.get();
            return res.status(200).json(categories);
        } catch (error) {
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
}

export const categoriesController = new CategoriesController();
