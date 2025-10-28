import { z } from "zod";

export const UserDTO = z.object({
    name: z.string({ error: "Nome do usuário é obrigatório" }),
    email: z.string().email({ error: "Email deve ter um formato válido" }),
    password: z.string().min(6, { error: "Senha deve ter pelo menos 6 caracteres" }).optional(),
    phone: z.string().optional(),
    profilePicture: z.string().optional(),
    birthDate: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    auth0Id: z.string().optional(),
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
    phone: z.string().nullable(),
    profilePicture: z.string().nullable(),
    birthDate: z.date().nullable(),
    gender: z.string().nullable(),
    address: z.string().nullable(),
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
    phone: u.phone,
    profilePicture: u.profilePicture,
    birthDate: u.birthDate ? (u.birthDate instanceof Date ? u.birthDate : new Date(u.birthDate)) : null,
    gender: u.gender,
    address: u.address,
    role: u.role,
    marketId: u.marketId,
    market: u.market,
    createdAt: u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt),
    updatedAt: u.updatedAt instanceof Date ? u.updatedAt : new Date(u.updatedAt),
});

export const ProfileUpdateDTO = z.object({
    name: z.string().min(1, { error: "Nome não pode estar vazio" }).optional(),
    email: z.string().email({ error: "Email deve ter um formato válido" }).optional(),
    phone: z.string().min(10, { error: "Telefone deve ter pelo menos 10 caracteres" }).optional(),
    profilePicture: z.string().url({ error: "URL da foto deve ser válida" }).optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Data deve estar no formato YYYY-MM-DD" }).optional(),
    gender: z.enum(["masculino", "feminino", "outro"], { error: "Gênero deve ser masculino, feminino ou outro" }).optional(),
    address: z.string().min(5, { error: "Endereço deve ter pelo menos 5 caracteres" }).optional(),
    password: z.string().min(6, { error: "Senha deve ter pelo menos 6 caracteres" }).optional(),
});

export type ProfileUpdateDTO = z.infer<typeof ProfileUpdateDTO>;

export const ProfileCreateDTO = z.object({
    name: z.string().min(1, { error: "Nome é obrigatório" }),
    email: z.string().email({ error: "Email deve ter um formato válido" }),
    password: z.string().min(6, { error: "Senha deve ter pelo menos 6 caracteres" }),
    phone: z.string().min(10, { error: "Telefone deve ter pelo menos 10 caracteres" }).optional(),
    profilePicture: z.string().url({ error: "URL da foto deve ser válida" }).optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Data deve estar no formato YYYY-MM-DD" }).optional(),
    gender: z.enum(["masculino", "feminino", "outro"], { error: "Gênero deve ser masculino, feminino ou outro" }).optional(),
    address: z.string().min(5, { error: "Endereço deve ter pelo menos 5 caracteres" }).optional(),
});

export type ProfileCreateDTO = z.infer<typeof ProfileCreateDTO>;