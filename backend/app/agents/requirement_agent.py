from ..schemas import EventRequirementInput, RequirementAnalysisResult
import uuid

class RequirementAnalysisAgent:
    """Agent 1: Requirement Analysis Agent
    Understands event requirements, normalizes constraints, identifies personas,
    and extracts critical criteria.
    """

    def analyze(self, req: EventRequirementInput) -> RequirementAnalysisResult:
        event_id = f"evt_{uuid.uuid4().hex[:8]}"
        
        # Calculate derived metrics
        budget_per_guest = round(req.budget / max(req.guests, 1), 2)
        
        # Dynamic capacity safety buffer (15% headroom)
        rec_min_capacity = max(20, int(req.guests * 0.9))
        rec_max_capacity = int(req.guests * 1.6)

        # Key constraints extraction
        constraints = []
        if req.budget < 100000:
            constraints.append(f"Strict Budget Ceiling (₹{req.budget:,.0f})")
        else:
            constraints.append(f"Flexible / Moderate Budget Tier (₹{req.budget:,.0f})")

        if req.guests > 400:
            constraints.append(f"High-Density Capacity ({req.guests} guests)")
        else:
            constraints.append(f"Medium-Scale Gathering ({req.guests} guests)")

        # Age group specific needs identification
        age_special_needs = {}
        if "Kids" in req.age_groups:
            age_special_needs["Kids"] = [
                "Safe enclosed play zone",
                "Non-sharp decor & childproofing",
                f"Dedicated kids seating capacity for ~{req.kids_count or max(10, int(req.guests * 0.12))} kids",
                "Kid-friendly non-spicy catering options"
            ]
        if "Senior Citizens" in req.age_groups:
            age_special_needs["Senior Citizens"] = [
                "100% Step-free wheelchair access or ramps",
                "Ground-floor proximity to washrooms and main hall",
                "Acoustic buffer from loud speakers / DJ",
                "Priority drop-off bay near entrance",
                "Ergonomic, cushioned seating"
            ]
        if "Teenagers" in req.age_groups:
            age_special_needs["Teenagers"] = [
                "Interactive photo booth / selfie zone",
                "High-speed Wi-Fi and sound / DJ dancefloor"
            ]

        # Personas
        personas = [f"{req.organizer_type} Planner"]
        if "Family Friendly" in req.priorities or "Family" in req.organizer_type:
            personas.append("Multi-Generational Family Host")
        if "Low Budget" in req.priorities:
            personas.append("Cost-Optimized Organizer")
        if "Premium Experience" in req.priorities or "Luxury" in req.priorities:
            personas.append("Luxury Experience Seeker")
        if "Accessibility" in req.priorities or "Senior Citizens" in req.age_groups:
            personas.append("Universal Accessibility Advocate")

        critical_facilities = list(req.facilities)
        if "Senior Citizens" in req.age_groups and "Senior Rest Area" not in critical_facilities:
            critical_facilities.append("Senior Rest Area")
        if "Kids" in req.age_groups and "Kids Area" not in critical_facilities:
            critical_facilities.append("Kids Area")

        summary = (
            f"Validated requirements for a {req.event_type} in {req.city} for {req.guests} guests "
            f"with a target budget of ₹{req.budget:,.0f} (₹{budget_per_guest}/head). "
            f"Identified {len(req.age_groups)} key demographic groups with {len(critical_facilities)} prerequisite facilities."
        )

        return RequirementAnalysisResult(
            is_valid=True,
            event_id=event_id,
            summary=summary,
            key_constraints=constraints,
            identified_personas=personas,
            budget_per_guest=budget_per_guest,
            recommended_min_capacity=rec_min_capacity,
            recommended_max_capacity=rec_max_capacity,
            critical_facilities=critical_facilities,
            age_special_needs=age_special_needs,
            organizer_profile_notes=f"Organized by {req.organizer_type}. Focus priorities: {', '.join(req.priorities) if req.priorities else 'Standard'}"
        )
