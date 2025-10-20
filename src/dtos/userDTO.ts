import { z } from "zod";

export const UserDTO = z.object({
    name: z.string({ error: "Nome do usuário é obrigatório" }),
    email: z.string().email({ error: "Email deve ter um formato válido" }),
    password: z.string().min(6, { error: "Senha deve ter pelo menos 6 caracteres" }),
});

export type UserDTO = z.infer<typeof UserDTO>;

export const UserUpdateDTO = UserDTO.partial();
export type UserUpdateDTO = z.infer<typeof UserUpdateDTO>;

export const UserResponseDTO = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type UserResponseDTO = z.infer<typeof UserResponseDTO>;

export const toUserResponseDTO = (u: any): UserResponseDTO => ({
    id: String(u.id),
    name: u.name,
    email: u.email,
    createdAt: u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt),
    updatedAt: u.updatedAt instanceof Date ? u.updatedAt : new Date(u.updatedAt),
});

export const ProfileResponseDTO = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    marketId: z.string().nullable(),
    market: z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        profilePicture: z.string().nullable()
    }).nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ProfileResponseDTO = z.infer<typeof ProfileResponseDTO>;

export const toProfileResponseDTO = (u: any): ProfileResponseDTO => ({
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role,
    marketId: u.marketId,
    market: u.market,
    createdAt: u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt),
    updatedAt: u.updatedAt instanceof Date ? u.updatedAt : new Date(u.updatedAt),
});