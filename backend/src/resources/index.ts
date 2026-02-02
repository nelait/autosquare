// MCP Resources Registry
import { Resource } from '@modelcontextprotocol/sdk/types.js';

// Resource definitions for MCP
export function registerResources(): Resource[] {
    return [
        {
            uri: 'autosquare://health',
            name: 'Health Check',
            description: 'Server health status',
            mimeType: 'application/json',
        },
        {
            uri: 'autosquare://config',
            name: 'Server Configuration',
            description: 'Current server configuration (non-sensitive)',
            mimeType: 'application/json',
        },
    ];
}

// Resource read handler
export async function handleResourceRead(
    uri: string
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
    if (uri === 'autosquare://health') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify({
                        status: 'healthy',
                        timestamp: new Date().toISOString(),
                        uptime: process.uptime(),
                    }),
                },
            ],
        };
    }

    if (uri === 'autosquare://config') {
        // Return non-sensitive config
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify({
                        version: '0.1.0',
                        environment: process.env.NODE_ENV || 'development',
                        aiProvider: process.env.AI_PROVIDER || 'openai',
                        sessionStorageEnabled: process.env.ENABLE_SESSION_STORAGE === 'true',
                    }),
                },
            ],
        };
    }

    throw new Error(`Unknown resource: ${uri}`);
}
