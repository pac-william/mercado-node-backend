import { z } from "zod";

export const CreateMessageDTO = z.object({
    chatId: z.string(),
    username: z.string(),
    userId: z.string(),
    message: z.string().min(1),
});

export type CreateMessageDTO = z.infer<typeof CreateMessageDTO>;

export const CreateChatDTO = z.object({
    chatId: z.string(),
    userId: z.string(),
    marketId: z.string(),
});

export type CreateChatDTO = z.infer<typeof CreateChatDTO>;

export interface MessageResponseDTO {
    id: string;
    chatId: string;
    username: string;
    userId: string;
    message: string;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatResponseDTO {
    id: string;
    chatId: string;
    userId: string;
    marketId: string;
    isActive: boolean;
    lastMessageAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatWithMessagesDTO extends ChatResponseDTO {
    messages: MessageResponseDTO[];
}

export interface CustomerConversationsDTO {
    chatId: string;
    marketId: string;
    storeOwnerUsername: string;
    isActive: boolean;
    lastMessage: {
        message: string;
        timestamp: Date;
    } | null;
}

export interface StoreOwnerConversationsDTO {
    chatId: string;
    customerId: string;
    customerUsername: string;
    isActive: boolean;
    lastMessage: {
        message: string;
        timestamp: Date;
    } | null;
}

export function toMessageResponseDTO(message: any): MessageResponseDTO {
    return {
        id: message.id,
        chatId: message.chatId,
        username: message.username,
        userId: message.userId,
        message: message.message,
        readAt: message.readAt || null,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    };
}

export function toChatResponseDTO(chat: any): ChatResponseDTO {
    return {
        id: chat.id,
        chatId: chat.chatId,
        userId: chat.userId,
        marketId: chat.marketId,
        isActive: chat.isActive,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
    };
}

export function toChatWithMessagesDTO(chat: any): ChatWithMessagesDTO {
    return {
        ...toChatResponseDTO(chat),
        messages: chat.messages ? chat.messages.map(toMessageResponseDTO) : [],
    };
}
