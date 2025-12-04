import { prisma } from '../utils/prisma';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any> | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class NotificationRepository {
  async createNotification(params: CreateNotificationParams): Promise<Notification> {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        body: params.body,
        type: params.type,
        data: params.data || null,
        isRead: false,
      },
    });

    return this.mapToNotification(notification);
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    size: number = 20,
    isRead?: boolean
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where: any = {
      userId,
    };

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications: notifications.map(this.mapToNotification),
      total,
    };
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications.map(this.mapToNotification);
  }

  async countUnreadNotifications(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result.count;
  }

  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          userId,
        },
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      return false;
    }
  }

  async deleteReadNotifications(userId: string): Promise<number> {
    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });

    return result.count;
  }

  private mapToNotification(notification: any): Notification {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      data: notification.data as Record<string, any> | null,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}

export const notificationRepository = new NotificationRepository();


