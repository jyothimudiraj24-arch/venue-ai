from typing import List, Dict, Any, Tuple
from ..models import Venue
from ..schemas import (
    EventRequirementInput, 
    RequirementAnalysisResult, 
    VenueRecommendation, 
    DimensionScores, 
    VenueBase
)
from .accessibility_agent import AgeAccessibilityAgent
from .budget_agent import BudgetAnalysisAgent

class DecisionMakingAgent:
    """Agent 7: Decision-Making Agent
    Synthesizes multidimensional scores, ranks candidates, and selects the optimal venue.
    """

    def __init__(self):
        self.access_agent = AgeAccessibilityAgent()
        self.budget_agent = BudgetAnalysisAgent()

    def rank_and_select(
        self, 
        candidates: List[Venue], 
        req: EventRequirementInput, 
        analysis: RequirementAnalysisResult
    ) -> Tuple[VenueRecommendation, List[VenueRecommendation]]:
        
        evaluated_venues = []

        for venue in candidates:
            # 1. Budget dimension
            budget_res = self.budget_agent.analyze_budget(venue, req)
            b_score = budget_res["budget_score"]
            est_cost = budget_res["total_estimated_cost"]

            # 2. Capacity dimension
            if venue.capacity_min <= req.guests <= venue.capacity_max:
                c_score = 96.0
            elif req.guests < venue.capacity_min:
                c_score = 80.0
            else:
                c_score = max(40.0, 95.0 - ((req.guests - venue.capacity_max) / venue.capacity_max) * 100)

            # 3. Facilities dimension
            venue_facs = set(venue.facilities)
            req_facs = set(req.facilities) if req.facilities else set()
            if req_facs:
                matched_cnt = len(venue_facs.intersection(req_facs))
                f_score = min(100.0, (matched_cnt / len(req_facs)) * 100.0)
            else:
                f_score = 90.0

            # 4. Accessibility & Family dimensions
            demo_res = self.access_agent.evaluate(venue, req)
            acc_score = demo_res["senior_score"] if "Senior Citizens" in req.age_groups else 85.0
            fam_score = demo_res["kids_score"] if "Kids" in req.age_groups else 88.0

            # Weighted overall score calculation
            # Weights adjust if organizer emphasizes Budget or Luxury or Family
            w_budget = 0.30
            w_capacity = 0.25
            w_facilities = 0.20
            w_acc = 0.15
            w_fam = 0.10

            if "Low Budget" in req.priorities:
                w_budget += 0.10
                w_facilities -= 0.05
                w_capacity -= 0.05
            if "Accessibility" in req.priorities:
                w_acc += 0.10
                w_budget -= 0.05
                w_capacity -= 0.05
            if "Family Friendly" in req.priorities:
                w_fam += 0.10
                w_capacity -= 0.05
                w_budget -= 0.05

            overall = (
                (b_score * w_budget) +
                (c_score * w_capacity) +
                (f_score * w_facilities) +
                (acc_score * w_acc) +
                (fam_score * w_fam)
            )
            # Add rating boost (0-5 stars = 0-2.5 pts)
            overall = min(99.4, round(overall + (venue.rating * 0.5), 1))

            scores = DimensionScores(
                budget_match_score=round(b_score, 1),
                capacity_match_score=round(c_score, 1),
                facilities_match_score=round(f_score, 1),
                accessibility_score=round(acc_score, 1),
                family_comfort_score=round(fam_score, 1),
                overall_match_score=overall
            )

            evaluated_venues.append({
                "venue": venue,
                "overall_score": overall,
                "scores": scores,
                "est_cost": est_cost,
                "budget_res": budget_res,
                "demo_res": demo_res
            })

        # Sort descending by overall score
        evaluated_venues.sort(key=lambda x: x["overall_score"], reverse=True)

        return evaluated_venues
