import { z } from "zod";

export const SubcategoryDTO = z.object({
    name: z.string().min(1, { error: "Nome da subcategoria é obrigatório" }),
    categoryId: z.string().min(1, { error: "ID da categoria é obrigatório" }),
    description: z.string().optional(),
});

export type SubcategoryDTO = z.infer<typeof SubcategoryDTO>;

export const SubcategoryUpdateDTO = SubcategoryDTO.partial();
export type SubcategoryUpdateDTO = z.infer<typeof SubcategoryUpdateDTO>;

