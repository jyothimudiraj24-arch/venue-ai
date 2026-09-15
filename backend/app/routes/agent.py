from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import (
    EventRequirementInput, 
    AgentRecommendationResponse, 
    FloorPlanLayout
)
from ..agents.orchestrator import AgentOrchestrator
from ..models import Venue

router = APIRouter(prefix="/api/agent", tags=["Agent Workflow"])

orchestrator = AgentOrchestrator()

@router.post("/recommend", response_model=AgentRecommendationResponse)
def execute_agentic_recommendation_pipeline(
    req: EventRequirementInput, 
    db: Session = Depends(get_db)
):
    """Execute the complete 8-Agent Agentic AI workflow and return recommendation matrices."""
    try:
        return orchestrator.run_agentic_workflow(db, req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent workflow error: {str(e)}")

@router.post("/preview-layout", response_model=FloorPlanLayout)
def generate_venue_experience_layout(
    req: EventRequirementInput,
    venue_id: int = 1,
    db: Session = Depends(get_db)
):
    """Generate dynamic 2D event floor plan preview according to event demographics."""
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        venue = db.query(Venue).first()
    return orchestrator.generate_floor_layout(venue, req)
