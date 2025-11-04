import { UserDTO, UserUpdateDTO } from "../dtos/userDTO";
import { prisma } from "../utils/prisma";

class UserRepository {
    async createUser(userDTO: UserDTO) {
        const user = await prisma.user.create({
            data: {
                ...userDTO,
                password: userDTO.password || '',
            },
        });
        return user;
    }

    async getUsers(page: number, size: number, auth0Id?: string) {
        const users = await prisma.user.findMany({
            where: {
                auth0Id: auth0Id ?? undefined,
            },
            skip: (page - 1) * size,
            take: size,
            select: {
                id: true,
                name: true,
                email: true,
                auth0Id: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return users;
    }

    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                auth0Id: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    }

    async getUserByAuth0Id(auth0Id: string) {
        const user = await prisma.user.findUnique({
            where: { auth0Id },
        });
        return user;
    }

    async createUserWithAuth0Id(data: { name: string; email: string; auth0Id: string }) {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: '', // Senha vazia pois autenticação é feita via Auth0
                auth0Id: data.auth0Id,
            }
        });
        return user;
    }

    async createUserWithRoleAndMarket(data: {
        name: string;
        email: string;
        password: string;
        auth0Id: string;
        role: string;
        marketId: string;
    }) {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password || '',
                auth0Id: data.auth0Id,
                role: data.role as any,
                marketId: data.marketId,
            }
        });
        return user;
    }

    async updateUser(id: string, userDTO: UserDTO) {
        const user = await prisma.user.update({
            where: { id },
            data: {
                ...userDTO,
                password: userDTO.password || '',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }

    async updateUserPartial(id: string, userUpdateDTO: UserUpdateDTO) {
        const user = await prisma.user.update({
            where: { id },
            data: userUpdateDTO,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }

    async deleteUser(id: string) {
        const user = await prisma.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
}

export const userRepository = new UserRepository();
