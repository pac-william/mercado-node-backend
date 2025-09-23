import { Meta } from "./metaDomain";

export class SubCategory {
    constructor(
        public name: string,
        public slug: string,
        public description: string,
    ) { }
}

export class Category {
    constructor(
        public id: string,
        public name: string,
        public slug: string,
        public description: string,
        public subCategories: SubCategory[],
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class CategoryPaginatedResponse {
    constructor(
        public categories: Category[],
        public meta: Meta,
    ) { }
}
