// MCP Backend Client Service
// Connects React frontend to the deployed MCP server

const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL || 'https://autosquare-mcp-446953879113.us-central1.run.app';

/**
 * Call an MCP tool on the backend
 */
async function callTool(toolName, args) {
    const response = await fetch(`${MCP_SERVER_URL}/api/tools`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tool: toolName,
            arguments: args,
        }),
    });

    if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`);
    }

    const result = await response.json();

    // Parse the MCP response format
    if (result.content && result.content[0]?.text) {
        return JSON.parse(result.content[0].text);
    }

    return result;
}

/**
 * Diagnose vehicle symptoms using AI
 */
export async function diagnoseVehicle(symptoms, vehicleInfo = null) {
    const args = { symptoms };

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
    checkHealth,
    getAvailableTools,
};
