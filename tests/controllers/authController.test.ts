import { Request, Response } from 'express';
import { authController } from '../../src/controllers/authController';
import { authService } from '../../src/services/authService';
import { AuthRegisterUserDTO, AuthLoginDTO, AuthLinkUserToMarketDTO, AuthCreateMarketDTO } from '../../src/dtos/authDTO';

jest.mock('../../src/services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'CUSTOMER' | 'MARKET_ADMIN';
        marketId?: string;
    };
}

describe('AuthController', () => {
    let mockRequest: Partial<AuthenticatedRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockCookie: jest.Mock;
    let mockClearCookie: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockCookie = jest.fn();
        mockClearCookie = jest.fn();

        mockRequest = {
            body: {},
            params: {},
            user: undefined,
        };

        mockResponse = {
            json: mockJson,
            status: mockStatus,
            cookie: mockCookie,
            clearCookie: mockClearCookie,
        };

        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                marketId: 'market-123'
            };

            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'MARKET_ADMIN' as const,
                marketId: 'market-123',
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date(),
                refreshToken: null
            };

            mockRequest.body = userData;
            mockedAuthService.registerUser.mockResolvedValue(mockUser);

            await authController.registerUser(mockRequest as Request, mockResponse as Response);

            expect(mockedAuthService.registerUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    marketId: userData.marketId
                })
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Usuário registrado com sucesso",
                userId: mockUser.id,
                role: mockUser.role,
                marketId: mockUser.marketId
            });
        });

        it('should handle email already in use error', async () => {
            const userData = {
                name: 'John Doe',
                email: 'existing@example.com',
                password: 'password123'
            };

            mockRequest.body = userData;
            mockedAuthService.registerUser.mockRejectedValue(new Error('Email já está em uso'));

            await authController.registerUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(409);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Email já está em uso'
            });
        });

        it('should handle market not found error', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                marketId: 'non-existent-market'
            };

            mockRequest.body = userData;
            mockedAuthService.registerUser.mockRejectedValue(new Error('Mercado não encontrado'));

            await authController.registerUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Mercado não encontrado'
            });
        });

        it('should handle generic server error', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            mockRequest.body = userData;
            mockedAuthService.registerUser.mockRejectedValue(new Error('Database connection failed'));

            await authController.registerUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Erro interno do servidor"
            });
        });
    });

    describe('createMarket', () => {
        it('should create a market successfully', async () => {
            const marketData = {
                name: 'Super Market',
                address: '123 Main St',
                profilePicture: 'https://example.com/image.jpg'
            };

            const mockMarket = {
                id: 'market-123',
                name: 'Super Market',
                address: '123 Main St',
                profilePicture: 'https://example.com/image.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockRequest.body = marketData;
            mockRequest.user = { id: 'user-123', role: 'CUSTOMER' as const };
            mockedAuthService.createMarket.mockResolvedValue(mockMarket);

            await authController.createMarket(mockRequest as Request, mockResponse as Response);
            expect(mockedAuthService.createMarket).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: marketData.name,
                    address: marketData.address,
                    profilePicture: marketData.profilePicture
                }),
                'user-123'
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Mercado criado com sucesso e você foi vinculado como administrador",
                marketId: mockMarket.id
            });
        });

        it('should handle unauthenticated user', async () => {
            const marketData = {
                name: 'Super Market',
                address: '123 Main St'
            };

            mockRequest.body = marketData;
            mockRequest.user = undefined;

            await authController.createMarket(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Usuário não autenticado"
            });
        });

        it('should handle service error', async () => {
            const marketData = {
                name: 'Super Market',
                address: '123 Main St'
            };

            mockRequest.body = marketData;
            mockRequest.user = { id: 'user-123', role: 'CUSTOMER' as const };
            mockedAuthService.createMarket.mockRejectedValue(new Error('Database error'));

            await authController.createMarket(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Erro interno do servidor"
            });
        });
    });

    describe('linkUserToMarket', () => {
        it('should link user to market successfully', async () => {
            const linkData = {
                userId: 'user-123',
                marketId: 'market-123'
            };

            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'MARKET_ADMIN' as const,
                marketId: 'market-123',
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date(),
                refreshToken: null
            };

            mockRequest.body = linkData;
            mockedAuthService.linkUserToMarket.mockResolvedValue(mockUser);

            await authController.linkUserToMarket(mockRequest as Request, mockResponse as Response);
            expect(mockedAuthService.linkUserToMarket).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: linkData.userId,
                    marketId: linkData.marketId
                })
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Usuário vinculado ao mercado com sucesso",
                userId: mockUser.id,
                marketId: mockUser.marketId,
                role: mockUser.role
            });
        });

        it('should handle user not found error', async () => {
            const linkData = {
                userId: 'non-existent-user',
                marketId: 'market-123'
            };

            mockRequest.body = linkData;
            mockedAuthService.linkUserToMarket.mockRejectedValue(new Error('Usuário não encontrado'));

            await authController.linkUserToMarket(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Usuário não encontrado'
            });
        });

        it('should handle market not found error', async () => {
            const linkData = {
                userId: 'user-123',
                marketId: 'non-existent-market'
            };

            mockRequest.body = linkData;
            mockedAuthService.linkUserToMarket.mockRejectedValue(new Error('Mercado não encontrado'));

            await authController.linkUserToMarket(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Mercado não encontrado'
            });
        });
    });

    describe('unlinkUserFromMarket', () => {
        it('should unlink user from market successfully', async () => {
            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'CUSTOMER' as const,
                marketId: null,
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date(),
                refreshToken: null
            };

            mockRequest.params = { userId: 'user-123' };
            mockedAuthService.unlinkUserFromMarket.mockResolvedValue(mockUser);
            await authController.unlinkUserFromMarket(mockRequest as Request, mockResponse as Response);
            expect(mockedAuthService.unlinkUserFromMarket).toHaveBeenCalledWith('user-123');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Usuário desvinculado do mercado com sucesso",
                userId: mockUser.id,
                role: mockUser.role
            });
        });

        it('should handle user not found error', async () => {
            mockRequest.params = { userId: 'non-existent-user' };
            mockedAuthService.unlinkUserFromMarket.mockRejectedValue(new Error('Usuário não encontrado'));
            await authController.unlinkUserFromMarket(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Usuário não encontrado'
            });
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'password123'
            };

            const mockLoginResult = {
                accessToken: 'access-token-123',
                refreshToken: 'refresh-token-123',
                role: 'MARKET_ADMIN' as const,
                id: 'user-123',
                marketId: 'market-123',
                market: {
                    id: 'market-123',
                    name: 'Super Market',
                    address: '123 Main St',
                    profilePicture: 'https://example.com/image.jpg',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            };

            mockRequest.body = loginData;
            mockedAuthService.login.mockResolvedValue(mockLoginResult);
            await authController.login(mockRequest as Request, mockResponse as Response);
            expect(mockedAuthService.login).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: loginData.email,
                    password: loginData.password
                })
            );
            expect(mockCookie).toHaveBeenCalledWith('accessToken', 'access-token-123', {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            expect(mockCookie).toHaveBeenCalledWith('refreshToken', 'refresh-token-123', {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Login realizado com sucesso",
                role: mockLoginResult.role,
                id: mockLoginResult.id,
                marketId: mockLoginResult.marketId,
                market: {
                    id: mockLoginResult.market.id,
                    name: mockLoginResult.market.name,
                    address: mockLoginResult.market.address,
                    profilePicture: mockLoginResult.market.profilePicture
                },
                accessToken: mockLoginResult.accessToken,
                refreshToken: mockLoginResult.refreshToken
            });
        });

        it('should handle invalid credentials error', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            mockRequest.body = loginData;
            mockedAuthService.login.mockRejectedValue(new Error('Credenciais inválidas'));

            await authController.login(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Credenciais inválidas'
            });
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully', async () => {
            const refreshData = {
                refreshToken: 'refresh-token-123'
            };

            const mockRefreshResult = {
                accessToken: 'new-access-token-123',
                refreshToken: 'new-refresh-token-123',
                role: 'MARKET_ADMIN' as const,
                marketId: 'market-123',
                market: {
                    id: 'market-123',
                    name: 'Super Market',
                    address: '123 Main St',
                    profilePicture: 'https://example.com/image.jpg',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            };

            mockRequest.body = refreshData;
            mockedAuthService.refreshAccessToken.mockResolvedValue(mockRefreshResult);
            await authController.refreshToken(mockRequest as Request, mockResponse as Response);
            expect(mockedAuthService.refreshAccessToken).toHaveBeenCalledWith('refresh-token-123');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                accessToken: mockRefreshResult.accessToken,
                refreshToken: mockRefreshResult.refreshToken,
                role: mockRefreshResult.role,
                marketId: mockRefreshResult.marketId,
                market: {
                    id: mockRefreshResult.market.id,
                    name: mockRefreshResult.market.name,
                    address: mockRefreshResult.market.address,
                    profilePicture: mockRefreshResult.market.profilePicture
                }
            });
        });

        it('should handle missing refresh token', async () => {
            mockRequest.body = {};
            await authController.refreshToken(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Refresh token é obrigatório"
            });
        });

        it('should handle invalid refresh token', async () => {
            const refreshData = {
                refreshToken: 'invalid-token'
            };

            mockRequest.body = refreshData;
            mockedAuthService.refreshAccessToken.mockRejectedValue(new Error('Refresh token inválido'));

            await authController.refreshToken(mockRequest as Request, mockResponse as Response); 
            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Refresh token inválido'
            });
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            await authController.logout(mockRequest as Request, mockResponse as Response);
            expect(mockClearCookie).toHaveBeenCalledWith('accessToken');
            expect(mockClearCookie).toHaveBeenCalledWith('refreshToken');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: "Logout realizado com sucesso"
            });
        });
    });
});
