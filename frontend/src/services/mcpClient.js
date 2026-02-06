// MCP Backend Client Service
// Connects React frontend to the deployed MCP server

import { getIdToken } from './authService';

const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL || 'https://autosquare-mcp-446953879113.us-central1.run.app';

/**
 * Get auth headers with Firebase ID token
 */
async function getAuthHeaders() {
    const token = await getIdToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
}

/**
 * Call an MCP tool on the backend (authenticated)
 */
async function callTool(toolName, args) {
    const headers = await getAuthHeaders();

    const response = await fetch(`${MCP_SERVER_URL}/api/tools`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            tool: toolName,
            arguments: args,
        }),
    });

    if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.message || error.error || `MCP Server error: ${response.status}`);
    }

    const result = await response.json();

    // Parse the MCP response format
    if (result.content && result.content[0]?.text) {
        return JSON.parse(result.content[0].text);
    }

    return result;
}

/**
 * Log an authentication event
 */
export async function logAuthEvent(action) {
    try {
        const headers = await getAuthHeaders();
        await fetch(`${MCP_SERVER_URL}/api/auth/log`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ action }),
        });
    } catch (error) {
        console.error('Failed to log auth event:', error);
    }
}

/**
 * Diagnose vehicle symptoms using AI
 * If vehicleVin is provided, backend will fetch NHTSA data and recalls for enhanced context
 */
export async function diagnoseVehicle(symptoms, vehicleInfo = null, vehicleVin = null) {
    const args = { symptoms };

    // Pass VIN for backend to fetch NHTSA data and recalls
    if (vehicleVin) {
        args.vehicleVin = vehicleVin;
    }

    if (vehicleInfo) {
        args.vehicleInfo = {
            year: vehicleInfo.year,
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            engine: vehicleInfo.engine?.type,
            mileage: vehicleInfo.mileage,
        };
    }

    return callTool('diagnose_vehicle', args);
}

/**
 * Get repair procedure for a problem
 */
export async function getRepairProcedure(problemName, problemDescription, vehicleInfo = null) {
    const args = {
        problemName,
        problemDescription,
    };

    if (vehicleInfo) {
        args.vehicleInfo = {
            year: vehicleInfo.year,
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            engine: vehicleInfo.engine?.type,
        };
    }

    return callTool('get_repair_procedure', args);
}

/**
 * Look up vehicle by VIN
 */
export async function lookupVehicle(vin) {
    return callTool('lookup_vehicle', { vin });
}

/**
 * Get recalls for a vehicle
 */
export async function getRecalls(params) {
    // Can pass VIN or make/model/year
    return callTool('get_recalls', params);
}

// ============ User Vehicle Management ============

/**
 * Get the authenticated user's saved vehicles
 */
export async function getMyVehicles() {
    return callTool('get_my_vehicles', {});
}

/**
 * Add a vehicle to the user's collection
 */
export async function addMyVehicle(vehicle) {
    return callTool('add_my_vehicle', vehicle);
}

/**
 * Remove a vehicle from the user's collection
 */
export async function removeMyVehicle(vin) {
    return callTool('remove_my_vehicle', { vin });
}

/**
 * Update a vehicle's nickname
 */
export async function updateVehicleNickname(vin, nickname) {
    return callTool('update_vehicle_nickname', { vin, nickname });
}

// ============ Utility Functions ============

/**
 * Check if backend is available
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${MCP_SERVER_URL}/health`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === 'healthy';
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}

/**
 * Get available tools from the backend
 */
// ==================== SERVICE LOGS ====================

/**
 * Get service logs for a vehicle
 */
export async function getServiceLogs(vin) {
    return callTool('get_service_logs', { vin });
}

/**
 * Add a service log entry manually
 */
export async function addServiceLog(vin, date, description, category = 'other', mileage, cost) {
    return callTool('add_service_log', {
        vin,
        date,
        description,
        category,
        ...(mileage && { mileage }),
        ...(cost && { cost }),
    });
}

/**
 * Parse a service document and extract log entries
 */
export async function parseServiceDocument(vin, documentText) {
    return callTool('parse_service_document', { vin, documentText });
}

/**
 * Delete a service log entry
 */
export async function deleteServiceLog(logId) {
    return callTool('delete_service_log', { logId });
}

// ==================== UTILS ====================

export async function getAvailableTools() {
    const response = await fetch(`${MCP_SERVER_URL}/api/tools`);
    if (!response.ok) {
        throw new Error(`Failed to get tools: ${response.status}`);
    }
    return response.json();
}

export default {
    diagnoseVehicle,
    getRepairProcedure,
    lookupVehicle,
    getRecalls,
    getMyVehicles,
    addMyVehicle,
    removeMyVehicle,
    updateVehicleNickname,
    getServiceLogs,
    addServiceLog,
    parseServiceDocument,
    deleteServiceLog,
    checkHealth,
    getAvailableTools,
    logAuthEvent,
};
