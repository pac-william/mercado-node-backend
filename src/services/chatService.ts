import { CreateChatDTO, CreateMessageDTO, CustomerConversationsDTO, StoreOwnerConversationsDTO, toChatWithMessagesDTO, toMessageResponseDTO } from "../dtos/chatDTO";
import { chatRepository } from "../repositories/chatRepository";
import { Logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

class ChatService {
    async findOrCreateChat(chatDTO: CreateChatDTO) {
        Logger.info('ChatService', 'findOrCreateChat', `Finding or creating chat with chatId ${chatDTO.chatId}`);
        return await chatRepository.findOrCreateChat(chatDTO);
    }

    async getChatByChatId(chatId: string) {
        Logger.info('ChatService', 'getChatByChatId', `Getting chat with chatId ${chatId}`);
        const chat = await chatRepository.findChatByChatId(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        return toChatWithMessagesDTO(chat);
    }

    async getChatById(chatId: string) {
        Logger.info('ChatService', 'getChatById', `Getting chat with id ${chatId}`);
        const chat = await chatRepository.findChatById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        return toChatWithMessagesDTO(chat);
    }

    async getChatsByUserId(userId: string): Promise<CustomerConversationsDTO[]> {
        Logger.info('ChatService', 'getChatsByUserId', `Getting chats for user ${userId}`);
        // O repositório já filtra apenas chats com mensagens (lastMessageAt não é null)
        const chats = await chatRepository.findChatsByUserId(userId);
        
        const results: CustomerConversationsDTO[] = await Promise.all(
            chats.map(async (chat) => {
                const market = await prisma.market.findUnique({
                    where: { id: chat.marketId },
                });

                const user = await prisma.user.findUnique({
                    where: { id: market?.ownerId || '' },
                });

                const lastMessage = chat.messages && chat.messages.length > 0
                    ? chat.messages[0]
                    : await chatRepository.findLastMessageByChatId(chat.id);

                return {
                    chatId: chat.chatId,
                    marketId: chat.marketId,
                    storeOwnerUsername: user?.name || 'Store Owner',
                    isActive: chat.isActive,
                    lastMessage: lastMessage
                        ? {
                            message: lastMessage.message,
                            timestamp: lastMessage.createdAt,
                        }
                        : null,
                };
            })
        );

        return results;
    }

    async getChatsByMarketId(marketId: string): Promise<StoreOwnerConversationsDTO[]> {
        Logger.info('ChatService', 'getChatsByMarketId', `Getting chats for market ${marketId}`);
        // O repositório já filtra apenas chats com mensagens (lastMessageAt não é null)
        const chats = await chatRepository.findChatsByMarketId(marketId);
        
        const results: StoreOwnerConversationsDTO[] = await Promise.all(
            chats.map(async (chat) => {
                const user = await prisma.user.findUnique({
                    where: { id: chat.userId },
                });

                const lastMessage = chat.messages && chat.messages.length > 0
                    ? chat.messages[0]
                    : await chatRepository.findLastMessageByChatId(chat.id);

                return {
                    chatId: chat.chatId,
                    customerId: chat.userId,
                    customerUsername: user?.name || 'Customer',
                    isActive: chat.isActive,
                    lastMessage: lastMessage
                        ? {
                            message: lastMessage.message,
                            timestamp: lastMessage.createdAt,
                        }
                        : null,
                };
            })
        );

        return results;
    }

    async createMessage(chatId: string, messageDTO: CreateMessageDTO) {
        Logger.info('ChatService', 'createMessage', `Creating message in chat ${chatId}`);
        
        const chat = await chatRepository.findChatByChatId(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }

        const message = await chatRepository.createMessage(chat.id, messageDTO);
        return toMessageResponseDTO(message);
    }

    async getMessagesByChatId(chatId: string) {
        Logger.info('ChatService', 'getMessagesByChatId', `Getting messages for chat ${chatId}`);
        const chat = await chatRepository.findChatByChatId(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        
        const messages = await chatRepository.findMessagesByChatId(chat.id);
        return messages.map(toMessageResponseDTO);
    }

    async updateChatStatus(chatId: string, isActive: boolean) {
        Logger.info('ChatService', 'updateChatStatus', `Updating chat status for chat ${chatId}`);
        const chat = await chatRepository.findChatByChatId(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        
        return await chatRepository.updateChatStatus(chat.id, isActive);
    }

    async markMessagesAsRead(chatId: string, readerUserId: string) {
        Logger.info('ChatService', 'markMessagesAsRead', `Marking messages as read in chat ${chatId} by user ${readerUserId}`);
        const chat = await chatRepository.findChatByChatId(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        
        return await chatRepository.markMessagesAsRead(chat.id, readerUserId);
    }
}

export const chatService = new ChatService();
