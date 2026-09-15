from typing import List, Dict, Any
from ..schemas import (
    EventRequirementInput, 
    RequirementAnalysisResult, 
    VenueRecommendation, 
    VenueBase
)
from ..models import Venue

class RecommendationExplanationAgent:
    """Agent 8: Recommendation Explanation Agent
    Produces natural language explanations, lists advantages and limitations,
    and constructs executive justification summaries.
    """

    def explain(
        self, 
        evaluated_item: Dict[str, Any], 
        rank: int, 
        req: EventRequirementInput, 
        analysis: RequirementAnalysisResult
    ) -> VenueRecommendation:
        venue: Venue = evaluated_item["venue"]
        scores = evaluated_item["scores"]
        est_cost = evaluated_item["est_cost"]
        budget_res = evaluated_item["budget_res"]
        demo_res = evaluated_item["demo_res"]

        reasons = []
        advantages = []
        limitations = []
        customizations = []

        # Why AI Selected This Venue
        if est_cost <= req.budget:
            reasons.append(f"Fits well within the target budget (Estimated ₹{est_cost:,.0f} vs ₹{req.budget:,.0f} budget)")
        else:
            reasons.append(f"Premium value match at ₹{est_cost:,.0f} with superior amenities")

        if venue.capacity_min <= req.guests <= venue.capacity_max:
            reasons.append(f"Optimal capacity alignment for {req.guests} guests (Max capacity: {venue.capacity_max})")

        if req.city.lower() in venue.city.lower():
            reasons.append(f"Matches preferred location in {venue.city} ({venue.area})")

        if "Kids" in req.age_groups and demo_res["kids_audit"]["has_kids_area"]:
            reasons.append("Equipped with dedicated, secure kids activity amenities")

        if "Senior Citizens" in req.age_groups and demo_res["senior_audit"]["has_ramps"]:
            reasons.append("Features barrier-free wheelchair ramps and senior-friendly rest zones")

        # Advantages
        advantages.append(f"High customer satisfaction rating of {venue.rating}★ across {venue.review_count}+ verified events.")
        if "Parking" in venue.facilities:
            advantages.append("Spacious dedicated parking with direct valet drop-off corridor.")
        if "Catering" in venue.facilities:
            advantages.append("In-house multi-cuisine culinary team with customizable dietary menus.")
        if "Air Conditioning" in venue.facilities:
            advantages.append("Fully climate-controlled indoor acoustic hall.")
        if len(venue.accessibility_features) > 0:
            advantages.append(f"Accessibility features: {', '.join(venue.accessibility_features[:3])}.")

        # Limitations
        if est_cost > req.budget:
            limitations.append(f"Budget variance: Requires ₹{est_cost - req.budget:,.0f} over initial target.")
        if venue.capacity_max - req.guests < 50:
            limitations.append("Peak seating capacity will be nearly filled; careful floor zoning required.")
        if not demo_res["kids_audit"]["has_kids_area"] and "Kids" in req.age_groups:
            limitations.append("Lacks built-in play equipment; recommend arranging modular soft play kits.")
        if len(limitations) == 0:
            limitations.append("Popular venue date slots fill up quickly; early deposit is advised.")

        # Suggestions
        customizations.append(f"Reserve front-row seating block with direct line-of-sight for senior family members.")
        if "Kids" in req.age_groups:
            customizations.append("Position kids creative desk on the left perimeter away from buffet hot stations.")
        customizations.append("Coordinate dual wireless microphones for stage announcements and toast speeches.")

        venue_base = VenueBase.model_validate(venue)

        return VenueRecommendation(
            venue=venue_base,
            rank=rank,
            ai_match_score=scores.overall_match_score,
            estimated_cost=est_cost,
            scores=scores,
            reasons=reasons[:6],
            advantages=advantages[:5],
            limitations=limitations[:3],
            suggested_customizations=customizations
        )
