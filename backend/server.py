from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from pathlib import Path
from datetime import datetime, date, time as time_cls, timedelta
import logging
import os
import uuid

try:
    # Optional dependency (for environments that provide Mongo)
    from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore
    _motor_available = True
except Exception:  # pragma: no cover - optional
    _motor_available = False


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="QuickCourt API", version="0.1.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------------------------
# Models
# ---------------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


class OperatingHours(BaseModel):
    start: str = "08:00"
    end: str = "22:00"


class Court(BaseModel):
    id: int
    name: str
    sportType: str
    pricePerHour: float
    operatingHours: OperatingHours = OperatingHours()


class Review(BaseModel):
    id: int
    user: str
    rating: int
    comment: str


class Venue(BaseModel):
    id: int
    name: str
    sportTypes: List[str]
    startingPrice: float
    rating: float
    address: str
    description: str = ""
    amenities: List[str] = []
    images: List[str] = []
    courts: List[Court] = []
    reviews: List[Review] = []
    status: str = "approved"  # approved | pending
    timezone: str = "UTC"


class VenueCreate(BaseModel):
    name: str
    sportTypes: List[str]
    startingPrice: float
    rating: float = 0
    address: str
    description: str = ""
    amenities: List[str] = []
    images: List[str] = []
    status: str = "pending"


class User(BaseModel):
    id: int
    name: str
    email: str
    role: str  # user | facility_owner | admin
    status: str = "active"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


class Booking(BaseModel):
    id: int
    userId: int
    venueId: int
    venueName: str
    courtId: int
    courtName: str
    sportType: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    duration: int
    totalPrice: float
    status: str = "confirmed"
    bookingDateTimeUtc: Optional[str] = None
    timezone: Optional[str] = None


class BookingCreate(BaseModel):
    userId: int
    venueId: int
    courtId: int
    date: str
    time: str
    duration: int = 1


# ---------------------------
# Simple in-memory store
# ---------------------------
class MemoryStore:
    def __init__(self) -> None:
        self.users: Dict[int, User] = {}
        self.venues: Dict[int, Venue] = {}
        self.bookings: Dict[int, Booking] = {}
        self._user_seq = 0
        self._venue_seq = 0
        self._booking_seq = 0
        self._court_seq = 0
        self.seed()

    def next_user_id(self) -> int:
        self._user_seq += 1
        return self._user_seq

    def next_venue_id(self) -> int:
        self._venue_seq += 1
        return self._venue_seq

    def next_court_id(self) -> int:
        self._court_seq += 1
        return self._court_seq

    def next_booking_id(self) -> int:
        self._booking_seq += 1
        return self._booking_seq

    def seed(self) -> None:
        # Users
        for user in [
            User(id=self.next_user_id(), name="John Smith", email="john@example.com", role="user"),
            User(id=self.next_user_id(), name="Sarah Johnson", email="sarah@example.com", role="user"),
            User(id=self.next_user_id(), name="Mike Davis", email="mike@example.com", role="facility_owner"),
            User(id=self.next_user_id(), name="Admin User", email="admin@quickcourt.com", role="admin"),
        ]:
            self.users[user.id] = user

        # Venues with courts
        elite_tennis = Venue(
            id=self.next_venue_id(),
            name="Elite Tennis Club",
            sportTypes=["Tennis"],
            startingPrice=50,
            rating=4.8,
            address="123 Sports Ave, City Center",
            description="Premium tennis facility with 6 professional courts, pro shop, and coaching services.",
            amenities=["Parking", "Lockers", "Pro Shop", "Coaching", "Restrooms"],
            images=[],
            courts=[],
            reviews=[
                Review(id=1, user="John Smith", rating=5, comment="Excellent facilities and well-maintained courts!"),
                Review(id=2, user="Sarah Johnson", rating=4, comment="Great place, professional staff."),
            ],
            status="approved",
        )
        elite_tennis.courts = [
            Court(id=self.next_court_id(), name="Court 1", sportType="Tennis", pricePerHour=50),
            Court(id=self.next_court_id(), name="Court 2", sportType="Tennis", pricePerHour=55),
        ]

        city_bball = Venue(
            id=self.next_venue_id(),
            name="City Basketball Center",
            sportTypes=["Basketball"],
            startingPrice=40,
            rating=4.6,
            address="456 Athletic Blvd, Downtown",
            description="Indoor basketball facility with 4 full courts and modern amenities.",
            amenities=["Parking", "Lockers", "Scoreboard", "Sound System", "AC"],
            images=[],
            courts=[],
            reviews=[Review(id=3, user="Mike Davis", rating=5, comment="Perfect for team practice!")],
            status="approved",
        )
        city_bball.courts = [
            Court(id=self.next_court_id(), name="Court A", sportType="Basketball", pricePerHour=40),
            Court(id=self.next_court_id(), name="Court B", sportType="Basketball", pricePerHour=45),
        ]

        premier_complex = Venue(
            id=self.next_venue_id(),
            name="Premier Sports Complex",
            sportTypes=["Tennis", "Basketball", "Badminton"],
            startingPrice=35,
            rating=4.7,
            address="789 Champions Way, Sports District",
            description="Multi-sport facility offering various court types for all skill levels.",
            amenities=["Parking", "Cafe", "Lockers", "Equipment Rental", "Shower"],
            images=[],
            courts=[],
            reviews=[],
            status="pending",
        )
        premier_complex.courts = [
            Court(id=self.next_court_id(), name="Tennis Court 1", sportType="Tennis", pricePerHour=45),
            Court(id=self.next_court_id(), name="Basketball Court", sportType="Basketball", pricePerHour=35),
            Court(id=self.next_court_id(), name="Badminton Court 1", sportType="Badminton", pricePerHour=30),
        ]

        for v in [elite_tennis, city_bball, premier_complex]:
            self.venues[v.id] = v

        # Bookings (seed for John)
        booking1 = Booking(
            id=self.next_booking_id(),
            userId=1,
            venueId=elite_tennis.id,
            venueName=elite_tennis.name,
            courtId=elite_tennis.courts[0].id,
            courtName=elite_tennis.courts[0].name,
            sportType=elite_tennis.courts[0].sportType,
            date="2025-01-20",
            time="10:00",
            duration=2,
            totalPrice=100,
        )
        booking2 = Booking(
            id=self.next_booking_id(),
            userId=1,
            venueId=city_bball.id,
            venueName=city_bball.name,
            courtId=city_bball.courts[0].id,
            courtName=city_bball.courts[0].name,
            sportType=city_bball.courts[0].sportType,
            date="2025-01-25",
            time="14:00",
            duration=1,
            totalPrice=40,
        )
        self.bookings[booking1.id] = booking1
        self.bookings[booking2.id] = booking2


store = MemoryStore()


# ---------------------------
# Utilities
# ---------------------------
def _parse_time_str(value: str) -> time_cls:
    hour, minute = [int(x) for x in value.split(":")]
    return time_cls(hour=hour, minute=minute)


def _overlaps(b1_start: time_cls, b1_dur_h: int, b2_start: time_cls, b2_dur_h: int) -> bool:
    day = date.today()
    start1 = datetime.combine(day, b1_start)
    end1 = start1 + timedelta(hours=b1_dur_h)
    start2 = datetime.combine(day, b2_start)
    end2 = start2 + timedelta(hours=b2_dur_h)
    return start1 < end2 and start2 < end1


def _within_operating_hours(court: Court, start_time: time_cls, duration_h: int) -> bool:
    start_minutes = start_time.hour * 60 + start_time.minute
    end_minutes = start_minutes + duration_h * 60
    op_start_h, op_start_m = [int(x) for x in court.operatingHours.start.split(":")]
    op_end_h, op_end_m = [int(x) for x in court.operatingHours.end.split(":")]
    op_start = op_start_h * 60 + op_start_m
    op_end = op_end_h * 60 + op_end_m
    return start_minutes >= op_start and end_minutes <= op_end


def _to_utc_iso(venue_tz: str, local_date: str, local_time: str) -> str:
    if ZoneInfo is None:
        # Fallback: treat as UTC
        year, month, day = [int(x) for x in local_date.split("-")]
        hour, minute = [int(x) for x in local_time.split(":")]
        local_dt = datetime(year, month, day, hour, minute, tzinfo=tzinfo.utc)
        return local_dt.astimezone(tzinfo.utc).isoformat()
    try:
        tz = ZoneInfo(venue_tz)
    except Exception:
        tz = tzinfo.utc
    year, month, day = [int(x) for x in local_date.split("-")]
    hour, minute = [int(x) for x in local_time.split(":")]
    local_dt = datetime(year, month, day, hour, minute, tzinfo=tz)
    return local_dt.astimezone(tzinfo.utc).isoformat()


# ---------------------------
# Routes
# ---------------------------
@api_router.get("/")
async def root() -> Dict[str, str]:
    return {"message": "QuickCourt API running"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate) -> StatusCheck:  # noqa: A002
    # Persist to Mongo if configured; otherwise just return
    if _motor_available and os.environ.get("MONGO_URL") and os.environ.get("DB_NAME"):
        try:
            client = AsyncIOMotorClient(os.environ["MONGO_URL"])  # type: ignore
            db = client[os.environ["DB_NAME"]]
            status_obj = StatusCheck(client_name=input.client_name)
            await db.status_checks.insert_one(status_obj.model_dump())
            client.close()
            return status_obj
        except Exception:  # pragma: no cover - optional path
            pass

    return StatusCheck(client_name=input.client_name)


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[StatusCheck]:
    # If Mongo configured, return what's stored there; else return empty list
    if _motor_available and os.environ.get("MONGO_URL") and os.environ.get("DB_NAME"):
        try:
            client = AsyncIOMotorClient(os.environ["MONGO_URL"])  # type: ignore
            db = client[os.environ["DB_NAME"]]
            rows = await db.status_checks.find().to_list(1000)
            client.close()
            return [StatusCheck(**row) for row in rows]
        except Exception:  # pragma: no cover - optional path
            return []
    return []


# Users
@api_router.get("/users", response_model=List[User])
async def list_users() -> List[User]:
    return list(store.users.values())


@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int) -> User:
    user = store.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@api_router.patch("/users/{user_id}", response_model=User)
async def update_user(user_id: int, payload: UserUpdate) -> User:
    user = store.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    data = user.model_dump()
    update = payload.model_dump(exclude_none=True)
    data.update(update)
    updated = User(**data)
    store.users[user_id] = updated
    return updated


# Venues
@api_router.get("/venues", response_model=List[Venue])
async def list_venues(
    status: Optional[str] = None,
    sport: Optional[str] = None,
) -> List[Venue]:
    venues = list(store.venues.values())
    if status:
        venues = [v for v in venues if v.status == status]
    if sport:
        venues = [v for v in venues if sport in v.sportTypes]
    return venues


@api_router.get("/venues/{venue_id}", response_model=Venue)
async def get_venue(venue_id: int) -> Venue:
    venue = store.venues.get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


@api_router.post("/venues", response_model=Venue, status_code=201)
async def create_venue(payload: VenueCreate) -> Venue:
    new_id = store.next_venue_id()
    venue = Venue(
        id=new_id,
        name=payload.name,
        sportTypes=payload.sportTypes,
        startingPrice=payload.startingPrice,
        rating=payload.rating,
        address=payload.address,
        description=payload.description,
        amenities=payload.amenities,
        images=payload.images,
        status=payload.status,
        courts=[],
        reviews=[],
    )
    store.venues[new_id] = venue
    return venue


# Approvals (admin)
@api_router.post("/admin/venues/{venue_id}/approve", response_model=Venue)
async def approve_venue(venue_id: int) -> Venue:
    venue = store.venues.get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    venue.status = "approved"
    store.venues[venue_id] = venue
    return venue


# Courts
@api_router.get("/venues/{venue_id}/courts", response_model=List[Court])
async def list_courts(venue_id: int) -> List[Court]:
    venue = store.venues.get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue.courts


# Bookings
@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(userId: Optional[int] = None) -> List[Booking]:  # noqa: N803
    bookings = list(store.bookings.values())
    if userId is not None:
        bookings = [b for b in bookings if b.userId == userId]
    return bookings


def _compute_total_price(venue_id: int, court_id: int, duration: int) -> float:
    venue = store.venues.get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    court = next((c for c in venue.courts if c.id == court_id), None)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    return float(court.pricePerHour * max(1, duration))


def _court_name(venue_id: int, court_id: int) -> str:
    venue = store.venues[venue_id]
    court = next(c for c in venue.courts if c.id == court_id)
    return court.name


@api_router.post("/bookings", response_model=Booking, status_code=201)
async def create_booking(payload: BookingCreate) -> Booking:
    venue = store.venues.get(payload.venueId)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    # Simple conflict check within same venue/court/date plus operating hours
    new_start = _parse_time_str(payload.time)
    for b in store.bookings.values():
        if b.venueId == payload.venueId and b.courtId == payload.courtId and b.date == payload.date:
            if _overlaps(new_start, payload.duration, _parse_time_str(b.time), b.duration):
                raise HTTPException(status_code=409, detail="Time slot not available")

    total_price = _compute_total_price(payload.venueId, payload.courtId, payload.duration)
    court = next((c for c in venue.courts if c.id == payload.courtId), None)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    if not _within_operating_hours(court, new_start, payload.duration):
        raise HTTPException(status_code=400, detail="Outside operating hours")
    new_id = store.next_booking_id()
    booking = Booking(
        id=new_id,
        userId=payload.userId,
        venueId=payload.venueId,
        venueName=venue.name,
        courtId=payload.courtId,
        courtName=court.name,
        sportType=court.sportType,
        date=payload.date,
        time=payload.time,
        duration=max(1, payload.duration),
        totalPrice=total_price,
        status="confirmed",
        bookingDateTimeUtc=_to_utc_iso(venue.timezone, payload.date, payload.time),
        timezone=venue.timezone,
    )
    store.bookings[new_id] = booking
    return booking


# Availability endpoint for authoritative checks
@api_router.get("/availability")
async def availability(venueId: int, courtId: int, date: str) -> Dict[str, object]:  # noqa: N803
    venue = store.venues.get(venueId)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    court = next((c for c in venue.courts if c.id == courtId), None)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    day_bookings = [
        {"time": b.time, "duration": b.duration}
        for b in store.bookings.values()
        if b.venueId == venueId and b.courtId == courtId and b.date == date
    ]
    return {
        "timezone": venue.timezone,
        "operatingHours": court.operatingHours.model_dump(),
        "bookings": day_bookings,
    }


@api_router.post("/bookings/{booking_id}/cancel", response_model=Booking)
async def cancel_booking(booking_id: int) -> Booking:
    booking = store.bookings.get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = "cancelled"
    store.bookings[booking_id] = booking
    return booking


# KPIs for owner dashboard
@api_router.get("/owner/kpis")
async def owner_kpis() -> Dict[str, int | float]:
    total_bookings = len(store.bookings)
    active_courts = sum(len(v.courts) for v in store.venues.values() if v.status == "approved")
    monthly_earnings = sum(b.totalPrice for b in store.bookings.values())
    occupancy_rate = 75
    return {
        "totalBookings": total_bookings,
        "activeCourts": active_courts,
        "monthlyEarnings": monthly_earnings,
        "occupancyRate": occupancy_rate,
    }


# Include the router in the main app
app.include_router(api_router)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

