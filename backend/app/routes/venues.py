from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from ..database import get_db
from ..models import Venue, SavedVenue
from ..schemas import (
    VenueBase, 
    VenueSearchFilter, 
    VenueCompareRequest, 
    VenueCompareResponse, 
    SaveVenueRequest, 
    SavedVenueItem
)
from ..agents.comparison_agent import VenueComparisonAgent
from ..agents.research_agent import VenueResearchAgent

router = APIRouter(prefix="/api/venues", tags=["Venues"])

comp_agent = VenueComparisonAgent()
research_agent = VenueResearchAgent()

@router.get("", response_model=List[VenueBase])
def get_all_venues(
    city: Optional[str] = None,
    venue_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Return demo venues with optional filters."""
    query = db.query(Venue)
    if city:
        query = query.filter(Venue.city.ilike(f"%{city}%"))
    if venue_type and venue_type.lower() != "all":
        query = query.filter(Venue.venue_type.ilike(f"%{venue_type}%"))
    
    venues = query.all()
    return [VenueBase.model_validate(v) for v in venues]

@router.post("/search", response_model=List[VenueBase])
def search_venues(
    filters: VenueSearchFilter,
    db: Session = Depends(get_db)
):
    """Search venues based on requirements and filter parameters."""
    query = db.query(Venue)

    if filters.city and filters.city.strip():
        query = query.filter(Venue.city.ilike(f"%{filters.city.strip()}%"))

    if filters.area and filters.area.strip():
        query = query.filter(Venue.area.ilike(f"%{filters.area.strip()}%"))

    if filters.venue_type and filters.venue_type.strip() and filters.venue_type.lower() != "all":
        query = query.filter(Venue.venue_type.ilike(f"%{filters.venue_type.strip()}%"))

    if filters.guests:
        # Flexible headroom: accommodate if capacity_max is within reasonable range
        query = query.filter(Venue.capacity_max >= int(filters.guests * 0.7))

    if filters.max_budget:
        # Allow venues where daily rental is within 1.25x budget
        query = query.filter(Venue.price_per_day <= filters.max_budget * 1.25)

    if filters.min_rating:
        query = query.filter(Venue.rating >= filters.min_rating)

    results = query.all()

    # Facility filtering in memory if requested
    if filters.facilities and len(filters.facilities) > 0:
        req_facs = set(filters.facilities)
        # Prefer venues matching at least 50% of requested facilities
        results.sort(
            key=lambda v: len(set(v.facilities).intersection(req_facs)), 
            reverse=True
        )

    # Fallback to general list if no strict match
    if not results:
        results = db.query(Venue).all()

    return [VenueBase.model_validate(v) for v in results]

@router.get("/saved", response_model=List[SavedVenueItem])
def get_saved_venues(db: Session = Depends(get_db)):
    """Return all saved bookmark venues."""
    saved_items = db.query(SavedVenue).order_by(SavedVenue.saved_at.desc()).all()
    results = []
    for item in saved_items:
        if item.venue:
            results.append(SavedVenueItem(
                id=item.id,
                venue_id=item.venue_id,
                saved_at=item.saved_at,
                notes=item.notes,
                venue=VenueBase.model_validate(item.venue)
            ))
    return results

@router.post("/save", response_model=SavedVenueItem)
def save_venue(data: SaveVenueRequest, db: Session = Depends(get_db)):
    """Save / bookmark a venue."""
    venue = db.query(Venue).filter(Venue.id == data.venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    # Check if already saved
    existing = db.query(SavedVenue).filter(SavedVenue.venue_id == data.venue_id).first()
    if existing:
        return SavedVenueItem(
            id=existing.id,
            venue_id=existing.venue_id,
            saved_at=existing.saved_at,
            notes=existing.notes,
            venue=VenueBase.model_validate(venue)
        )

    saved_entry = SavedVenue(
        venue_id=data.venue_id,
        notes=data.notes
    )
    db.add(saved_entry)
    db.commit()
    db.refresh(saved_entry)

    return SavedVenueItem(
        id=saved_entry.id,
        venue_id=saved_entry.venue_id,
        saved_at=saved_entry.saved_at,
        notes=saved_entry.notes,
        venue=VenueBase.model_validate(venue)
    )

@router.delete("/saved/{venue_id}")
def remove_saved_venue(venue_id: int, db: Session = Depends(get_db)):
    """Remove a saved venue."""
    entry = db.query(SavedVenue).filter(SavedVenue.venue_id == venue_id).first()
    if entry:
        db.delete(entry)
        db.commit()
    return {"status": "success", "message": f"Venue {venue_id} removed from saved list"}

@router.post("/compare", response_model=VenueCompareResponse)
def compare_venues(req: VenueCompareRequest, db: Session = Depends(get_db)):
    """Compare 2 to 4 selected venues."""
    venues = db.query(Venue).filter(Venue.id.in_(req.venue_ids)).all()
    if len(venues) < 2:
        raise HTTPException(status_code=400, detail="Please select at least 2 valid venues to compare.")

    return comp_agent.compare(
        venues=venues,
        budget=req.budget or 150000.0,
        guests=req.guests or 200,
        required_facilities=req.facilities or [],
        age_groups=req.age_groups or []
    )

@router.get("/{venue_id}", response_model=VenueBase)
def get_venue_details(venue_id: int, db: Session = Depends(get_db)):
    """Return detailed information for a single venue."""
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return VenueBase.model_validate(venue)
