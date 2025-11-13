import { Buffer } from 'buffer';
import { Request } from 'express';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserToken
    file?: UploadedFile
    files?: UploadedFile[]
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