from typing import List, Dict, Any
from ..models import Venue
from ..schemas import ComparisonMetric, VenueCompareResponse, VenueBase

class VenueComparisonAgent:
    """Agent 4: Venue Comparison Agent
    Calculates detailed multi-attribute metric comparisons between 2-4 candidate venues.
    """

    def compare(
        self, 
        venues: List[Venue], 
        budget: float, 
        guests: int, 
        required_facilities: List[str],
        age_groups: List[str]
    ) -> VenueCompareResponse:
        metrics: List[ComparisonMetric] = []

        for v in venues:
            # 1. Price Fit
            total_est = v.price_per_day + (v.price_per_plate * guests * 0.8) # estimated catering combo
            if total_est <= budget:
                price_fit = 95.0 + min(5.0, ((budget - total_est) / budget) * 10)
            elif total_est <= budget * 1.15:
                price_fit = 80.0
            else:
                price_fit = max(40.0, 100.0 - ((total_est - budget) / budget) * 100)

            # 2. Capacity Fit
            if v.capacity_min <= guests <= v.capacity_max:
                cap_fit = 95.0
            elif guests < v.capacity_min:
                cap_fit = 75.0
            else:
                cap_fit = max(30.0, 100.0 - ((guests - v.capacity_max) / v.capacity_max) * 100)

            # 3. Facilities Match
            venue_facs = set(v.facilities)
            req_set = set(required_facilities) if required_facilities else set()
            match_count = len(venue_facs.intersection(req_set)) if req_set else len(venue_facs)
            match_pct = (match_count / max(len(req_set), 1)) * 100 if req_set else 90.0

            # 4. Accessibility Score
            has_wheelchair = "Wheelchair Accessibility" in venue_facs or any("ramp" in x.lower() or "wheelchair" in x.lower() for x in v.accessibility_features)
            has_senior = "Senior Rest Area" in venue_facs or any("senior" in x.lower() for x in v.accessibility_features)
            access_score = 95.0 if (has_wheelchair and has_senior) else (80.0 if (has_wheelchair or has_senior) else 60.0)

            # 5. Family Score
            has_kids = "Kids Area" in venue_facs or any("kid" in x.lower() for x in v.family_features)
            family_score = 96.0 if (has_kids and has_senior) else (82.0 if (has_kids or has_senior) else 65.0)

            overall = round((price_fit * 0.3) + (cap_fit * 0.25) + (min(match_pct, 100) * 0.2) + (access_score * 0.15) + (v.rating * 2.0), 1)

            # Pros & Cons
            pros = []
            cons = []
            if total_est <= budget:
                pros.append(f"Highly cost-effective (Est: ₹{total_est:,.0f} vs ₹{budget:,.0f} budget)")
            else:
                cons.append(f"Slightly above target budget (Est: ₹{total_est:,.0f})")

            if v.capacity_max >= guests * 1.2:
                pros.append(f"Spacious comfort headroom for {guests} guests (Max: {v.capacity_max})")
            elif v.capacity_max < guests:
                cons.append(f"Capacity tighter than ideal for {guests} guests")

            if v.rating >= 4.8:
                pros.append(f"Exceptional {v.rating}★ user satisfaction rating ({v.review_count}+ reviews)")

            if has_wheelchair:
                pros.append("Full ramp & barrier-free wheelchair accessibility")
            if has_kids:
                pros.append("Dedicated safe play arena for children")

            if not has_kids and "Kids" in age_groups:
                cons.append("Lacks dedicated enclosed children's activity space")
            if not has_wheelchair and "Senior Citizens" in age_groups:
                cons.append("Requires manual wheelchair ramp arrangements")

            metrics.append(ComparisonMetric(
                venue_id=v.id,
                venue_name=v.name,
                price_total=round(total_est, 2),
                price_fit_score=round(price_fit, 1),
                capacity_fit_score=round(cap_fit, 1),
                facilities_match_count=match_count,
                facilities_match_percentage=round(min(match_pct, 100.0), 1),
                accessibility_score=round(access_score, 1),
                family_score=round(family_score, 1),
                overall_score=overall,
                pros=pros[:4],
                cons=cons[:3] if cons else ["Standard commercial terms apply"]
            ))

        # Determine best awards
        best_overall = max(metrics, key=lambda m: m.overall_score) if metrics else None
        best_val = min(metrics, key=lambda m: m.price_total) if metrics else None
        best_fam = max(metrics, key=lambda m: m.family_score) if metrics else None

        venue_bases = [VenueBase.model_validate(v) for v in venues]

        return VenueCompareResponse(
            metrics=metrics,
            venues=venue_bases,
            summary_verdict=f"Comparative analysis indicates '{best_overall.venue_name if best_overall else 'Selected Venue'}' provides the most harmonious balance of budget containment, demographic safety, and spatial capacity.",
            best_value_venue_id=best_val.venue_id if best_val else venues[0].id,
            best_luxury_venue_id=best_overall.venue_id if best_overall else venues[0].id,
            best_family_venue_id=best_fam.venue_id if best_fam else venues[0].id
        )
