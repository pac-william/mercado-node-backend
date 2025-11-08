import { z } from "zod";

export const ProductDTO = z.object({
    name: z.string().min(1, { error: "Nome do produto é obrigatório" }),
    price: z.number({ error: "Preço do produto é obrigatório" }),
    unit: z.string().default("unidade"),
    marketId: z.string({ error: "ID do mercado é obrigatório" }),
    categoryId: z.string({ error: "ID da categoria é obrigatório" }).min(1, { message: "ID da categoria é obrigatório" }),
    sku: z.string().trim().optional(),
    image: z.string().optional(),
});

export type ProductDTO = z.infer<typeof ProductDTO>;

export const ProductUpdateDTO = ProductDTO.partial();
export type ProductUpdateDTO = z.infer<typeof ProductUpdateDTO>; 