import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { Logger } from '../utils/logger';

let firebaseApp: admin.app.App | null = null;

export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
}

export interface SendNotificationOptions {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}


export function initializeFirebaseAdmin(): void {

    if (firebaseApp) {
        return;
    }

    try {
        const serviceAccountPath = path.join(
            process.cwd(),
            'service-account.json'
        );

        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });

        Logger.info('NotificationService', 'Firebase Admin SDK inicializado com sucesso');
    } catch (error: any) {
        Logger.errorOperation(
            'NotificationService',
            'initializeFirebaseAdmin',
            `Erro ao inicializar Firebase Admin: ${error.message}`
        );
        throw error;
    }
}

/**
 * Verifica se o Firebase Admin está inicializado
 */
function ensureInitialized(): void {
    if (!firebaseApp) {
        initializeFirebaseAdmin();
    }
}


export async function sendPushNotification(
    options: SendNotificationOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        ensureInitialized();

        const { token, title, body, data, imageUrl } = options;

        const message: admin.messaging.Message = {
            token,
            notification: {
                title,
                body,
                ...(imageUrl && { imageUrl }),
            },
            data: data
                ? Object.keys(data).reduce((acc, key) => {
                    acc[key] = String(data[key]);
                    return acc;
                }, {} as Record<string, string>)
                : {},
            android: {
                priority: 'high' as const,
                notification: {
                    channelId: 'default',
                    sound: 'default',
                    priority: 'high' as const,
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };

        const response = await admin.messaging().send(message);
        return {
            success: true,
            messageId: response,
        };
    } catch (error: any) {
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
            return {
                success: false,
                error: 'Token inválido ou não registrado',
            };
        }

        return {
            success: false,
            error: error.message || 'Erro desconhecido ao enviar notificação',
        };
    }
}

export async function sendPushNotificationToMultiple(
    tokens: string[],
    payload: NotificationPayload
): Promise<{
    successCount: number;
    failureCount: number;
    results: Array<{ token: string; success: boolean; error?: string }>;
}> {
    try {
        ensureInitialized();

        if (tokens.length === 0) {
            return {
                successCount: 0,
                failureCount: 0,
                results: [],
            };
        }

        const message: admin.messaging.MulticastMessage = {
            tokens,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data
                ? Object.keys(payload.data).reduce((acc, key) => {
                    acc[key] = String(payload.data![key]);
                    return acc;
                }, {} as Record<string, string>)
                : {},
            android: {
                priority: 'high' as const,
                notification: {
                    channelId: 'default',
                    sound: 'default',
                    priority: 'high' as const,
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };

        const response = await admin.messaging().sendEachForMulticast(message);

        const results = tokens.map((token, index) => {
            const result = response.responses[index];
            return {
                token,
                success: result.success,
                error: result.error?.message,
            };
        });

        Logger.info(
            'NotificationService',
            'Notificações multicast enviadas',
            {
                successCount: response.successCount,
                failureCount: response.failureCount,
            }
        );

        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
            results,
        };
    } catch (error: any) {
        Logger.errorOperation(
            'NotificationService',
            'sendPushNotificationToMultiple',
            `Erro ao enviar notificações: ${error.message}`
        );

        return {
            successCount: 0,
            failureCount: tokens.length,
            results: tokens.map((token) => ({
                token,
                success: false,
                error: error.message,
            })),
        };
    }
}


export async function sendPushNotificationToTopic(
    topic: string,
    payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        ensureInitialized();

        const message: admin.messaging.Message = {
            topic,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data
                ? Object.keys(payload.data).reduce((acc, key) => {
                    acc[key] = String(payload.data![key]);
                    return acc;
                }, {} as Record<string, string>)
                : {},
        };

        const response = await admin.messaging().send(message);

        return {
            success: true,
            messageId: response,
        };
    } catch (error: any) {
        Logger.errorOperation(
            'NotificationService',
            'sendPushNotificationToTopic',
            `Erro ao enviar notificação para tópico: ${error.message}`
        );
        return {
            success: false,
            error: error.message,
        };
    }
}

