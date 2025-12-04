import { notificationTokenRepository } from '../repositories/notificationTokenRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import { sendPushNotification } from './notificationService';
import { Logger } from '../utils/logger';
import { OrderStatus } from '@prisma/client';


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
    const token = tokens[0];

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

    const notification = await notificationRepository.createNotification({
      userId,
      title,
      body,
      type: 'NEW_ORDER',
      data: notificationData,
    });

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    if (notification.createdAt < oneMinuteAgo) {
      Logger.info(
        'OrderNotificationService',
        'notifyNewOrder',
        `Notificação duplicada detectada para pedido ${orderId}, pulando envio de push`
      );
      return;
    }

    const result = await sendPushNotification({
      token,
      title,
      body,
      data: notificationData,
    });

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

    const token = tokens[0];
    const statusMessage = getStatusMessage(newStatus);
    const title = '📦 Status atualizado';
    const body = `Seu pedido #${orderId} mudou para: ${statusMessage}`;

    const notificationData = {
      type: 'ORDER_STATUS_UPDATE',
      orderId: String(orderId),
      status: newStatus,
      statusMessage,
      ...(oldStatus && { oldStatus }),
    };

    const notification = await notificationRepository.createNotification({
      userId,
      title,
      body,
      type: 'ORDER_STATUS_UPDATE',
      data: notificationData,
    });


    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    if (notification.createdAt < oneMinuteAgo) {

      return;
    }

    const result = await sendPushNotification({
      token,
      title,
      body,
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
        notificationId: notification.id,
        pushSent: result.success,
        pushError: result.error,
      }
    );
  } catch (error: any) {
    Logger.errorOperation(
      'OrderNotificationService',
      'notifyOrderStatusUpdate',
      `Erro ao enviar notificação de atualização de status: ${error.message}`
    );
  }
}

