// Get Repair Procedure Tool
import { z } from 'zod';
import type { RepairProcedureResponse } from '../types/index.js';
import { aiService } from '../services/aiService.js';

export const GetRepairProcedureSchema = {
    type: 'object' as const,
    properties: {
        problemId: {
            type: 'string',
            description: 'ID of the diagnosed problem',
        },
        problemName: {
            type: 'string',
            description: 'Name of the problem',
        },
        problemDescription: {
            type: 'string',
            description: 'Description of the problem',
        },
        vehicleVin: {
            type: 'string',
            description: 'Optional VIN for vehicle-specific procedure',
        },
        vehicleInfo: {
            type: 'object',
            description: 'Optional vehicle information for context',
            properties: {
                year: { type: 'number' },
                make: { type: 'string' },
                model: { type: 'string' },
                engine: { type: 'string' },
            },
        },
    },
    required: ['problemName', 'problemDescription'],
};

const InputSchema = z.object({
    problemId: z.string().optional(),
    problemName: z.string().min(1, 'Problem name is required'),
    problemDescription: z.string().min(1, 'Problem description is required'),
    vehicleVin: z.string().optional(),
    vehicleInfo: z.object({
        year: z.number().optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        engine: z.string().optional(),
    }).optional(),
});

export async function getRepairProcedure(
    args: Record<string, unknown>
): Promise<RepairProcedureResponse> {
    // Validate input
    const input = InputSchema.parse(args);

    try {
        // Call AI service for repair procedure
        const procedure = await aiService.getRepairProcedure(
            input.problemName,
            input.problemDescription,
            input.vehicleInfo
        );

        return { procedure };
    } catch (error) {
        console.error('Error getting repair procedure:', error);
        return {
            procedure: null,
            error: error instanceof Error ? error.message : 'Failed to get repair procedure',
        };
    }
}
