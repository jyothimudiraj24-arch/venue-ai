from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import EventRequirementInput, RequirementAnalysisResult, FinalEventPlanData
from ..agents.requirement_agent import RequirementAnalysisAgent
from ..agents.orchestrator import AgentOrchestrator
from ..models import Venue

router = APIRouter(prefix="/api/events", tags=["Events"])

req_agent = RequirementAnalysisAgent()
orchestrator = AgentOrchestrator()

@router.post("/analyze", response_model=RequirementAnalysisResult)
def analyze_event_requirements(req: EventRequirementInput):
    """Analyze and validate event and organizer requirements."""
    try:
        return req_agent.analyze(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{event_id}/plan", response_model=FinalEventPlanData)
def get_event_plan(
    event_id: str, 
    venue_id: int = 1,
    city: str = "Hyderabad",
    guests: int = 200,
    budget: float = 150000.0,
    event_type: str = "Wedding",
    organizer_type: str = "Family",
    db: Session = Depends(get_db)
):
    """Return the final structured event plan."""
    try:
        # Create requirement input from params or defaults
        req = EventRequirementInput(
            event_type=event_type,
            city=city,
            guests=guests,
            budget=budget,
            organizer_type=organizer_type,
            age_groups=["Kids", "Adults", "Senior Citizens"],
            facilities=["Parking", "Catering", "Stage", "Wheelchair Accessibility"]
        )
        return orchestrator.generate_full_event_plan(db, req, venue_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
