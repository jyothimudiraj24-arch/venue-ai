from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

# ==================== Event Requirements ====================
class EventRequirementInput(BaseModel):
    event_type: str = Field(...)
    event_date: Optional[str] = Field(None)
    city: str = Field(...)
    area: Optional[str] = Field("")
    guests: int = Field(...)
    budget: float = Field(...)
    organizer_type: str = Field(...)
    priorities: List[str] = Field(default_factory=list)
    age_groups: List[str] = Field(default_factory=list)
    kids_count: Optional[int] = Field(0)
    facilities: List[str] = Field(default_factory=list)
    additional_preferences: Optional[str] = Field("")

class RequirementAnalysisResult(BaseModel):
    is_valid: bool = True
    event_id: str
    summary: str
    key_constraints: List[str]
    identified_personas: List[str]
    budget_per_guest: float
    recommended_min_capacity: int
    recommended_max_capacity: int
    critical_facilities: List[str]
    age_special_needs: Dict[str, List[str]]
    organizer_profile_notes: str

# ==================== Venues ====================
class VenueBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    area: str
    address: Optional[str] = ""
    venue_type: str
    capacity_min: int
    capacity_max: int
    price_per_day: float
    price_per_plate: float
    rating: float
    review_count: int
    contact_phone: Optional[str] = ""
    contact_email: Optional[str] = ""
    facilities: List[str]
    images: List[str]
    video_url: Optional[str] = None
    description: Optional[str] = ""
    accessibility_features: List[str]
    family_features: List[str]
    is_demo_data: bool = True

class VenueSearchFilter(BaseModel):
    city: Optional[str] = None
    area: Optional[str] = None
    event_type: Optional[str] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    guests: Optional[int] = None
    venue_type: Optional[str] = None
    min_rating: Optional[float] = None
    facilities: Optional[List[str]] = None
    age_groups: Optional[List[str]] = None

# ==================== Comparison ====================
class VenueCompareRequest(BaseModel):
    venue_ids: List[int] = Field(..., min_length=2, max_length=4)
    event_type: Optional[str] = "Wedding"
    budget: Optional[float] = 150000.0
    guests: Optional[int] = 200
    facilities: Optional[List[str]] = []
    age_groups: Optional[List[str]] = []

class ComparisonMetric(BaseModel):
    venue_id: int
    venue_name: str
    price_total: float
    price_fit_score: float
    capacity_fit_score: float
    facilities_match_count: int
    facilities_match_percentage: float
    accessibility_score: float
    family_score: float
    overall_score: float
    pros: List[str]
    cons: List[str]

class VenueCompareResponse(BaseModel):
    metrics: List[ComparisonMetric]
    venues: List[VenueBase]
    summary_verdict: str
    best_value_venue_id: int
    best_luxury_venue_id: int
    best_family_venue_id: int

# ==================== Agent Workflow & Recommendation ====================
class AgentStepLog(BaseModel):
    step_id: int
    agent_name: str
    status: str  # "pending", "in_progress", "completed", "failed"
    message: str
    details: Optional[Dict[str, Any]] = None

class DimensionScores(BaseModel):
    budget_match_score: float
    capacity_match_score: float
    facilities_match_score: float
    accessibility_score: float
    family_comfort_score: float
    overall_match_score: float

class VenueRecommendation(BaseModel):
    venue: VenueBase
    rank: int
    ai_match_score: float
    estimated_cost: float
    scores: DimensionScores
    reasons: List[str]
    advantages: List[str]
    limitations: List[str]
    suggested_customizations: List[str]

class AgentRecommendationResponse(BaseModel):
    event_id: str
    execution_steps: List[AgentStepLog]
    best_venue: VenueRecommendation
    alternative_venues: List[VenueRecommendation]
    executive_summary: str
    workflow_completed_at: str

# ==================== Experience Preview & Floor Plan ====================
class FloorZone(BaseModel):
    id: str
    name: str
    category: str
    x: int
    y: int
    width: int
    height: int
    color: str
    icon: str
    description: str
    capacity: Optional[int] = None
    features: List[str]

class FloorPlanLayout(BaseModel):
    venue_name: str
    event_type: str
    guest_count: int
    total_area_sqft: int
    zones: List[FloorZone]
    smart_flow_notes: List[str]
    accessibility_notes: List[str]

# ==================== Event Plan ====================
class TimelineEvent(BaseModel):
    time: str
    title: str
    description: str
    zone: str
    icon: str

class KidsPlan(BaseModel):
    included: bool
    activity_zone_setup: str
    safety_measures: List[str]
    recommended_menu_items: List[str]
    entertainment_ideas: List[str]

class SeniorPlan(BaseModel):
    included: bool
    mobility_support: List[str]
    quiet_rest_zone_details: str
    seating_allocation: str
    dietary_recommendations: List[str]
    dropoff_protocol: str

class FinalEventPlanData(BaseModel):
    event_id: str
    event_title: str
    event_type: str
    event_date: Optional[str]
    city: str
    guest_count: int
    budget: float
    estimated_cost: float
    budget_variance: float
    organizer_type: str
    selected_venue: VenueBase
    alternative_venues: List[VenueBase]
    recommended_facilities: List[str]
    budget_breakdown: Dict[str, float]
    timeline: List[TimelineEvent]
    kids_plan: KidsPlan
    senior_plan: SeniorPlan
    floor_layout: FloorPlanLayout
    coordinator_checklist: List[str]
    created_at: str

# ==================== Saved Venues & History ====================
class SaveVenueRequest(BaseModel):
    venue_id: int
    notes: Optional[str] = "Saved for later review"

class SavedVenueItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    venue_id: int
    saved_at: datetime
    notes: Optional[str]
    venue: VenueBase

class SearchHistoryItem(BaseModel):
    id: int
    event_type: str
    event_date: Optional[str]
    city: str
    area: Optional[str]
    guests: int
    budget: float
    organizer_type: str
    priorities: List[str]
    age_groups: List[str]
    facilities: List[str]
    kids_count: int
    additional_preferences: Optional[str]
    created_at: datetime
    results_count: int
    top_venue_id: Optional[int]
