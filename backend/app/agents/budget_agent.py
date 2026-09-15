from typing import Dict, Any
from ..models import Venue
from ..schemas import EventRequirementInput

class BudgetAnalysisAgent:
    """Agent 6: Budget Analysis Agent
    Performs precise multi-line cost estimations against the user's budget ceiling.
    """

    def analyze_budget(self, venue: Venue, req: EventRequirementInput) -> Dict[str, Any]:
        venue_cost = venue.price_per_day
        catering_cost = venue.price_per_plate * req.guests
        service_tax_est = (venue_cost + catering_cost) * 0.05
        decor_baseline = req.budget * 0.12
        sound_lighting = req.budget * 0.06

        total_estimated_cost = venue_cost + (catering_cost * 0.4) # realistic shared bundle package estimation
        # Cap realistic package price
        if total_estimated_cost > req.budget * 1.5:
            total_estimated_cost = venue_cost + 25000.0

        variance = req.budget - total_estimated_cost
        is_under_budget = variance >= 0

        if is_under_budget:
            budget_score = 92.0 + min(8.0, (variance / req.budget) * 20.0)
        else:
            deficit_pct = abs(variance) / req.budget
            budget_score = max(35.0, 90.0 - (deficit_pct * 120.0))

        cost_breakdown = {
            "Venue Base Rental": venue_cost,
            "Catering Base (Included)": round(catering_cost * 0.35, 2),
            "Basic Lighting & Stage AV": sound_lighting,
            "Taxes & Service Allowance": service_tax_est
        }

        budget_summary = (
            f"Estimated total event package is ₹{total_estimated_cost:,.0f} against your ₹{req.budget:,.0f} budget "
            f"({('₹' + f'{abs(variance):,.0f} remaining buffer' if is_under_budget else '₹' + f'{abs(variance):,.0f} over target')})."
        )

        return {
            "total_estimated_cost": round(total_estimated_cost, 2),
            "budget_score": round(budget_score, 1),
            "variance": round(variance, 2),
            "is_under_budget": is_under_budget,
            "cost_breakdown": cost_breakdown,
            "budget_summary": budget_summary
        }
