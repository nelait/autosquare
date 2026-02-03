# AutoSquare Backend - MCP Server Documentation

This document explains the backend architecture, code structure, and how each component works together.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Server                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    HTTP Server (Port 8080)              │   │
│  │   /health   /api/tools   /sse (Server-Sent Events)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┴───────────────────────────┐     │
│  │                    MCP Tools                           │     │
│  │  diagnose_vehicle  │  get_repair_procedure            │     │
│  │  lookup_vehicle    │  get_recalls                     │     │
│  └───────────────────────────────────────────────────────┘     │
│                              │                                  │
│  ┌───────────────────────────┴───────────────────────────┐     │
│  │                    Services                            │     │
│  │      AI Service (OpenAI)   │   Session Service        │     │
│  └───────────────────────────────────────────────────────┘     │
│                              │                                  │
│  ┌───────────────────────────┴───────────────────────────┐     │
│  │                    Integrations                        │     │
│  │      NHTSA API (VIN/Recalls)  │  Secret Manager       │     │
│  └───────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
backend/
├── src/
│   ├── index.ts              # Main entry point - HTTP server
│   ├── config/
│   │   ├── index.ts          # Environment configuration
│   │   └── secrets.ts        # Google Secret Manager integration
│   ├── tools/
│   │   ├── index.ts          # Tool registry and dispatcher
│   │   ├── diagnoseVehicle.ts    # AI symptom analysis
│   │   ├── getRepairProcedure.ts # Repair instructions
│   │   ├── lookupVehicle.ts      # VIN decoding
│   │   └── getRecalls.ts         # Safety recalls
│   ├── services/
│   │   ├── aiService.ts      # OpenAI API wrapper
│   │   └── sessionService.ts # Session storage (BigTable)
│   ├── integrations/
│   │   └── nhtsa/
│   │       └── client.ts     # NHTSA API client
│   ├── resources/
│   │   └── index.ts          # MCP resources (health, config)
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── Dockerfile                # Docker build configuration
├── package.json
└── tsconfig.json
```

---

## Component Details

### 1. Entry Point (`index.ts`)

The main server that handles HTTP requests. Uses express to create REST endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Returns server health status |
| `/api/tools` | GET | Lists all available MCP tools |
| `/api/tools` | POST | Executes a specific tool |
| `/sse` | GET | Server-Sent Events for MCP protocol |

**Key features:**
- CORS enabled for cross-origin requests
- Graceful shutdown handling
- JSON request/response parsing

---

### 2. Configuration (`config/`)

#### `config/index.ts`
Loads environment variables and provides typed configuration:

```typescript
export const config = {
  environment: 'production' | 'development',
  port: 8080,
  gcpProject: 'autosquare-prod',
  aiProvider: 'openai',
  openaiModel: 'gpt-4o-mini',
  enableSessionStorage: false,
};
```

#### `config/secrets.ts`
Securely fetches secrets from Google Secret Manager:

```typescript
// Fetches OpenAI API key from Secret Manager
const apiKey = await getSecret(SecretNames.OPENAI_API_KEY);
```

**Caching:** Secrets are cached in memory to avoid repeated API calls.

---

### 3. MCP Tools (`tools/`)

#### Tool Registry (`tools/index.ts`)
Registers all available tools and dispatches requests:

```typescript
const tools = {
  diagnose_vehicle: diagnoseVehicleTool,
  get_repair_procedure: getRepairProcedureTool,
  lookup_vehicle: lookupVehicleTool,
  get_recalls: getRecallsTool,
};

// Dispatcher
export async function callTool(name: string, args: unknown) {
  const tool = tools[name];
  return tool.handler(args);
}
```

---

#### `diagnoseVehicle.ts`
**Purpose:** Analyzes vehicle symptoms using OpenAI to identify potential problems.

**Input:**
```json
{
  "symptoms": "Check engine light is on and rough idle",
  "vehicleInfo": {
    "year": 2020,
    "make": "Honda",
    "model": "Accord"
  }
}
```

**Output:**
```json
{
  "problems": [
    {
      "id": "prob_1",
      "name": "Faulty Oxygen Sensor",
      "description": "O2 sensor causing incorrect fuel mixture",
      "severity": "high",
      "confidence": 90,
      "estimatedCost": { "min": 100, "max": 300 }
    }
  ]
}
```

**Flow:**
1. Receives symptoms from frontend
2. Calls `aiService.analyzeSymptoms()`
3. OpenAI generates structured diagnosis
4. Returns formatted problems list

---

#### `getRepairProcedure.ts`
**Purpose:** Generates step-by-step repair instructions for a specific problem.

**Input:**
```json
{
  "problemName": "Faulty Oxygen Sensor",
  "problemDescription": "O2 sensor causing incorrect fuel mixture",
  "vehicleInfo": { "year": 2020, "make": "Honda", "model": "Accord" }
}
```

**Output:**
```json
{
  "procedure": {
    "title": "Replace Oxygen Sensor",
    "difficulty": "Intermediate",
    "estimatedTime": "1-2 hours",
    "tools": ["O2 sensor socket", "Jack stands", "Wrench set"],
    "parts": [{ "name": "Oxygen Sensor", "partNumber": "234-4587", "avgPrice": 89.99 }],
    "steps": ["Step 1...", "Step 2..."],
    "safetyWarnings": ["Let engine cool before starting"]
  }
}
```

---

#### `lookupVehicle.ts`
**Purpose:** Decodes VIN to get vehicle information using NHTSA API.

**Input:**
```json
{ "vin": "1HGBH41JXMN109186" }
```

**API Called:** `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}`

**Output:** Vehicle year, make, model, engine, transmission, etc.

---

#### `getRecalls.ts`
**Purpose:** Fetches safety recalls for a vehicle from NHTSA.

**Input:**
```json
{ "make": "Honda", "model": "Accord", "year": 2020 }
```

**API Called:** `https://api.nhtsa.gov/recalls/recallsByVehicle`

**Output:** List of recalls with descriptions, remedy, and severity.

---

### 4. Services (`services/`)

#### `aiService.ts`
Wrapper for OpenAI API calls:

```typescript
// Analyzes symptoms and returns structured problems
async function analyzeSymptoms(
  symptoms: string,
  vehicleContext?: string
): Promise<Problem[]>

// Generates repair procedure
async function generateRepairProcedure(
  problemName: string,
  problemDescription: string,
  vehicleContext?: string
): Promise<RepairProcedure>
```

**Key features:**
- Fetches API key from Secret Manager on first use
- Uses GPT-4o-mini model for cost efficiency
- JSON mode for structured responses
- Error handling with retries

---

#### `sessionService.ts`
Placeholder for BigTable session storage:

```typescript
// Save diagnosis session for analytics
await sessionService.saveSession({
  sessionId: 'uuid',
  userId: 'user123',
  symptoms: 'Check engine light...',
  problems: [...],
  latencyMs: 1500,
});
```

**Note:** Currently logs to console. BigTable integration planned for Phase 5.

---

### 5. Integrations (`integrations/`)

#### `nhtsa/client.ts`
Client for NHTSA (National Highway Traffic Safety Administration) APIs:

```typescript
// Decode VIN to get vehicle info
async function decodeVin(vin: string): Promise<VehicleInfo>

// Get recalls for a vehicle
async function getRecalls(make: string, model: string, year: number): Promise<Recall[]>
```

**APIs Used:**
- VIN Decoder: `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/`
- Recalls: `https://api.nhtsa.gov/recalls/recallsByVehicle`

---

### 6. Types (`types/index.ts`)

TypeScript interfaces for all data structures:

```typescript
interface Problem {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  confidence: number;
  symptoms: string[];
  estimatedCost: { min: number; max: number };
}

interface RepairProcedure {
  title: string;
  difficulty: string;
  estimatedTime: string;
  tools: string[];
  parts: Part[];
  steps: string[];
  safetyWarnings: string[];
}

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  engine: { type: string; displacement: string };
  transmission: string;
}

interface Recall {
  id: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  severity: 'critical' | 'high' | 'moderate';
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `8080` |
| `GCP_PROJECT` | GCP project ID | - |
| `AI_PROVIDER` | AI provider (`openai` or `vertex`) | `openai` |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4o-mini` |
| `OPENAI_API_KEY` | Direct API key (dev only) | - |
| `ENABLE_SESSION_STORAGE` | Enable BigTable storage | `false` |

---

## Deployment

### Build Docker Image
```bash
gcloud builds submit --tag gcr.io/autosquare-prod/autosquare-mcp:latest ./backend
```

### Deploy to Cloud Run
```bash
gcloud run deploy autosquare-mcp \
  --image=gcr.io/autosquare-prod/autosquare-mcp:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated
```

### Test Endpoints
```bash
# Health check
curl https://autosquare-mcp-446953879113.us-central1.run.app/health

# List tools
curl https://autosquare-mcp-446953879113.us-central1.run.app/api/tools

# Call diagnose tool
curl -X POST https://autosquare-mcp-446953879113.us-central1.run.app/api/tools \
  -H "Content-Type: application/json" \
  -d '{"tool": "diagnose_vehicle", "arguments": {"symptoms": "Engine overheating"}}'
```

---

## Adding New Tools

1. Create tool file in `tools/`:
```typescript
// tools/myNewTool.ts
export const myNewTool = {
  name: 'my_new_tool',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Parameter description' }
    },
    required: ['param1']
  },
  handler: async (args: { param1: string }) => {
    // Implementation
    return { result: 'success' };
  }
};
```

2. Register in `tools/index.ts`:
```typescript
import { myNewTool } from './myNewTool.js';

export const allTools = [
  // ... existing tools
  myNewTool
];
```

3. Rebuild and redeploy.
