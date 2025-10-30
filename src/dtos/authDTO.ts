import { z } from 'zod';

export const Auth0CreateUserDTO = z.object({
    connection: z.string().default('Username-Password-Authentication'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    name: z.string().min(1, 'Nome é obrigatório'),
});

export const Auth0LoginDTO = z.object({
    username: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
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

export const AuthRegisterUserDTO = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    marketId: z.string().optional(),
    auth0Id: z.string().optional(),
});

export type Auth0CreateUserDTOType = z.infer<typeof Auth0CreateUserDTO>;
export type Auth0LoginDTOType = z.infer<typeof Auth0LoginDTO>;
export type AuthLoginDTOType = z.infer<typeof AuthLoginDTO>;
export type AuthLinkUserToMarketDTOType = z.infer<typeof AuthLinkUserToMarketDTO>;
export type AuthCreateMarketDTOType = z.infer<typeof AuthCreateMarketDTO>;
export type AuthRegisterUserDTOType = z.infer<typeof AuthRegisterUserDTO>;
