import { z } from "zod";

export const CampaignStatusEnum = z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "EXPIRED"]);

export const CampaignDTO = z.object({
    marketId: z.string({ message: "ID do mercado é obrigatório" }),
    title: z.string({ message: "Título da campanha é obrigatório" }).min(1, "Título não pode ser vazio"),
    imageUrl: z.string({ message: "URL da imagem é obrigatória" }).url("URL da imagem inválida"),
    slot: z.number({ message: "Slot é obrigatório" })
        .int("Slot deve ser um número inteiro")
        .min(1, "Slot deve ser entre 1 e 8")
        .max(8, "Slot deve ser entre 1 e 8"),
    startDate: z.coerce.date({ message: "Data de início é obrigatória" }),
    endDate: z.coerce.date().optional().nullable(),
    status: CampaignStatusEnum.optional().default("DRAFT"),
}).refine((data) => {
    if (!data.endDate) return true;
    
    const daysDifference = Math.ceil(
        (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDifference <= 7 && daysDifference >= 0;
}, {
    message: "O período da campanha não pode exceder 7 dias (1 semana) e deve ter pelo menos 1 dia",
    path: ["endDate"],
});

export type CampaignDTO = z.infer<typeof CampaignDTO>;

export const CampaignUpdateDTO = CampaignDTO.partial();
export type CampaignUpdateDTO = z.infer<typeof CampaignUpdateDTO>;

