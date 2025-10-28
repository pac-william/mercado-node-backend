import { authService } from '../../src/services/authService';
import { prisma } from '../../src/utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRegisterUserDTO, AuthLoginDTO, AuthLinkUserToMarketDTO, AuthCreateMarketDTO } from '../../src/dtos/authDTO';

const mockedPrisma = jest.mocked(prisma, { shallow: false });
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData: AuthRegisterUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        marketId: 'market-123'
      };

      const mockMarket = {
        id: 'market-123',
        name: 'Super Market',
        address: '123 Main St',
        profilePicture: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(null);
      mockedPrisma.market.findUnique.mockResolvedValue(mockMarket);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockedPrisma.user.create.mockResolvedValue(mockUser);

      const result = await authService.registerUser(userData);
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(mockedPrisma.market.findUnique).toHaveBeenCalledWith({
        where: { id: userData.marketId }
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: 'hashedPassword',
          role: 'MARKET_ADMIN',
          marketId: userData.marketId,
        }
      });
      expect(result).toEqual(mockUser);
    });

    it('should register a customer user without marketId', async () => {
      const userData: AuthRegisterUserDTO = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockedPrisma.user.create.mockResolvedValue(mockUser);
      const result = await authService.registerUser(userData);
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(mockedPrisma.market.findUnique).not.toHaveBeenCalled();
      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: 'hashedPassword',
          role: 'CUSTOMER',
          marketId: undefined,
        }
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when email is already in use', async () => {
      const userData: AuthRegisterUserDTO = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      const existingUser = {
        id: 'existing-user-123',
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(existingUser);
      await expect(authService.registerUser(userData)).rejects.toThrow('Email já está em uso');
      expect(mockedPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw error when market is not found', async () => {
      const userData: AuthRegisterUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        marketId: 'non-existent-market'
      };

      mockedPrisma.user.findUnique.mockResolvedValue(null);
      mockedPrisma.market.findUnique.mockResolvedValue(null);
      await expect(authService.registerUser(userData)).rejects.toThrow('Mercado não encontrado');
      expect(mockedPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('createMarket', () => {
    it('should create a market and link user successfully', async () => {
      const marketData: AuthCreateMarketDTO = {
        name: 'Super Market',
        address: '123 Main St',
        profilePicture: 'https://example.com/image.jpg'
      };

      const userId = 'user-123';

      const mockMarket = {
        id: 'market-123',
        name: 'Super Market',
        address: '123 Main St',
        profilePicture: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedPrisma.market.create.mockResolvedValue(mockMarket);
      mockedPrisma.user.update.mockResolvedValue({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      });

      const result = await authService.createMarket(marketData, userId);

      expect(mockedPrisma.market.create).toHaveBeenCalledWith({
        data: {
          name: marketData.name,
          address: marketData.address,
          profilePicture: marketData.profilePicture,
        }
      });
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          marketId: mockMarket.id,
          role: 'MARKET_ADMIN',
        }
      });
      expect(result).toEqual(mockMarket);
    });
  });

  describe('linkUserToMarket', () => {
    it('should link user to market successfully', async () => {
      const linkData: AuthLinkUserToMarketDTO = {
        userId: 'user-123',
        marketId: 'market-123'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      const mockMarket = {
        id: 'market-123',
        name: 'Super Market',
        address: '123 Main St',
        profilePicture: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedUser = {
        ...mockUser,
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123'
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockedPrisma.market.findUnique.mockResolvedValue(mockMarket);
      mockedPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await authService.linkUserToMarket(linkData);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: linkData.userId }
      });
      expect(mockedPrisma.market.findUnique).toHaveBeenCalledWith({
        where: { id: linkData.marketId }
      });
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: linkData.userId },
        data: {
          marketId: linkData.marketId,
          role: 'MARKET_ADMIN',
        }
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when user is not found', async () => {
      const linkData: AuthLinkUserToMarketDTO = {
        userId: 'non-existent-user',
        marketId: 'market-123'
      };

      mockedPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.linkUserToMarket(linkData)).rejects.toThrow('Usuário não encontrado');
      expect(mockedPrisma.market.findUnique).not.toHaveBeenCalled();
    });

    it('should throw error when market is not found', async () => {
      const linkData: AuthLinkUserToMarketDTO = {
        userId: 'user-123',
        marketId: 'non-existent-market'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockedPrisma.market.findUnique.mockResolvedValue(null);
      await expect(authService.linkUserToMarket(linkData)).rejects.toThrow('Mercado não encontrado');
      expect(mockedPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('unlinkUserFromMarket', () => {
    it('should unlink user from market successfully', async () => {
      const userId = 'user-123';

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      const updatedUser = {
        ...mockUser,
        role: 'CUSTOMER' as const,
        marketId: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockedPrisma.user.update.mockResolvedValue(updatedUser);

      // Act: Call the service method
      const result = await authService.unlinkUserFromMarket(userId);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          marketId: null,
          role: 'CUSTOMER',
        }
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when user is not found', async () => {
      const userId = 'non-existent-user';

      mockedPrisma.user.findUnique.mockResolvedValue(null);
      await expect(authService.unlinkUserFromMarket(userId)).rejects.toThrow('Usuário não encontrado');
      expect(mockedPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData: AuthLoginDTO = {
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null,
        market: {
          id: 'market-123',
          name: 'Super Market',
          address: '123 Main St',
          profilePicture: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123'
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign
        .mockReturnValueOnce(mockTokens.accessToken as never)
        .mockReturnValueOnce(mockTokens.refreshToken as never);
      mockedPrisma.user.update.mockResolvedValue({
        ...mockUser,
        refreshToken: mockTokens.refreshToken
      });

      const result = await authService.login(loginData);
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
        include: { market: true }
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(mockedJwt.sign).toHaveBeenCalledTimes(2);
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshToken: mockTokens.refreshToken }
      });
      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        role: mockUser.role,
        id: mockUser.id,
        marketId: mockUser.marketId,
        market: mockUser.market
      });
    });

    it('should throw error when user is not found', async () => {
      const loginData: AuthLoginDTO = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockedPrisma.user.findUnique.mockResolvedValue(null);
      await expect(authService.login(loginData)).rejects.toThrow('Credenciais inválidas');
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      const loginData: AuthLoginDTO = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null,
        market: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);
      await expect(authService.login(loginData)).rejects.toThrow('Credenciais inválidas');
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const oldRefreshToken = 'old-refresh-token-123';
      const decodedToken = {
        id: 'user-123',
        role: 'MARKET_ADMIN',
        marketId: 'market-123'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: oldRefreshToken,
        market: {
          id: 'market-123',
          name: 'Super Market',
          address: '123 Main St',
          profilePicture: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const mockTokens = {
        accessToken: 'new-access-token-123',
        refreshToken: 'new-refresh-token-123'
      };

      mockedJwt.verify.mockReturnValue(decodedToken as never);
      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockedJwt.sign
        .mockReturnValueOnce(mockTokens.accessToken as never)
        .mockReturnValueOnce(mockTokens.refreshToken as never);
      mockedPrisma.user.update.mockResolvedValue({
        ...mockUser,
        refreshToken: mockTokens.refreshToken
      });

      const result = await authService.refreshAccessToken(oldRefreshToken);
      expect(mockedJwt.verify).toHaveBeenCalledWith(oldRefreshToken, process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey');
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: decodedToken.id },
        include: { market: true }
      });
      expect(mockedJwt.sign).toHaveBeenCalledTimes(2);
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshToken: mockTokens.refreshToken }
      });
      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        role: mockUser.role,
        marketId: mockUser.marketId,
        market: mockUser.market
      });
    });

    it('should throw error when refresh token is invalid', async () => {
      const invalidRefreshToken = 'invalid-refresh-token';

      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      await expect(authService.refreshAccessToken(invalidRefreshToken)).rejects.toThrow('Refresh token inválido ou expirado');
    });

    it('should throw error when user is not found', async () => {
      const refreshToken = 'refresh-token-123';
      const decodedToken = {
        id: 'non-existent-user',
        role: 'MARKET_ADMIN',
        marketId: 'market-123'
      };

      mockedJwt.verify.mockReturnValue(decodedToken as never);
      mockedPrisma.user.findUnique.mockResolvedValue(null);
      await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow('Refresh token inválido');
    });

    it('should throw error when refresh token does not match', async () => {
      const refreshToken = 'refresh-token-123';
      const decodedToken = {
        id: 'user-123',
        role: 'MARKET_ADMIN',
        marketId: 'market-123'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: 'different-refresh-token',
        market: null
      };

      mockedJwt.verify.mockReturnValue(decodedToken as never);
      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow('Refresh token inválido');
    });
  });
});
