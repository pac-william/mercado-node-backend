import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { UserToken } from "../@types/express";
import { Logger } from "../utils/logger";

const client = jwksClient({
  jwksUri: process.env.JWKS_URI || "https://dev-gk5bz75smosenq24.us.auth0.com/.well-known/jwks.json"
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err || !key) {
      Logger.errorOperation('ValidateToken', 'getKey', `Erro ao obter a chave pública: ${err?.message}`);
      return callback(err || new Error("Chave pública não encontrada"));
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const ISSUER = process.env.ISSUER || "https://dev-gk5bz75smosenq24.us.auth0.com/";

export function validateToken(req: Request, res: Response, next: NextFunction) {

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    Logger.errorOperation('ValidateToken', 'validateToken', 'Token ausente ou inválido');
    return res.status(401).json({ error: "Token ausente ou inválido" });
  }

  const token = authHeader?.split(" ")[1];
  console.log(token);

  if (!token) {
    Logger.errorOperation('ValidateToken', 'validateToken', 'Token ausente ou inválido');
    return res.status(401).json({ error: "Token ausente ou inválido" });
  }

  jwt.verify(token as string, getKey, { issuer: ISSUER, algorithms: ["RS256"] }, (err: any, decoded: any) => {
    if (err) {
      Logger.errorOperation('ValidateToken', 'validateToken', err.message);
      return res.status(401).json({ error: "Token inválido" });
    }

    req.user = getTokenInfo(decoded);

    next();
  });
}

export function getTokenInfo(decoded: any): UserToken {
  return {
    id: decoded.id,
    role: decoded['https://yourdomain.com/roles']?.[0] || decoded.role || 'CUSTOMER',
    marketId: decoded['https://yourdomain.com/marketId'] || decoded.marketId,
    auth0Id: decoded.sub || undefined,
  };
}

export function getAuth0Id(decoded: any): string | null {
  return decoded.sub || null;
}

export function requireMarketAdmin(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      Logger.errorOperation('RequireMarketAdmin', 'requireMarketAdmin', 'Usuário não autenticado');
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      Logger.errorOperation('RequireMarketAdmin', 'requireMarketAdmin', `Acesso negado. Role necessária: ${allowedRoles.join(', ')}. Role atual: ${req.user.role}`);
      return res.status(403).json({ error: "Acesso negado. Permissões insuficientes" });
    }

    next();
  };
}