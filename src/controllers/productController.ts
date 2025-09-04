import { Request, Response } from "express";
import { ProductDTO, ProductUpdateDTO } from "../dtos/productDTO";
import { productService } from "../services/productService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class ProductController {
    async getProducts(req: Request, res: Response) {
        Logger.controller('Product', 'getProducts', 'query', req.query);
        try {
            const { page, size, marketId } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('marketId')
                .build();

            const products = await productService.getProducts(page, size, marketId);
            Logger.successOperation('ProductController', 'getProducts');
            return res.status(200).json(products);
        } catch (error) {
            Logger.errorOperation('ProductController', 'getProducts', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createProduct(req: Request, res: Response) {
        Logger.controller('Product', 'createProduct', 'req: Request, res: Response', { body: req.body });
        try {
            const productDTO = ProductDTO.parse(req.body);
            const product = await productService.createProduct(productDTO);
            Logger.successOperation('ProductController', 'createProduct');
            return res.status(201).json(product);
        } catch (error) {
            Logger.errorOperation('ProductController', 'createProduct', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getProductsByMarket(req: Request, res: Response) {
        Logger.controller('Product', 'getProductsByMarket', 'query', req.query);
        try {
            const { marketId } = req.params;
            const { page, size } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .build();

            const products = await productService.getProducts(page, size, marketId);
            Logger.successOperation('ProductController', 'getProductsByMarket');
            return res.status(200).json(products);
        } catch (error) {
            Logger.errorOperation('ProductController', 'getProductsByMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getProductById(req: Request, res: Response) {
        Logger.controller('Product', 'getProductById', 'query', req.query);
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            Logger.successOperation('ProductController', 'getProductById');
            return res.status(200).json(product);
        } catch (error) {
            Logger.errorOperation('ProductController', 'getProductById', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateProduct(req: Request, res: Response) {
        Logger.controller('Product', 'updateProduct', 'query', req.query);
        try {
            const { id } = req.params;
            const productDTO = ProductDTO.parse(req.body);
            const product = await productService.updateProduct(id, productDTO);
            Logger.successOperation('ProductController', 'updateProduct');
            return res.status(200).json(product);
        } catch (error) {
            Logger.errorOperation('ProductController', 'updateProduct', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateProductPartial(req: Request, res: Response) {
        Logger.controller('Product', 'updateProductPartial', 'query', req.query);
        try {
            const { id } = req.params;
            const productUpdateDTO = ProductUpdateDTO.parse(req.body);
            const product = await productService.updateProductPartial(id, productUpdateDTO);
            Logger.successOperation('ProductController', 'updateProductPartial');
            return res.status(200).json(product);
        } catch (error) {
            Logger.errorOperation('ProductController', 'updateProductPartial', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        Logger.controller('Product', 'deleteProduct', 'query', req.query);
        try {
            const { id } = req.params;
            const product = await productService.deleteProduct(id);
            Logger.successOperation('ProductController', 'deleteProduct');
            return res.status(200).json(product);
        } catch (error) {
            Logger.errorOperation('ProductController', 'deleteProduct', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const productController = new ProductController();