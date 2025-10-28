import { UserDTO, UserUpdateDTO } from "../dtos/userDTO";
import { userRepository } from "../repositories/userRepository";

class UserService {
    async createUser(userDTO: UserDTO) {
        const existingUser = await userRepository.getUserByEmail(userDTO.email);
        if (existingUser) {
            throw new Error("Email já está em uso");
        }
        
        return await userRepository.createUser(userDTO);
    }

    async getUsers(page: number, size: number) {
        return await userRepository.getUsers(page, size);
    }

    async getUserById(id: string) {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    async updateUser(id: string, userDTO: UserDTO) {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) {
            throw new Error("Usuário não encontrado");
        }

        if (userDTO.email !== existingUser.email) {
            const emailInUse = await userRepository.getUserByEmail(userDTO.email);
            if (emailInUse) {
                throw new Error("Email já está em uso");
            }
        }

        return await userRepository.updateUser(id, userDTO);
    }

    async updateUserPartial(id: string, userUpdateDTO: UserUpdateDTO) {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) {
            throw new Error("Usuário não encontrado");
        }

        if (userUpdateDTO.email && userUpdateDTO.email !== existingUser.email) {
            const emailInUse = await userRepository.getUserByEmail(userUpdateDTO.email);
            if (emailInUse) {
                throw new Error("Email já está em uso");
            }
        }

        return await userRepository.updateUserPartial(id, userUpdateDTO);
    }

    async deleteUser(id: string) {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) {
            throw new Error("Usuário não encontrado");
        }

        return await userRepository.deleteUser(id);
    }
}

export const userService = new UserService();
