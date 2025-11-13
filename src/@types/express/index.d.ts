import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserToken
    file?: Express.Multer.File
    files?: Express.Multer.File[]
  }
}

export interface UserToken {
  id: string;
  role: 'CUSTOMER' | 'MARKET_ADMIN';
  marketId?: string;
  auth0Id?: string;
}

// Interface para requisições autenticadas (user é obrigatório)
export interface AuthenticatedRequest extends Request {
  user: UserToken;
}