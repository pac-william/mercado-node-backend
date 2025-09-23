import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthCreateMarketDTO, AuthLinkUserToMarketDTO, AuthLoginDTO, AuthRegisterUserDTO } from "../dtos/authDTO";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey';
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

class AuthService {
    async registerUser(authRegisterUserDTO: AuthRegisterUserDTO) {
        Logger.service('AuthService', 'registerUser', 'Attempting to register user', { email: authRegisterUserDTO.email });
        
        // Verificar se o email já existe
        const existingUser = await prisma.user.findUnique({ where: { email: authRegisterUserDTO.email } });
        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        // Verificar se o mercado existe (se fornecido)
        if (authRegisterUserDTO.marketId) {
            const market = await prisma.market.findUnique({ where: { id: authRegisterUserDTO.marketId } });
            if (!market) {
                throw new Error('Mercado não encontrado');
            }
        }

        const hashedPassword = await bcrypt.hash(authRegisterUserDTO.password, 10);
        const user = await prisma.user.create({
            data: {
                name: authRegisterUserDTO.name,
                email: authRegisterUserDTO.email,
                password: hashedPassword,
                role: authRegisterUserDTO.marketId ? "MARKET_ADMIN" : "CUSTOMER",
                marketId: authRegisterUserDTO.marketId,
            },
        });
        Logger.successOperation('AuthService', 'registerUser', user.id);
        return user;
    }

    async createMarket(authCreateMarketDTO: AuthCreateMarketDTO, userId: string) {
        Logger.service('AuthService', 'createMarket', 'Attempting to create market', { name: authCreateMarketDTO.name, userId });
        const market = await prisma.market.create({
            data: {
                name: authCreateMarketDTO.name,
                address: authCreateMarketDTO.address,
                profilePicture: authCreateMarketDTO.profilePicture,
            },
        });

        // Vincular o usuário que criou o mercado como administrador
        await prisma.user.update({
            where: { id: userId },
            data: {
                marketId: market.id,
                role: "MARKET_ADMIN",
            },
        });

        Logger.successOperation('AuthService', 'createMarket', market.id);
        return market;
    }

    async linkUserToMarket(authLinkUserToMarketDTO: AuthLinkUserToMarketDTO) {
        Logger.service('AuthService', 'linkUserToMarket', 'Attempting to link user to market', { 
            userId: authLinkUserToMarketDTO.userId, 
            marketId: authLinkUserToMarketDTO.marketId 
        });

        const user = await prisma.user.findUnique({ where: { id: authLinkUserToMarketDTO.userId } });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const market = await prisma.market.findUnique({ where: { id: authLinkUserToMarketDTO.marketId } });
        if (!market) {
            throw new Error('Mercado não encontrado');
        }

        const updatedUser = await prisma.user.update({
            where: { id: authLinkUserToMarketDTO.userId },
            data: {
                marketId: authLinkUserToMarketDTO.marketId,
                role: "MARKET_ADMIN",
            },
        });

        Logger.successOperation('AuthService', 'linkUserToMarket', updatedUser.id);
        return updatedUser;
    }

    async unlinkUserFromMarket(userId: string) {
        Logger.service('AuthService', 'unlinkUserFromMarket', 'Attempting to unlink user from market', { userId });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                marketId: null,
                role: "CUSTOMER",
            },
        });

        Logger.successOperation('AuthService', 'unlinkUserFromMarket', updatedUser.id);
        return updatedUser;
    }

    async login(authLoginDTO: AuthLoginDTO) {
        Logger.service('AuthService', 'login', 'Attempting to login', { email: authLoginDTO.email });
        
        const user = await prisma.user.findUnique({ 
            where: { email: authLoginDTO.email }
        });

        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(authLoginDTO.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }

        const accessToken = jwt.sign({ 
            id: user.id, 
            role: user.role,
            marketId: user.marketId 
        }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
        
        const refreshToken = jwt.sign({ 
            id: user.id, 
            role: user.role,
            marketId: user.marketId 
        }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken },
        });

        // Buscar dados do mercado se o usuário tiver marketId
        let market = null;
        if (user.marketId) {
            market = await prisma.market.findUnique({ 
                where: { id: user.marketId }
            });
        }

        Logger.successOperation('AuthService', 'login', user.id);
        return { 
            accessToken, 
            refreshToken, 
            role: user.role, 
            id: user.id,
            marketId: user.marketId,
            market: market
        };
    }

    async refreshAccessToken(oldRefreshToken: string) {
        Logger.service('AuthService', 'refreshAccessToken', 'Attempting to refresh token');
        try {
            const decoded: any = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);
            const user = await prisma.user.findUnique({ 
                where: { id: decoded.id }
            });

            if (!user || user.refreshToken !== oldRefreshToken) {
                throw new Error('Refresh token inválido');
            }

            const newAccessToken = jwt.sign({ 
                id: user.id, 
                role: user.role,
                marketId: user.marketId 
            }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
            
            const newRefreshToken = jwt.sign({ 
                id: user.id, 
                role: user.role,
                marketId: user.marketId 
            }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: newRefreshToken },
            });

            // Buscar dados do mercado se o usuário tiver marketId
            let market = null;
            if (user.marketId) {
                market = await prisma.market.findUnique({ 
                    where: { id: user.marketId }
                });
            }

            Logger.successOperation('AuthService', 'refreshAccessToken', user.id);
            return { 
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken,
                role: user.role,
                marketId: user.marketId,
                market: market
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'refreshAccessToken', error, 'Invalid refresh token');
            throw new Error('Refresh token inválido ou expirado');
        }
    }
}

export const authService = new AuthService();
