import { Request, Response } from 'express';
import { notificationTokenRepository } from '../repositories/notificationTokenRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import {
  sendPushNotification,
  sendPushNotificationToMultiple,
} from '../services/notificationService';
import { Logger } from '../utils/logger';
import { userService } from '../services/userService';

export class NotificationController {

  async registerToken(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, deviceId, fcmToken, platform } = req.body;

      if (!fcmToken) {
        return res.status(400).json({
          success: false,
          error: 'fcmToken é obrigatório',
        });
      }

      if (!platform || !['android', 'ios', 'web'].includes(platform)) {
        return res.status(400).json({
          success: false,
          error: 'platform é obrigatório e deve ser android, ios ou web',
        });
      }

      if (!userId && !deviceId) {
        return res.status(400).json({
          success: false,
          error: 'É necessário fornecer userId (usuário logado) ou deviceId (dispositivo sem usuário)',
        });
      }

      const token = await notificationTokenRepository.registerToken({
        fcmToken,
        platform,
        userId: userId || null,
        deviceId: deviceId || null,
      });


      return res.status(200).json({
        success: true,
        message: 'Token registrado com sucesso',
        data: {
          id: token.id,
          userId: token.userId,
          deviceId: token.deviceId,
          platform: token.platform,
          createdAt: token.createdAt,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'registerToken',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao registrar token',
      });
    }
  }

  async unregisterToken(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, deviceId, fcmToken } = req.body;

      if (!fcmToken) {
        return res.status(400).json({
          success: false,
          error: 'fcmToken é obrigatório',
        });
      }

      const deleted = await notificationTokenRepository.unregisterToken(
        fcmToken,
        userId,
        deviceId
      );

      if (deleted) {
        Logger.info(
          'NotificationController',
          'Token removido',
          {
            userId: userId || 'null',
            deviceId: deviceId || 'null',
            tokenId: fcmToken.substring(0, 20) + '...',
          }
        );
      }

      return res.status(200).json({
        success: true,
        message: deleted
          ? 'Token removido com sucesso'
          : 'Token não encontrado',
        deleted,
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'unregisterToken',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao remover token',
      });
    }
  }

  async sendNotification(req: Request, res: Response): Promise<Response> {
    try {
      const { token, title, body, data, imageUrl } = req.body;

      if (!token || !title || !body) {
        return res.status(400).json({
          success: false,
          error: 'token, title e body são obrigatórios',
        });
      }

      const result = await sendPushNotification({
        token,
        title,
        body,
        data,
        imageUrl,
      });

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Notificação enviada com sucesso',
          data: {
            messageId: result.messageId,
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error || 'Erro ao enviar notificação',
        });
      }
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'sendNotification',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar notificação',
      });
    }
  }

  async sendNotificationToUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const { title, body, data, imageUrl } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          success: false,
          error: 'title e body são obrigatórios',
        });
      }

      const tokens = await notificationTokenRepository.getUserTokens(userId);

      if (tokens.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não possui tokens registrados',
        });
      }

      const result = await sendPushNotificationToMultiple(tokens, {
        title,
        body,
        data,
      });

      return res.status(200).json({
        success: true,
        message: 'Notificações enviadas',
        data: {
          successCount: result.successCount,
          failureCount: result.failureCount,
          totalTokens: tokens.length,
          results: result.results,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'sendNotificationToUser',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar notificação',
      });
    }
  }

  async notifyNewOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, orderId, orderTotal, marketName } = req.body;

      if (!userId || !orderId) {
        return res.status(400).json({
          success: false,
          error: 'userId e orderId são obrigatórios',
        });
      }

      const tokens = await notificationTokenRepository.getUserTokens(userId);

      if (tokens.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não possui tokens registrados',
        });
      }

      const title = '🎉 Pedido Confirmado!';
      const body = marketName
        ? `Seu pedido #${orderId} no ${marketName} foi confirmado${orderTotal ? ` - R$ ${orderTotal.toFixed(2)}` : ''}`
        : `Seu pedido #${orderId} foi confirmado${orderTotal ? ` - R$ ${orderTotal.toFixed(2)}` : ''}`;

      const result = await sendPushNotificationToMultiple(tokens, {
        title,
        body,
        data: {
          type: 'NEW_ORDER',
          orderId: String(orderId),
          ...(orderTotal && { orderTotal: String(orderTotal) }),
          ...(marketName && { marketName }),
        },
      });

      Logger.info(
        'NotificationController',
        'Notificação de novo pedido enviada',
        { userId, orderId, successCount: result.successCount }
      );

      return res.status(200).json({
        success: true,
        message: 'Notificação de novo pedido enviada',
        data: {
          successCount: result.successCount,
          failureCount: result.failureCount,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'notifyNewOrder',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar notificação de novo pedido',
      });
    }
  }

  /**
   * Envia notificação para um dispositivo específico (sem usuário)
   * POST /api/v1/notifications/notify-device/:deviceId
   */
  async sendNotificationToDevice(req: Request, res: Response): Promise<Response> {
    try {
      const { deviceId } = req.params;
      const { title, body, data, imageUrl } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          success: false,
          error: 'title e body são obrigatórios',
        });
      }

      // Busca tokens do dispositivo
      const tokens = await notificationTokenRepository.getDeviceTokens(deviceId);

      if (tokens.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Dispositivo não possui tokens registrados',
        });
      }

      // Envia para todos os dispositivos
      const result = await sendPushNotificationToMultiple(tokens, {
        title,
        body,
        data,
      });

      return res.status(200).json({
        success: true,
        message: 'Notificações enviadas',
        data: {
          successCount: result.successCount,
          failureCount: result.failureCount,
          totalTokens: tokens.length,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'sendNotificationToDevice',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar notificação',
      });
    }
  }

  async getUserTokens(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const tokens = await notificationTokenRepository.getUserTokens(userId);

      return res.status(200).json({
        success: true,
        data: {
          userId,
          tokenCount: tokens.length,
          tokens: tokens.map((token) => token.substring(0, 20) + '...'),
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'getUserTokens',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar tokens',
      });
    }
  }

  async getDeviceTokens(req: Request, res: Response): Promise<Response> {
    try {
      const { deviceId } = req.params;
      const tokens = await notificationTokenRepository.getDeviceTokens(deviceId);

      return res.status(200).json({
        success: true,
        data: {
          deviceId,
          tokenCount: tokens.length,
          tokens: tokens.map((token) => token.substring(0, 20) + '...'),
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'getDeviceTokens',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar tokens',
      });
    }
  }

  async associateTokenToUser(req: Request, res: Response): Promise<Response> {
    try {
      const { fcmToken, userId } = req.body;

      if (!fcmToken || !userId) {
        return res.status(400).json({
          success: false,
          error: 'fcmToken e userId são obrigatórios',
        });
      }

      let actualUserId = userId;
      const isAuth0Id = userId.includes('|') || userId.length > 24;
      
      if (isAuth0Id) {
        try {
          const user = await userService.getUserByAuth0Id(userId);
          actualUserId = user.id;
        } catch (error: any) {
          return res.status(404).json({
            success: false,
            error: 'Usuário não encontrado com o auth0Id fornecido',
          });
        }
      }

      const success = await notificationTokenRepository.associateTokenToUser(
        fcmToken,
        actualUserId
      );

      if (success) {
        Logger.info(
          'NotificationController',
          'Token associado ao usuário',
          { 
            userId: actualUserId, 
            auth0Id: isAuth0Id ? userId : undefined, 
            tokenId: fcmToken.substring(0, 20) + '...' 
          }
        );
      }

      return res.status(200).json({
        success,
        message: success
          ? 'Token associado ao usuário com sucesso'
          : 'Erro ao associar token',
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'associateTokenToUser',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao associar token',
      });
    }
  }

  /**
   * Endpoint de teste para enviar notificação push
   * POST /api/v1/notifications/test
   */
  async testNotification(req: Request, res: Response): Promise<Response> {
    try {
      const { token, title, body, data } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'token é obrigatório',
        });
      }

      const result = await sendPushNotification({
        token,
        title: title || 'Notificação de teste',
        body: body || 'Esta é uma notificação de teste do sistema',
        data: data || { type: 'TEST' },
      });

      const userId = await userService.getUserIdByNotificationToken(token);

      await notificationRepository.createNotification({
        userId,
        title: title || 'Notificação de teste',
        body: body || 'Esta é uma notificação de teste do sistema',
        data: data || { type: 'TEST' },
        type: 'TEST',
      });


      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Notificação de teste enviada com sucesso',
          data: {
            messageId: result.messageId,
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.error || 'Erro ao enviar notificação de teste',
        });
      }
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'testNotification',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar notificação de teste',
      });
    }
  }

  /**
   * Lista notificações do usuário autenticado
   * GET /api/v1/notifications
   */
  async getNotifications(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 20;
      const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;

      const result = await notificationRepository.getUserNotifications(
        userId,
        page,
        size,
        isRead
      );

      return res.status(200).json({
        success: true,
        data: {
          notifications: result.notifications,
          pagination: {
            page,
            size,
            total: result.total,
            totalPages: Math.ceil(result.total / size),
          },
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'getNotifications',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar notificações',
      });
    }
  }

  /**
   * Conta notificações não lidas do usuário
   * GET /api/v1/notifications/unread/count
   */
  async getUnreadCount(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const userId = req.user.id;
      const count = await notificationRepository.countUnreadNotifications(userId);

      return res.status(200).json({
        success: true,
        data: {
          count,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'getUnreadCount',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao contar notificações não lidas',
      });
    }
  }

  /**
   * Marca uma notificação como lida
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const { id } = req.params;
      const userId = req.user.id;

      const success = await notificationRepository.markAsRead(id, userId);

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Notificação marcada como lida',
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'Notificação não encontrada',
        });
      }
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'markAsRead',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao marcar notificação como lida',
      });
    }
  }

  /**
   * Marca todas as notificações do usuário como lidas
   * PATCH /api/v1/notifications/read-all
   */
  async markAllAsRead(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const userId = req.user.id;
      const count = await notificationRepository.markAllAsRead(userId);

      return res.status(200).json({
        success: true,
        message: `${count} notificação(ões) marcada(s) como lida(s)`,
        data: {
          count,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'markAllAsRead',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao marcar notificações como lidas',
      });
    }
  }

  /**
   * Deleta uma notificação
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const { id } = req.params;
      const userId = req.user.id;

      const success = await notificationRepository.deleteNotification(id, userId);

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Notificação deletada com sucesso',
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'Notificação não encontrada',
        });
      }
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'deleteNotification',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao deletar notificação',
      });
    }
  }

  /**
   * Deleta todas as notificações lidas do usuário
   * DELETE /api/v1/notifications/read
   */
  async deleteReadNotifications(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const userId = req.user.id;
      const count = await notificationRepository.deleteReadNotifications(userId);

      return res.status(200).json({
        success: true,
        message: `${count} notificação(ões) deletada(s)`,
        data: {
          count,
        },
      });
    } catch (error: any) {
      Logger.errorOperation(
        'NotificationController',
        'deleteReadNotifications',
        error.message
      );
      return res.status(500).json({
        success: false,
        error: 'Erro ao deletar notificações lidas',
      });
    }
  }
}

export const notificationController = new NotificationController();

