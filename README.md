# AutoSquare - AI Vehicle Intelligence Platform

A monorepo containing the frontend React application and backend MCP server for automotive diagnostics.

## Project Structure

```
autosquare/
├── frontend/          # React + Vite frontend application
├── backend/           # MCP Server (Node.js + TypeScript)
├── shared/            # Shared TypeScript types
└── infrastructure/    # Deployment configurations
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- (Optional) Docker for containerized development

### Installation

```bash
# Install all dependencies (workspaces)
npm install

# Or install each workspace separately
npm install --workspace=frontend
npm install --workspace=backend
npm install --workspace=shared
```

### Development

```bash
# Run frontend only
npm run dev

# Run backend only
npm run dev:backend

# Run both (requires concurrently)
npm run dev:all
```

### Frontend (React + Vite)

```bash
cd frontend
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend (MCP Server)

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys

npm run dev      # Start with hot reload
npm run build    # Compile TypeScript
npm start        # Run compiled server
```

## MCP Tools

The backend exposes the following MCP tools:

| Tool | Description |
|------|-------------|
| `diagnose_vehicle` | AI-powered symptom analysis |
| `get_repair_procedure` | Detailed repair instructions |
| `lookup_vehicle` | VIN decoding via NHTSA |
| `get_recalls` | Safety recall information |

## Technology Stack

**Frontend:**
- React 18
- Vite 5
- React Router 6

**Backend:**
- Node.js 20
- TypeScript 5
- MCP SDK
- OpenAI / Vertex AI
- Google Cloud BigTable (for sessions)

## Deployment

See `infrastructure/` for Cloud Run deployment configurations.

## License

Private - All rights reserved.
