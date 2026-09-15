from typing import Dict, Any, List
from ..schemas import EventRequirementInput, RequirementAnalysisResult, TimelineEvent, KidsPlan, SeniorPlan

class EventPlanningAgent:
    """Agent 2: Event Planning Agent
    Plans the structural tasks, space zoning allocations, multi-generational safety plans,
    and stage-by-stage timelines based on event type.
    """

    def plan_event(self, req: EventRequirementInput, analysis: RequirementAnalysisResult) -> Dict[str, Any]:
        # Generate event timeline
        timeline = self._generate_timeline(req.event_type)
        
        # Generate kids care plan
        kids_plan = KidsPlan(
            included="Kids" in req.age_groups,
            activity_zone_setup="Safe soft-mat sensory zone with interactive coloring, face painting, and ball pit away from heavy traffic corridors." if "Kids" in req.age_groups else "Standard seating arrangement.",
            safety_measures=[
                "Dedicated supervisor/childminder perimeter check",
                "Rounded-corner furniture & non-toxic decorative items",
                "First aid kit and allergy-conscious snack station"
            ] if "Kids" in req.age_groups else [],
            recommended_menu_items=[
                "Mini sliders & mild cheese bites", "Fresh fruit skewers", "Vanilla & chocolate cake pops", "Fresh fruit juices"
            ] if "Kids" in req.age_groups else [],
            entertainment_ideas=[
                "Magic show / puppet performance (45 mins)", "Balloon twisting artist", "Interactive crafting desk"
            ] if "Kids" in req.age_groups else []
        )

        # Generate senior citizen plan
        senior_plan = SeniorPlan(
            included="Senior Citizens" in req.age_groups,
            mobility_support=[
                "Dedicated ramp entrance with gentle 1:12 slope",
                "Reserved wheelchair transit bays and direct golf-cart support from parking",
                "Non-skid carpet runners across all corridors"
            ] if "Senior Citizens" in req.age_groups else [],
            quiet_rest_zone_details="Acoustically isolated lounge equipped with plush reclined seating, climate control set to comfortable 24°C, and water/tea dispenser." if "Senior Citizens" in req.age_groups else "Standard hall seating.",
            seating_allocation="Front-to-mid rows with direct line of sight to stage, placed at least 15 feet away from primary acoustic subwoofers." if "Senior Citizens" in req.age_groups else "Open seating.",
            dietary_recommendations=[
                "Low-sodium, mild spice vegetarian options", "Fresh steamed appetizers", "Sugar-free dessert selections", "Warm herbal beverages"
            ] if "Senior Citizens" in req.age_groups else [],
            dropoff_protocol="Porte-cochère direct drive-in lane with zero curb steps to registration foyer." if "Senior Citizens" in req.age_groups else "Standard main gate drop-off."
        )

        tasks = [
            "1. Match and reserve verified venue with adequate capacity buffer.",
            "2. Confirm catering menu accommodating multi-generational dietary preferences.",
            "3. Coordinate staging, audiovisual sound checks, and ambient lighting.",
            "4. Establish dedicated zones: Kids Play, Senior Rest Lounge, Buffet Counters, Reception.",
            "5. Implement arrival valet and barrier-free accessibility checkpoints."
        ]

        return {
            "timeline": timeline,
            "kids_plan": kids_plan,
            "senior_plan": senior_plan,
            "planning_tasks": tasks,
            "budget_allocation_template": self._get_budget_breakdown(req.budget, req.event_type)
        }

    def _generate_timeline(self, event_type: str) -> List[TimelineEvent]:
        et = event_type.lower()
        if "wedding" in et:
            return [
                TimelineEvent(time="04:30 PM", title="Vendor Setup & Venue Inspection", description="Audio/visual checks, floral stage setup, and catering buffet staging.", zone="Main Stage & Catering", icon="Clock"),
                TimelineEvent(time="05:30 PM", title="Guest Arrival & Welcome Drink", description="Traditional welcome, registration foyer greetings, and welcome refreshments.", zone="Reception / Entry", icon="UserCheck"),
                TimelineEvent(time="06:30 PM", title="Main Ceremony & Rituals", description="Traditional rituals on stage, exchanging of garlands, and photo opportunities.", zone="Stage & Main Seating", icon="Heart"),
                TimelineEvent(time="08:00 PM", title="Grand Dinner & Live Music", description="Multi-cuisine buffet service with gentle instrumental melodies.", zone="Food Area", icon="Utensils"),
                TimelineEvent(time="09:30 PM", title="Family Photo Session & Farewell", description="Group photography on illuminated stage and distribution of return gifts.", zone="Stage / Photo Zone", icon="Camera")
            ]
        elif "conference" in et or "corporate" in et:
            return [
                TimelineEvent(time="09:00 AM", title="Registration & Morning Coffee", description="Badge collection, welcome beverage, and networking.", zone="Reception / Entry", icon="Coffee"),
                TimelineEvent(time="10:00 AM", title="Keynote Address & Presentations", description="Opening address with projector and digital mic setup.", zone="Stage & Main Seating", icon="Presentation"),
                TimelineEvent(time="01:00 PM", title="Networking Luncheon", description="Executive buffet lunch in dining pavilion.", zone="Food Area", icon="Utensils"),
                TimelineEvent(time="02:30 PM", title="Panel Discussions & Q&A", description="Interactive session with audience mic routing.", zone="Stage & Main Seating", icon="MessageSquare"),
                TimelineEvent(time="04:30 PM", title="High Tea & Closing Remarks", description="Concluding thoughts, sponsor appreciation, and evening tea.", zone="Food Area", icon="Coffee")
            ]
        elif "birthday" in et or "party" in et:
            return [
                TimelineEvent(time="05:00 PM", title="Guest Arrival & Fun Activities", description="Welcome beverages, photo booth posing, and kids game corner.", zone="Reception & Kids Zone", icon="Smile"),
                TimelineEvent(time="06:15 PM", title="Cake Cutting & Celebration", description="Grand birthday song, confetti, and cake cutting ceremony on stage.", zone="Stage", icon="Cake"),
                TimelineEvent(time="07:00 PM", title="DJ Dance Floor & Games", description="High-energy music, group games, and dance floor opening.", zone="DJ & Main Seating", icon="Music"),
                TimelineEvent(time="08:30 PM", title="Dinner Buffet", description="Delicious dinner spread with live chaat and dessert counters.", zone="Food Area", icon="Utensils"),
                TimelineEvent(time="10:00 PM", title="Return Gifts & Send-Off", description="Distributing memory favor bags and farewell greetings.", zone="Reception / Entry", icon="Gift")
            ]
        else:
            return [
                TimelineEvent(time="05:00 PM", title="Guest Arrival & Welcome", description="Registration and refreshments in the arrival foyer.", zone="Reception / Entry", icon="UserCheck"),
                TimelineEvent(time="06:00 PM", title="Opening & Main Event", description="Core performances, address, or celebratory program.", zone="Stage & Main Seating", icon="Star"),
                TimelineEvent(time="07:45 PM", title="Dinner & Social Gathering", description="Buffet dinner with relaxed ambient music.", zone="Food Area", icon="Utensils"),
                TimelineEvent(time="09:15 PM", title="Closing & Photo Memories", description="Farewell photo sessions and concluding greetings.", zone="Stage", icon="Camera")
            ]

    def _get_budget_breakdown(self, total_budget: float, event_type: str) -> Dict[str, float]:
        # Realistic allocation percentages
        venue_rent = round(total_budget * 0.38, 2)
        catering = round(total_budget * 0.35, 2)
        decor_stage = round(total_budget * 0.14, 2)
        av_sound = round(total_budget * 0.07, 2)
        contingency = round(total_budget * 0.06, 2)
        return {
            "Venue Booking & Hall Rental": venue_rent,
            "Catering & Multi-Cuisine Dining": catering,
            "Decoration, Stage & Lighting": decor_stage,
            "Audiovisual, Sound & DJ": av_sound,
            "Hospitality & Contingency Reserve": contingency
        }
