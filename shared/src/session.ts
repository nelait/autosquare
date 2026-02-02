// Session Types for BigTable storage

export interface DiagnosisSession {
    sessionId: string;
    userId: string;
    vin?: string;

    // Input
    symptoms: string;
    inputMethod: 'text' | 'voice';
    voiceTranscript?: string;

    // Analysis
    problems: string; // JSON string of Problem[]
    topProblemId?: string;
    topProblemConfidence?: number;
    aiModel: string;
    latencyMs: number;

    // Outcome
    problemSelected?: string;
    repairProcedureViewed?: boolean;
    serviceCenterClicked?: boolean;
    userFeedback?: 'positive' | 'negative';

    // Timestamps
    startedAt: string;
    endedAt?: string;
}

export interface SessionMetrics {
    totalSessions: number;
    averageLatency: number;
    topProblems: { problemId: string; count: number }[];
    conversionRate: number;
}
