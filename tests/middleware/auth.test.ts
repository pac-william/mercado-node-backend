import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorizeRoles, optionalAuth, requireMarketOwnership } from '../../src/middleware/auth';

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'CUSTOMER' | 'MARKET_ADMIN';
    marketId?: string;
  };
}

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      params: {},
      body: {},
      user: undefined
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token', () => {
      const validToken = 'valid-token-123';
      const decodedUser = {
        id: 'user-123',
        role: 'MARKET_ADMIN',
        marketId: 'market-123'
      };

      mockRequest.headers = {
        authorization: `Bearer ${validToken}`
      };

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(null, decodedUser);
      });

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockedJwt.verify).toHaveBeenCalledWith(
        validToken,
        process.env.JWT_SECRET || 'supersecretjwtkey',
        expect.any(Function)
      );
      expect(mockRequest.user).toEqual(decodedUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', () => {
      mockRequest.headers = {};

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token de autenticação é obrigatório'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is malformed', () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat'
      };

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token de autenticação é obrigatório'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid or expired', () => {
      const invalidToken = 'invalid-token-123';
      const error = new Error('Token expired');

      mockRequest.headers = {
        authorization: `Bearer ${invalidToken}`
      };

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(error, null);
      });

      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token de autenticação inválido ou expirado'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    it('should authorize user with correct role', () => {
      const user = {
        id: 'user-123',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123'
      };

      mockRequest.user = user;

      const authorizeMarketAdmin = authorizeRoles(['MARKET_ADMIN']);

      authorizeMarketAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should deny access when user has incorrect role', () => {
      const user = {
        id: 'user-123',
        role: 'CUSTOMER' as const,
        marketId: null
      };

      mockRequest.user = user;

      const authorizeMarketAdmin = authorizeRoles(['MARKET_ADMIN']);

      authorizeMarketAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Acesso negado: você não tem permissão para acessar este recurso'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', () => {
      mockRequest.user = undefined;

      const authorizeMarketAdmin = authorizeRoles(['MARKET_ADMIN']);

      authorizeMarketAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário não autenticado'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should authorize user with multiple allowed roles', () => {
      const user = {
        id: 'user-123',
        role: 'CUSTOMER' as const,
        marketId: null
      };

      mockRequest.user = user;

      const authorizeMultipleRoles = authorizeRoles(['CUSTOMER', 'MARKET_ADMIN']);

      authorizeMultipleRoles(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should set user when valid token is provided', () => {
      const validToken = 'valid-token-123';
      const decodedUser = {
        id: 'user-123',
        role: 'MARKET_ADMIN',
        marketId: 'market-123'
      };

      mockRequest.headers = {
        authorization: `Bearer ${validToken}`
      };

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(null, decodedUser);
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toEqual(decodedUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should set user to undefined when no token is provided', () => {
      mockRequest.headers = {};

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should set user to undefined when token is invalid', () => {
      const invalidToken = 'invalid-token-123';
      const error = new Error('Token expired');

      mockRequest.headers = {
        authorization: `Bearer ${invalidToken}`
      };

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(error, null);
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('requireMarketOwnership', () => {
    it('should allow access when user is market admin and owns the market', () => {
      const user = {
        id: 'user-123',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123'
      };

      mockRequest.user = user;
      mockRequest.params = { marketId: 'market-123' };

      requireMarketOwnership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', () => {
      mockRequest.user = undefined;
      mockRequest.params = { marketId: 'market-123' };

      requireMarketOwnership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário não autenticado'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user is not market admin', () => {
      const user = {
        id: 'user-123',
        role: 'CUSTOMER' as const,
        marketId: null
      };

      mockRequest.user = user;
      mockRequest.params = { marketId: 'market-123' };

      requireMarketOwnership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Acesso negado: apenas administradores de mercado podem acessar este recurso'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user does not own the market', () => {
      const user = {
        id: 'user-123',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123'
      };

      mockRequest.user = user;
      mockRequest.params = { marketId: 'different-market-456' };

      requireMarketOwnership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Acesso negado: você não tem permissão para acessar este mercado'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access when marketId is in body', () => {
      const user = {
        id: 'user-123',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123'
      };

      mockRequest.user = user;
      mockRequest.body = { marketId: 'market-123' };

      requireMarketOwnership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should allow access when no marketId is specified', () => {
      const user = {
        id: 'user-123',
        role: 'MARKET_ADMIN' as const,
        marketId: 'market-123'
      };

      mockRequest.user = user;
      mockRequest.params = {};
      mockRequest.body = {};

      requireMarketOwnership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});