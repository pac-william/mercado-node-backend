import { CreateChatDTO, CreateMessageDTO } from "../dtos/chatDTO";
import { prisma } from "../utils/prisma";

class ChatRepository {
    async findOrCreateChat(chatDTO: CreateChatDTO) {
        let chat = await prisma.chat.findUnique({
            where: { chatId: chatDTO.chatId },
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    chatId: chatDTO.chatId,
                    userId: chatDTO.userId,
                    marketId: chatDTO.marketId,
                    isActive: true,
                },
            });
        } else {
            if (!chat.isActive) {
                chat = await prisma.chat.update({
                    where: { id: chat.id },
                    data: { isActive: true },
                });
            }
        }

        return chat;
    }

    async findChatByChatId(chatId: string) {
        return await prisma.chat.findUnique({
            where: { chatId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }

    async findChatById(chatId: string) {
        return await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }

    async findChatsByUserId(userId: string) {
        // Buscar apenas chats que têm mensagens (lastMessageAt não é null)
        return await prisma.chat.findMany({
            where: { 
                userId,
                lastMessageAt: {
                    not: null
                }
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { lastMessageAt: "desc" },
        });
    }

    async findChatsByMarketId(marketId: string) {
        // Buscar apenas chats que têm mensagens (lastMessageAt não é null)
        return await prisma.chat.findMany({
            where: { 
                marketId,
                lastMessageAt: {
                    not: null
                }
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { lastMessageAt: "desc" },
        });
    }

    async createMessage(chatId: string, messageDTO: CreateMessageDTO) {
        const message = await prisma.message.create({
            data: {
                chatId,
                username: messageDTO.username,
                userId: messageDTO.userId,
                message: messageDTO.message,
                status: "DELIVERED", // Quando salva no banco, a mensagem foi entregue
            },
        });

        await prisma.chat.update({
            where: { id: chatId },
            data: { lastMessageAt: new Date() },
        });

        return message;
    }

    async findMessagesByChatId(chatId: string) {
        return await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
        });
    }

    async findLastMessageByChatId(chatId: string) {
        return await prisma.message.findFirst({
            where: { chatId },
            orderBy: { createdAt: "desc" },
        });
    }

    async updateChatStatus(chatId: string, isActive: boolean) {
        return await prisma.chat.update({
            where: { id: chatId },
            data: { isActive },
        });
    }

    async markMessagesAsRead(chatId: string, readerUserId: string) {
        // Marcar como lidas apenas mensagens do outro usuário (não as próprias)
        return await prisma.message.updateMany({
            where: {
                chatId,
                userId: {
                    not: readerUserId
                },
                status: {
                    not: "READ"
                }
            },
            data: {
                status: "READ",
                readAt: new Date()
            }
        });
    }

    async countUnreadMessagesByChatId(chatId: string, readerUserId: string) {
        // Contar mensagens não lidas do outro usuário (não as próprias)
        // Mensagens não lidas são aquelas com status diferente de READ
        return await prisma.message.count({
            where: {
                chatId,
                userId: {
                    not: readerUserId
                },
                status: {
                    not: "READ"
                }
            }
        });
    }

    async countUnreadMessagesByUserId(userId: string) {
        // Contar todas as mensagens não lidas de todos os chats do usuário
        const chats = await prisma.chat.findMany({
            where: { userId },
            select: { id: true }
        });

        const chatIds = chats.map(chat => chat.id);
        
        if (chatIds.length === 0) {
            return 0;
        }

        // Mensagens não lidas são aquelas com status diferente de READ
        return await prisma.message.count({
            where: {
                chatId: { in: chatIds },
                userId: {
                    not: userId
                },
                status: {
                    not: "READ"
                }
            }
        });
    }
}

export const chatRepository = new ChatRepository();
