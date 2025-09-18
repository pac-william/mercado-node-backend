import { z } from 'zod';

export const AuthRegisterUserDTO = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    marketId: z.string().optional(),
});

export const AuthLoginDTO = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

export const AuthLinkUserToMarketDTO = z.object({
    userId: z.string().min(1, 'ID do usuário é obrigatório'),
    marketId: z.string().min(1, 'ID do mercado é obrigatório'),
});

export const AuthCreateMarketDTO = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    address: z.string().min(1, 'Endereço é obrigatório'),
    profilePicture: z.string().url('URL inválida').optional(),
});

export type AuthRegisterUserDTO = z.infer<typeof AuthRegisterUserDTO>;
export type AuthLoginDTO = z.infer<typeof AuthLoginDTO>;
export type AuthLinkUserToMarketDTO = z.infer<typeof AuthLinkUserToMarketDTO>;
export type AuthCreateMarketDTO = z.infer<typeof AuthCreateMarketDTO>;
