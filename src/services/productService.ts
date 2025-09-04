import { ProductDTO, ProductUpdateDTO } from "../dtos/index";
import { productRepository } from "../repositories/productRepository";

class ProductService {
    async createProduct(productDTO: ProductDTO) {
        return await productRepository.createProduct(productDTO);
    }

    async getProducts(page: number, size: number, marketId?: string) {
        return await productRepository.getProducts(page, size, marketId);
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