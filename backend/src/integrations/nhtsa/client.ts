// NHTSA API Client
import type { Vehicle, Recall } from '../../types/index.js';

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const NHTSA_RECALLS_URL = 'https://api.nhtsa.gov/recalls/recallsByVehicle';

interface NHTSADecodeResult {
    Variable: string;
    Value: string | null;
    ValueId: string | null;
}

interface NHTSADecodeResponse {
    Results: NHTSADecodeResult[];
}

interface NHTSARecallResult {
    Manufacturer: string;
    NHTSACampaignNumber: string;
    Component: string;
    Summary: string;
    Consequence: string;
    Remedy: string;
    ReportReceivedDate: string;
    PotentialNumberofUnitsAffected: number;
}

interface NHTSARecallsResponse {
    results: NHTSARecallResult[];
    Count: number;
}

function getValueFromResults(results: NHTSADecodeResult[], variable: string): string {
    const item = results.find(r => r.Variable === variable);
    return item?.Value || '';
}

export const nhtsaClient = {
    async decodeVin(vin: string): Promise<Vehicle | null> {
        try {
            const response = await fetch(
                `${NHTSA_BASE_URL}/DecodeVin/${vin}?format=json`
            );

            if (!response.ok) {
                throw new Error(`NHTSA API error: ${response.status}`);
            }

            const data = await response.json() as NHTSADecodeResponse;
            const results = data.Results;

            const year = parseInt(getValueFromResults(results, 'Model Year'), 10);
            const make = getValueFromResults(results, 'Make');
            const model = getValueFromResults(results, 'Model');

            if (!year || !make || !model) {
                return null;
            }

            return {
                vin,
                year,
                make,
                model,
                trim: getValueFromResults(results, 'Trim') || getValueFromResults(results, 'Series'),
                engine: {
                    type: getValueFromResults(results, 'Engine Configuration') ||
                        `${getValueFromResults(results, 'Engine Number of Cylinders')} Cylinder`,
                    displacement: getValueFromResults(results, 'Displacement (L)') + 'L',
                    horsepower: parseInt(getValueFromResults(results, 'Engine Brake (hp) From'), 10) || 0,
                    torque: 0, // Not available from NHTSA
                    fuelType: getValueFromResults(results, 'Fuel Type - Primary'),
                },
                transmission: getValueFromResults(results, 'Transmission Style'),
                drivetrain: getValueFromResults(results, 'Drive Type'),
                exteriorColor: '', // Not available from NHTSA
                interiorColor: '', // Not available from NHTSA
                mileage: 0, // Not available from NHTSA
                features: [],
                imageUrl: undefined,
            };
        } catch (error) {
            console.error('Error decoding VIN:', error);
            return null;
        }
    },

    async getRecalls(make: string, model: string, year: number): Promise<Recall[]> {
        try {
            const response = await fetch(
                `${NHTSA_RECALLS_URL}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`
            );

            if (!response.ok) {
                throw new Error(`NHTSA Recalls API error: ${response.status}`);
            }

            const data = await response.json() as NHTSARecallsResponse;

            return data.results.map((r, index) => ({
                id: `recall-${r.NHTSACampaignNumber}-${index}`,
                campaignNumber: r.NHTSACampaignNumber,
                manufacturer: r.Manufacturer,
                component: r.Component,
                summary: r.Summary,
                consequence: r.Consequence,
                remedy: r.Remedy,
                status: 'open' as const, // NHTSA doesn't provide completion status
                severity: determineSeverity(r.Consequence),
                reportDate: r.ReportReceivedDate,
                affectedVehicles: r.PotentialNumberofUnitsAffected || 0,
            }));
        } catch (error) {
            console.error('Error getting recalls:', error);
            return [];
        }
    },
};

function determineSeverity(consequence: string): 'critical' | 'high' | 'moderate' | 'low' {
    const lowerConsequence = consequence.toLowerCase();

    if (lowerConsequence.includes('fire') || lowerConsequence.includes('crash') ||
        lowerConsequence.includes('death') || lowerConsequence.includes('injury')) {
        return 'critical';
    }
    if (lowerConsequence.includes('loss of control') || lowerConsequence.includes('brake')) {
        return 'high';
    }
    if (lowerConsequence.includes('stall') || lowerConsequence.includes('warning')) {
        return 'moderate';
    }
    return 'low';
}
