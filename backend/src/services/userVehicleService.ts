// User Vehicle Management Service - Firestore CRUD for user's saved vehicles
import { getFirestore } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import { logUserAction } from './auditService.js';

export interface UserVehicle {
    id?: string;
    userId: string;
    vin: string;
    nickname?: string;
    make?: string;
    model?: string;
    year?: number;
    addedAt?: Date;
    lastUsedAt?: Date;
}

const COLLECTION = 'user_vehicles';

/**
 * Get all vehicles for a user
 */
export async function getUserVehicles(userId: string): Promise<UserVehicle[]> {
    try {
        const db = getFirestore();

        // Simple query without orderBy to avoid composite index requirement
        const snapshot = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .get();

        const vehicles = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                vin: data.vin,
                nickname: data.nickname,
                make: data.make,
                model: data.model,
                year: data.year,
                addedAt: data.addedAt?.toDate(),
                lastUsedAt: data.lastUsedAt?.toDate(),
            };
        });

        // Sort in memory by lastUsedAt descending
        vehicles.sort((a, b) => {
            const aTime = a.lastUsedAt?.getTime() || 0;
            const bTime = b.lastUsedAt?.getTime() || 0;
            return bTime - aTime;
        });

        return vehicles;
    } catch (error) {
        console.error('[UserVehicles] Failed to get vehicles:', error);
        return [];
    }
}

/**
 * Add a vehicle to user's collection
 */
export async function addUserVehicle(
    userId: string,
    userEmail: string | undefined,
    vehicle: {
        vin: string;
        nickname?: string;
        make?: string;
        model?: string;
        year?: number;
    }
): Promise<UserVehicle | null> {
    try {
        const db = getFirestore();

        // Check if vehicle already exists for this user
        const existing = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .where('vin', '==', vehicle.vin)
            .get();

        if (!existing.empty) {
            // Update lastUsedAt and return existing
            const existingDoc = existing.docs[0];
            await existingDoc.ref.update({
                lastUsedAt: FieldValue.serverTimestamp(),
                // Update vehicle info if provided
                ...(vehicle.make && { make: vehicle.make }),
                ...(vehicle.model && { model: vehicle.model }),
                ...(vehicle.year && { year: vehicle.year }),
                ...(vehicle.nickname && { nickname: vehicle.nickname }),
            });

            return {
                id: existingDoc.id,
                userId,
                ...vehicle,
            };
        }

        // Create new vehicle entry
        const docRef = await db.collection(COLLECTION).add({
            userId,
            vin: vehicle.vin,
            nickname: vehicle.nickname || null,
            make: vehicle.make || null,
            model: vehicle.model || null,
            year: vehicle.year || null,
            addedAt: FieldValue.serverTimestamp(),
            lastUsedAt: FieldValue.serverTimestamp(),
        });

        // Log the action
        await logUserAction({
            userId,
            userEmail,
            action: 'VEHICLE_ADDED',
            metadata: { vin: vehicle.vin, make: vehicle.make, model: vehicle.model },
        });

        console.log(`[UserVehicles] Added vehicle ${vehicle.vin} for user ${userId}`);

        return {
            id: docRef.id,
            userId,
            ...vehicle,
        };
    } catch (error) {
        console.error('[UserVehicles] Failed to add vehicle:', error);
        return null;
    }
}

/**
 * Remove a vehicle from user's collection
 */
export async function removeUserVehicle(
    userId: string,
    userEmail: string | undefined,
    vin: string
): Promise<boolean> {
    try {
        const db = getFirestore();

        const snapshot = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .where('vin', '==', vin)
            .get();

        if (snapshot.empty) {
            return false;
        }

        // Delete all matching documents (should be just one)
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        // Log the action
        await logUserAction({
            userId,
            userEmail,
            action: 'VEHICLE_REMOVED',
            metadata: { vin },
        });

        console.log(`[UserVehicles] Removed vehicle ${vin} for user ${userId}`);
        return true;
    } catch (error) {
        console.error('[UserVehicles] Failed to remove vehicle:', error);
        return false;
    }
}

/**
 * Update vehicle nickname
 */
export async function updateVehicleNickname(
    userId: string,
    vin: string,
    nickname: string
): Promise<boolean> {
    try {
        const db = getFirestore();

        const snapshot = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .where('vin', '==', vin)
            .get();

        if (snapshot.empty) {
            return false;
        }

        await snapshot.docs[0].ref.update({ nickname });
        return true;
    } catch (error) {
        console.error('[UserVehicles] Failed to update nickname:', error);
        return false;
    }
}

/**
 * Update lastUsedAt timestamp for a vehicle
 */
export async function touchVehicle(userId: string, vin: string): Promise<void> {
    try {
        const db = getFirestore();

        const snapshot = await db.collection(COLLECTION)
            .where('userId', '==', userId)
            .where('vin', '==', vin)
            .get();

        if (!snapshot.empty) {
            await snapshot.docs[0].ref.update({
                lastUsedAt: FieldValue.serverTimestamp(),
            });
        }
    } catch (error) {
        console.error('[UserVehicles] Failed to touch vehicle:', error);
    }
}

export const userVehicleService = {
    getUserVehicles,
    addUserVehicle,
    removeUserVehicle,
    updateVehicleNickname,
    touchVehicle,
};
