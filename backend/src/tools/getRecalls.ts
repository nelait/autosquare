// Get Recalls Tool
import { z } from 'zod';
import type { RecallsResponse, Recall } from '../types/index.js';
import { nhtsaClient } from '../integrations/nhtsa/client.js';

export const GetRecallsSchema = {
    type: 'object' as const,
    properties: {
        vin: {
            type: 'string',
            description: 'Vehicle Identification Number',
        },
        make: {
            type: 'string',
            description: 'Vehicle make (e.g., Honda, Toyota)',
        },
        model: {
            type: 'string',
            description: 'Vehicle model (e.g., Accord, Camry)',
        },
        year: {
            type: 'number',
            description: 'Vehicle model year',
        },
    },
    required: [],
};

const InputSchema = z.object({
    vin: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
}).refine(
    (data) => data.vin || (data.make && data.model && data.year),
    { message: 'Either VIN or make/model/year combination is required' }
);

export async function getRecalls(
    args: Record<string, unknown>
): Promise<RecallsResponse> {
    // Validate input
    const input = InputSchema.parse(args);

    try {
        let recalls: Recall[] = [];

        if (input.vin) {
            // Lookup by VIN (first decode to get make/model/year)
            const vehicle = await nhtsaClient.decodeVin(input.vin);
            if (vehicle) {
                recalls = await nhtsaClient.getRecalls(
                    vehicle.make,
                    vehicle.model,
                    vehicle.year
                );
            } else {
                recalls = [];
            }
        } else if (input.make && input.model && input.year) {
            // Lookup by make/model/year
            recalls = await nhtsaClient.getRecalls(
                input.make,
                input.model,
                input.year
            );
        } else {
            recalls = [];
        }

        const openCount = recalls.filter(r => r.status === 'open').length;

        return {
            recalls,
            totalCount: recalls.length,
            openCount,
        };
    } catch (error) {
        console.error('Error getting recalls:', error);
        return {
            recalls: [],
            totalCount: 0,
            openCount: 0,
        };
    }
}
