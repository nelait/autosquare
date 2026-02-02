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
}

export interface EngineInfo {
    type: string;
    displacement: string;
    horsepower: number;
    torque: number;
    fuelType: string;
}

export interface VehicleLookupRequest {
    vin: string;
}

export interface VehicleLookupResponse {
    vehicle: Vehicle | null;
    error?: string;
}
