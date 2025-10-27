import { UserDTO, UserUpdateDTO } from "../dtos/userDTO";
import { prisma } from "../utils/prisma";

class UserRepository {
    async createUser(userDTO: UserDTO) {
        const user = await prisma.user.create({
            data: userDTO,
        });
        return user;
    }

    async getUsers(page: number, size: number) {
        const users = await prisma.user.findMany({
            skip: (page - 1) * size,
            take: size,
            select: {
                id: true,
                name: true,
                email: true,
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

    async updateUser(id: string, userDTO: UserDTO) {
        const user = await prisma.user.update({
            where: { id },
            data: userDTO,
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
