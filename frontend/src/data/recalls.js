// Mock Recalls Database
export const recalls = [
    {
        id: "RCL-2023-001",
        vin: "1HGBH41JXMN109186",
        campaignNumber: "23V-456",
        component: "Fuel System",
        summary: "Fuel pump may fail without warning",
        description: "The fuel pump module may contain a defective impeller that can deform over time, potentially causing the fuel pump to fail. If the fuel pump fails, the engine may stall or fail to start, increasing the risk of a crash.",
        remedy: "Dealers will replace the fuel pump module, free of charge.",
        status: "open",
        severity: "critical",
        manufacturedDate: "2020-01-15",
        recallDate: "2023-06-20",
        affectedUnits: 245000
    },
    {
        id: "RCL-2022-045",
        vin: "1HGBH41JXMN109186",
        campaignNumber: "22V-891",
        component: "Airbags",
        summary: "Passenger airbag inflator may rupture",
        description: "In the event of a crash necessitating deployment of the front airbags, these inflators may rupture due to propellant degradation occurring after long-term exposure to high absolute humidity, high temperatures, and high temperature cycling.",
        remedy: "Dealers will replace the front passenger airbag inflator, free of charge.",
        status: "completed",
        severity: "critical",
        manufacturedDate: "2019-03-10",
        recallDate: "2022-08-15",
        affectedUnits: 1200000
    },
    {
        id: "RCL-2023-089",
        vin: "5YJSA1E26MF123456",
        campaignNumber: "23V-201",
        component: "Software",
        summary: "Touchscreen display may become unresponsive",
        description: "The center touchscreen display of certain vehicles may become unresponsive to touch and voice commands. This condition may affect the backup camera and turn signal functionality when operating as a side repeater camera.",
        remedy: "An over-the-air (OTA) software update will be deployed to address this issue.",
        status: "open",
        severity: "moderate",
        manufacturedDate: "2022-01-01",
        recallDate: "2023-09-10",
        affectedUnits: 89000
    },
    {
        id: "RCL-2023-112",
        vin: "1G1YY22G965109876",
        campaignNumber: "23V-334",
        component: "Suspension",
        summary: "Front suspension toe link separation",
        description: "The front suspension toe links may fracture, which could result in a sudden change in vehicle handling and increase the risk of a crash.",
        remedy: "Dealers will replace the front suspension toe links with redesigned parts, free of charge.",
        status: "open",
        severity: "high",
        manufacturedDate: "2022-06-01",
        recallDate: "2023-11-01",
        affectedUnits: 12500
    },
    {
        id: "RCL-2022-067",
        vin: "WVWZZZ3CZWE123789",
        campaignNumber: "22V-567",
        component: "Brakes",
        summary: "Brake fluid may leak from master cylinder",
        description: "The brake master cylinder internal seal may leak brake fluid into the brake booster. If brake fluid leak continues, it could cause brake pedal feel changes and increase the risk of a crash.",
        remedy: "Dealers will replace the brake master cylinder, free of charge.",
        status: "completed",
        severity: "high",
        manufacturedDate: "2021-09-20",
        recallDate: "2022-04-30",
        affectedUnits: 340000
    },
    {
        id: "RCL-2023-145",
        vin: "WBAJA5C58KB123456",
        campaignNumber: "23V-789",
        component: "Electrical",
        summary: "Battery cable connection may loosen",
        description: "The negative battery cable bolt may loosen over time, potentially causing electrical issues including the engine stalling while driving.",
        remedy: "Dealers will inspect and tighten the battery cable connection, and replace if necessary, free of charge.",
        status: "open",
        severity: "moderate",
        manufacturedDate: "2021-04-15",
        recallDate: "2023-12-05",
        affectedUnits: 67000
    }
];

export const getRecallsByVin = (vin) => {
    const normalizedVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return recalls.filter(r => r.vin === normalizedVin);
};

export const getRecallById = (id) => {
    return recalls.find(r => r.id === id) || null;
};

export const getOpenRecalls = (vin) => {
    return getRecallsByVin(vin).filter(r => r.status === 'open');
};

export default recalls;
