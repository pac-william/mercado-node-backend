import { z } from "zod";

export const GeocodeReverseDTO = z.object({
    latitude: z.number().min(-90).max(90, { message: "Latitude deve estar entre -90 e 90" }),
    longitude: z.number().min(-180).max(180, { message: "Longitude deve estar entre -180 e 180" }),
});

export const GeocodeDTO = z.object({
    address: z.string().min(1, { message: "Endereço é obrigatório" }),
});

export type GeocodeReverseDTO = z.infer<typeof GeocodeReverseDTO>;
export type GeocodeDTO = z.infer<typeof GeocodeDTO>;

