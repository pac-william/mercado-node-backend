import { Meta } from "./metaDomain";

export class SubCategory {
    constructor(
        public id: string,
        public name: string,
        public slug: string,
        public description: string,
        public categoryId: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class SubCategoryPaginatedResponse {
    constructor(
        public subcategories: SubCategory[],
        public meta: Meta,
    ) { }
}

