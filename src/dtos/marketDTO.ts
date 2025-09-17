import { z } from "zod";

export const MarketDTO = z.object({
    name: z.string({ error: "Nome do mercado é obrigatório" }),
    address: z.string({ error: "Endereço do mercado é obrigatório" }),
    profilePicture: z.string({ error: "Logo do mercado é obrigatório" }).optional(),
});

export type MarketDTO = z.infer<typeof MarketDTO>;

export const MarketUpdateDTO = MarketDTO.partial();
export type MarketUpdateDTO = z.infer<typeof MarketUpdateDTO>;

export type MarketResponseDTO = {
    id: string;
    name: string;
    address: string;
    profilePicture?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export const toMarketResponseDTO = (m: any): MarketResponseDTO => ({
    id: String(m.id),
    name: m.name,
    address: m.address,
    profilePicture: m.profilePicture ?? null,
    createdAt: m.createdAt ? (m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt)) : undefined,
    updatedAt: m.updatedAt ? (m.updatedAt instanceof Date ? m.updatedAt : new Date(m.updatedAt)) : undefined,
});
