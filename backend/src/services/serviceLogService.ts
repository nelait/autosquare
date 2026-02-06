// Service Log Service - Firestore CRUD for vehicle service logs
import { getFirestore } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import { logUserAction } from './auditService.js';

export interface ServiceLog {
    id?: string;
    userId: string;
    vin: string;
    date: string;  // ISO date string
    mileage?: number;
    description: string;
    category: 'maintenance' | 'repair' | 'inspection' | 'recall' | 'other';
    cost?: number;
    extractedFrom: 'upload' | 'manual';
    createdAt?: Date;
}

const COLLECTION = 'service_logs';

/**
 * Get all service logs for a vehicle (by VIN)
 */
export async function getServiceLogs(userId: string, vin: string): Promise<ServiceLog[]> {
    try {
        const db = getFirestore();

        const snapshot = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .where('vin', '==', vin)
            .get();

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                vin: data.vin,
                date: data.date,
                mileage: data.mileage,
                description: data.description,
                category: data.category,
                cost: data.cost,
                extractedFrom: data.extractedFrom,
                createdAt: data.createdAt?.toDate(),
            } as ServiceLog;
        });

        // Sort by date descending (most recent first)
        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return logs;
    } catch (error) {
        console.error('[ServiceLogs] Failed to get logs:', error);
        return [];
    }
}

/**
 * Add a single service log entry
 */
export async function addServiceLog(
    userId: string,
    userEmail: string | undefined,
    log: Omit<ServiceLog, 'id' | 'userId' | 'createdAt'>
): Promise<ServiceLog | null> {
    try {
        const db = getFirestore();

        const docRef = await db.collection(COLLECTION).add({
            userId,
            vin: log.vin,
            date: log.date,
            mileage: log.mileage || null,
            description: log.description,
            category: log.category || 'other',
            cost: log.cost || null,
            extractedFrom: log.extractedFrom,
            createdAt: FieldValue.serverTimestamp(),
        });

        // Log the action
        await logUserAction({
            userId,
            userEmail,
            action: 'SERVICE_LOG_ADDED',
            metadata: { vin: log.vin, date: log.date, category: log.category },
        });

        console.log(`[ServiceLogs] Added log for VIN ${log.vin}: ${log.description.substring(0, 50)}...`);

        return {
            id: docRef.id,
            userId,
            ...log,
        };
    } catch (error) {
        console.error('[ServiceLogs] Failed to add log:', error);
        return null;
    }
}

/**
 * Add multiple service log entries (for batch upload)
 */
export async function addServiceLogsBatch(
    userId: string,
    userEmail: string | undefined,
    logs: Omit<ServiceLog, 'id' | 'userId' | 'createdAt'>[]
): Promise<{ added: number; failed: number }> {
    let added = 0;
    let failed = 0;

    for (const log of logs) {
        const result = await addServiceLog(userId, userEmail, log);
        if (result) {
            added++;
        } else {
            failed++;
        }
    }

    return { added, failed };
}

/**
 * Delete a service log entry
 */
export async function deleteServiceLog(
    userId: string,
    logId: string
): Promise<boolean> {
    try {
        const db = getFirestore();

        const docRef = db.collection(COLLECTION).doc(logId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return false;
        }

        // Verify ownership
        const data = doc.data();
        if (data?.userId !== userId) {
            console.error('[ServiceLogs] Unauthorized delete attempt');
            return false;
        }

        await docRef.delete();
        console.log(`[ServiceLogs] Deleted log ${logId}`);
        return true;
    } catch (error) {
        console.error('[ServiceLogs] Failed to delete log:', error);
        return false;
    }
}

/**
 * Get service logs formatted for AI context
 */
export async function getServiceLogsForAI(userId: string, vin: string): Promise<string | null> {
    const logs = await getServiceLogs(userId, vin);

    if (logs.length === 0) {
        return null;
    }

    // Format logs for AI consumption
    const formattedLogs = logs.map(log => {
        const parts = [`- ${log.date}:`];
        if (log.mileage) parts.push(`at ${log.mileage.toLocaleString()} miles`);
        parts.push(`[${log.category}]`);
        parts.push(log.description);
        if (log.cost) parts.push(`($${log.cost.toFixed(2)})`);
        return parts.join(' ');
    }).join('\n');

    return `SERVICE HISTORY (${logs.length} records):\n${formattedLogs}`;
}

export const serviceLogService = {
    getServiceLogs,
    addServiceLog,
    addServiceLogsBatch,
    deleteServiceLog,
    getServiceLogsForAI,
};
