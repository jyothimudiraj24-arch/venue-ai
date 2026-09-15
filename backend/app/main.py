import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .seed_data import seed_venues
from .routes import events, venues, agent, history

# Ensure database tables and initial seed data exist at import time
try:
    Base.metadata.create_all(bind=engine)
    seed_venues()
except Exception as e:
    print(f"[SmartVenue AI] Startup DB Init error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[SmartVenue AI] Server running and verified.")
    yield
    # Shutdown
    print("[SmartVenue AI] Server shutting down.")

app = FastAPI(
    title="SmartVenue AI API",
    description="Agentic AI-Based Intelligent Event Planning and Decision-Making System API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(events.router)
app.include_router(venues.router)
app.include_router(agent.router)
app.include_router(history.router)

@app.get("/")
def root():
    return {
        "system": "SmartVenue AI API",
        "status": "online",
        "version": "1.0.0",
        "description": "Agentic AI-Based Intelligent Event Planning and Decision-Making System",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SmartVenue AI Backend"}
