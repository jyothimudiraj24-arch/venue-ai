from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models import SearchHistory
from ..schemas import SearchHistoryItem

router = APIRouter(prefix="/api/search-history", tags=["Search History"])

@router.get("", response_model=List[SearchHistoryItem])
def get_search_history(db: Session = Depends(get_db)):
    """Return previous searches performed in the system."""
    items = db.query(SearchHistory).order_by(SearchHistory.created_at.desc()).limit(20).all()
    results = []
    for item in items:
        try:
            priorities = json.loads(item.priorities_json) if item.priorities_json else []
        except Exception:
            priorities = []

        try:
            age_groups = json.loads(item.age_groups_json) if item.age_groups_json else []
        except Exception:
            age_groups = []

        try:
            facilities = json.loads(item.facilities_json) if item.facilities_json else []
        except Exception:
            facilities = []

        results.append(SearchHistoryItem(
            id=item.id,
            event_type=item.event_type,
            event_date=item.event_date,
            city=item.city,
            area=item.area,
            guests=item.guests,
            budget=item.budget,
            organizer_type=item.organizer_type,
            priorities=priorities,
            age_groups=age_groups,
            facilities=facilities,
            kids_count=item.kids_count or 0,
            additional_preferences=item.additional_preferences,
            created_at=item.created_at,
            results_count=item.results_count or 0,
            top_venue_id=item.top_venue_id
        ))
    return results
