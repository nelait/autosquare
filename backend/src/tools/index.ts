// MCP Tools Registry
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { diagnoseVehicle, DiagnoseVehicleSchema } from './diagnoseVehicle.js';
import { getRepairProcedure, GetRepairProcedureSchema } from './getRepairProcedure.js';
import { lookupVehicle, LookupVehicleSchema } from './lookupVehicle.js';
import { getRecalls, GetRecallsSchema } from './getRecalls.js';
import {
    getMyVehicles,
    addMyVehicle,
    removeMyVehicle,
    updateMyVehicleNickname,
    GetMyVehiclesSchema,
    AddMyVehicleSchema,
    RemoveMyVehicleSchema,
    UpdateVehicleNicknameSchema,
} from './userVehicleTools.js';
import { logUserAction, AuditAction } from '../services/auditService.js';
import { AuthUser } from '../auth/middleware.js';

// Tool definitions for MCP
export function registerTools(): Tool[] {
    return [
        {
            name: 'diagnose_vehicle',
            description: 'Analyze vehicle symptoms using AI to identify potential problems. Returns a list of possible issues with confidence scores, severity levels, and repair estimates.',
            inputSchema: DiagnoseVehicleSchema,
        },
        {
            name: 'get_repair_procedure',
            description: 'Get detailed repair procedure for a specific vehicle problem. Returns step-by-step instructions, required tools, parts, safety warnings, and cost estimates.',
            inputSchema: GetRepairProcedureSchema,
        },
        {
            name: 'lookup_vehicle',
            description: 'Look up vehicle information by VIN. Returns vehicle specifications, features, and basic information.',
            inputSchema: LookupVehicleSchema,
        },
        {
            name: 'get_recalls',
            description: 'Get safety recalls for a vehicle by VIN or make/model/year. Returns list of open and completed recalls.',
            inputSchema: GetRecallsSchema,
        },
        {
            name: 'get_my_vehicles',
            description: 'Get the authenticated user\'s saved vehicles.',
            inputSchema: GetMyVehiclesSchema,
        },
        {
            name: 'add_my_vehicle',
            description: 'Add a vehicle to the authenticated user\'s collection.',
            inputSchema: AddMyVehicleSchema,
        },
        {
            name: 'remove_my_vehicle',
            description: 'Remove a vehicle from the authenticated user\'s collection.',
            inputSchema: RemoveMyVehicleSchema,
        },
        {
            name: 'update_vehicle_nickname',
            description: 'Update the nickname of a saved vehicle.',
            inputSchema: UpdateVehicleNicknameSchema,
        },
    ];
}

// Tool call dispatcher with optional user context
export async function handleToolCall(
    name: string,
    args: Record<string, unknown>,
    user?: AuthUser
): Promise<{ content: Array<{ type: string; text: string }> }> {
    let result: unknown;

    // Log tool usage if user is authenticated
    if (user) {
        const auditAction = getAuditAction(name);
        if (auditAction) {
            // Don't await - fire and forget to not slow down the response
            logUserAction({
                userId: user.uid,
                userEmail: user.email,
                action: auditAction,
                metadata: { tool: name, args: sanitizeArgs(args) },
            }).catch(console.error);
        }
    }

    switch (name) {
        case 'diagnose_vehicle':
            result = await diagnoseVehicle(args);
            break;
        case 'get_repair_procedure':
            result = await getRepairProcedure(args);
            break;
        case 'lookup_vehicle':
            result = await lookupVehicle(args);
            break;
        case 'get_recalls':
            result = await getRecalls(args);
            break;
        case 'get_my_vehicles':
            if (!user) throw new Error('Authentication required');
            result = await getMyVehicles(args, user);
            break;
        case 'add_my_vehicle':
            if (!user) throw new Error('Authentication required');
            result = await addMyVehicle(args, user);
            break;
        case 'remove_my_vehicle':
            if (!user) throw new Error('Authentication required');
            result = await removeMyVehicle(args, user);
            break;
        case 'update_vehicle_nickname':
            if (!user) throw new Error('Authentication required');
            result = await updateMyVehicleNickname(args, user);
            break;
        default:
            throw new Error(`Unknown tool: ${name}`);
    }

    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(result, null, 2),
            },
        ],
    };
}

// Map tool names to audit actions
function getAuditAction(toolName: string): AuditAction | null {
    const mapping: Record<string, AuditAction> = {
        'diagnose_vehicle': 'DIAGNOSIS',
        'lookup_vehicle': 'VIN_LOOKUP',
        'get_recalls': 'RECALL_CHECK',
        'get_repair_procedure': 'REPAIR_PROCEDURE',
        'add_my_vehicle': 'VEHICLE_ADDED',
        'remove_my_vehicle': 'VEHICLE_REMOVED',
    };
    return mapping[toolName] || null;
}

// Remove sensitive data from args before logging
function sanitizeArgs(args: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...args };
    // Remove any potentially sensitive fields
    delete sanitized['apiKey'];
    delete sanitized['password'];
    delete sanitized['token'];
    return sanitized;
}
