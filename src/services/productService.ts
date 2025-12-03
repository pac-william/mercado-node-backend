import { Meta } from "../domain/metaDomain";
import { ProductPaginatedResponse } from "../domain/productDomain";
import { ProductDTO, ProductUpdateDTO } from "../dtos/index";
import { productRepository } from "../repositories/productRepository";
import { productElasticSearch } from "../rest/productElasticSearch";
import { Logger } from "../utils/logger";
import { categoriesService } from "./categoriesService";

class ProductService {
    async createProduct(productDTO: ProductDTO) {
        const product = await productRepository.createProduct(productDTO);

        if (process.env.ELASTICSEARCH_URL) {
            try {
                const category = product.categoryId ? await categoriesService.getCategoryById(product.categoryId) : null;
                await productElasticSearch.indexProduct({
                    ...product,
                    categoryName: category?.name ?? null,
                });
            } catch (error) {
                Logger.errorOperation('ProductService', 'createProduct', error, 'Falha ao indexar produto no Elasticsearch');
            }
        }

        return product;
    }

    async getProducts(
        page: number,
        size: number,
        marketId?: string,
        name?: string,
        minPrice?: number,
        maxPrice?: number,
        categoryIds: string[] = [],
        sort?: string
    ) {
        const count = await productRepository.countProducts(marketId, name, minPrice, maxPrice, categoryIds);
        const products = await productRepository.getProducts(page, size, marketId, name, minPrice, maxPrice, categoryIds, sort);
        return new ProductPaginatedResponse(products, new Meta(page, size, count, Math.ceil(count / size), count));
    }

    async getProductsElasticSearch(name: string, page: number, size: number, categoryNames: string[] = [], marketId?: string) {
        return await productElasticSearch.getProducts(name, page, size, categoryNames, marketId);
    }

    async getProductById(id: string) {
        return await productRepository.getProductById(id);
    }

    async updateProduct(id: string, productDTO: ProductDTO) {
        return await productRepository.updateProduct(id, productDTO);
    }

    async updateProductPartial(id: string, productUpdateDTO: ProductUpdateDTO) {
        return await productRepository.updateProductPartial(id, productUpdateDTO);
    }

    async deleteProduct(id: string) {
        return await productRepository.deleteProduct(id);
    }
}

export const productService = new ProductService();