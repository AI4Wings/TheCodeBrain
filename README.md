# TheCodeBrain

A code analysis tool with FastAPI backend and React frontend for analyzing code changes and determining UI impacts.

## Features
- Multi-agent system using LangGraph for intelligent code analysis
- Human-in-the-loop task planning and execution
- Code analysis for UI impacts and compatibility testing
- Interactive task execution workflow
- Playbook management for standardized analysis

## Deployment

### Backend Setup

1. Install Python dependencies:
```bash
cd backend/code_brain_api
pip install -r requirements.txt
```

2. Start the FastAPI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. The OpenAPI documentation can be accessed at `http://localhost:8000/docs`.

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend/code_brain_ui
pnpm install
```

2. Configure environment:
Create a `.env` file in `frontend/code_brain_ui` with:
```
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
pnpm dev
```

The UI will be available at `http://localhost:5173`.

## Architecture

### Backend
- FastAPI: Modern, high-performance framework with automatic OpenAPI documentation
- LangGraph: Framework for building multi-agent systems with human-in-the-loop capabilities
- In-memory task and playbook storage for development
- RESTful API endpoints for task management and code analysis

### Frontend
- React + TypeScript for type-safe development
- Vite for fast development and optimized builds
- shadcn/ui for consistent and accessible UI components
- Real-time task execution monitoring

## Environment Variables

### Backend
No environment variables required for basic setup.

### Frontend
- `VITE_API_URL`: URL of the backend API server (default: http://localhost:8000)
