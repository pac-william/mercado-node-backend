import { Request, Response } from "express";
import { authService } from "../services/authService";
import { AuthLoginDTO, AuthRegisterUserDTO, AuthLinkUserToMarketDTO, AuthCreateMarketDTO } from "../dtos/authDTO";
import { toProfileResponseDTO, ProfileUpdateDTO } from "../dtos/userDTO";
import { Logger } from "../utils/logger";

export class AuthController {
    async registerUser(req: Request, res: Response) {
        Logger.controller('Auth', 'registerUser', 'body', req.body);
        try {
            const authRegisterUserDTO = AuthRegisterUserDTO.parse(req.body);
            const user = await authService.registerUser(authRegisterUserDTO);
            Logger.successOperation('AuthController', 'registerUser', user.id);
            return res.status(201).json({ 
                message: "Usuário registrado com sucesso", 
                userId: user.id,
                role: user.role,
                marketId: user.marketId
            });
        } catch (error) {
            Logger.errorOperation('AuthController', 'registerUser', error);
            if (error instanceof Error && error.message.includes('Email já está em uso')) {
                return res.status(409).json({ message: error.message });
            }
            if (error instanceof Error && error.message.includes('Mercado não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createMarket(req: Request, res: Response) {
        Logger.controller('Auth', 'createMarket', 'body', req.body);
        try {
            const authCreateMarketDTO = AuthCreateMarketDTO.parse(req.body);
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const market = await authService.createMarket(authCreateMarketDTO, userId);
            Logger.successOperation('AuthController', 'createMarket', market.id);
            return res.status(201).json({ 
                message: "Mercado criado com sucesso e você foi vinculado como administrador", 
                marketId: market.id 
            });
        } catch (error) {
            Logger.errorOperation('AuthController', 'createMarket', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async linkUserToMarket(req: Request, res: Response) {
        Logger.controller('Auth', 'linkUserToMarket', 'body', req.body);
        try {
            const authLinkUserToMarketDTO = AuthLinkUserToMarketDTO.parse(req.body);
            const user = await authService.linkUserToMarket(authLinkUserToMarketDTO);
            Logger.successOperation('AuthController', 'linkUserToMarket', user.id);
            return res.status(200).json({ 
                message: "Usuário vinculado ao mercado com sucesso", 
                userId: user.id,
                marketId: user.marketId,
                role: user.role
            });
        } catch (error) {
            Logger.errorOperation('AuthController', 'linkUserToMarket', error);
            if (error instanceof Error && (error.message.includes('Usuário não encontrado') || error.message.includes('Mercado não encontrado'))) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async unlinkUserFromMarket(req: Request, res: Response) {
        Logger.controller('Auth', 'unlinkUserFromMarket', 'params', req.params);
        try {
            const { userId } = req.params;
            const user = await authService.unlinkUserFromMarket(userId);
            Logger.successOperation('AuthController', 'unlinkUserFromMarket', user.id);
            return res.status(200).json({ 
                message: "Usuário desvinculado do mercado com sucesso", 
                userId: user.id,
                role: user.role
            });
        } catch (error) {
            Logger.errorOperation('AuthController', 'unlinkUserFromMarket', error);
            if (error instanceof Error && error.message.includes('Usuário não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async login(req: Request, res: Response) {
        Logger.controller('Auth', 'login', 'body', req.body);
        try {
            const authLoginDTO = AuthLoginDTO.parse(req.body);
            const { accessToken, refreshToken, role, id, marketId, market } = await authService.login(authLoginDTO);
            
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
            });

            Logger.successOperation('AuthController', 'login', id);
            return res.status(200).json({ 
                message: "Login realizado com sucesso",
                role, 
                id,
                marketId,
                market: market ? {
                    id: market.id,
                    name: market.name,
                    address: market.address,
                    profilePicture: market.profilePicture
                } : null,
                accessToken,
                refreshToken
            });
        } catch (error) {
            Logger.errorOperation('AuthController', 'login', error);
            if (error instanceof Error && error.message === 'Credenciais inválidas') {
                return res.status(401).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async refreshToken(req: Request, res: Response) {
        Logger.controller('Auth', 'refreshToken', 'body', req.body);
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token é obrigatório" });
            }
            const { accessToken: newAccessToken, refreshToken: newRefreshToken, role, marketId, market } = await authService.refreshAccessToken(refreshToken);
            
            // Atualizar cookies
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
            });

            Logger.successOperation('AuthController', 'refreshToken');
            return res.status(200).json({ 
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken,
                role,
                marketId,
                market: market ? {
                    id: market.id,
                    name: market.name,
                    address: market.address,
                    profilePicture: market.profilePicture
                } : null
            });
        } catch (error) {
            Logger.errorOperation('AuthController', 'refreshToken', error);
            if (error instanceof Error && error.message.includes('Refresh token inválido')) {
                return res.status(403).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async logout(req: Request, res: Response) {
        Logger.controller('Auth', 'logout', 'cookies', req.cookies);
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            
            Logger.successOperation('AuthController', 'logout');
            return res.status(200).json({ message: "Logout realizado com sucesso" });
        } catch (error) {
            Logger.errorOperation('AuthController', 'logout', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getMe(req: Request, res: Response) {
        Logger.controller('Auth', 'getMe', 'user', { userId: (req as any).user?.id });
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const user = await authService.getUserProfile(userId);
            Logger.successOperation('AuthController', 'getMe', userId);
            return res.status(200).json(toProfileResponseDTO(user));
        } catch (error) {
            Logger.errorOperation('AuthController', 'getMe', error);
            if (error instanceof Error && error.message === "Usuário não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMe(req: Request, res: Response) {
        Logger.controller('Auth', 'updateMe', 'body', req.body);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const profileUpdateDTO = ProfileUpdateDTO.parse(req.body);
            const user = await authService.updateUserProfile(userId, profileUpdateDTO);
            Logger.successOperation('AuthController', 'updateMe', userId);
            return res.status(200).json(toProfileResponseDTO(user));
        } catch (error) {
            Logger.errorOperation('AuthController', 'updateMe', error);
            if (error instanceof Error && error.message === "Usuário não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            if (error instanceof Error && error.message === "Email já está em uso") {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateMePartial(req: Request, res: Response) {
        Logger.controller('Auth', 'updateMePartial', 'body', req.body);
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const profileUpdateDTO = ProfileUpdateDTO.parse(req.body);
            const user = await authService.updateUserProfilePartial(userId, profileUpdateDTO);
            Logger.successOperation('AuthController', 'updateMePartial', userId);
            return res.status(200).json(toProfileResponseDTO(user));
        } catch (error) {
            Logger.errorOperation('AuthController', 'updateMePartial', error);
            if (error instanceof Error && error.message === "Usuário não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            if (error instanceof Error && error.message === "Email já está em uso") {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const authController = new AuthController();
