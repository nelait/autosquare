// AI Service for Vehicle Diagnostics
// Uses MCP Backend Server (Cloud Run) instead of direct OpenAI calls
import mcpClient from './mcpClient.js';

// Legacy API key functions (kept for backward compatibility but not used)
export const setApiKey = (key) => {
    localStorage.setItem('openai_api_key', key);
};

export const getApiKey = () => {
    return localStorage.getItem('openai_api_key') || '';
};

export const hasApiKey = () => {
    // Always return true since we now use the backend server
    return true;
};

// Analyze vehicle symptoms using MCP Backend
export const analyzeVehicleSymptoms = async (symptoms, vehicleInfo = null) => {
    try {
        const result = await mcpClient.diagnoseVehicle(symptoms, vehicleInfo);

        // Return the problems array
        if (result.problems) {
            // Add source info from backend
            return result.problems.map(p => ({
                ...p,
                source: p.source || 'mcp-backend'
            }));
        }

        return [];
    } catch (error) {
        console.error('MCP diagnosis error:', error);
        throw new Error(`Diagnosis failed: ${error.message}`);
    }
};

// Get detailed repair procedure using MCP Backend
export const getRepairProcedure = async (problemName, problemDescription, vehicleInfo = null) => {
    try {
        const result = await mcpClient.getRepairProcedure(
            problemName,
            problemDescription,
            vehicleInfo
        );

        return result.procedure || result;
    } catch (error) {
        console.error('MCP repair procedure error:', error);
        throw new Error(`Failed to get repair procedure: ${error.message}`);
    }
};

// Look up vehicle by VIN using MCP Backend
export const lookupVehicleByVin = async (vin) => {
    try {
        const result = await mcpClient.lookupVehicle(vin);
        return result.vehicle;
    } catch (error) {
        console.error('MCP vehicle lookup error:', error);
        throw new Error(`Vehicle lookup failed: ${error.message}`);
    }
};

// Get recalls for a vehicle using MCP Backend
export const getVehicleRecalls = async (params) => {
    try {
        const result = await mcpClient.getRecalls(params);
        return result;
    } catch (error) {
        console.error('MCP recalls error:', error);
        throw new Error(`Recalls lookup failed: ${error.message}`);
    }
};

// Check if the backend service is available
export const checkBackendHealth = async () => {
    return mcpClient.checkHealth();
};

export default {
    setApiKey,
    getApiKey,
    hasApiKey,
    analyzeVehicleSymptoms,
    getRepairProcedure,
    lookupVehicleByVin,
    getVehicleRecalls,
    checkBackendHealth
};
