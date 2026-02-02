// Lookup Vehicle Tool
import { z } from 'zod';
import type { VehicleLookupResponse } from '../types/index.js';
import { nhtsaClient } from '../integrations/nhtsa/client.js';

export const LookupVehicleSchema = {
    type: 'object' as const,
    properties: {
        vin: {
            type: 'string',
            description: 'Vehicle Identification Number (17 characters)',
        },
    },
    required: ['vin'],
};

const InputSchema = z.object({
    vin: z.string().length(17, 'VIN must be exactly 17 characters'),
});

export async function lookupVehicle(
    args: Record<string, unknown>
): Promise<VehicleLookupResponse> {
    // Validate input
    const input = InputSchema.parse(args);

    try {
        // Decode VIN using NHTSA API
        const vehicle = await nhtsaClient.decodeVin(input.vin);

        return { vehicle };
    } catch (error) {
        console.error('Error looking up vehicle:', error);
        return {
            vehicle: null,
            error: error instanceof Error ? error.message : 'Failed to lookup vehicle',
        };
    }
}
