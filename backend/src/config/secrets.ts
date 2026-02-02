// Secret Manager Integration
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { config } from './index.js';

let secretClient: SecretManagerServiceClient | null = null;
const secretCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getClient(): SecretManagerServiceClient {
    if (!secretClient) {
        secretClient = new SecretManagerServiceClient();
    }
    return secretClient;
}

export async function getSecret(secretName: string): Promise<string> {
    // Check cache first
    const cached = secretCache.get(secretName);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
    }

    // In development, try environment variables first
    if (config.nodeEnv === 'development') {
        const envValue = process.env[secretName.toUpperCase().replace(/-/g, '_')];
        if (envValue) {
            return envValue;
        }
    }

    // Fetch from Secret Manager
    const client = getClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/${config.gcpProject}/secrets/${secretName}/versions/latest`,
    });

    const payload = version.payload?.data;
    if (!payload) {
        throw new Error(`Secret ${secretName} has no payload`);
    }

    const value = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8');

    // Cache the value
    secretCache.set(secretName, {
        value,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return value;
}

// Pre-defined secret names
export const SecretNames = {
    OPENAI_API_KEY: 'openai-api-key',
    FIREBASE_SERVICE_ACCOUNT: 'firebase-service-account',
} as const;
