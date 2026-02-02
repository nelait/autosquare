// MCP Tools Registry
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { diagnoseVehicle, DiagnoseVehicleSchema } from './diagnoseVehicle.js';
import { getRepairProcedure, GetRepairProcedureSchema } from './getRepairProcedure.js';
import { lookupVehicle, LookupVehicleSchema } from './lookupVehicle.js';
import { getRecalls, GetRecallsSchema } from './getRecalls.js';

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
    ];
}

// Tool call dispatcher
export async function handleToolCall(
    name: string,
    args: Record<string, unknown>
): Promise<{ content: Array<{ type: string; text: string }> }> {
    let result: unknown;

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
