// Local Types for Backend (standalone deployment)
// These mirror the shared types for when building without workspace

// Vehicle Types
export interface Vehicle {
    vin: string;
    year: number;
    make: string;
    model: string;
    trim: string;
    engine: EngineInfo;
    transmission: string;
    drivetrain: string;
    exteriorColor: string;
    interiorColor: string;
    mileage: number;
    features: string[];
    imageUrl?: string;
    // Optional NHTSA-specific fields
    bodyClass?: string;
    vehicleType?: string;
    plantCountry?: string;
    electrificationLevel?: string;
}

export interface EngineInfo {
    type: string;
    displacement: string;
    horsepower: number;
    torque: number;
    fuelType: string;
}

export interface VehicleLookupResponse {
    vehicle: Vehicle | null;
    error?: string;
}

// Diagnosis Types
export interface Problem {
    id: string;
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'moderate' | 'low';
    confidence: number;
    symptoms: string[];
    diagnosticSteps: string[];
    estimatedCost: {
        min: number;
        max: number;
    };
    estimatedTime: string;
    source: 'openai' | 'vertexai' | 'mock';
}

export interface DiagnosisResponse {
    problems: Problem[];
    sessionId: string;
    analyzedAt: string;
    recallDataUsed?: boolean;
    recallCount?: number;
}

export interface RepairPart {
    name: string;
    partNumber: string;
    avgPrice: number;
    link?: string;
}

export interface RepairProcedure {
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
    estimatedTime: string;
    tools: string[];
    parts: RepairPart[];
    steps: string[];
    safetyWarnings: string[];
    tips: string[];
}

export interface RepairProcedureResponse {
    procedure: RepairProcedure | null;
    error?: string;
}

// Recall Types
export interface Recall {
    id: string;
    campaignNumber: string;
    manufacturer: string;
    component: string;
    summary: string;
    consequence: string;
    remedy: string;
    status: 'open' | 'completed';
    severity: 'critical' | 'high' | 'moderate' | 'low';
    reportDate: string;
    affectedVehicles: number;
}

export interface RecallsResponse {
    recalls: Recall[];
    totalCount: number;
    openCount: number;
}

// Session Types
export interface DiagnosisSession {
    sessionId: string;
    userId: string;
    vin?: string;
    symptoms: string;
    inputMethod: 'text' | 'voice';
    voiceTranscript?: string;
    problems: string;
    topProblemId?: string;
    topProblemConfidence?: number;
    aiModel: string;
    latencyMs: number;
    problemSelected?: string;
    repairProcedureViewed?: boolean;
    serviceCenterClicked?: boolean;
    userFeedback?: 'positive' | 'negative';
    startedAt: string;
    endedAt?: string;
}
