// Service Log Tools - MCP tools for managing vehicle service logs
import { z } from 'zod';
import { serviceLogService, ServiceLog } from '../services/serviceLogService.js';
import { aiService } from '../services/aiService.js';
import { logUserAction } from '../services/auditService.js';

// Schema definitions for MCP tools
export const GetServiceLogsSchema = {
    type: 'object' as const,
    properties: {
        vin: {
            type: 'string',
            description: 'VIN of the vehicle to get service logs for',
        },
    },
    required: ['vin'],
};

export const AddServiceLogSchema = {
    type: 'object' as const,
    properties: {
        vin: {
            type: 'string',
            description: 'VIN of the vehicle',
        },
        date: {
            type: 'string',
            description: 'Date of service (YYYY-MM-DD format)',
        },
        description: {
            type: 'string',
            description: 'Description of the service performed',
        },
        category: {
            type: 'string',
            description: 'Category: maintenance, repair, inspection, recall, or other',
        },
        mileage: {
            type: 'number',
            description: 'Mileage at time of service (optional)',
        },
        cost: {
            type: 'number',
            description: 'Cost of service in dollars (optional)',
        },
    },
    required: ['vin', 'date', 'description'],
};

export const ParseServiceDocumentSchema = {
    type: 'object' as const,
    properties: {
        vin: {
            type: 'string',
            description: 'VIN of the vehicle the document belongs to',
        },
        documentText: {
            type: 'string',
            description: 'Text content extracted from the service document',
        },
    },
    required: ['vin', 'documentText'],
};

export const DeleteServiceLogSchema = {
    type: 'object' as const,
    properties: {
        logId: {
            type: 'string',
            description: 'ID of the service log entry to delete',
        },
    },
    required: ['logId'],
};

// Zod schemas for validation
const GetServiceLogsInput = z.object({
    vin: z.string().length(17, 'VIN must be 17 characters'),
});

const AddServiceLogInput = z.object({
    vin: z.string().length(17, 'VIN must be 17 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    description: z.string().min(1, 'Description is required'),
    category: z.enum(['maintenance', 'repair', 'inspection', 'recall', 'other']).optional().default('other'),
    mileage: z.number().optional(),
    cost: z.number().optional(),
});

const ParseServiceDocumentInput = z.object({
    vin: z.string().length(17, 'VIN must be 17 characters'),
    documentText: z.string().min(10, 'Document text is too short'),
});

const DeleteServiceLogInput = z.object({
    logId: z.string().min(1, 'Log ID is required'),
});

/**
 * Get service logs for a vehicle
 */
export async function getServiceLogs(
    args: Record<string, unknown>,
    userId: string
): Promise<{ logs: ServiceLog[]; count: number }> {
    const input = GetServiceLogsInput.parse(args);

    const logs = await serviceLogService.getServiceLogs(userId, input.vin);

    return {
        logs,
        count: logs.length,
    };
}

/**
 * Add a service log entry manually
 */
export async function addServiceLog(
    args: Record<string, unknown>,
    userId: string,
    userEmail?: string
): Promise<{ success: boolean; log?: ServiceLog; error?: string }> {
    const input = AddServiceLogInput.parse(args);

    const log = await serviceLogService.addServiceLog(userId, userEmail, {
        vin: input.vin,
        date: input.date,
        description: input.description,
        category: input.category as ServiceLog['category'],
        mileage: input.mileage,
        cost: input.cost,
        extractedFrom: 'manual',
    });

    if (log) {
        return { success: true, log };
    } else {
        return { success: false, error: 'Failed to add service log' };
    }
}

/**
 * Parse a service document and extract log entries
 */
export async function parseServiceDocument(
    args: Record<string, unknown>,
    userId: string,
    userEmail?: string
): Promise<{ success: boolean; logs: ServiceLog[]; added: number; error?: string }> {
    const input = ParseServiceDocumentInput.parse(args);

    try {
        // Use AI to parse the document text
        const parsedLogs = await aiService.parseServiceDocument(input.documentText);

        if (!parsedLogs || parsedLogs.length === 0) {
            return {
                success: false,
                logs: [],
                added: 0,
                error: 'Could not extract any service records from the document',
            };
        }

        // Add each parsed log to the database
        const logsToAdd = parsedLogs.map(log => ({
            vin: input.vin,
            date: log.date,
            description: log.description,
            category: log.category as ServiceLog['category'],
            mileage: log.mileage,
            cost: log.cost,
            extractedFrom: 'upload' as const,
        }));

        const result = await serviceLogService.addServiceLogsBatch(userId, userEmail, logsToAdd);

        // Log the parsing action
        await logUserAction({
            userId,
            userEmail,
            action: 'SERVICE_DOC_PARSED',
            metadata: { vin: input.vin, recordsExtracted: result.added },
        });

        // Fetch the added logs
        const allLogs = await serviceLogService.getServiceLogs(userId, input.vin);

        return {
            success: true,
            logs: allLogs,
            added: result.added,
        };
    } catch (error) {
        console.error('[ServiceLogTools] Parse error:', error);
        return {
            success: false,
            logs: [],
            added: 0,
            error: 'Failed to parse service document',
        };
    }
}

/**
 * Delete a service log entry
 */
export async function deleteServiceLog(
    args: Record<string, unknown>,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    const input = DeleteServiceLogInput.parse(args);

    const deleted = await serviceLogService.deleteServiceLog(userId, input.logId);

    if (deleted) {
        return { success: true };
    } else {
        return { success: false, error: 'Failed to delete service log or log not found' };
    }
}

// Tool definitions for registration
export const serviceLogTools = [
    {
        name: 'get_service_logs',
        description: 'Get service history logs for a vehicle by VIN',
        inputSchema: GetServiceLogsSchema,
    },
    {
        name: 'add_service_log',
        description: 'Add a manual service log entry for a vehicle',
        inputSchema: AddServiceLogSchema,
    },
    {
        name: 'parse_service_document',
        description: 'Parse uploaded service document text and extract service records',
        inputSchema: ParseServiceDocumentSchema,
    },
    {
        name: 'delete_service_log',
        description: 'Delete a service log entry by ID',
        inputSchema: DeleteServiceLogSchema,
    },
];
