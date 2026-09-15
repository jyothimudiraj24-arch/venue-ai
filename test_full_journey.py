import httpx
import sys

# Configure UTF-8 for console output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def test_full_journey():
    client = httpx.Client(base_url=BASE_URL, timeout=20.0)

    print("==================================================")
    print("SMARTVENUE AI - COMPREHENSIVE END-TO-END SYSTEM TEST")
    print("==================================================")

    # 1. Health & Root
    r = client.get("/health")
    assert r.status_code == 200, f"Health failed: {r.text}"
    print("[PASS] Health Check Passed:", r.json())

    # 2. Analyze Event Requirements
    req_payload = {
        "event_type": "Wedding",
        "event_date": "2026-11-20",
        "city": "Hyderabad",
        "area": "Gachibowli / Banjara Hills",
        "guests": 200,
        "budget": 150000.0,
        "organizer_type": "Family",
        "priorities": ["Family Friendly", "Accessibility", "Low Budget"],
        "age_groups": ["Kids", "Adults", "Senior Citizens"],
        "kids_count": 25,
        "facilities": ["Parking", "Catering", "Stage", "Wheelchair Accessibility"],
        "additional_preferences": "Wheelchair ramps and quiet senior lounge required."
    }
    r = client.post("/api/events/analyze", json=req_payload)
    assert r.status_code == 200, f"Analyze failed: {r.text}"
    analysis = r.json()
    print(f"[PASS] Event Analysis Agent Passed: Event ID = {analysis['event_id']}, Budget/Guest = Rs.{analysis['budget_per_guest']}")

    # 3. Search Venues
    r = client.post("/api/venues/search", json={"city": "Hyderabad", "guests": 200, "max_budget": 150000.0})
    assert r.status_code == 200, f"Search failed: {r.text}"
    venues = r.json()
    print(f"[PASS] Venue Research Agent Passed: Found {len(venues)} matching venues in Hyderabad")

    # 4. Get Venue Details
    v_id = venues[0]["id"]
    r = client.get(f"/api/venues/{v_id}")
    assert r.status_code == 200, f"Get venue failed: {r.text}"
    venue_detail = r.json()
    print(f"[PASS] Venue Details Passed: {venue_detail['name']} (Rating: {venue_detail['rating']} stars)")

    # 5. Compare Venues
    r = client.post("/api/venues/compare", json={
        "venue_ids": [venues[0]["id"], venues[1]["id"]],
        "event_type": "Wedding",
        "budget": 150000.0,
        "guests": 200,
        "facilities": ["Parking", "Catering"],
        "age_groups": ["Kids", "Senior Citizens"]
    })
    assert r.status_code == 200, f"Compare failed: {r.text}"
    compare_res = r.json()
    print(f"[PASS] Venue Comparison Agent Passed: {len(compare_res['metrics'])} venues compared. Best Value ID: {compare_res['best_value_venue_id']}")

    # 6. Execute 8-Agent Workflow Recommendation
    r = client.post("/api/agent/recommend", json=req_payload)
    assert r.status_code == 200, f"Agent recommend failed: {r.text}"
    agent_res = r.json()
    best_venue = agent_res["best_venue"]
    print(f"[PASS] 8-Agent Autonomous Pipeline Passed: Top Pick = '{best_venue['venue']['name']}' (AI Match Score = {best_venue['ai_match_score']}%)")
    print(f"  * Execution steps executed: {len(agent_res['execution_steps'])}")
    print(f"  * Reason breakdown items: {len(best_venue['reasons'])}")

    # 7. Generate 2D Experience Layout
    r = client.post(f"/api/agent/preview-layout?venue_id={best_venue['venue']['id']}", json=req_payload)
    assert r.status_code == 200, f"Preview layout failed: {r.text}"
    layout = r.json()
    print(f"[PASS] 2D Spatial Experience Preview Passed: {len(layout['zones'])} spatial zones generated ({', '.join(z['name'] for z in layout['zones'][:3])}...)")

    # 8. Save Venue
    r = client.post("/api/venues/save", json={"venue_id": best_venue["venue"]["id"], "notes": "Top wedding choice"})
    assert r.status_code == 200, f"Save venue failed: {r.text}"
    print("[PASS] Save Venue Passed")

    # 9. Get Saved Venues
    r = client.get("/api/venues/saved")
    assert r.status_code == 200, f"Get saved venues failed: {r.text}"
    print(f"[PASS] Saved Venues Retrieval Passed: {len(r.json())} bookmarks")

    # 10. Search History
    r = client.get("/api/search-history")
    assert r.status_code == 200, f"Search history failed: {r.text}"
    print(f"[PASS] Search History Retrieval Passed: {len(r.json())} logs")

    # 11. Final Event Plan
    r = client.get(f"/api/events/{analysis['event_id']}/plan", params={
        "venue_id": best_venue["venue"]["id"],
        "city": "Hyderabad",
        "guests": 200,
        "budget": 150000.0,
        "event_type": "Wedding",
        "organizer_type": "Family"
    })
    assert r.status_code == 200, f"Final event plan failed: {r.text}"
    plan = r.json()
    print(f"[PASS] Final Event Plan Generation Passed: '{plan['event_title']}' with {len(plan['timeline'])} timeline items & coordinator checklist")

    print("\n==================================================")
    print("ALL 11 PIPELINE STAGES & API CONTRACTS PASSED 100%!")
    print("==================================================")

if __name__ == "__main__":
    test_full_journey()
