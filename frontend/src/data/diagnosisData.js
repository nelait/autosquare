// AI Diagnosis Knowledge Base
export const diagnosisData = {
    symptoms: [
        {
            id: "SYM-001",
            keywords: ["check engine light", "cel", "engine light", "warning light", "malfunction indicator"],
            problems: ["PROB-001", "PROB-002", "PROB-003", "PROB-008"]
        },
        {
            id: "SYM-002",
            keywords: ["hard start", "won't start", "no start", "cranks but won't start", "starting problem", "engine won't turn over"],
            problems: ["PROB-001", "PROB-004", "PROB-005"]
        },
        {
            id: "SYM-003",
            keywords: ["rough idle", "shaking", "vibration at idle", "engine shakes", "rough running"],
            problems: ["PROB-002", "PROB-003", "PROB-006"]
        },
        {
            id: "SYM-004",
            keywords: ["stalling", "stalls", "dies while driving", "engine cuts off", "loses power"],
            problems: ["PROB-001", "PROB-004", "PROB-007"]
        },
        {
            id: "SYM-005",
            keywords: ["brake noise", "squeaking brakes", "grinding brakes", "brake squeal", "brakes grinding"],
            problems: ["PROB-009", "PROB-010"]
        },
        {
            id: "SYM-006",
            keywords: ["battery drain", "dead battery", "battery dies", "won't hold charge", "parasitic drain"],
            problems: ["PROB-005", "PROB-011"]
        },
        {
            id: "SYM-007",
            keywords: ["overheating", "temperature high", "coolant warning", "hot engine", "smoke from hood"],
            problems: ["PROB-012", "PROB-013", "PROB-014"]
        },
        {
            id: "SYM-008",
            keywords: ["transmission slipping", "hard shifting", "won't shift", "jerky shifting", "transmission problems"],
            problems: ["PROB-015", "PROB-016"]
        },
        {
            id: "SYM-009",
            keywords: ["oil leak", "burning oil", "oil consumption", "oil smell", "low oil"],
            problems: ["PROB-017", "PROB-018"]
        },
        {
            id: "SYM-010",
            keywords: ["ac not working", "no cold air", "ac blowing warm", "air conditioning problem", "climate control issue"],
            problems: ["PROB-019", "PROB-020"]
        }
    ],

    problems: [
        {
            id: "PROB-001",
            name: "Faulty Fuel Pump",
            description: "The fuel pump may be failing or has failed, preventing proper fuel delivery to the engine.",
            severity: "high",
            confidence: 85,
            symptoms: ["Hard starting", "Engine stalling", "Loss of power", "Check engine light"],
            diagnosticSteps: [
                "Check fuel pressure using a fuel pressure gauge",
                "Listen for fuel pump priming sound when turning key to ON",
                "Check for fuel pump relay operation",
                "Inspect fuel pump fuse"
            ],
            estimatedCost: { min: 400, max: 800 },
            estimatedTime: "2-3 hours"
        },
        {
            id: "PROB-002",
            name: "Worn Spark Plugs",
            description: "Spark plugs may be worn or fouled, causing misfires and poor engine performance.",
            severity: "moderate",
            confidence: 75,
            symptoms: ["Rough idle", "Check engine light", "Poor fuel economy", "Hesitation during acceleration"],
            diagnosticSteps: [
                "Visual inspection of spark plugs",
                "Check spark plug gap",
                "Test ignition coils",
                "Scan for misfire codes"
            ],
            estimatedCost: { min: 100, max: 300 },
            estimatedTime: "1-2 hours"
        },
        {
            id: "PROB-003",
            name: "Faulty O2 Sensor",
            description: "One or more oxygen sensors may be malfunctioning, affecting fuel mixture and emissions.",
            severity: "moderate",
            confidence: 70,
            symptoms: ["Check engine light", "Poor fuel economy", "Rough idle", "Failed emissions test"],
            diagnosticSteps: [
                "Scan for O2 sensor related codes",
                "Check O2 sensor voltage readings",
                "Inspect wiring and connections",
                "Compare upstream vs downstream readings"
            ],
            estimatedCost: { min: 150, max: 400 },
            estimatedTime: "1-2 hours"
        },
        {
            id: "PROB-004",
            name: "Failing Fuel Injectors",
            description: "Fuel injectors may be clogged or leaking, causing improper fuel delivery.",
            severity: "moderate",
            confidence: 65,
            symptoms: ["Hard starting", "Engine stalling", "Rough idle", "Poor performance"],
            diagnosticSteps: [
                "Perform fuel injector balance test",
                "Check for injector pulse with noid light",
                "Inspect for fuel leaks around injectors",
                "Test injector resistance"
            ],
            estimatedCost: { min: 200, max: 600 },
            estimatedTime: "2-4 hours"
        },
        {
            id: "PROB-005",
            name: "Weak or Dead Battery",
            description: "The battery may be weak, dead, or has internal cell damage.",
            severity: "low",
            confidence: 90,
            symptoms: ["No start", "Slow cranking", "Electrical issues", "Battery light on"],
            diagnosticSteps: [
                "Test battery voltage (should be 12.6V+)",
                "Perform load test",
                "Check for corrosion on terminals",
                "Test alternator output"
            ],
            estimatedCost: { min: 100, max: 300 },
            estimatedTime: "30 minutes - 1 hour"
        },
        {
            id: "PROB-006",
            name: "Vacuum Leak",
            description: "There may be a vacuum leak in the intake manifold or related components.",
            severity: "moderate",
            confidence: 60,
            symptoms: ["Rough idle", "High idle", "Check engine light", "Hissing sound"],
            diagnosticSteps: [
                "Visual inspection of vacuum hoses",
                "Smoke test the intake system",
                "Check intake manifold gaskets",
                "Spray brake cleaner around suspected areas"
            ],
            estimatedCost: { min: 75, max: 400 },
            estimatedTime: "1-3 hours"
        },
        {
            id: "PROB-007",
            name: "Mass Air Flow Sensor Issue",
            description: "The MAF sensor may be dirty or failing, causing incorrect air measurement.",
            severity: "moderate",
            confidence: 70,
            symptoms: ["Engine stalling", "Poor acceleration", "Check engine light", "Surging"],
            diagnosticSteps: [
                "Clean MAF sensor with appropriate cleaner",
                "Check MAF sensor readings with scan tool",
                "Inspect air filter and intake tract",
                "Test MAF voltage at idle and under load"
            ],
            estimatedCost: { min: 50, max: 250 },
            estimatedTime: "30 minutes - 1 hour"
        },
        {
            id: "PROB-008",
            name: "Catalytic Converter Failure",
            description: "The catalytic converter may be clogged or has failed internally.",
            severity: "high",
            confidence: 55,
            symptoms: ["Check engine light", "Reduced power", "Rotten egg smell", "Failed emissions"],
            diagnosticSteps: [
                "Check for P0420/P0430 codes",
                "Inspect exhaust back pressure",
                "Check pre and post catalyst O2 readings",
                "Visual inspection for damage"
            ],
            estimatedCost: { min: 500, max: 2500 },
            estimatedTime: "2-4 hours"
        },
        {
            id: "PROB-009",
            name: "Worn Brake Pads",
            description: "Brake pads have worn to minimum thickness and need replacement.",
            severity: "high",
            confidence: 95,
            symptoms: ["Squeaking brakes", "Grinding noise", "Longer stopping distance", "Brake warning light"],
            diagnosticSteps: [
                "Visual inspection of brake pad thickness",
                "Check brake pad wear indicators",
                "Inspect rotors for scoring",
                "Measure rotor thickness"
            ],
            estimatedCost: { min: 150, max: 400 },
            estimatedTime: "1-2 hours per axle"
        },
        {
            id: "PROB-010",
            name: "Warped Brake Rotors",
            description: "Brake rotors have warped due to heat or wear, causing pulsation.",
            severity: "moderate",
            confidence: 80,
            symptoms: ["Brake pulsation", "Vibration when braking", "Uneven pad wear", "Steering wheel shake"],
            diagnosticSteps: [
                "Measure rotor runout with dial indicator",
                "Check rotor thickness variation",
                "Inspect for hot spots or discoloration",
                "Test drive to replicate symptoms"
            ],
            estimatedCost: { min: 200, max: 600 },
            estimatedTime: "2-3 hours per axle"
        },
        {
            id: "PROB-011",
            name: "Parasitic Battery Drain",
            description: "There is an electrical component draining the battery when the vehicle is off.",
            severity: "moderate",
            confidence: 75,
            symptoms: ["Dead battery", "Battery dies overnight", "Slow cranking after sitting"],
            diagnosticSteps: [
                "Perform parasitic draw test",
                "Pull fuses one at a time to isolate circuit",
                "Check for aftermarket accessories",
                "Inspect for interior lights staying on"
            ],
            estimatedCost: { min: 100, max: 500 },
            estimatedTime: "1-3 hours"
        },
        {
            id: "PROB-012",
            name: "Thermostat Failure",
            description: "The thermostat may be stuck closed or open, affecting engine temperature.",
            severity: "high",
            confidence: 80,
            symptoms: ["Overheating", "Running cold", "Poor heater output", "Temperature gauge issues"],
            diagnosticSteps: [
                "Check coolant temperature with scan tool",
                "Feel upper/lower radiator hoses",
                "Observe thermostat housing for operation",
                "Test thermostat in boiling water"
            ],
            estimatedCost: { min: 100, max: 300 },
            estimatedTime: "1-2 hours"
        },
        {
            id: "PROB-013",
            name: "Coolant Leak",
            description: "There is a leak in the cooling system causing loss of coolant.",
            severity: "high",
            confidence: 85,
            symptoms: ["Overheating", "Sweet smell", "Visible leak", "Low coolant warning"],
            diagnosticSteps: [
                "Pressure test cooling system",
                "UV dye test for small leaks",
                "Inspect all hoses and connections",
                "Check water pump weep hole"
            ],
            estimatedCost: { min: 50, max: 800 },
            estimatedTime: "1-4 hours depending on location"
        },
        {
            id: "PROB-014",
            name: "Failed Water Pump",
            description: "The water pump has failed or is failing, preventing proper coolant circulation.",
            severity: "critical",
            confidence: 70,
            symptoms: ["Overheating", "Coolant leak", "Grinding noise from pump", "Steam from engine"],
            diagnosticSteps: [
                "Check for coolant leak at water pump",
                "Inspect belt for proper tension",
                "Feel for water pump shaft play",
                "Listen for bearing noise"
            ],
            estimatedCost: { min: 300, max: 800 },
            estimatedTime: "2-4 hours"
        },
        {
            id: "PROB-015",
            name: "Low Transmission Fluid",
            description: "Transmission fluid level is low due to leak or consumption.",
            severity: "high",
            confidence: 85,
            symptoms: ["Hard shifting", "Slipping", "Delayed engagement", "Transmission whine"],
            diagnosticSteps: [
                "Check transmission fluid level and condition",
                "Inspect for external leaks",
                "Check pan gasket and seals",
                "Review fluid condition for burnt smell"
            ],
            estimatedCost: { min: 50, max: 200 },
            estimatedTime: "30 minutes - 1 hour"
        },
        {
            id: "PROB-016",
            name: "Failing Transmission Solenoids",
            description: "One or more shift solenoids may be failing, causing shifting problems.",
            severity: "high",
            confidence: 65,
            symptoms: ["Hard shifting", "Stuck in gear", "Check engine light", "Limp mode"],
            diagnosticSteps: [
                "Scan for transmission codes",
                "Check solenoid resistance values",
                "Monitor solenoid operation with scan tool",
                "Test transmission fluid pressure"
            ],
            estimatedCost: { min: 200, max: 600 },
            estimatedTime: "2-4 hours"
        },
        {
            id: "PROB-017",
            name: "Worn Valve Cover Gasket",
            description: "The valve cover gasket is leaking oil onto the engine.",
            severity: "moderate",
            confidence: 90,
            symptoms: ["Oil leak", "Burning oil smell", "Oil on spark plugs", "Visible leak on engine"],
            diagnosticSteps: [
                "Visual inspection of valve cover area",
                "Clean and monitor for fresh oil",
                "Check torque on valve cover bolts",
                "Inspect PCV system for excessive pressure"
            ],
            estimatedCost: { min: 100, max: 400 },
            estimatedTime: "1-3 hours"
        },
        {
            id: "PROB-018",
            name: "PCV Valve Failure",
            description: "The PCV valve is stuck or clogged, causing oil consumption or pressure issues.",
            severity: "low",
            confidence: 70,
            symptoms: ["Oil consumption", "Oil leaks", "Rough idle", "Whistling sound"],
            diagnosticSteps: [
                "Check PCV valve operation",
                "Inspect for oil in intake",
                "Test crankcase vacuum",
                "Replace if stuck or clogged"
            ],
            estimatedCost: { min: 25, max: 100 },
            estimatedTime: "15-30 minutes"
        },
        {
            id: "PROB-019",
            name: "Low AC Refrigerant",
            description: "The AC system is low on refrigerant, likely due to a leak.",
            severity: "low",
            confidence: 85,
            symptoms: ["AC blowing warm", "Weak cooling", "AC clutch cycling rapidly"],
            diagnosticSteps: [
                "Check AC pressure readings",
                "Inspect for visible leaks",
                "UV dye test for leaks",
                "Check compressor clutch operation"
            ],
            estimatedCost: { min: 100, max: 400 },
            estimatedTime: "1-2 hours"
        },
        {
            id: "PROB-020",
            name: "Failed AC Compressor",
            description: "The AC compressor has failed and needs replacement.",
            severity: "moderate",
            confidence: 60,
            symptoms: ["No cold air", "AC clutch not engaging", "Strange noises when AC on", "AC light blinking"],
            diagnosticSteps: [
                "Check compressor clutch engagement",
                "Measure compressor amp draw",
                "Listen for internal compressor noise",
                "Check for metal debris in system"
            ],
            estimatedCost: { min: 500, max: 1200 },
            estimatedTime: "3-5 hours"
        }
    ],

    repairProcedures: {
        "PROB-001": {
            id: "PROC-001",
            problemId: "PROB-001",
            title: "Fuel Pump Replacement",
            difficulty: "Intermediate",
            tools: [
                "Fuel line disconnect tool",
                "Socket set",
                "Fuel pressure gauge",
                "Jack and jack stands",
                "Fire extinguisher"
            ],
            parts: [
                { name: "Fuel Pump Module Assembly", partNumber: "17040-SNA-A01", avgPrice: 285.00, link: "https://parts.honda.com" },
                { name: "Fuel Tank Lock Ring", partNumber: "17045-SNA-A00", avgPrice: 25.00, link: "https://parts.honda.com" },
                { name: "Fuel Tank Seal", partNumber: "17048-SNA-A01", avgPrice: 15.00, link: "https://parts.honda.com" }
            ],
            steps: [
                "Disconnect negative battery cable and relieve fuel system pressure",
                "Raise vehicle and support on jack stands",
                "Disconnect fuel lines at tank using disconnect tool",
                "Support fuel tank with a jack and remove tank straps",
                "Lower tank slightly and disconnect electrical connector",
                "Remove fuel tank and place on clean surface",
                "Remove lock ring using appropriate tool and extract old pump",
                "Install new pump with new seal and lock ring",
                "Reinstall tank and reconnect all lines",
                "Lower vehicle, reconnect battery, and test for leaks"
            ],
            safetyWarnings: [
                "Work in a well-ventilated area away from ignition sources",
                "Wear safety glasses and chemical-resistant gloves",
                "Have a fire extinguisher nearby",
                "Relieve fuel pressure before disconnecting any lines"
            ],
            videoLink: "https://www.youtube.com/results?search_query=fuel+pump+replacement",
            estimatedTime: "2-3 hours"
        },
        "PROB-002": {
            id: "PROC-002",
            problemId: "PROB-002",
            title: "Spark Plug Replacement",
            difficulty: "Beginner",
            tools: [
                "Spark plug socket (5/8\" or 16mm typically)",
                "Torque wrench",
                "Gap gauge",
                "Dielectric grease",
                "Ratchet and extension"
            ],
            parts: [
                { name: "Iridium Spark Plugs (set of 4)", partNumber: "12290-R70-A01", avgPrice: 60.00, link: "https://www.ngk.com" }
            ],
            steps: [
                "Allow engine to cool completely",
                "Remove engine cover if applicable",
                "Disconnect ignition coil connectors and remove coils",
                "Use spark plug socket to remove old spark plugs",
                "Inspect old plugs for wear patterns and deposits",
                "Check gap on new plugs (verify specification)",
                "Apply small amount of anti-seize to threads",
                "Hand-thread new plugs to avoid cross-threading",
                "Torque to specification (typically 13-20 ft-lbs)",
                "Reinstall ignition coils and engine cover"
            ],
            safetyWarnings: [
                "Never work on hot engine - risk of burns",
                "Do not over-torque spark plugs",
                "Use anti-seize sparingly to avoid contamination"
            ],
            videoLink: "https://www.youtube.com/results?search_query=spark+plug+replacement",
            estimatedTime: "30 minutes - 1 hour"
        },
        "PROB-009": {
            id: "PROC-009",
            problemId: "PROB-009",
            title: "Brake Pad Replacement",
            difficulty: "Beginner-Intermediate",
            tools: [
                "Lug wrench",
                "Jack and jack stands",
                "C-clamp or brake caliper tool",
                "Socket set",
                "Wire brush",
                "Brake cleaner"
            ],
            parts: [
                { name: "Ceramic Brake Pads (Front)", partNumber: "45022-TBA-A01", avgPrice: 65.00, link: "https://www.rockauto.com" },
                { name: "Brake Hardware Kit", partNumber: "45019-TBA-A00", avgPrice: 15.00, link: "https://www.rockauto.com" },
                { name: "Brake Grease", partNumber: "SERVICE", avgPrice: 8.00, link: "https://www.rockauto.com" }
            ],
            steps: [
                "Loosen lug nuts while vehicle is on ground",
                "Raise vehicle and support on jack stands",
                "Remove wheel to access brake caliper",
                "Remove caliper bolts and hang caliper with wire",
                "Remove old brake pads and hardware",
                "Inspect rotor condition - replace if needed",
                "Compress caliper piston using C-clamp",
                "Install new hardware and brake pads",
                "Reinstall caliper and torque bolts to spec",
                "Reinstall wheel and lower vehicle"
            ],
            safetyWarnings: [
                "Never work under vehicle on jack alone - use jack stands",
                "Check brake fluid level after compressing pistons",
                "Avoid inhaling brake dust - use brake cleaner",
                "Bed in new pads per manufacturer instructions"
            ],
            videoLink: "https://www.youtube.com/results?search_query=brake+pad+replacement",
            estimatedTime: "1-2 hours per axle"
        }
    }
};

// AI Analysis Function - simulates AI matching symptoms to problems
export const analyzeSymptoms = (userInput) => {
    const inputLower = userInput.toLowerCase();
    const matchedProblems = new Map();

    // Find matching symptoms
    diagnosisData.symptoms.forEach(symptom => {
        symptom.keywords.forEach(keyword => {
            if (inputLower.includes(keyword)) {
                symptom.problems.forEach(problemId => {
                    const existing = matchedProblems.get(problemId) || { count: 0, keywords: [] };
                    existing.count++;
                    existing.keywords.push(keyword);
                    matchedProblems.set(problemId, existing);
                });
            }
        });
    });

    // Get problem details and calculate adjusted confidence
    const results = [];
    matchedProblems.forEach((match, problemId) => {
        const problem = diagnosisData.problems.find(p => p.id === problemId);
        if (problem) {
            // Adjust confidence based on number of matching keywords
            const adjustedConfidence = Math.min(
                problem.confidence + (match.count - 1) * 5,
                99
            );
            results.push({
                ...problem,
                matchedKeywords: match.keywords,
                adjustedConfidence
            });
        }
    });

    // Sort by adjusted confidence
    return results.sort((a, b) => b.adjustedConfidence - a.adjustedConfidence);
};

export const getRepairProcedure = (problemId) => {
    return diagnosisData.repairProcedures[problemId] || null;
};

export const getProblemById = (problemId) => {
    return diagnosisData.problems.find(p => p.id === problemId) || null;
};

export default diagnosisData;
