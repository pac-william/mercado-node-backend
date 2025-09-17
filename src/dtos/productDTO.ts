import { z } from "zod";

export const ProductDTO = z.object({
    name: z.string().min(1, { error: "Nome do produto é obrigatório" }),
    price: z.number({ error: "Preço do produto é obrigatório" }),
    unit: z.string().default("unidade"),
    marketId: z.string({ error: "ID do mercado é obrigatório" }),
    categoryId: z.string().optional(),
    image: z.string().optional(),
});

export type ProductDTO = z.infer<typeof ProductDTO>;

export const ProductUpdateDTO = ProductDTO.partial();
export type ProductUpdateDTO = z.infer<typeof ProductUpdateDTO>; 

export type ProductResponseDTO = {
    id: string;
    name: string;
    price: number;
    unit: string;
    marketId: string;
    categoryId?: string | null;
    category?: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
    } | null;
    image?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export const toProductResponseDTO = (p: any): ProductResponseDTO => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    unit: p.unit ?? "unidade",
    marketId: String(p.marketId),
    categoryId: p.categoryId ? String(p.categoryId) : null,
    category: p.category ? {
        id: String(p.category.id),
        name: p.category.name,
        slug: p.category.slug,
        description: p.category.description ?? null,
    } : null,
    image: p.image ?? null,
    createdAt: p.createdAt ? (p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt)) : undefined,
    updatedAt: p.updatedAt ? (p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt)) : undefined,
});