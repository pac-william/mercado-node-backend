import { Request, Response } from "express";
import { CreateUserResponse, GetTokenResponse } from "../domain/authDomain";
import { Logger } from "../utils/logger";
export class AuthController {
    async createUser(req: Request, res: Response) {
        Logger.controller('Auth', 'registerUser', 'body', req.body);
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

            const auth0TokenData = await auth0Token.json();
            const managementToken = auth0TokenData.access_token;


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

            const createUserResponse = await data.json() as CreateUserResponse;
            return res.status(201).json(createUserResponse);

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
}

export const authController = new AuthController();
