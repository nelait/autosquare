// Firebase Admin SDK Configuration for Backend
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// In production, this will use Application Default Credentials (ADC)
// In development, you can set GOOGLE_APPLICATION_CREDENTIALS env var

let initialized = false;

export function initializeFirebase() {
    if (initialized) return;

    try {
        // Initialize with ADC (works on Cloud Run automatically)
        admin.initializeApp({
            projectId: 'autosquare-prod',
        });
        initialized = true;
        console.log('[Firebase Admin] Initialized successfully');
    } catch (error) {
        // App might already be initialized
        if ((error as Error).message?.includes('already exists')) {
            initialized = true;
        } else {
            console.error('[Firebase Admin] Initialization error:', error);
            throw error;
        }
    }
}

// Get Firebase Auth instance
export function getAuth(): admin.auth.Auth {
    initializeFirebase();
    return admin.auth();
}

// Get Firestore instance
export function getFirestore(): admin.firestore.Firestore {
    initializeFirebase();
    return admin.firestore();
}

export default admin;
