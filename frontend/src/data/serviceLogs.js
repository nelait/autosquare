// Mock Service Logs Database
export const serviceLogs = [
    {
        id: "SVC-2023-001",
        vin: "1HGBH41JXMN109186",
        date: "2023-11-15",
        mileage: 44850,
        type: "maintenance",
        category: "Oil Change",
        description: "Full synthetic oil change with filter replacement",
        technician: "Mike Johnson",
        dealer: "Honda of Downtown",
        items: [
            { name: "Synthetic Oil 0W-20 (5 qt)", partNumber: "08798-9031", cost: 45.00 },
            { name: "Oil Filter", partNumber: "15400-PLM-A02", cost: 12.50 }
        ],
        laborHours: 0.5,
        laborRate: 125,
        notes: "All fluids topped off. Brake fluid appears slightly discolored - recommend flush at next service.",
        totalCost: 120.00
    },
    {
        id: "SVC-2023-002",
        vin: "1HGBH41JXMN109186",
        date: "2023-08-22",
        mileage: 40200,
        type: "maintenance",
        category: "Brake Service",
        description: "Front brake pad replacement and rotor resurfacing",
        technician: "Carlos Rodriguez",
        dealer: "Honda of Downtown",
        items: [
            { name: "Front Brake Pads", partNumber: "45022-TBA-A01", cost: 89.00 },
            { name: "Brake Rotor Resurfacing", partNumber: "SERVICE", cost: 60.00 }
        ],
        laborHours: 1.5,
        laborRate: 125,
        notes: "Rear brakes at 60% - recommend replacement in 15,000 miles.",
        totalCost: 336.50
    },
    {
        id: "SVC-2023-003",
        vin: "1HGBH41JXMN109186",
        date: "2023-05-10",
        mileage: 35600,
        type: "repair",
        category: "Engine",
        description: "Check engine light diagnosis - O2 sensor replacement",
        technician: "Mike Johnson",
        dealer: "Honda of Downtown",
        items: [
            { name: "Oxygen Sensor (Bank 1)", partNumber: "36531-5BA-A01", cost: 185.00 },
            { name: "Diagnostic Fee", partNumber: "DIAG", cost: 95.00 }
        ],
        laborHours: 1.0,
        laborRate: 125,
        notes: "P0131 code cleared. Test drive confirmed proper operation.",
        totalCost: 405.00
    },
    {
        id: "SVC-2022-004",
        vin: "1HGBH41JXMN109186",
        date: "2022-11-28",
        mileage: 30100,
        type: "recall",
        category: "Recall",
        description: "Recall 22V-891 - Passenger airbag inflator replacement",
        technician: "Sarah Chen",
        dealer: "Honda of Downtown",
        items: [
            { name: "Passenger Airbag Inflator Assembly", partNumber: "77820-TBA-A81", cost: 0.00 }
        ],
        laborHours: 2.0,
        laborRate: 0,
        notes: "Recall service completed per TSB. All airbag systems tested and verified.",
        totalCost: 0.00
    },
    {
        id: "SVC-2023-005",
        vin: "5YJSA1E26MF123456",
        date: "2023-10-05",
        mileage: 21500,
        type: "maintenance",
        category: "Tire Service",
        description: "Tire rotation and brake inspection",
        technician: "Alex Park",
        dealer: "Tesla Service Center",
        items: [
            { name: "Tire Rotation", partNumber: "SERVICE", cost: 0.00 }
        ],
        laborHours: 0.5,
        laborRate: 150,
        notes: "All tires at 7/32\" tread depth. Brakes at 75% front, 80% rear.",
        totalCost: 75.00
    },
    {
        id: "SVC-2023-006",
        vin: "5YJSA1E26MF123456",
        date: "2023-06-18",
        mileage: 18200,
        type: "repair",
        category: "Suspension",
        description: "Air suspension compressor replacement",
        technician: "David Kim",
        dealer: "Tesla Service Center",
        items: [
            { name: "Air Suspension Compressor", partNumber: "1028665-00-A", cost: 650.00 }
        ],
        laborHours: 2.5,
        laborRate: 150,
        notes: "Customer reported vehicle lowering overnight. Compressor failed - replaced under extended warranty.",
        totalCost: 0.00
    },
    {
        id: "SVC-2023-007",
        vin: "1G1YY22G965109876",
        date: "2023-12-01",
        mileage: 8500,
        type: "maintenance",
        category: "Oil Change",
        description: "First service - oil change and multi-point inspection",
        technician: "Tom Bradley",
        dealer: "Classic Chevrolet",
        items: [
            { name: "Mobil 1 5W-30 (8 qt)", partNumber: "12345678", cost: 72.00 },
            { name: "AC Delco Oil Filter", partNumber: "PF64", cost: 15.00 }
        ],
        laborHours: 0.5,
        laborRate: 145,
        notes: "First service completed. Vehicle in excellent condition.",
        totalCost: 159.50
    },
    {
        id: "SVC-2023-008",
        vin: "WVWZZZ3CZWE123789",
        date: "2023-09-14",
        mileage: 31200,
        type: "maintenance",
        category: "Scheduled Service",
        description: "30,000 mile scheduled maintenance",
        technician: "James Wilson",
        dealer: "Ford Premier",
        items: [
            { name: "Synthetic Blend Oil (6 qt)", partNumber: "XO-5W30-6Q", cost: 55.00 },
            { name: "Oil Filter", partNumber: "FL-500S", cost: 12.00 },
            { name: "Cabin Air Filter", partNumber: "HC3Z-19N619-A", cost: 35.00 },
            { name: "Engine Air Filter", partNumber: "FA-1927", cost: 28.00 }
        ],
        laborHours: 1.5,
        laborRate: 135,
        notes: "30K service complete. Transmission fluid in good condition - defer flush to 60K.",
        totalCost: 332.50
    },
    {
        id: "SVC-2023-009",
        vin: "WBAJA5C58KB123456",
        date: "2023-07-28",
        mileage: 27500,
        type: "maintenance",
        category: "Oil Change",
        description: "Oil change and condition-based service reset",
        technician: "Hans Mueller",
        dealer: "BMW of Excellence",
        items: [
            { name: "BMW TwinPower Turbo Oil LL-01 (7 qt)", partNumber: "07-51-0-009-420", cost: 98.00 },
            { name: "BMW Oil Filter", partNumber: "11-42-7-953-129", cost: 28.00 }
        ],
        laborHours: 0.75,
        laborRate: 175,
        notes: "CBS reset performed. Next service due in 10,000 miles.",
        totalCost: 257.25
    },
    {
        id: "SVC-2023-010",
        vin: "WBAJA5C58KB123456",
        date: "2023-02-15",
        mileage: 22100,
        type: "repair",
        category: "Electrical",
        description: "Battery replacement and coding",
        technician: "Hans Mueller",
        dealer: "BMW of Excellence",
        items: [
            { name: "BMW AGM Battery 90Ah", partNumber: "61-21-7-604-822", cost: 425.00 },
            { name: "Battery Registration/Coding", partNumber: "SERVICE", cost: 95.00 }
        ],
        laborHours: 1.0,
        laborRate: 175,
        notes: "Original battery failed. New battery registered to vehicle DME.",
        totalCost: 695.00
    }
];

export const getServiceLogsByVin = (vin) => {
    const normalizedVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return serviceLogs
        .filter(s => s.vin === normalizedVin)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getServiceLogById = (id) => {
    return serviceLogs.find(s => s.id === id) || null;
};

export const getServiceLogsByType = (vin, type) => {
    return getServiceLogsByVin(vin).filter(s => s.type === type);
};

export const getTotalServiceCost = (vin) => {
    return getServiceLogsByVin(vin).reduce((sum, log) => sum + log.totalCost, 0);
};

export default serviceLogs;
