import { Category } from "./categoryDomain";
import { SubCategory } from "./subcategoryDomain";
import { Meta } from "./metaDomain";

export class Product {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public unit: string,
        public marketId: string,
        public image?: string | null,
        public categoryId?: string,
        public subCategoryId?: string | null,
        public sku?: string | null,
        public category?: Category | null,
        public subCategory?: SubCategory | null,
        public isActive?: boolean,
    ) { }
}

export class ProductPaginatedResponse {
    constructor(
        public products: Product[],
        public meta: Meta,
    ) { }
}