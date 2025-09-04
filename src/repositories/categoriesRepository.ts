import { prisma } from "../utils/prisma";

class CategoriesRepository {

    async get() {
        return await prisma.categories.findMany();
    }

}

export const categoriesRepository = new CategoriesRepository();
