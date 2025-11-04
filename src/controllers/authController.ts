import { Request, Response } from "express";
import { ZodError } from "zod";
import { CreateUserResponse, GetTokenResponse } from "../domain/authDomain";
import { userService } from "../services/userService";
import { marketService } from "../services/marketService";
import { AuthCreateMarketDTO } from "../dtos/authDTO";
import { Logger } from "../utils/logger";

export class AuthController {
    async createUser(req: Request, res: Response) {
        Logger.controller('Auth', 'createUser', 'body', req.body);
        try {
            // Buscar token de management do Auth0
            const auth0Token = await fetch('https://dev-gk5bz75smosenq24.us.auth0.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    audience: 'https://dev-gk5bz75smosenq24.us.auth0.com/api/v2/'
                })
            });

            if (!auth0Token.ok) {
                const errorData = await auth0Token.json();
                Logger.errorOperation('AuthController', 'createUser', `Failed to get Auth0 token: ${JSON.stringify(errorData)}`);
                return res.status(auth0Token.status).json({ 
                    message: "Erro ao obter token de autenticação",
                    error: errorData 
                });
            }

            const auth0TokenData = await auth0Token.json();
            const managementToken = auth0TokenData.access_token;

            if (!managementToken) {
                Logger.errorOperation('AuthController', 'createUser', 'No access token received from Auth0');
                return res.status(500).json({ message: "Erro ao obter token de autenticação" });
            }

            // Criar usuário no Auth0
            const data = await fetch('https://dev-gk5bz75smosenq24.us.auth0.com/api/v2/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${managementToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    connection: 'Username-Password-Authentication',
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name
                })
            });

            if (!data.ok) {
                const errorData = await data.json();
                Logger.errorOperation('AuthController', 'createUser', `Auth0 user creation failed: ${JSON.stringify(errorData)}`);
                
                // Verificar se é erro de email duplicado
                if (errorData.code === 'user_exists' || errorData.message?.toLowerCase().includes('user already exists')) {
                    return res.status(409).json({ 
                        message: "Email já está em uso",
                        error: errorData 
                    });
                }
                
                return res.status(data.status).json({ 
                    message: "Erro ao criar usuário no Auth0",
                    error: errorData 
                });
            }

            const createUserResponse = await data.json() as CreateUserResponse;

            // Criar usuário no banco local usando o service
            await userService.createUser({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                auth0Id: createUserResponse.user_id,
            });

            Logger.successOperation('AuthController', 'createUser', 'User created in Auth0 and database');
            return res.status(201).json(createUserResponse);

        } catch (error: any) {
            Logger.errorOperation('AuthController', 'createUser', error);
            
            // Tratar erro de constraint única do Prisma
            if (error?.code === 'P2002') {
                const field = error?.meta?.target?.[0] || 'campo';
                if (field === 'email' || field === 'auth0Id') {
                    return res.status(409).json({ 
                        message: "Email já está em uso" 
                    });
                }
                return res.status(409).json({ 
                    message: `Já existe um registro com este ${field}` 
                });
            }
            
            if (error instanceof Error && error.message.includes('Email já está em uso')) {
                return res.status(409).json({ message: error.message });
            }
            
            if (error instanceof Error && error.message.includes('Mercado não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            
            return res.status(500).json({ 
                message: "Erro interno do servidor",
                error: error?.message || "Erro desconhecido"
            });
        }
    }

    async getToken(req: Request, res: Response) {
        Logger.controller('Auth', 'getToken', 'body', req.body);
        try {
            const auth0Token = await fetch('https://dev-gk5bz75smosenq24.us.auth0.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
                    client_id: process.env.AUTH0_CLIENT_ID,
                    username: req.body.username,
                    password: req.body.password,
                    realm: 'Username-Password-Authentication',
                    scope: 'openid profile email'
                })
            });
            const auth0TokenData = await auth0Token.json() as GetTokenResponse;
            return res.status(200).json(auth0TokenData);
        } catch (error) {
            Logger.errorOperation('AuthController', 'getToken', error);
            if (error instanceof Error) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async registerMarket(req: Request, res: Response) {
        Logger.controller('Auth', 'registerMarket', 'body', req.body);
        try {
            const { email, password, name: userName, marketName, ...marketFields } = req.body;
            const marketData = AuthCreateMarketDTO.parse({
                ...marketFields,
                name: marketName || marketFields.name,
            });
            
            if (!email || !password) {
                return res.status(400).json({ 
                    message: "Email e senha são obrigatórios" 
                });
            }

            const auth0Token = await fetch('https://dev-gk5bz75smosenq24.us.auth0.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    audience: 'https://dev-gk5bz75smosenq24.us.auth0.com/api/v2/'
                })
            });

            if (!auth0Token.ok) {
                const errorData = await auth0Token.json();
                Logger.errorOperation('AuthController', 'registerMarket', `Failed to get Auth0 token: ${JSON.stringify(errorData)}`);
                return res.status(auth0Token.status).json({ 
                    message: "Erro ao obter token de autenticação",
                    error: errorData 
                });
            }

            const auth0TokenData = await auth0Token.json();
            const managementToken = auth0TokenData.access_token;

            if (!managementToken) {
                Logger.errorOperation('AuthController', 'registerMarket', 'No access token received from Auth0');
                return res.status(500).json({ message: "Erro ao obter token de autenticação" });
            }

            const market = await marketService.createMarket({
                name: marketData.name,
                address: marketData.address,
                profilePicture: marketData.profilePicture || undefined,
            });

            const auth0UserData = await fetch('https://dev-gk5bz75smosenq24.us.auth0.com/api/v2/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${managementToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    connection: 'Username-Password-Authentication',
                    email: email,
                    password: password,
                    name: userName || marketData.name,
                    app_metadata: {
                        role: 'MARKET_ADMIN',
                        marketId: market.id
                    },
                    user_metadata: {
                        role: 'MARKET_ADMIN',
                        marketId: market.id
                    }
                })
            });

            if (!auth0UserData.ok) {
                const errorData = await auth0UserData.json();
                Logger.errorOperation('AuthController', 'registerMarket', `Auth0 user creation failed: ${JSON.stringify(errorData)}`);
                try {
                    await marketService.deleteMarket(market.id);
                } catch (deleteError) {
                    Logger.errorOperation('AuthController', 'registerMarket', `Failed to delete market after user creation failure: ${deleteError}`);
                }
                
                if (errorData.code === 'user_exists' || errorData.message?.toLowerCase().includes('user already exists')) {
                    return res.status(409).json({ 
                        message: "Email já está em uso",
                        error: errorData 
                    });
                }
                
                return res.status(auth0UserData.status).json({ 
                    message: "Erro ao criar usuário no Auth0",
                    error: errorData 
                });
            }

            const createUserResponse = await auth0UserData.json() as CreateUserResponse;

            const { userRepository } = await import('../repositories/userRepository');
            await userRepository.createUserWithRoleAndMarket({
                name: userName || marketData.name,
                email: email,
                password: password,
                auth0Id: createUserResponse.user_id,
                role: 'MARKET_ADMIN',
                marketId: market.id,
            });

            Logger.successOperation('AuthController', 'registerMarket', 'Market and user created successfully');
            return res.status(201).json({
                message: "Mercado e usuário criados com sucesso",
                market: {
                    id: market.id,
                    name: market.name,
                    address: market.address,
                },
                user: {
                    auth0Id: createUserResponse.user_id,
                    email: email,
                }
            });

        } catch (error: any) {
            Logger.errorOperation('AuthController', 'registerMarket', error);
            
            if (error?.code === 'P2002') {
                const field = error?.meta?.target?.[0] || 'campo';
                if (field === 'email' || field === 'auth0Id') {
                    return res.status(409).json({ 
                        message: "Email já está em uso" 
                    });
                }
                return res.status(409).json({ 
                    message: `Já existe um registro com este ${field}` 
                });
            }
            
            if (error instanceof ZodError) {
                return res.status(400).json({ 
                    message: "Erro de validação",
                    errors: error.issues 
                });
            }
            
            if (error instanceof Error) {
                if (error.message.includes('Email já está em uso')) {
                    return res.status(409).json({ message: error.message });
                }
                if (error.message.includes('Mercado não encontrado')) {
                    return res.status(404).json({ message: error.message });
                }
            }
            
            return res.status(500).json({ 
                message: "Erro interno do servidor",
                error: error?.message || "Erro desconhecido"
            });
        }
    }

    async createMarketForUser(req: Request, res: Response) {
        Logger.controller('Auth', 'createMarketForUser', 'body', req.body);
        try {
            const { auth0Id, marketName, address, profilePicture, userName } = req.body;

            if (!auth0Id || !marketName || !address) {
                return res.status(400).json({ 
                    message: "auth0Id, marketName e address são obrigatórios" 
                });
            }

            const marketData = AuthCreateMarketDTO.parse({
                name: marketName,
                address: address,
                profilePicture: profilePicture,
            });

            const market = await marketService.createMarket({
                name: marketData.name,
                address: marketData.address,
                profilePicture: marketData.profilePicture || undefined,
            });

            let userEmail = '';
            try {
                const auth0Token = await fetch('https://dev-gk5bz75smosenq24.us.auth0.com/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        grant_type: 'client_credentials',
                        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
                        client_secret: process.env.AUTH0_CLIENT_SECRET,
                        audience: 'https://dev-gk5bz75smosenq24.us.auth0.com/api/v2/'
                    })
                });

                if (auth0Token.ok) {
                    const tokenData = await auth0Token.json();
                    const managementToken = tokenData.access_token;

                    const auth0UserResponse = await fetch(`https://dev-gk5bz75smosenq24.us.auth0.com/api/v2/users/${auth0Id}`, {
                        headers: {
                            'Authorization': `Bearer ${managementToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (auth0UserResponse.ok) {
                        const auth0User = await auth0UserResponse.json();
                        userEmail = auth0User.email || '';
                    }
                }
            } catch (error) {
                Logger.errorOperation('AuthController', 'createMarketForUser', `Erro ao buscar email do Auth0: ${error}`);
            }

            const { userRepository } = await import('../repositories/userRepository');
            const existingUser = await userRepository.getUserByAuth0Id(auth0Id);

            if (!existingUser) {
                await userRepository.createUserWithRoleAndMarket({
                    name: userName || marketData.name,
                    email: userEmail || req.body.email || '',
                    password: '',
                    auth0Id: auth0Id,
                    role: 'MARKET_ADMIN',
                    marketId: market.id,
                });
            } else {
                const { prisma } = await import('../utils/prisma');
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        role: 'MARKET_ADMIN',
                        marketId: market.id,
                    },
                });
            }

            Logger.successOperation('AuthController', 'createMarketForUser', 'Market created and linked to user');
            return res.status(201).json({
                message: "Mercado criado e vinculado ao usuário com sucesso",
                market: {
                    id: market.id,
                    name: market.name,
                    address: market.address,
                },
                user: {
                    auth0Id: auth0Id,
                }
            });

        } catch (error: any) {
            Logger.errorOperation('AuthController', 'createMarketForUser', error);
            
            if (error?.code === 'P2002') {
                const field = error?.meta?.target?.[0] || 'campo';
                return res.status(409).json({ 
                    message: `Já existe um registro com este ${field}` 
                });
            }
            
            if (error instanceof ZodError) {
                return res.status(400).json({ 
                    message: "Erro de validação",
                    errors: error.issues 
                });
            }
            
            if (error instanceof Error) {
                if (error.message.includes('Email já está em uso')) {
                    return res.status(409).json({ message: error.message });
                }
                if (error.message.includes('Mercado não encontrado')) {
                    return res.status(404).json({ message: error.message });
                }
            }
            
            return res.status(500).json({ 
                message: "Erro interno do servidor",
                error: error?.message || "Erro desconhecido"
            });
        }
    }
}

export const authController = new AuthController();
