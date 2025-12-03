import { notificationTokenRepository } from '../repositories/notificationTokenRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import { sendPushNotificationToMultiple } from './notificationService';
import { Logger } from '../utils/logger';
import { OrderStatus } from '@prisma/client';

/**
 * Mapeia status de pedido para mensagens amigáveis
 */
const getStatusMessage = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Em preparação',
    READY_FOR_DELIVERY: 'Pronto para entrega',
    OUT_FOR_DELIVERY: 'Saiu para entrega',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  };
  return statusMap[status] || status;
};

export async function notifyNewOrder(
  userId: string,
  orderId: string,
  orderTotal: number,
  marketName?: string
): Promise<void> {
  try {
    const tokens = await notificationTokenRepository.getUserTokens(userId);
    if (tokens.length === 0) {
      return;
    }

    const title = '🎉 Novo pedido recebido';
    const body = marketName
      ? `Seu pedido #${orderId} no ${marketName} foi criado com sucesso.`
      : `Seu pedido #${orderId} foi criado com sucesso.`;

    const notificationData = {
      type: 'NEW_ORDER',
      orderId: String(orderId),
      orderTotal: String(orderTotal),
      ...(marketName && { marketName }),
    };

    const result = await sendPushNotificationToMultiple(tokens, {
      title,
      body,
      data: notificationData,
    });

    await notificationRepository.createNotification({
      userId,
      title,
      body,
      type: 'NEW_ORDER',
      data: notificationData,
    });

    Logger.info(
      'OrderNotificationService',
      'notifyNewOrder',
      {
        userId,
        orderId,
        tokensSent: result.successCount,
        tokensFailed: result.failureCount,
      }
    );
  } catch (error: any) {
    Logger.errorOperation(
      'OrderNotificationService',
      'notifyNewOrder',
      `Erro ao enviar notificação de novo pedido: ${error.message}`
    );
  }
}

export async function notifyOrderStatusUpdate(
  userId: string,
  orderId: string,
  newStatus: OrderStatus,
  oldStatus?: OrderStatus
): Promise<void> {
  try {
    const tokens = await notificationTokenRepository.getUserTokens(userId);

    if (tokens.length === 0) {
      Logger.info(
        'OrderNotificationService',
        'notifyOrderStatusUpdate',
        `Usuário ${userId} não possui tokens registrados`
      );
      return;
    }

    const statusMessage = getStatusMessage(newStatus);
    const title = '📦 Status atualizado';
    const body = `Seu pedido #${orderId} agora está com status: ${statusMessage}`;

    const notificationData = {
      type: 'ORDER_STATUS_UPDATE',
      orderId: String(orderId),
      status: newStatus,
      statusMessage,
      ...(oldStatus && { oldStatus }),
    };

    const result = await sendPushNotificationToMultiple(tokens, {
      title,
      body,
      data: notificationData,
    });

    await notificationRepository.createNotification({
      userId,
      title,
      body,
      type: 'ORDER_STATUS_UPDATE',
      data: notificationData,
    });

    Logger.info(
      'OrderNotificationService',
      'notifyOrderStatusUpdate',
      {
        userId,
        orderId,
        oldStatus,
        newStatus,
        tokensSent: result.successCount,
        tokensFailed: result.failureCount,
      }
    );
  } catch (error: any) {

  }
}

