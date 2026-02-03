// Authentication Middleware - Verifies Firebase ID tokens
import { getAuth } from '../config/firebase.js';

export interface AuthUser {
    uid: string;
    email: string | undefined;
    name: string | undefined;
}

/**
 * Verify Firebase ID token from Authorization header
 * Returns user info if valid, null if invalid or missing
 */
export async function verifyToken(authHeader: string | undefined): Promise<AuthUser | null> {
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        return null;
    }

    try {
        const auth = getAuth();
        const decodedToken = await auth.verifyIdToken(token);

        return {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
        };
    } catch (error) {
        console.error('[Auth Middleware] Token verification failed:', error);
        return null;
    }
}

/**
 * Helper to extract auth header from request
 */
export function getAuthHeader(headers: { [key: string]: string | string[] | undefined }): string | undefined {
    const auth = headers['authorization'] || headers['Authorization'];
    return Array.isArray(auth) ? auth[0] : auth;
}
