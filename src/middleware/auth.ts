import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'CUSTOMER' | 'MARKET_ADMIN';
        marketId?: string;
    };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        Logger.warn('AuthMiddleware', 'authenticate', 'No token provided');
        return res.status(401).json({ message: 'Token de autenticação é obrigatório' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            Logger.errorOperation('AuthMiddleware', 'authenticate', err, 'Invalid or expired token');
            return res.status(403).json({ message: 'Token de autenticação inválido ou expirado' });
        }
        req.user = user;
        next();
    });
};

export const authorizeRoles = (roles: Array<'CUSTOMER' | 'MARKET_ADMIN'>) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            Logger.warn('AuthMiddleware', 'authorizeRoles', 'User not authenticated before authorization check');
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        if (!roles.includes(req.user.role)) {
            Logger.warn('AuthMiddleware', 'authorizeRoles', `User ${req.user.id} with role ${req.user.role} attempted to access forbidden resource`);
            return res.status(403).json({ message: 'Acesso negado: você não tem permissão para acessar este recurso' });
        }
        next();
    };
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        req.user = undefined;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            req.user = undefined;
        } else {
            req.user = user;
        }
        next();
    });
};

export const requireMarketAdmin = authorizeRoles(['MARKET_ADMIN']);
export const requireCustomer = authorizeRoles(['CUSTOMER']);

export const requireMarketOwnership = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (req.user.role !== 'MARKET_ADMIN') {
        return res.status(403).json({ message: 'Acesso negado: apenas administradores de mercado podem acessar este recurso' });
    }

    const marketId = req.params.marketId || req.body.marketId;
    if (marketId && req.user.marketId !== marketId) {
        return res.status(403).json({ message: 'Acesso negado: você não tem permissão para acessar este mercado' });
    }

    next();
};
