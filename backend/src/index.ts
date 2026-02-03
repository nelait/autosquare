// MCP Server Entry Point with HTTP Transport for Cloud Run
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import http from 'http';
import { URL } from 'url';

import { config } from './config/index.js';
import { registerTools, handleToolCall } from './tools/index.js';
import { registerResources, handleResourceRead } from './resources/index.js';
import { verifyToken, getAuthHeader, AuthUser } from './auth/middleware.js';
import { logUserAction } from './services/auditService.js';
import { initializeFirebase } from './config/firebase.js';

// Initialize Firebase Admin SDK
initializeFirebase();

// Create MCP Server
function createMCPServer() {
    const server = new Server(
        {
            name: 'autosquare-mcp',
            version: '0.1.0',
        },
        {
            capabilities: {
                tools: {},
                resources: {},
            },
        }
    );

    // Register tool handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return { tools: registerTools() };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        return handleToolCall(name, args ?? {});
    });

    // Register resource handlers
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return { resources: registerResources() };
    });

    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const { uri } = request.params;
        return handleResourceRead(uri);
    });

    // Error handling
    server.onerror = (error) => {
        console.error('[MCP Server Error]', error);
    };

    return server;
}

// HTTP Server for Cloud Run
const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Health check endpoint
    if (url.pathname === '/' || url.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'autosquare-mcp',
            version: '0.1.0',
            timestamp: new Date().toISOString(),
        }));
        return;
    }

    // SSE endpoint for MCP
    if (url.pathname === '/sse') {
        console.log('New SSE connection');
        const server = createMCPServer();
        const transport = new SSEServerTransport('/message', res);
        await server.connect(transport);
        return;
    }

    // Message endpoint for MCP
    if (url.pathname === '/message' && req.method === 'POST') {
        // Handle incoming messages - the SSE transport handles this internally
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ received: true }));
        });
        return;
    }

    // Simple JSON-RPC style API for direct tool calls (non-MCP clients)
    // Now with authentication
    if (url.pathname === '/api/tools' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                // Verify authentication
                const authHeader = getAuthHeader(req.headers);
                const user = await verifyToken(authHeader);

                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Unauthorized',
                        message: 'Valid authentication token required'
                    }));
                    return;
                }

                const { tool, arguments: args } = JSON.parse(body);
                const result = await handleToolCall(tool, args || {}, user);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }));
            }
        });
        return;
    }

    // List available tools (public - no auth required)
    if (url.pathname === '/api/tools' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ tools: registerTools() }));
        return;
    }

    // Auth event logging endpoint
    if (url.pathname === '/api/auth/log' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const authHeader = getAuthHeader(req.headers);
                const user = await verifyToken(authHeader);

                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Unauthorized' }));
                    return;
                }

                const { action } = JSON.parse(body);

                if (action === 'LOGIN' || action === 'SIGNUP' || action === 'LOGOUT') {
                    await logUserAction({
                        userId: user.uid,
                        userEmail: user.email,
                        action,
                        metadata: {},
                    });
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }));
            }
        });
        return;
    }

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = parseInt(process.env.PORT || '8080', 10);

httpServer.listen(PORT, () => {
    console.log(`AutoSquare MCP Server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`AI Provider: ${config.aiProvider}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`MCP SSE endpoint: http://localhost:${PORT}/sse`);
    console.log(`API endpoint: http://localhost:${PORT}/api/tools`);
    console.log(`Auth logging: http://localhost:${PORT}/api/auth/log`);
});

process.on('SIGINT', () => {
    console.log('Shutting down MCP server...');
    httpServer.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    httpServer.close();
    process.exit(0);
});
