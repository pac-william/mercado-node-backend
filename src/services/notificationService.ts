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

