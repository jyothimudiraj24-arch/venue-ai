import json
from .database import SessionLocal
from .models import Venue

DEMO_VENUES = [
    {
        "id": 1,
        "name": "Grand Imperial Convention & Banquets",
        "city": "Hyderabad",
        "area": "Gachibowli / Hitec City",
        "address": "Plot 42, Financial District, Gachibowli, Hyderabad - 500032",
        "venue_type": "Convention Center",
        "capacity_min": 100,
        "capacity_max": 600,
        "price_per_day": 120000.0,
        "price_per_plate": 650.0,
        "rating": 4.9,
        "review_count": 342,
        "contact_phone": "+91 94401 23456",
        "contact_email": "grandimperial@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Air Conditioning", "Outdoor Area", 
            "Indoor Hall", "Kids Area", "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-celebration-at-a-wedding-party-41315-large.mp4",
        "description": "Grand Imperial is Hyderabad's premier venue for weddings, grand conferences, and family milestones. Featuring an expansive pillarless air-conditioned hall, dedicated senior citizen lounge with ramp connectivity, safe kids play arena, and multi-cuisine in-house catering.",
        "accessibility_features": [
            "Wheelchair Ramps at all Entrances", "Elevators to Upper Deck", "Senior Rest Lounge", 
            "Accessible Restrooms", "Dedicated Porch Drop-off", "Non-slip Flooring"
        ],
        "family_features": [
            "Sound-isolated Kids Play Corner", "Baby Changing Station", "Family Suite Dressing Rooms", "Spacious Stroller Pathways"
        ],
        "is_demo_data": True
    },
    {
        "id": 2,
        "name": "The Royal Orchid Palace & Heritage Lawn",
        "city": "Hyderabad",
        "area": "Banjara Hills, Road No. 12",
        "address": "Road No. 12, Near Lotus Pond, Banjara Hills, Hyderabad - 500034",
        "venue_type": "Heritage Palace & Lawn",
        "capacity_min": 150,
        "capacity_max": 800,
        "price_per_day": 145000.0,
        "price_per_plate": 750.0,
        "rating": 4.8,
        "review_count": 289,
        "contact_phone": "+91 98480 98765",
        "contact_email": "royalorchid@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Air Conditioning", "Outdoor Area", "Indoor Hall", 
            "Kids Area", "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1545232979-fbf68fe9ec41?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-set-of-plate-glasses-and-cutlery-on-a-table-42358-large.mp4",
        "description": "A breathtaking heritage property combining Nizam-inspired royal aesthetics with sprawling manicured green lawns. Ideal for luxury weddings, family celebrations, and grand receptions with lush open skies and full accessibility ramps.",
        "accessibility_features": [
            "Golf-cart mobility assistance from gate", "Ground-level ramp entry", "Wide corridors", "Senior seating pods"
        ],
        "family_features": [
            "Open garden lawn for kid activities", "Family photo booth zone", "Dedicated green rooms"
        ],
        "is_demo_data": True
    },
    {
        "id": 3,
        "name": "Nirvana Lakeview Resorts & Lawns",
        "city": "Hyderabad",
        "area": "Gandipet / Osman Sagar",
        "address": "Survey 88, Lakeview Boulevard, Gandipet, Hyderabad - 500075",
        "venue_type": "Resort",
        "capacity_min": 80,
        "capacity_max": 450,
        "price_per_day": 135000.0,
        "price_per_plate": 600.0,
        "rating": 4.7,
        "review_count": 195,
        "contact_phone": "+91 97000 11223",
        "contact_email": "nirvanalake@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Air Conditioning", "Outdoor Area", 
            "Indoor Hall", "Kids Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "Scenic waterside resort destination surrounded by lush greenery. Excellent venue for sunset weddings, cocktail nights, corporate retreats, and engagement festivities with soothing ambient tranquility.",
        "accessibility_features": [
            "Paved lakeview promenade", "Wheelchair accessible dining hall", "Direct vehicle drop-off"
        ],
        "family_features": [
            "Kids splash pool safety fencing", "Huge open play lawns", "Pet friendly outdoor section"
        ],
        "is_demo_data": True
    },
    {
        "id": 4,
        "name": "Silver Oak Banquet & Celebrations Hall",
        "city": "Hyderabad",
        "area": "Secunderabad / Begumpet",
        "address": "104 SP Road, Near Paradise Circle, Secunderabad - 500003",
        "venue_type": "Banquet Hall",
        "capacity_min": 50,
        "capacity_max": 300,
        "price_per_day": 85000.0,
        "price_per_plate": 500.0,
        "rating": 4.6,
        "review_count": 210,
        "contact_phone": "+91 91234 56789",
        "contact_email": "silveroak@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Air Conditioning", "Indoor Hall", "Wheelchair Accessibility", "Senior Rest Area"
        ],
        "images": [
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "An ultra-budget-friendly yet refined banquet hall located centrally in Secunderabad. Perfect for compact weddings, sangeet, birthday parties, conferences, and family functions with excellent metro proximity.",
        "accessibility_features": [
            "Dual elevator access", "Wheelchair ramp at lobby", "Comfortable padded banquet seating"
        ],
        "family_features": [
            "Sound-insulated dining area", "Safe kids seating high chairs"
        ],
        "is_demo_data": True
    },
    {
        "id": 5,
        "name": "Taj Deccan Crystal Ballroom",
        "city": "Hyderabad",
        "area": "Banjara Hills, Road No. 1",
        "address": "Road No. 1, Banjara Hills, Hyderabad - 500034",
        "venue_type": "5-Star Hotel",
        "capacity_min": 100,
        "capacity_max": 500,
        "price_per_day": 280000.0,
        "price_per_plate": 1400.0,
        "rating": 4.95,
        "review_count": 480,
        "contact_phone": "+91 40 6666 3939",
        "contact_email": "tajdeccan@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Air Conditioning", "Outdoor Area", 
            "Indoor Hall", "Kids Area", "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "5-star luxury hospitality in prime Banjara Hills. Offers presidential service standards, world-class culinary masterchefs, crystalline lighting architecture, and white-glove event concierge support.",
        "accessibility_features": [
            "Full ADA compliance", "Valet wheelchair assistance", "Zero threshold step-free access", "Braille signage"
        ],
        "family_features": [
            "Certified nanny care support", "Kids gourmet buffet menu", "VIP family changing suite"
        ],
        "is_demo_data": True
    },
    {
        "id": 6,
        "name": "Skyline Panorama Rooftop & Lounge",
        "city": "Hyderabad",
        "area": "Madhapur / Cyber Towers",
        "address": "15th Floor, Cyber Heights, Madhapur, Hyderabad - 500081",
        "venue_type": "Rooftop & Lounge",
        "capacity_min": 40,
        "capacity_max": 200,
        "price_per_day": 95000.0,
        "price_per_plate": 850.0,
        "rating": 4.65,
        "review_count": 160,
        "contact_phone": "+91 99887 65432",
        "contact_email": "skylinemadhapur@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Outdoor Area", "Air Conditioning"
        ],
        "images": [
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "A chic 15th-floor rooftop venue boasting panoramic 360-degree city skyline vistas. Features neon ambient lighting, acoustic DJ booth, handcrafted cocktails, and an electric atmosphere for youth parties and corporate celebrations.",
        "accessibility_features": [
            "High-speed passenger elevator", "Step-free terrace access"
        ],
        "family_features": [
            "Telescope stargazing deck", "Lounge seating cluster"
        ],
        "is_demo_data": True
    },
    {
        "id": 7,
        "name": "Bengaluru Palace Grounds & Royal Pavilion",
        "city": "Bengaluru",
        "area": "Jayamahal / Vasanth Nagar",
        "address": "Palace Road, Near Jayamahal, Bengaluru - 560006",
        "venue_type": "Heritage Palace & Lawn",
        "capacity_min": 200,
        "capacity_max": 1500,
        "price_per_day": 250000.0,
        "price_per_plate": 800.0,
        "rating": 4.88,
        "review_count": 520,
        "contact_phone": "+91 80 2361 5888",
        "contact_email": "bangalorepalace@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Air Conditioning", "Outdoor Area", 
            "Indoor Hall", "Kids Area", "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1545232979-fbf68fe9ec41?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "One of India's most iconic heritage landmarks. Features sprawling acres of Tudor-style architectural majesty, regal stone facades, and royal courtyards for mega-weddings and international summits.",
        "accessibility_features": ["Golf cart transit", "Gentle incline walkways", "Ground-level accessibility"],
        "family_features": ["Vast open heritage lawns", "Grand regal photography corners"],
        "is_demo_data": True
    },
    {
        "id": 8,
        "name": "The Leela Palace Grand Ballroom",
        "city": "Bengaluru",
        "area": "Old Airport Road / HAL",
        "address": "23 HAL Airport Road, Kodihalli, Bengaluru - 560008",
        "venue_type": "5-Star Hotel",
        "capacity_min": 80,
        "capacity_max": 500,
        "price_per_day": 320000.0,
        "price_per_plate": 1600.0,
        "rating": 4.96,
        "review_count": 410,
        "contact_phone": "+91 80 2521 1234",
        "contact_email": "leelapalace@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Air Conditioning", "Indoor Hall", 
            "Kids Area", "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "Gold-leaf embellished grand ballroom echoing royal Vijayanagara palaces. Ultra-luxurious service, bespoke chandelier lighting, and elite culinary creations.",
        "accessibility_features": ["Full step-free luxury access", "Personal wheelchair butler", "Spacious restrooms"],
        "family_features": ["Kids gourmet confectionery corner", "Private family green rooms"],
        "is_demo_data": True
    },
    {
        "id": 9,
        "name": "St. Regis Astor Ballroom",
        "city": "Mumbai",
        "area": "Lower Parel / Worli",
        "address": "462 Senapati Bapat Marg, Lower Parel, Mumbai - 400013",
        "venue_type": "5-Star Hotel",
        "capacity_min": 100,
        "capacity_max": 700,
        "price_per_day": 350000.0,
        "price_per_plate": 1800.0,
        "rating": 4.92,
        "review_count": 390,
        "contact_phone": "+91 22 6162 8000",
        "contact_email": "stregismumbai@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Projector", "Wi-Fi", "Air Conditioning", "Indoor Hall", 
            "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "Mumbai's premier high-society ballroom featuring unmatched high ceilings, bespoke silk drapery, signature butler service, and direct multi-level valet parking.",
        "accessibility_features": ["Wheelchair accessible elevators", "ADA compliant rest spaces"],
        "family_features": ["VIP family lounge", "Sound dampening panels"],
        "is_demo_data": True
    },
    {
        "id": 10,
        "name": "Sea Princess Beachside Bay Lawn",
        "city": "Mumbai",
        "area": "Juhu Beach",
        "address": "Juhu Tara Road, Juhu Beach, Mumbai - 400049",
        "venue_type": "Lawn / Open Air",
        "capacity_min": 80,
        "capacity_max": 400,
        "price_per_day": 160000.0,
        "price_per_plate": 900.0,
        "rating": 4.72,
        "review_count": 270,
        "contact_phone": "+91 22 2646 9500",
        "contact_email": "seaprincess@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Outdoor Area", "Kids Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "Iconic beachside open-air venue on Juhu shore. Sunset sea breezes, coconut palm fairy lights, and live barbecue counters for vibrant wedding sangeets and cocktail soirees.",
        "accessibility_features": ["Paved boardwalk to lawn", "Ramp from lobby"],
        "family_features": ["Sand castle play sector", "Beachfront family seating"],
        "is_demo_data": True
    },
    {
        "id": 11,
        "name": "Manekshaw Centre Grand Auditorium & Lawns",
        "city": "Delhi",
        "area": "Dhaula Kuan / Delhi Cantt",
        "address": "Khyber Lines, Delhi Cantt, New Delhi - 110010",
        "venue_type": "Auditorium & Convention",
        "capacity_min": 150,
        "capacity_max": 1000,
        "price_per_day": 180000.0,
        "price_per_plate": 700.0,
        "rating": 4.85,
        "review_count": 310,
        "contact_phone": "+91 11 2568 7000",
        "contact_email": "manekshaw@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Projector", 
            "Wi-Fi", "Air Conditioning", "Outdoor Area", "Indoor Hall", 
            "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "Sprawling state-of-the-art convention facility in diplomatic Delhi. High-tech audiovisual infrastructure, huge secure parking, and peaceful landscaped green environments.",
        "accessibility_features": ["Universal barrier-free design", "Wide ramp network", "Priority senior seating"],
        "family_features": ["Open green spaces", "Wide walking avenues"],
        "is_demo_data": True
    },
    {
        "id": 12,
        "name": "Tivoli Grand Luxury Lawns & Suites",
        "city": "Delhi",
        "area": "GT Karnal Road / Alipur",
        "address": "GT Karnal Road, Alipur, New Delhi - 110036",
        "venue_type": "Lawn / Open Air",
        "capacity_min": 200,
        "capacity_max": 1200,
        "price_per_day": 175000.0,
        "price_per_plate": 850.0,
        "rating": 4.78,
        "review_count": 340,
        "contact_phone": "+91 11 4755 5555",
        "contact_email": "tivoligrand@smartvenue.ai",
        "facilities": [
            "Parking", "Catering", "Stage", "Decoration", "Music/DJ", 
            "Air Conditioning", "Outdoor Area", "Indoor Hall", 
            "Kids Area", "Senior Rest Area", "Wheelchair Accessibility"
        ],
        "images": [
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
        ],
        "video_url": None,
        "description": "Grand destination resort on GT Karnal Road equipped with majestic illuminated Roman pillars, manicured lawn carpets, luxury bridal suites, and valet bays for 500+ vehicles.",
        "accessibility_features": ["Flat paved entrances", "Ramps throughout lawn perimeter"],
        "family_features": ["Dedicated kids carnival zones", "Air conditioned family waiting suites"],
        "is_demo_data": True
    }
]

def seed_venues(db_session=None):
    close_when_done = False
    if db_session is None:
        db_session = SessionLocal()
        close_when_done = True
    
    try:
        existing_count = db_session.query(Venue).count()
        if existing_count == 0:
            for item in DEMO_VENUES:
                venue = Venue(
                    id=item["id"],
                    name=item["name"],
                    city=item["city"],
                    area=item["area"],
                    address=item["address"],
                    venue_type=item["venue_type"],
                    capacity_min=item["capacity_min"],
                    capacity_max=item["capacity_max"],
                    price_per_day=item["price_per_day"],
                    price_per_plate=item["price_per_plate"],
                    rating=item["rating"],
                    review_count=item["review_count"],
                    contact_phone=item["contact_phone"],
                    contact_email=item["contact_email"],
                    facilities_json=json.dumps(item["facilities"]),
                    images_json=json.dumps(item["images"]),
                    video_url=item["video_url"],
                    description=item["description"],
                    accessibility_json=json.dumps(item["accessibility_features"]),
                    family_features_json=json.dumps(item["family_features"]),
                    is_demo_data=item["is_demo_data"]
                )
                db_session.add(venue)
            db_session.commit()
            print(f"[SmartVenue AI] Successfully seeded {len(DEMO_VENUES)} demo venues.")
    except Exception as e:
        db_session.rollback()
        print(f"[SmartVenue AI] Error seeding venues: {e}")
    finally:
        if close_when_done:
            db_session.close()
