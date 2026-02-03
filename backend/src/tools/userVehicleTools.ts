// User Vehicle Management Tools
import { z } from 'zod';
import { getUserVehicles, addUserVehicle, removeUserVehicle, updateVehicleNickname } from '../services/userVehicleService.js';
import { AuthUser } from '../auth/middleware.js';

// Schema definitions - using 'as const' for proper type inference
export const GetMyVehiclesSchema = {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
};

export const AddMyVehicleSchema = {
    type: 'object' as const,
    properties: {
        vin: { type: 'string', description: 'Vehicle VIN (17 characters)' },
        nickname: { type: 'string', description: 'Optional friendly name for the vehicle' },
        make: { type: 'string', description: 'Vehicle make (e.g., Tesla, Honda)' },
        model: { type: 'string', description: 'Vehicle model (e.g., Model Y, Civic)' },
        year: { type: 'number', description: 'Vehicle year' },
    },
    required: ['vin'],
};

export const RemoveMyVehicleSchema = {
    type: 'object' as const,
    properties: {
        vin: { type: 'string', description: 'VIN of vehicle to remove' },
    },
    required: ['vin'],
};

export const UpdateVehicleNicknameSchema = {
    type: 'object' as const,
    properties: {
        vin: { type: 'string', description: 'VIN of vehicle to update' },
        nickname: { type: 'string', description: 'New nickname for the vehicle' },
    },
    required: ['vin', 'nickname'],
};

// Zod schemas for validation
const getMyVehiclesInput = z.object({});

const addMyVehicleInput = z.object({
    vin: z.string().length(17),
    nickname: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
});

const removeMyVehicleInput = z.object({
    vin: z.string().length(17),
});

const updateVehicleNicknameInput = z.object({
    vin: z.string().length(17),
    nickname: z.string(),
});

/**
 * Get all vehicles for the authenticated user
 */
export async function getMyVehicles(
    _args: Record<string, unknown>,
    user: AuthUser
) {
    const vehicles = await getUserVehicles(user.uid);

    return {
        vehicles,
        count: vehicles.length,
    };
}

/**
 * Add a vehicle to the user's collection
 */
export async function addMyVehicle(
    args: Record<string, unknown>,
    user: AuthUser
) {
    const input = addMyVehicleInput.parse(args);

    const vehicle = await addUserVehicle(user.uid, user.email, {
        vin: input.vin.toUpperCase(),
        nickname: input.nickname,
        make: input.make,
        model: input.model,
        year: input.year,
    });

    if (!vehicle) {
        return { success: false, error: 'Failed to add vehicle' };
    }

    return {
        success: true,
        vehicle,
    };
}

/**
 * Remove a vehicle from the user's collection
 */
export async function removeMyVehicle(
    args: Record<string, unknown>,
    user: AuthUser
) {
    const input = removeMyVehicleInput.parse(args);

    const success = await removeUserVehicle(user.uid, user.email, input.vin.toUpperCase());

    return {
        success,
        message: success ? 'Vehicle removed' : 'Vehicle not found',
    };
}

/**
 * Update a vehicle's nickname
 */
export async function updateMyVehicleNickname(
    args: Record<string, unknown>,
    user: AuthUser
) {
    const input = updateVehicleNicknameInput.parse(args);

    const success = await updateVehicleNickname(user.uid, input.vin.toUpperCase(), input.nickname);

    return {
        success,
        message: success ? 'Nickname updated' : 'Vehicle not found',
    };
}
