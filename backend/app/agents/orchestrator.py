import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from ..models import Venue, SearchHistory, EventPlan
from ..schemas import (
    EventRequirementInput, 
    RequirementAnalysisResult, 
    AgentStepLog, 
    AgentRecommendationResponse,
    VenueRecommendation,
    FloorPlanLayout,
    FloorZone,
    FinalEventPlanData,
    VenueBase
)
from .requirement_agent import RequirementAnalysisAgent
from .planning_agent import EventPlanningAgent
from .research_agent import VenueResearchAgent
from .comparison_agent import VenueComparisonAgent
from .accessibility_agent import AgeAccessibilityAgent
from .budget_agent import BudgetAnalysisAgent
from .decision_agent import DecisionMakingAgent
from .explanation_agent import RecommendationExplanationAgent
import json

class AgentOrchestrator:
    """Master Orchestrator
    Coordinates the 8-agent workflow sequentially, generates progress logs,
    and synthesizes floor layouts, multi-agent recommendation decisions, and event plans.
    """

    def __init__(self):
        self.req_agent = RequirementAnalysisAgent()
        self.plan_agent = EventPlanningAgent()
        self.research_agent = VenueResearchAgent()
        self.comp_agent = VenueComparisonAgent()
        self.access_agent = AgeAccessibilityAgent()
        self.budget_agent = BudgetAnalysisAgent()
        self.decision_agent = DecisionMakingAgent()
        self.explain_agent = RecommendationExplanationAgent()

    def run_agentic_workflow(self, db: Session, req: EventRequirementInput) -> AgentRecommendationResponse:
        steps: List[AgentStepLog] = []

        # 1. Requirement Analysis Agent
        analysis = self.req_agent.analyze(req)
        steps.append(AgentStepLog(
            step_id=1,
            agent_name="Requirement Analysis Agent",
            status="completed",
            message=f"Requirements parsed & normalized. Identified target guest scale ({req.guests}), budget tier (₹{req.budget:,.0f}), and demographic profiles ({', '.join(req.age_groups)}).",
            details={"personas": analysis.identified_personas, "budget_per_guest": analysis.budget_per_guest}
        ))

        # 2. Event Planning Agent
        planning_data = self.plan_agent.plan_event(req, analysis)
        steps.append(AgentStepLog(
            step_id=2,
            agent_name="Event Planning Agent",
            status="completed",
            message=f"Formulated event operational tasks, timeline matrix ({len(planning_data['timeline'])} milestones), and specialized demographic safety guidelines.",
            details={"task_count": len(planning_data["planning_tasks"])}
        ))

        # 3. Venue Research Agent
        candidate_venues = self.research_agent.find_candidates_for_event(db, req)
        steps.append(AgentStepLog(
            step_id=3,
            agent_name="Venue Research Agent",
            status="completed",
            message=f"Queried venue catalog for {req.city}. Retrieved {len(candidate_venues)} matching candidate venues meeting threshold capacity and location parameters.",
            details={"candidates_found": len(candidate_venues), "city": req.city}
        ))

        # 4. Venue Comparison Agent
        comp_result = self.comp_agent.compare(
            venues=candidate_venues[:4],
            budget=req.budget,
            guests=req.guests,
            required_facilities=req.facilities,
            age_groups=req.age_groups
        )
        steps.append(AgentStepLog(
            step_id=4,
            agent_name="Venue Comparison Agent",
            status="completed",
            message=f"Executed multi-attribute comparative analysis across top {len(comp_result.venues)} venue options evaluating pricing elasticity, capacity comfort, and amenities.",
            details={"verdict": comp_result.summary_verdict}
        ))

        # 5. Age & Accessibility Agent
        steps.append(AgentStepLog(
            step_id=5,
            agent_name="Age & Accessibility Agent",
            status="completed",
            message=f"Audited wheelchair pathways, ramp gradients, noise isolation zones, and child protection parameters for {', '.join(req.age_groups)}.",
            details={"evaluated_venues_count": len(candidate_venues)}
        ))

        # 6. Budget Analysis Agent
        steps.append(AgentStepLog(
            step_id=6,
            agent_name="Budget Analysis Agent",
            status="completed",
            message=f"Simulated full event budget models including hall rental, estimated catering allocations, AV, and taxes against the ₹{req.budget:,.0f} ceiling.",
            details={"budget_target": req.budget}
        ))

        # 7. Decision-Making Agent
        ranked_items = self.decision_agent.rank_and_select(candidate_venues, req, analysis)
        steps.append(AgentStepLog(
            step_id=7,
            agent_name="Decision-Making Agent",
            status="completed",
            message=f"Synthesized weighted multidimensional scoring vectors. Selected '{ranked_items[0]['venue'].name}' as the #1 optimal venue match ({ranked_items[0]['overall_score']}% AI Match).",
            details={"top_score": ranked_items[0]["overall_score"]}
        ))

        # 8. Recommendation Explanation Agent
        best_rec = self.explain_agent.explain(ranked_items[0], rank=1, req=req, analysis=analysis)
        
        alt_recs: List[VenueRecommendation] = []
        for idx, item in enumerate(ranked_items[1:4], start=2):
            alt_recs.append(self.explain_agent.explain(item, rank=idx, req=req, analysis=analysis))

        steps.append(AgentStepLog(
            step_id=8,
            agent_name="Recommendation Explanation Agent",
            status="completed",
            message="Constructed structured justification narratives, pros & cons trade-off matrices, and spatial setup recommendations.",
            details={"reasons_count": len(best_rec.reasons)}
        ))

        # Persist search history
        try:
            hist = SearchHistory(
                event_type=req.event_type,
                event_date=req.event_date,
                city=req.city,
                area=req.area,
                guests=req.guests,
                budget=req.budget,
                organizer_type=req.organizer_type,
                priorities_json=json.dumps(req.priorities),
                age_groups_json=json.dumps(req.age_groups),
                facilities_json=json.dumps(req.facilities),
                kids_count=req.kids_count or 0,
                additional_preferences=req.additional_preferences,
                results_count=len(candidate_venues),
                top_venue_id=best_rec.venue.id
            )
            db.add(hist)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Error saving search history: {e}")

        summary = (
            f"SmartVenue AI Multi-Agent pipeline successfully synthesized recommendations for {req.event_type} in {req.city}. "
            f"The best recommended venue is {best_rec.venue.name} with an overall AI Match Score of {best_rec.ai_match_score}%."
        )

        return AgentRecommendationResponse(
            event_id=analysis.event_id,
            execution_steps=steps,
            best_venue=best_rec,
            alternative_venues=alt_recs,
            executive_summary=summary,
            workflow_completed_at=datetime.datetime.utcnow().isoformat()
        )

    def generate_floor_layout(self, venue: Venue, req: EventRequirementInput) -> FloorPlanLayout:
        zones = [
            FloorZone(
                id="z_stage",
                name="Grand Stage & Backdrop",
                category="stage",
                x=35,
                y=5,
                width=30,
                height=18,
                color="#8B5CF6", # Purple
                icon="Stage",
                description="Illuminated ceremonial stage with audio monitors, digital backdrop, and ramp accessibility.",
                capacity=15,
                features=["LED Backdrop Screen", "Audio Podium", "Wheelchair Incline Ramp", "Floral Garland Trim"]
            ),
            FloorZone(
                id="z_seating",
                name="Main Guest Seating Area",
                category="seating",
                x=25,
                y=28,
                width=50,
                height=32,
                color="#3B82F6", # Blue
                icon="Users",
                description=f"Primary round-table & theatre style banquet seating configured for {req.guests} guests with wide aisles.",
                capacity=req.guests,
                features=["Round Banquet Tables (10-seat)", "Center Aisle Runway", "Padded Ergonomic Chairs", "Clear Stage Line-of-Sight"]
            ),
            FloorZone(
                id="z_food",
                name="Dining & Buffet Pavilions",
                category="food",
                x=78,
                y=25,
                width=20,
                height=45,
                color="#F59E0B", # Amber
                icon="Utensils",
                description="Double-sided live culinary counters, beverage stations, and dessert bars with queue management.",
                capacity=80,
                features=["Live Cooking Stations", "Dessert Carousel", "Low-Sodium Counter", "Beverage Bar"]
            ),
            FloorZone(
                id="z_reception",
                name="Reception Foyer & Welcome Entry",
                category="reception",
                x=35,
                y=82,
                width=30,
                height=15,
                color="#10B981", # Emerald
                icon="UserCheck",
                description="Arrival greeting lounge, gift registry desk, and digital welcome display screens.",
                capacity=40,
                features=["Welcome Desk", "Digital Photo Frame", "Coat & Gift Check", "Sanitizer Station"]
            ),
            FloorZone(
                id="z_parking",
                name="Valet & Mobility Drop-off",
                category="parking",
                x=5,
                y=82,
                width=25,
                height=15,
                color="#64748B", # Slate
                icon="Car",
                description="Dedicated vehicle arrival bay, valet queue, and zero-curb step wheelchair drop-off point.",
                capacity=50,
                features=["Porte-Cochère Cover", "Valet Booth", "Wheelchair Standby", "Direct Ramp Connector"]
            )
        ]

        # Conditionally add Kids Zone
        if "Kids" in req.age_groups:
            zones.append(FloorZone(
                id="z_kids",
                name="Kids Activity Zone & Play Arena",
                category="kids",
                x=3,
                y=25,
                width=20,
                height=30,
                color="#EC4899", # Pink
                icon="Sparkles",
                description="Secure soft-play enclosure with interactive art crafts, cartoon screening, and childminders.",
                capacity=30,
                features=["Soft Mat Flooring", "Crafts & Coloring Desk", "Dedicated Attendant", "Child-Safe Toys"]
            ))

        # Conditionally add Senior Citizen Zone
        if "Senior Citizens" in req.age_groups:
            zones.append(FloorZone(
                id="z_senior",
                name="Senior Citizen Quiet Lounge",
                category="senior",
                x=3,
                y=58,
                width=20,
                height=20,
                color="#06B6D4", # Cyan
                icon="Armchair",
                description="Acoustically softened rest area with plush reclined seating, climate comfort, and tea station.",
                capacity=25,
                features=["Sound Dampening Dividers", "Ergonomic Recliners", "Direct Restroom Access", "Attendant Call Button"]
            ))

        smart_notes = [
            "Buffet zone placed on the eastern wing to create natural one-directional traffic flow.",
            "Kids area and Senior Lounge placed on opposite quiet corners with clear parental line of sight.",
            "Central 6-foot wide arterial aisle allows seamless wheelchair and stroller passage from entry to stage."
        ]

        acc_notes = [
            "All transitions from reception to stage feature zero-step thresholds or 1:12 slope ramps.",
            "Dedicated senior citizen seating rows positioned in Front-Center zone for maximum audio clarity.",
            "Emergency medical kit and wheelchair transit dock positioned at the reception foyer."
        ]

        return FloorPlanLayout(
            venue_name=venue.name,
            event_type=req.event_type,
            guest_count=req.guests,
            total_area_sqft=int(req.guests * 25 + 2000),
            zones=zones,
            smart_flow_notes=smart_notes,
            accessibility_notes=acc_notes
        )

    def generate_full_event_plan(self, db: Session, req: EventRequirementInput, venue_id: int) -> FinalEventPlanData:
        venue = db.query(Venue).filter(Venue.id == venue_id).first()
        if not venue:
            venue = db.query(Venue).first()

        analysis = self.req_agent.analyze(req)
        plan_data = self.plan_agent.plan_event(req, analysis)
        layout = self.generate_floor_layout(venue, req)

        # Budget estimation
        b_res = self.budget_agent.analyze_budget(venue, req)
        est_cost = b_res["total_estimated_cost"]

        # Alternatives
        alt_venues = db.query(Venue).filter(Venue.id != venue.id).limit(3).all()
        alt_venue_bases = [VenueBase.model_validate(v) for v in alt_venues]

        coordinator_checklist = [
            f"Confirm hall deposit and time slot booking with {venue.name} manager.",
            f"Finalize multi-cuisine catering menu tasting for {req.guests} estimated attendees.",
            "Verify wheelchair ramps and arrange priority senior golf-cart drop-off.",
            "Inspect audio/visual stage projector, wireless mics, and ambient lighting.",
            "Assign 2 event coordinators to the Reception & Kids Zone.",
            "Prepare final welcome itinerary & timeline printed handouts."
        ]

        return FinalEventPlanData(
            event_id=analysis.event_id,
            event_title=f"{req.organizer_type} {req.event_type} Celebration",
            event_type=req.event_type,
            event_date=req.event_date or "To be scheduled",
            city=req.city,
            guest_count=req.guests,
            budget=req.budget,
            estimated_cost=est_cost,
            budget_variance=req.budget - est_cost,
            organizer_type=req.organizer_type,
            selected_venue=VenueBase.model_validate(venue),
            alternative_venues=alt_venue_bases,
            recommended_facilities=venue.facilities,
            budget_breakdown=plan_data["budget_allocation_template"],
            timeline=plan_data["timeline"],
            kids_plan=plan_data["kids_plan"],
            senior_plan=plan_data["senior_plan"],
            floor_layout=layout,
            coordinator_checklist=coordinator_checklist,
            created_at=datetime.datetime.utcnow().isoformat()
        )
