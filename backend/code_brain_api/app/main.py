from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import playbooks

app = FastAPI(title="CodeBrain API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(playbooks.router, prefix="/api/v1", tags=["playbooks"])

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
