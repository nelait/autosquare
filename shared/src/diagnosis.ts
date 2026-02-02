// Diagnosis Types

export interface DiagnosisRequest {
    symptoms: string;
    vehicleVin?: string;
    vehicleInfo?: {
        year: number;
        make: string;
        model: string;
        engine?: string;
        mileage?: number;
    };
}

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
}

export interface RepairProcedureRequest {
    problemId: string;
    problemName: string;
    problemDescription: string;
    vehicleVin?: string;
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
