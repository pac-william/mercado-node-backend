import { z } from "zod";

export const CategoriesDTO = z.object({
    name: z.string({ error: "Nome do mercado é obrigatório" }),
});

export type CategoriesDTO = z.infer<typeof CategoriesDTO>;

export const CategoriesUpdateDTO = CategoriesDTO.partial();
export type CategoriesUpdateDTO = z.infer<typeof CategoriesUpdateDTO>;
