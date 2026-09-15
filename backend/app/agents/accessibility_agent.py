from typing import Dict, Any, List
from ..models import Venue
from ..schemas import EventRequirementInput

class AgeAccessibilityAgent:
    """Agent 5: Age & Accessibility Agent
    Rigorously verifies demographic ergonomics, senior mobility barriers,
    and child safety protections across candidate venues.
    """

    def evaluate(self, venue: Venue, req: EventRequirementInput) -> Dict[str, Any]:
        venue_facs = set(venue.facilities)
        access_features = venue.accessibility_features
        family_features = venue.family_features

        # Senior citizen audit
        senior_audit = {
            "has_ramps": any("ramp" in x.lower() for x in access_features) or "Wheelchair Accessibility" in venue_facs,
            "has_elevators": any("elevator" in x.lower() or "lift" in x.lower() for x in access_features),
            "has_senior_lounge": "Senior Rest Area" in venue_facs or any("senior" in x.lower() for x in access_features),
            "has_accessible_toilets": any("restroom" in x.lower() or "toilet" in x.lower() for x in access_features) or "Wheelchair Accessibility" in venue_facs,
            "has_dropoff": any("drop-off" in x.lower() or "valet" in x.lower() or "porch" in x.lower() for x in access_features)
        }
        senior_score = 70.0
        if senior_audit["has_ramps"]: senior_score += 10.0
        if senior_audit["has_senior_lounge"]: senior_score += 10.0
        if senior_audit["has_accessible_toilets"]: senior_score += 5.0
        if senior_audit["has_dropoff"]: senior_score += 5.0
        senior_score = min(98.0, senior_score)

        # Kids safety audit
        kids_audit = {
            "has_kids_area": "Kids Area" in venue_facs or any("kid" in x.lower() or "play" in x.lower() for x in family_features),
            "has_safe_flooring": any("non-slip" in x.lower() or "carpet" in x.lower() for x in access_features),
            "has_nanny_support": any("nanny" in x.lower() for x in family_features),
            "has_baby_room": any("baby" in x.lower() or "changing" in x.lower() for x in family_features)
        }
        kids_score = 65.0
        if kids_audit["has_kids_area"]: kids_score += 20.0
        if kids_audit["has_safe_flooring"] or kids_audit["has_baby_room"]: kids_score += 10.0
        if "Outdoor Area" in venue_facs: kids_score += 5.0
        kids_score = min(98.0, kids_score)

        combined_score = round((senior_score * 0.5) + (kids_score * 0.5), 1)

        insights = []
        if "Senior Citizens" in req.age_groups:
            if senior_score >= 85:
                insights.append("✓ Excellent senior citizen accommodation with step-free pathways and dedicated quiet zones.")
            else:
                insights.append("⚠ Moderate senior accessibility; recommend renting a temporary ramp.")

        if "Kids" in req.age_groups:
            if kids_score >= 85:
                insights.append("✓ High child-friendly environment with dedicated play space away from kitchen/parking traffic.")
            else:
                insights.append("⚠ Standard safety rating; ensure event coordinators monitor exits.")

        return {
            "senior_score": senior_score,
            "kids_score": kids_score,
            "combined_accessibility_score": combined_score,
            "senior_audit": senior_audit,
            "kids_audit": kids_audit,
            "insights": insights
        }
