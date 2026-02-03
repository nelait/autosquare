// Audit Logging Service - Tracks all user actions in Firestore
import { getFirestore } from '../config/firebase.js';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export type AuditAction =
    | 'LOGIN'
    | 'LOGOUT'
    | 'SIGNUP'
    | 'VIN_LOOKUP'
    | 'DIAGNOSIS'
    | 'RECALL_CHECK'
    | 'VEHICLE_ADDED'
    | 'VEHICLE_REMOVED'
    | 'REPAIR_PROCEDURE';

export interface AuditLogEntry {
    userId: string;
    userEmail?: string;
    action: AuditAction;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

const COLLECTION = 'audit_logs';

/**
 * Log a user action to Firestore
 */
export async function logUserAction(entry: AuditLogEntry): Promise<string> {
    try {
        const db = getFirestore();

        const docRef = await db.collection(COLLECTION).add({
            ...entry,
            timestamp: FieldValue.serverTimestamp(),
        });

        console.log(`[Audit] Logged ${entry.action} for user ${entry.userId}`);
        return docRef.id;
    } catch (error) {
        console.error('[Audit] Failed to log action:', error);
        // Don't throw - audit logging should not break the main flow
        return '';
    }
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(
    userId: string,
    limit: number = 50
): Promise<Array<AuditLogEntry & { id: string; timestamp: Date }>> {
    try {
        const db = getFirestore();

        const snapshot = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                userEmail: data.userEmail,
                action: data.action as AuditAction,
                metadata: data.metadata,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                timestamp: data.timestamp?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error('[Audit] Failed to get logs:', error);
        return [];
    }
}

export const auditService = {
    logUserAction,
    getUserAuditLogs,
};
