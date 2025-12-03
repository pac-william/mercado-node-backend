import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export interface DeviceToken {
  id: string;
  userId?: string | null;
  deviceId?: string | null;
  fcmToken: string;
  platform: 'android' | 'ios' | 'web';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RegisterTokenParams {
  fcmToken: string;
  platform: 'android' | 'ios' | 'web';
  userId?: string | null;
  deviceId?: string | null;
}

class NotificationTokenRepository {
  async registerToken(params: RegisterTokenParams): Promise<DeviceToken> {
    const { fcmToken, platform, userId, deviceId } = params;

    if (!userId && !deviceId) {
      throw new Error('É necessário fornecer userId ou deviceId');
    }

    const existingToken = await prisma.notificationToken.findUnique({
      where: { fcmToken },
    });

    if (existingToken) {
      const updatedToken = await prisma.notificationToken.update({
        where: { fcmToken },
        data: {
          userId: userId || existingToken.userId,
          deviceId: deviceId || existingToken.deviceId,
          platform,
          isActive: true,
          updatedAt: new Date(),
        },
      });

      return this.mapToDeviceToken(updatedToken);
    }

    const newToken = await prisma.notificationToken.create({
      data: {
        fcmToken,
        platform,
        userId: userId || null,
        deviceId: deviceId || null,
        isActive: true,
      },
    });

    return this.mapToDeviceToken(newToken);
  }

  async unregisterToken(
    fcmToken: string,
    userId?: string,
    deviceId?: string
  ): Promise<boolean> {
    try {
      const token = await prisma.notificationToken.findUnique({
        where: { fcmToken },
      });

      if (!token) {
        return false;
      }

      if (userId && token.userId !== userId) {
        return false;
      }

      if (deviceId && token.deviceId !== deviceId) {
        return false;
      }

      await prisma.notificationToken.delete({
        where: { fcmToken },
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover token:', error);
      return false;
    }
  }

  async unregisterAllUserTokens(userId: string): Promise<number> {
    const result = await prisma.notificationToken.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  async unregisterAllDeviceTokens(deviceId: string): Promise<number> {
    const result = await prisma.notificationToken.deleteMany({
      where: { deviceId },
    });

    return result.count;
  }

  async getUserTokens(userId: string): Promise<string[]> {
    const tokens = await prisma.notificationToken.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        fcmToken: true,
      },
    });

    return tokens.map((token: { fcmToken: string }) => token.fcmToken);
  }

  async getDeviceTokens(deviceId: string): Promise<string[]> {
    const tokens = await prisma.notificationToken.findMany({
      where: {
        deviceId,
        isActive: true,
      },
      select: {
        fcmToken: true,
      },
    });

    return tokens.map((token: { fcmToken: string }) => token.fcmToken);
  }

  async getTokensByIdentifier(
    userId?: string,
    deviceId?: string
  ): Promise<string[]> {
    if (!userId && !deviceId) {
      return [];
    }

    const where: {
      isActive: boolean;
      userId?: string;
      deviceId?: string;
    } = {
      isActive: true,
    };

    if (userId) {
      where.userId = userId;
    }

    if (deviceId) {
      where.deviceId = deviceId;
    }

    const tokens = await prisma.notificationToken.findMany({
      where,
      select: {
        fcmToken: true,
      },
    });

    return tokens.map((token: { fcmToken: string }) => token.fcmToken);
  }

  async getTokenInfo(fcmToken: string): Promise<DeviceToken | null> {
    const token = await prisma.notificationToken.findUnique({
      where: { fcmToken },
    });

    if (!token) {
      return null;
    }

    return this.mapToDeviceToken(token);
  }

  async getAllTokens(): Promise<DeviceToken[]> {
    const tokens = await prisma.notificationToken.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tokens.map((token) => this.mapToDeviceToken(token));
  }

  async tokenExists(fcmToken: string): Promise<boolean> {
    const token = await prisma.notificationToken.findUnique({
      where: { fcmToken },
      select: { id: true },
    });

    return !!token;
  }

  async deactivateToken(fcmToken: string): Promise<boolean> {
    try {
      await prisma.notificationToken.update({
        where: { fcmToken },
        data: { isActive: false },
      });
      return true;
    } catch (error) {
      console.error('Erro ao desativar token:', error);
      return false;
    }
  }

  async associateTokenToUser(
    fcmToken: string,
    userId: string
  ): Promise<boolean> {
    try {
      await prisma.notificationToken.update({
        where: { fcmToken },
        data: {
          userId,
          isActive: true,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('Erro ao associar token ao usuário:', error);
      return false;
    }
  }

  async dissociateTokenFromUser(fcmToken: string): Promise<boolean> {
    try {
      await prisma.notificationToken.update({
        where: { fcmToken },
        data: {
          userId: null,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('Erro ao desassociar token do usuário:', error);
      return false;
    }
  }

  private mapToDeviceToken(token: {
    id: string;
    userId: string | null;
    deviceId: string | null;
    fcmToken: string;
    platform: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): DeviceToken {
    return {
      id: token.id,
      userId: token.userId || null,
      deviceId: token.deviceId || null,
      fcmToken: token.fcmToken,
      platform: token.platform as 'android' | 'ios' | 'web',
      isActive: token.isActive,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    };
  }
}

export const notificationTokenRepository = new NotificationTokenRepository();
