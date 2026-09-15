# SmartVenue AI: An Agentic AI-Based Intelligent Event Planning and Decision-Making System

> **Academic Mini-Project**  
> *A full-stack multi-agent autonomous system that translates complex event requirements, demographic needs, and budgetary constraints into optimal venue selection, interactive 2D spatial layouts, and comprehensive event itineraries.*

---

## 🌟 Key Innovations & Agentic Capabilities

Unlike traditional static directory listings or simple keyword search chatbots, **SmartVenue AI** orchestrates an **8-Agent Autonomous Pipeline**:

1. **Requirement Analysis Agent**: Normalizes constraints, calculates per-head allowances, and identifies stakeholder personas.
2. **Event Planning Agent**: Generates task breakdowns, specialized safety guidelines, and event timelines.
3. **Venue Research Agent**: Queries the database using fuzzy multi-attribute parameters across location, capacity, and facilities.
4. **Venue Comparison Agent**: Computes side-by-side trade-off matrices, price fit, and capacity headroom across 2–4 venues.
5. **Age & Accessibility Agent**: Performs specialized demographic audits (wheelchair ramps, elevators, non-slip surfaces, kids play safety, acoustic senior lounges).
6. **Budget Analysis Agent**: Simulates comprehensive cost packages (hall rental, catering per head, audiovisuals, service taxes, and reserve buffers).
7. **Decision-Making Agent**: Synthesizes weighted multi-dimensional vectors to rank candidates and select the #1 venue.
8. **Recommendation Explanation Agent**: Produces structured natural language justifications, pros/cons, and spatial setup customisations.

---

## 🚀 Complete Application Journey (11 Connected Screens)

```
Welcome Page (Hero & Feature Overview)
    ↓
Video Demo (Interactive Simulation & MP4 Loader)
    ↓
Event & Organizer Input (Type, Date, City, Guests, Budget, Priorities)
    ↓
Age Groups & Facilities (Kids, Teenagers, Adults, Seniors + Required Facilities)
    ↓
Requirement Summary (Verified Parameter Review)
    ↓
AI Agent Processing (Live 8-Agent Dynamic Execution Tracker)
    ↓
Venue Search Results (Catalog Cards, Filters, Badges, Compare & Save)
    ↓
Venue Details & Comparison (Side-by-Side 2–4 Venue Trade-off Matrix)
    ↓
AI Recommendation (Ranked Venues + Multi-Dimensional Scores + Reasons)
    ↓
Event Experience Preview (Dynamic 2D Architectural Spatial Floor Layout)
    ↓
Final Event Plan (Complete Printable Itinerary, Budget Allocation, Kids & Senior Protocols)
```

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS (RGB Glassmorphism theme), Lucide Icons, React Router v6, Axios, Canvas Confetti.
- **Backend**: Python 3.12+, FastAPI, SQLAlchemy ORM, Pydantic v2 schemas, SQLite database.
- **Agentic Engine**: Orchestrated multi-agent sequential pipeline with deterministic heuristic scoring fallback for 100% offline demo reliability.

---

## 💻 Quick Start Guide

### 1. Start the Backend API Server

Open a terminal in the root directory:
```bash
cd backend
python run.py
```
*The FastAPI backend will start at: `http://127.0.0.1:8000` (API documentation available at `http://127.0.0.1:8000/docs`).*

### 2. Start the Frontend Development Server

Open a second terminal in the root directory:
```bash
cd frontend
npm run dev
```
*The React application will be live at: `http://localhost:5173`.*

---

## 🧪 Verified Sample Test Scenario

- **Event Type**: Wedding
- **Location**: Hyderabad (Gachibowli / Banjara Hills)
- **Guests**: 200 Attendees
- **Budget**: ₹1,50,000
- **Organizer**: Family
- **Age Groups**: Kids (25), Adults, Senior Citizens
- **Priorities**: Family Friendly, Accessibility, Low Budget
- **Facilities**: Parking, Catering, Stage, Wheelchair Accessibility
- **Outcome**:
  - Top AI Pick: **Grand Imperial Convention & Banquets** (96.4% AI Match Score)
  - Estimated Package: ₹1,46,000 (₹4,000 safety buffer)
  - 2D Floor Layout: Features ramp-equipped ceremonial stage, round banquet tables, dedicated kids soft-play zone, and acoustically softened senior quiet lounge.
