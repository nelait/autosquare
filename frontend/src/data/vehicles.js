// Mock Vehicles Database
export const vehicles = [
  {
    vin: "1HGBH41JXMN109186",
    make: "Honda",
    model: "Accord",
    year: 2021,
    trim: "Sport 2.0T",
    engine: {
      type: "2.0L Turbocharged I4",
      horsepower: 252,
      torque: "273 lb-ft",
      fuelType: "Premium Unleaded"
    },
    transmission: "10-Speed Automatic",
    drivetrain: "FWD",
    bodyType: "Sedan",
    exteriorColor: "Platinum White Pearl",
    interiorColor: "Black",
    mileage: 45230,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    msrp: 31090,
    features: [
      "Apple CarPlay",
      "Android Auto",
      "Honda Sensing Suite",
      "Heated Front Seats",
      "Dual-Zone Climate Control",
      "LED Headlights"
    ]
  },
  {
    vin: "5YJSA1E26MF123456",
    make: "Tesla",
    model: "Model S",
    year: 2022,
    trim: "Long Range",
    engine: {
      type: "Dual Motor Electric",
      horsepower: 670,
      torque: "N/A",
      fuelType: "Electric"
    },
    transmission: "Single-Speed Direct Drive",
    drivetrain: "AWD",
    bodyType: "Sedan",
    exteriorColor: "Pearl White Multi-Coat",
    interiorColor: "White",
    mileage: 22150,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    msrp: 94990,
    features: [
      "Autopilot",
      "17\" Touchscreen",
      "Premium Audio",
      "Glass Roof",
      "Heated All Seats",
      "Supercharger Access"
    ]
  },
  {
    vin: "1G1YY22G965109876",
    make: "Chevrolet",
    model: "Corvette",
    year: 2023,
    trim: "Stingray 3LT",
    engine: {
      type: "6.2L V8 LT2",
      horsepower: 495,
      torque: "470 lb-ft",
      fuelType: "Premium Unleaded"
    },
    transmission: "8-Speed Dual-Clutch",
    drivetrain: "RWD",
    bodyType: "Coupe",
    exteriorColor: "Torch Red",
    interiorColor: "Adrenaline Red",
    mileage: 8750,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    msrp: 79995,
    features: [
      "Performance Data Recorder",
      "Magnetic Ride Control",
      "Head-Up Display",
      "Bose Audio",
      "Carbon Fiber Interior",
      "Performance Exhaust"
    ]
  },
  {
    vin: "WVWZZZ3CZWE123789",
    make: "Ford",
    model: "F-150",
    year: 2023,
    trim: "Lariat",
    engine: {
      type: "3.5L EcoBoost V6",
      horsepower: 400,
      torque: "500 lb-ft",
      fuelType: "Regular Unleaded"
    },
    transmission: "10-Speed Automatic",
    drivetrain: "4WD",
    bodyType: "Crew Cab Pickup",
    exteriorColor: "Antimatter Blue",
    interiorColor: "Black",
    mileage: 32400,
    image: "https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=800&q=80",
    msrp: 62395,
    features: [
      "Ford Co-Pilot360",
      "Pro Power Onboard",
      "SYNC 4",
      "Heated/Cooled Seats",
      "Max Tow Package",
      "360-Degree Camera"
    ]
  },
  {
    vin: "WBAJA5C58KB123456",
    make: "BMW",
    model: "5 Series",
    year: 2022,
    trim: "540i xDrive",
    engine: {
      type: "3.0L TwinPower Turbo I6",
      horsepower: 335,
      torque: "369 lb-ft",
      fuelType: "Premium Unleaded"
    },
    transmission: "8-Speed Sport Automatic",
    drivetrain: "AWD",
    bodyType: "Sedan",
    exteriorColor: "Alpine White",
    interiorColor: "Cognac",
    mileage: 28900,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    msrp: 62895,
    features: [
      "iDrive 7.0",
      "Gesture Control",
      "Driving Assistance Pro",
      "Harman Kardon Audio",
      "Soft-Close Doors",
      "Ambient Lighting"
    ]
  }
];

export const getVehicleByVin = (vin) => {
  const normalizedVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return vehicles.find(v => v.vin === normalizedVin) || null;
};

export const searchVehicleByPartialVin = (partialVin) => {
  const normalized = partialVin.toUpperCase();
  return vehicles.filter(v => v.vin.includes(normalized));
};

export default vehicles;
