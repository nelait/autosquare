// Backend Configuration

export interface Config {
    // Server
    port: number;
    nodeEnv: 'development' | 'production' | 'test';

    // GCP
    gcpProject: string;
    gcpRegion: string;

    // BigTable
    bigtableInstance: string;
    bigtableTable: string;

    // AI
    aiProvider: 'openai' | 'vertexai';
    openaiModel: string;
    vertexaiModel: string;

    // Feature Flags
    enableSessionStorage: boolean;
    enableCaching: boolean;
}

function getEnvOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

function getEnvOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export function loadConfig(): Config {
    const nodeEnv = getEnvOrDefault('NODE_ENV', 'development') as Config['nodeEnv'];

    return {
        // Server
        port: parseInt(getEnvOrDefault('PORT', '8080'), 10),
        nodeEnv,

        // GCP
        gcpProject: getEnvOrDefault('GCP_PROJECT', 'autosquare-dev'),
        gcpRegion: getEnvOrDefault('GCP_REGION', 'us-central1'),

        // BigTable
        bigtableInstance: getEnvOrDefault('BIGTABLE_INSTANCE', 'autosquare-sessions'),
        bigtableTable: getEnvOrDefault('BIGTABLE_TABLE', 'diagnosis_sessions'),

        // AI
        aiProvider: getEnvOrDefault('AI_PROVIDER', 'openai') as Config['aiProvider'],
        openaiModel: getEnvOrDefault('OPENAI_MODEL', 'gpt-4o-mini'),
        vertexaiModel: getEnvOrDefault('VERTEXAI_MODEL', 'gemini-1.5-flash'),

        // Feature Flags
        enableSessionStorage: getEnvOrDefault('ENABLE_SESSION_STORAGE', 'false') === 'true',
        enableCaching: getEnvOrDefault('ENABLE_CACHING', 'false') === 'true',
    };
}

export const config = loadConfig();
