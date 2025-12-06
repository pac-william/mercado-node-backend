import { Request, Response } from "express";
import { ProductDTO, ProductUpdateDTO } from "../dtos/productDTO";
import { categoriesService } from "../services/categoriesService";
import { productService } from "../services/productService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class ProductController {
    async getProducts(req: Request, res: Response) {
        Logger.controller('Product', 'getProducts', 'query', req.query);
        try {
            const { page, size, marketId, name, minPrice, maxPrice, categoryId: categoryIds, sort } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('marketId')
                .withString('name')
                .withNumber('minPrice')
                .withNumber('maxPrice')
                .withArray('categoryId')
                .withString('sort')
                .build();

            const elasticSearchEnv = process.env.ELASTICSEARCH_URL;
            const normalizedCategoryIds = Array.isArray(categoryIds)
                ? categoryIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
                : [];

            let products;
            if (name && elasticSearchEnv) {
                let categoryNames: string[] = [];
                if (normalizedCategoryIds.length > 0) {
                    const categories = await Promise.all(
                        normalizedCategoryIds.map((id) => categoriesService.getCategoryById(id))
                    );
                    categoryNames = categories
                        .filter((category): category is NonNullable<typeof category> => !!category?.name)
                        .map((category) => category.name);
                }

                products = await productService.getProductsElasticSearch(name, page, size, categoryNames, marketId);
            } else {
                products = await productService.getProducts(page, size, marketId, name, minPrice, maxPrice, normalizedCategoryIds, sort);
            }
            Logger.successOperation('ProductController', 'getProducts');
            return res.status(200).json({
                products: products.products,
                meta: products.meta,
            });
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
        } catch (error: any) {
            Logger.errorOperation('ProductController', 'createProduct', error);
            
            // Erro de validação do Zod
            if (error.name === 'ZodError') {
                return res.status(400).json({ 
                    message: "Dados inválidos", 
                    errors: error.errors 
                });
            }
            
            // Erro de SKU duplicado
            if (error.message && error.message.includes('já existe para este mercado')) {
                return res.status(400).json({ message: error.message });
            }
            
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getProductsByMarket(req: Request, res: Response) {
        Logger.controller('Product', 'getProductsByMarket', 'query', req.query);
        try {
            const { marketId } = req.params;
            const { page, size, categoryId: categoryIds, sort } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withArray('categoryId')
                .withString('sort')
                .build();

            const normalizedCategoryIds = Array.isArray(categoryIds)
                ? categoryIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
                : [];

            const products = await productService.getProducts(page, size, marketId, undefined, undefined, undefined, normalizedCategoryIds, sort);
            Logger.successOperation('ProductController', 'getProductsByMarket');
            return res.status(200).json({
                products: products.products,
                meta: products.meta,
            });
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
        } catch (error: any) {
            Logger.errorOperation('ProductController', 'updateProduct', error);
            
            // Erro de validação do Zod
            if (error.name === 'ZodError') {
                return res.status(400).json({ 
                    message: "Dados inválidos", 
                    errors: error.errors 
                });
            }
            
            // Erro de SKU duplicado
            if (error.message && error.message.includes('já existe para este mercado')) {
                return res.status(400).json({ message: error.message });
            }
            
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
        } catch (error: any) {
            Logger.errorOperation('ProductController', 'updateProductPartial', error);
            
            // Erro de validação do Zod
            if (error.name === 'ZodError') {
                return res.status(400).json({ 
                    message: "Dados inválidos", 
                    errors: error.errors 
                });
            }
            
            // Erro de SKU duplicado
            if (error.message && error.message.includes('já existe para este mercado')) {
                return res.status(400).json({ message: error.message });
            }
            
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