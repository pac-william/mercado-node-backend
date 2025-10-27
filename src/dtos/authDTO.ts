import { z } from 'zod';

export const AuthRegisterUserDTO = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().optional(), // Senha opcional
    marketId: z.string().optional(), // Opcional para vinculação com mercado
    auth0Id: z.string().optional(), // ID do Auth0 para integração
}).refine(
    (data) => {
        // Se não tem auth0Id, senha é obrigatória
        if (!data.auth0Id && !data.password) {
            return false;
        }
        // Se tem senha, deve ter no mínimo 6 caracteres
        if (data.password && data.password.length < 6) {
            return false;
        }
        return true;
    },
    {
        message: 'Senha é obrigatória (mínimo 6 caracteres) quando não há auth0Id, ou deve ter no mínimo 6 caracteres quando fornecida',
        path: ['password'],
    }
);

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
