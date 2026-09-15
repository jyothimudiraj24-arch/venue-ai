import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

def test_get_venues():
    res = client.get("/api/venues")
    assert res.status_code == 200
    venues = res.json()
    assert len(venues) > 0
    assert any("Grand Imperial" in v["name"] for v in venues)

def test_event_analysis():
    payload = {
        "event_type": "Wedding",
        "event_date": "2026-11-20",
        "city": "Hyderabad",
        "area": "Gachibowli",
        "guests": 200,
        "budget": 150000.0,
        "organizer_type": "Family",
        "priorities": ["Family Friendly", "Accessibility", "Low Budget"],
        "age_groups": ["Kids", "Adults", "Senior Citizens"],
        "kids_count": 25,
        "facilities": ["Parking", "Catering", "Stage", "Wheelchair Accessibility"],
        "additional_preferences": "Wheelchair ramps and quiet senior lounge required."
    }
    res = client.post("/api/events/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_valid"] is True
    assert "Senior Citizens" in data["age_special_needs"]

def test_agent_recommendation_pipeline():
    payload = {
        "event_type": "Wedding",
        "event_date": "2026-11-20",
        "city": "Hyderabad",
        "area": "Gachibowli",
        "guests": 200,
        "budget": 150000.0,
        "organizer_type": "Family",
        "priorities": ["Family Friendly", "Accessibility", "Low Budget"],
        "age_groups": ["Kids", "Adults", "Senior Citizens"],
        "kids_count": 25,
        "facilities": ["Parking", "Catering", "Stage", "Wheelchair Accessibility"]
    }
    res = client.post("/api/agent/recommend", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["execution_steps"]) == 8
    assert data["best_venue"] is not None
    assert data["best_venue"]["ai_match_score"] > 80.0

def test_compare_venues():
    payload = {
        "venue_ids": [1, 2],
        "event_type": "Wedding",
        "budget": 150000.0,
        "guests": 200,
        "facilities": ["Parking", "Catering"],
        "age_groups": ["Kids", "Senior Citizens"]
    }
    res = client.post("/api/venues/compare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["metrics"]) == 2

def test_save_venue():
    payload = {"venue_id": 1, "notes": "Top pick for Hyderabad wedding"}
    res = client.post("/api/venues/save", json=payload)
    assert res.status_code == 200
    
    get_res = client.get("/api/venues/saved")
    assert get_res.status_code == 200
    assert len(get_res.json()) >= 1

if __name__ == "__main__":
    pytest.main(["-v", "backend/test_backend.py"])
