import { z } from "zod";

export const VehicleDTO = z.object({
    type: z.enum(["bicicleta", "moto", "carro"]),
    plate: z.string().optional(),
    description: z.string().optional(),
});

export const DelivererDTO = z.object({
    name: z.string().min(1, { message: "Nome do entregador é obrigatório" }),
    document: z.string().min(1, { message: "Documento é obrigatório" }),
    phone: z.string().min(1, { message: "Telefone é obrigatório" }),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    vehicle: VehicleDTO,
});

export type DelivererDTO = z.infer<typeof DelivererDTO>;

export const DelivererUpdateDTO = DelivererDTO.partial();
export type DelivererUpdateDTO = z.infer<typeof DelivererUpdateDTO>;

export type DelivererResponseDTO = {
    id: string;
    name: string;
    document: string;
    phone: string;
    status: "ACTIVE" | "INACTIVE";
    vehicle: {
        type: string;
        plate?: string | null;
        description?: string | null;
    };
    createdAt?: Date;
    updatedAt?: Date;
};

export const toDelivererResponseDTO = (d: any): DelivererResponseDTO => ({
    id: String(d.id),
    name: d.name,
    document: d.document,
    phone: d.phone,
    status: d.status,
    vehicle: {
        type: d.vehicle.type,
        plate: d.vehicle.plate ?? null,
        description: d.vehicle.description ?? null,
    },
    createdAt: d.createdAt ? (d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt)) : undefined,
    updatedAt: d.updatedAt ? (d.updatedAt instanceof Date ? d.updatedAt : new Date(d.updatedAt)) : undefined,
});
