import datetime
import json
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    city = Column(String(100), nullable=False, index=True)
    area = Column(String(150), nullable=False)
    address = Column(String(300), nullable=True)
    venue_type = Column(String(100), nullable=False)  # Banquet Hall, Convention Center, Lawn / Open Air, Resort, 5-Star Hotel, Auditorium, Rooftop
    capacity_min = Column(Integer, default=50)
    capacity_max = Column(Integer, nullable=False)
    price_per_day = Column(Float, nullable=False)
    price_per_plate = Column(Float, default=500.0)
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=120)
    contact_phone = Column(String(50), default="+91 98765 43210")
    contact_email = Column(String(100), default="events@smartvenue.ai")
    
    # Stored as JSON strings
    facilities_json = Column(Text, default="[]")
    images_json = Column(Text, default="[]")
    video_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    accessibility_json = Column(Text, default="[]")
    family_features_json = Column(Text, default="[]")
    is_demo_data = Column(Boolean, default=True)

    @property
    def facilities(self):
        try:
            return json.loads(self.facilities_json)
        except Exception:
            return []

    @property
    def images(self):
        try:
            return json.loads(self.images_json)
        except Exception:
            return []

    @property
    def accessibility_features(self):
        try:
            return json.loads(self.accessibility_json)
        except Exception:
            return []

    @property
    def family_features(self):
        try:
            return json.loads(self.family_features_json)
        except Exception:
            return []


class SavedVenue(Base):
    __tablename__ = "saved_venues"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(Text, nullable=True)
    
    venue = relationship("Venue")


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)
    event_date = Column(String(50), nullable=True)
    city = Column(String(100), nullable=False)
    area = Column(String(150), nullable=True)
    guests = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    organizer_type = Column(String(100), nullable=False)
    
    priorities_json = Column(Text, default="[]")
    age_groups_json = Column(Text, default="[]")
    facilities_json = Column(Text, default="[]")
    kids_count = Column(Integer, default=0)
    additional_preferences = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    results_count = Column(Integer, default=0)
    top_venue_id = Column(Integer, nullable=True)


class EventPlan(Base):
    __tablename__ = "event_plans"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(100), unique=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    event_title = Column(String(200), nullable=False)
    event_type = Column(String(100), nullable=False)
    event_date = Column(String(50), nullable=True)
    guest_count = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    estimated_cost = Column(Float, nullable=False)
    organizer_type = Column(String(100), nullable=True)
    
    facilities_json = Column(Text, default="[]")
    kids_plan_json = Column(Text, default="{}")
    senior_plan_json = Column(Text, default="{}")
    layout_config_json = Column(Text, default="{}")
    timeline_json = Column(Text, default="[]")
    alternative_venue_ids_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    venue = relationship("Venue")
