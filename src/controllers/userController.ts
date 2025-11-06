import { Request, Response } from "express";
import { UserDTO, UserUpdateDTO } from "../dtos/userDTO";
import { userService } from "../services/userService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";

export class UserController {
    async getUsers(req: Request, res: Response) {
        Logger.controller('User', 'getUsers', 'query', req.query);
        try {
            const { page, size, auth0Id } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('auth0Id')
                .build();

            const users = await userService.getUsers(page, size, auth0Id);
            Logger.successOperation('UserController', 'getUsers');
            return res.status(200).json(users);
        } catch (error) {
            Logger.errorOperation('UserController', 'getUsers', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getUserByAuth0Id(req: Request, res: Response) {
        Logger.controller('User', 'getUserByAuth0Id', 'query', req.query);
        try {
            const { auth0Id } = req.params;
            const user = await userService.getUserByAuth0Id(auth0Id);
            Logger.successOperation('UserController', 'getUserByAuth0Id');
            return res.status(200).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'getUserByAuth0Id', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async createUser(req: Request, res: Response) {
        Logger.controller('User', 'createUser', 'req: Request, res: Response', { body: req.body });
        try {
            const userDTO = UserDTO.parse(req.body);
            const user = await userService.createUser(userDTO);
            Logger.successOperation('UserController', 'createUser');
            return res.status(201).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'createUser', error);
            if (error instanceof Error && error.message === "Email já está em uso") {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getMe(req: Request, res: Response) {
        Logger.controller('User', 'getMe', 'user', req.user);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const user = await userService.getUserById(req.user.id);
            Logger.successOperation('UserController', 'getMe');
            return res.status(200).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'getMe', error);
            if (error instanceof Error && error.message === "Usuário não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getUserById(req: Request, res: Response) {
        Logger.controller('User', 'getUserById', 'query', req.query);
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            Logger.successOperation('UserController', 'getUserById');
            return res.status(200).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'getUserById', error);
            if (error instanceof Error && error.message === "Usuário não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateUser(req: Request, res: Response) {
        Logger.controller('User', 'updateUser', 'query', req.query);
        try {
            const { id } = req.params;
            const userDTO = UserDTO.parse(req.body);
            const user = await userService.updateUser(id, userDTO);
            Logger.successOperation('UserController', 'updateUser');
            return res.status(200).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'updateUser', error);
            if (error instanceof Error && (error.message === "Usuário não encontrado" || error.message === "Email já está em uso")) {
                return res.status(error.message === "Usuário não encontrado" ? 404 : 409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateUserPartial(req: Request, res: Response) {
        Logger.controller('User', 'updateUserPartial', 'query', req.query);
        try {
            const { id } = req.params;
            const userUpdateDTO = UserUpdateDTO.parse(req.body);
            const user = await userService.updateUserPartial(id, userUpdateDTO);
            Logger.successOperation('UserController', 'updateUserPartial');
            return res.status(200).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'updateUserPartial', error);
            if (error instanceof Error && (error.message === "Usuário não encontrado" || error.message === "Email já está em uso")) {
                return res.status(error.message === "Usuário não encontrado" ? 404 : 409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        Logger.controller('User', 'deleteUser', 'query', req.query);
        try {
            const { id } = req.params;
            const user = await userService.deleteUser(id);
            Logger.successOperation('UserController', 'deleteUser');
            return res.status(200).json(user);
        } catch (error) {
            Logger.errorOperation('UserController', 'deleteUser', error);
            if (error instanceof Error && error.message === "Usuário não encontrado") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export const userController = new UserController();
