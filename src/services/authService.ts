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

        // Verificar se auth0Id já existe (se fornecido)
        if (authRegisterUserDTO.auth0Id) {
            const existingAuth0User = await prisma.user.findUnique({ where: { auth0Id: authRegisterUserDTO.auth0Id } });
            if (existingAuth0User) {
                throw new Error('Auth0 ID já está em uso');
            }
        }

        // Verificar se o mercado existe (se fornecido)
        if (authRegisterUserDTO.marketId) {
            const market = await prisma.market.findUnique({ where: { id: authRegisterUserDTO.marketId } });
            if (!market) {
                throw new Error('Mercado não encontrado');
            }
        }

        // Se tem senha, hash ela. Se não tem, senha vazia (usuário Auth0)
        const hashedPassword = authRegisterUserDTO.password 
            ? await bcrypt.hash(authRegisterUserDTO.password, 10) 
            : '';
        
        const user = await prisma.user.create({
            data: {
                name: authRegisterUserDTO.name,
                email: authRegisterUserDTO.email,
                password: hashedPassword,
                role: authRegisterUserDTO.marketId ? "MARKET_ADMIN" : "CUSTOMER",
                marketId: authRegisterUserDTO.marketId,
                auth0Id: authRegisterUserDTO.auth0Id,
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

    async getUserProfile(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            let market = null;
            if (user.marketId) {
                market = await prisma.market.findUnique({
                    where: { id: user.marketId },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        profilePicture: true
                    }
                });
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture,
                birthDate: user.birthDate,
                gender: user.gender,
                address: user.address,
                role: user.role,
                marketId: user.marketId,
                market: market,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'getUserProfile', error);
            throw error;
        }
    }

    async updateUserProfile(userId: string, userData: any) {
        try {
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            if (userData.email && userData.email !== existingUser.email) {
                const emailInUse = await prisma.user.findUnique({ where: { email: userData.email } });
                if (emailInUse) {
                    throw new Error('Email já está em uso');
                }
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    profilePicture: userData.profilePicture,
                    birthDate: userData.birthDate ? new Date(userData.birthDate) : undefined,
                    gender: userData.gender,
                    address: userData.address,
                    ...(userData.password && { password: await bcrypt.hash(userData.password, 10) })
                }
            });

            let market = null;
            if (updatedUser.marketId) {
                market = await prisma.market.findUnique({
                    where: { id: updatedUser.marketId },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        profilePicture: true
                    }
                });
            }

            return {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePicture: updatedUser.profilePicture,
                birthDate: updatedUser.birthDate,
                gender: updatedUser.gender,
                address: updatedUser.address,
                role: updatedUser.role,
                marketId: updatedUser.marketId,
                market: market,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'updateUserProfile', error);
            throw error;
        }
    }

    async updateUserProfilePartial(userId: string, userData: any) {
        try {
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            if (userData.email && userData.email !== existingUser.email) {
                const emailInUse = await prisma.user.findUnique({ where: { email: userData.email } });
                if (emailInUse) {
                    throw new Error('Email já está em uso');
                }
            }

            const updateData: any = {};
            if (userData.name) updateData.name = userData.name;
            if (userData.email) updateData.email = userData.email;
            if (userData.phone) updateData.phone = userData.phone;
            if (userData.profilePicture) updateData.profilePicture = userData.profilePicture;
            if (userData.birthDate) updateData.birthDate = new Date(userData.birthDate);
            if (userData.gender) updateData.gender = userData.gender;
            if (userData.address) updateData.address = userData.address;
            if (userData.password) updateData.password = await bcrypt.hash(userData.password, 10);

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData
            });

            let market = null;
            if (updatedUser.marketId) {
                market = await prisma.market.findUnique({
                    where: { id: updatedUser.marketId },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        profilePicture: true
                    }
                });
            }

            return {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePicture: updatedUser.profilePicture,
                birthDate: updatedUser.birthDate,
                gender: updatedUser.gender,
                address: updatedUser.address,
                role: updatedUser.role,
                marketId: updatedUser.marketId,
                market: market,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'updateUserProfilePartial', error);
            throw error;
        }
    }

    async uploadProfilePicture(userId: string, file: any) {
        try {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error('Formato de arquivo não suportado. Use JPEG, PNG, GIF ou WebP');
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('Arquivo muito grande. Tamanho máximo: 5MB');
            }

            const fileName = `profile_${userId}_${Date.now()}.${file.originalname.split('.').pop()}`;
            const filePath = `uploads/profiles/${fileName}`;
            
            const fs = require('fs');
            const path = require('path');
            
            const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

            const profilePictureUrl = `/uploads/profiles/${fileName}`;

            await prisma.user.update({
                where: { id: userId },
                data: { profilePicture: profilePictureUrl }
            });

            return profilePictureUrl;
        } catch (error) {
            Logger.errorOperation('AuthService', 'uploadProfilePicture', error);
            throw error;
        }
    }

    async getProfileHistory(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return {
                userId: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastUpdated: user.updatedAt,
                changes: [
                    {
                        field: 'account',
                        action: 'created',
                        timestamp: user.createdAt,
                        description: 'Conta criada'
                    }
                ]
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'getProfileHistory', error);
            throw error;
        }
    }

    async requestEmailConfirmation(userId: string, newEmail: string) {
        try {
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            const emailInUse = await prisma.user.findUnique({ where: { email: newEmail } });
            if (emailInUse) {
                throw new Error('Email já está em uso');
            }

            const confirmationToken = require('crypto').randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

            // Aqui você implementaria o envio do email
            // Por enquanto, apenas logamos a ação
            Logger.info('AuthService', 'requestEmailConfirmation', {
                userId,
                newEmail,
                token: confirmationToken,
                expiresAt
            });

            return {
                message: 'Email de confirmação será enviado',
                token: confirmationToken, // Em produção, não retornar o token
                expiresAt
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'requestEmailConfirmation', error);
            throw error;
        }
    }

    async confirmEmailChange(token: string) {
        try {
            // Em produção, você validaria o token contra um banco de dados
            // Por enquanto, simulamos a validação
            if (!token || token.length < 32) {
                throw new Error('Token inválido');
            }

            // Simular validação de token expirado
            const tokenAge = Date.now() - parseInt(token.substring(0, 13), 16);
            if (tokenAge > 24 * 60 * 60 * 1000) { // 24 horas
                throw new Error('Token expirado');
            }

            // Simular extração de dados do token
            const userId = 'user_id_from_token';
            const newEmail = 'new_email_from_token';

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { email: newEmail }
            });

            return {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                updatedAt: updatedUser.updatedAt
            };
        } catch (error) {
            Logger.errorOperation('AuthService', 'confirmEmailChange', error);
            throw error;
        }
    }

    async getUserByAuth0Id(auth0Id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { auth0Id }
            });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return user;
        } catch (error) {
            Logger.errorOperation('AuthService', 'getUserByAuth0Id', error);
            throw error;
        }
    }

    async linkAuth0IdToUser(userId: string, auth0Id: string) {
        try {
            Logger.service('AuthService', 'linkAuth0IdToUser', 'Attempting to link auth0Id to user', { userId, auth0Id });

            const existingUserWithAuth0Id = await prisma.user.findUnique({ 
                where: { auth0Id } 
            });

            if (existingUserWithAuth0Id && existingUserWithAuth0Id.id !== userId) {
                throw new Error('Auth0 ID já está vinculado a outro usuário');
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { auth0Id }
            });

            Logger.successOperation('AuthService', 'linkAuth0IdToUser', updatedUser.id);
            return updatedUser;
        } catch (error) {
            Logger.errorOperation('AuthService', 'linkAuth0IdToUser', error);
            throw error;
        }
    }

    async getOrCreateUserByAuth0Id(auth0Id: string, email: string, name: string) {
        try {
            Logger.service('AuthService', 'getOrCreateUserByAuth0Id', 'Attempting to get or create user by auth0Id', { auth0Id, email });

            // Primeiro, tenta buscar por auth0Id
            let user = await prisma.user.findUnique({ 
                where: { auth0Id }
            });

            if (user) {
                Logger.successOperation('AuthService', 'getOrCreateUserByAuth0Id', user.id);
                return user;
            }

            // Se não encontrou por auth0Id, busca por email
            user = await prisma.user.findUnique({ 
                where: { email }
            });

            if (user) {
                // Se encontrou por email, vincula o auth0Id
                Logger.info('AuthService', 'getOrCreateUserByAuth0Id', `Linking auth0Id to existing user by email: ${user.id}`);
                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: { auth0Id }
                });
                
                Logger.successOperation('AuthService', 'getOrCreateUserByAuth0Id - linked', updatedUser.id);
                return updatedUser;
            }

            // Se não encontrou nem por auth0Id nem por email, cria novo usuário
            Logger.info('AuthService', 'getOrCreateUserByAuth0Id', 'Creating new user with auth0Id');
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    auth0Id,
                    password: '', // Senha vazia pois o usuário autentica via Auth0
                    role: 'CUSTOMER'
                }
            });

            Logger.successOperation('AuthService', 'getOrCreateUserByAuth0Id - created', newUser.id);
            return newUser;
        } catch (error) {
            Logger.errorOperation('AuthService', 'getOrCreateUserByAuth0Id', error);
            throw error;
        }
    }
}

export const authService = new AuthService();
