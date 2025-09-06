import { Request, Response } from "express";
import { categoriesService } from "../services/categoriesService";

export class CategoriesController {
    async get(_: Request, res: Response) {
        try {
            const categories = await categoriesService.get();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const marketController = new CategoriesController();
