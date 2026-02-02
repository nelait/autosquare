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

export interface RecallsRequest {
    vin?: string;
    make?: string;
    model?: string;
    year?: number;
}

export interface RecallsResponse {
    recalls: Recall[];
    totalCount: number;
    openCount: number;
}
