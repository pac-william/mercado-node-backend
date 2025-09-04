import { z } from "zod";

export const ProductDTO = z.object({
    name: z.string({ error: "Nome do produto é obrigatório" }),
    price: z.number({ error: "Preço do produto é obrigatório" }),
    marketId: z.string({ error: "ID do mercado é obrigatório" }),
});

export type ProductDTO = z.infer<typeof ProductDTO>;

export const ProductUpdateDTO = ProductDTO.partial();
export type ProductUpdateDTO = z.infer<typeof ProductUpdateDTO>; 