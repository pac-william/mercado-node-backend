import { z } from "zod";

export const CategoriesDTO = z.object({
    name: z.string({ error: "Nome da categoria é obrigatório" }),
    description: z.string().optional(),
});

export type CategoriesDTO = z.infer<typeof CategoriesDTO>;

export const CategoriesUpdateDTO = CategoriesDTO.partial();
export type CategoriesUpdateDTO = z.infer<typeof CategoriesUpdateDTO>;

export type CategoryResponseDTO = {
    id: string;
    name: string;
    slug: string;
    description: string;
    subCategories: Array<{
        name: string;
        slug: string;
        description: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
};

export const toCategoryResponseDTO = (c: any): CategoryResponseDTO => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    subCategories: c.subCategories || [],
    createdAt: c.createdAt ? (c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt)) : new Date(),
    updatedAt: c.updatedAt ? (c.updatedAt instanceof Date ? c.updatedAt : new Date(c.updatedAt)) : new Date(),
});
