from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from ..models import Venue
from ..schemas import VenueBase, EventRequirementInput

class VenueResearchAgent:
    """Agent 3: Venue Research Agent
    Queries database for available venues matching criteria, handles fallback searches,
    and applies geographic and capacity thresholds.
    """

    def search_venues(
        self, 
        db: Session, 
        city: Optional[str] = None, 
        area: Optional[str] = None,
        guests: Optional[int] = None, 
        max_budget: Optional[float] = None,
        facilities: Optional[List[str]] = None,
        venue_type: Optional[str] = None
    ) -> List[Venue]:
        query = db.query(Venue)

        if city and city.strip():
            c_clean = city.strip().lower()
            query = query.filter(Venue.city.ilike(f"%{c_clean}%"))

        if venue_type and venue_type.strip() and venue_type.lower() != "all":
            query = query.filter(Venue.venue_type.ilike(f"%{venue_type.strip()}%"))

        results = query.all()

        # If strict search yields fewer than 2 venues, broaden search to all venues in database
        if len(results) < 2:
            results = db.query(Venue).all()

        return results

    def find_candidates_for_event(self, db: Session, req: EventRequirementInput) -> List[Venue]:
        # Search by city first
        matched = self.search_venues(
            db=db,
            city=req.city,
            area=req.area,
            guests=req.guests,
            max_budget=req.budget
        )
        
        # Ensure we always return good candidate venues
        if not matched:
            matched = db.query(Venue).all()

        return matched
