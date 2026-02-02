// Diagnose Vehicle Tool
import { z } from 'zod';
import type { DiagnosisResponse, Problem } from '../types/index.js';
import { aiService } from '../services/aiService.js';
import { sessionService } from '../services/sessionService.js';
import { config } from '../config/index.js';

export const DiagnoseVehicleSchema = {
    type: 'object' as const,
    properties: {
        symptoms: {
            type: 'string',
            description: 'Description of vehicle symptoms or problems',
        },
        vehicleVin: {
            type: 'string',
            description: 'Optional VIN for vehicle-specific diagnosis',
        },
        vehicleInfo: {
            type: 'object',
            description: 'Optional vehicle information for context',
            properties: {
                year: { type: 'number' },
                make: { type: 'string' },
                model: { type: 'string' },
                engine: { type: 'string' },
                mileage: { type: 'number' },
            },
        },
    },
    required: ['symptoms'],
};

const InputSchema = z.object({
    symptoms: z.string().min(1, 'Symptoms are required'),
    vehicleVin: z.string().optional(),
    vehicleInfo: z.object({
        year: z.number().optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        engine: z.string().optional(),
        mileage: z.number().optional(),
    }).optional(),
});

export async function diagnoseVehicle(
    args: Record<string, unknown>
): Promise<DiagnosisResponse> {
    const startTime = Date.now();

    // Validate input
    const input = InputSchema.parse(args);

    // Generate session ID
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Call AI service for diagnosis
    const problems = await aiService.analyzeSymptoms(
        input.symptoms,
        input.vehicleInfo
    );

    const latencyMs = Date.now() - startTime;

    // Store session if enabled
    if (config.enableSessionStorage) {
        await sessionService.saveSession({
            sessionId,
            userId: 'anonymous', // Will be replaced with real user ID from auth
            vin: input.vehicleVin,
            symptoms: input.symptoms,
            inputMethod: 'text',
            problems: JSON.stringify(problems),
            topProblemId: problems[0]?.id,
            topProblemConfidence: problems[0]?.confidence,
            aiModel: config.aiProvider === 'openai' ? config.openaiModel : config.vertexaiModel,
            latencyMs,
            startedAt: new Date().toISOString(),
        });
    }

    return {
        problems,
        sessionId,
        analyzedAt: new Date().toISOString(),
    };
}
