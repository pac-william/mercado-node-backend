import { Request, Response } from "express";
import { CreateChatDTO, CreateMessageDTO } from "../dtos/chatDTO";
import { chatService } from "../services/chatService";
import { Logger } from "../utils/logger";

export class ChatController {
    async findOrCreateChat(req: Request, res: Response) {
        Logger.controller('Chat', 'findOrCreateChat', 'body', req.body);
        try {
            const chatDTO = CreateChatDTO.parse(req.body);
            const chat = await chatService.findOrCreateChat(chatDTO);
            Logger.successOperation('ChatController', 'findOrCreateChat');
            return res.status(200).json(chat);
        } catch (error) {
            Logger.errorOperation('ChatController', 'findOrCreateChat', error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getChatByChatId(req: Request, res: Response) {
        Logger.controller('Chat', 'getChatByChatId', 'params', req.params);
        try {
            const { chatId } = req.params;
            const chat = await chatService.getChatByChatId(chatId);
            Logger.successOperation('ChatController', 'getChatByChatId');
            return res.status(200).json(chat);
        } catch (error) {
            Logger.errorOperation('ChatController', 'getChatByChatId', error);
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getChatsByUserId(req: Request, res: Response) {
        Logger.controller('Chat', 'getChatsByUserId', 'user', req.user);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const userId = req.user.id;
            const chats = await chatService.getChatsByUserId(userId);
            Logger.successOperation('ChatController', 'getChatsByUserId');
            return res.status(200).json(chats);
        } catch (error) {
            Logger.errorOperation('ChatController', 'getChatsByUserId', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getChatsByMarketId(req: Request, res: Response) {
        Logger.controller('Chat', 'getChatsByMarketId', 'params', req.params);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const { marketId } = req.params;
            const chats = await chatService.getChatsByMarketId(marketId);
            Logger.successOperation('ChatController', 'getChatsByMarketId');
            return res.status(200).json(chats);
        } catch (error) {
            Logger.errorOperation('ChatController', 'getChatsByMarketId', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async createMessage(req: Request, res: Response) {
        Logger.controller('Chat', 'createMessage', 'body', req.body);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const { chatId } = req.params;
            const body = req.body;
            
            // Use userId and username from token if not provided in body
            const messageDTO = CreateMessageDTO.parse({
                ...body,
                chatId: chatId,
                userId: body.userId || req.user.id,
                username: body.username || req.user.name || req.user.email || 'User',
            });
            
            const message = await chatService.createMessage(chatId, messageDTO);
            Logger.successOperation('ChatController', 'createMessage');
            return res.status(201).json(message);
        } catch (error) {
            Logger.errorOperation('ChatController', 'createMessage', error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getMessagesByChatId(req: Request, res: Response) {
        Logger.controller('Chat', 'getMessagesByChatId', 'params', req.params);
        try {
            const { chatId } = req.params;
            const messages = await chatService.getMessagesByChatId(chatId);
            Logger.successOperation('ChatController', 'getMessagesByChatId');
            return res.status(200).json(messages);
        } catch (error) {
            Logger.errorOperation('ChatController', 'getMessagesByChatId', error);
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateChatStatus(req: Request, res: Response) {
        Logger.controller('Chat', 'updateChatStatus', 'params', req.params);
        try {
            const { chatId } = req.params;
            const { isActive } = req.body;
            const chat = await chatService.updateChatStatus(chatId, isActive);
            Logger.successOperation('ChatController', 'updateChatStatus');
            return res.status(200).json(chat);
        } catch (error) {
            Logger.errorOperation('ChatController', 'updateChatStatus', error);
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async markMessagesAsRead(req: Request, res: Response) {
        Logger.controller('Chat', 'markMessagesAsRead', 'params', req.params);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const { chatId } = req.params;
            const readerUserId = req.user.id;
            
            const result = await chatService.markMessagesAsRead(chatId, readerUserId);
            Logger.successOperation('ChatController', 'markMessagesAsRead');
            return res.status(200).json({ 
                success: true, 
                count: result.count 
            });
        } catch (error) {
            Logger.errorOperation('ChatController', 'markMessagesAsRead', error);
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getUnreadMessagesCount(req: Request, res: Response) {
        Logger.controller('Chat', 'getUnreadMessagesCount', 'user', req.user);
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const userId = req.user.id;
            const count = await chatService.getUnreadMessagesCount(userId);
            Logger.successOperation('ChatController', 'getUnreadMessagesCount');
            return res.status(200).json({ count });
        } catch (error) {
            Logger.errorOperation('ChatController', 'getUnreadMessagesCount', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

