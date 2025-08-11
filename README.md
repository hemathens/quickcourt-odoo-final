QuickCourt 
================

**A local sports booking platform for customers, facility owners, and admins — built as a fast, scalable MVP for Odoo Hackathon 2025.**

Project Overview
================

*   QuickCourt helps users discover local sports venues, view real-time availability, and book courts.
    
*   Roles: **Customer**, **Facility Owner**, **Admin**.
    
*   Design goals: fast bookings (no double-bookings), clear owner dashboards, mobile-first UI, and extendability into an ERP-friendly product.
    

Key Features
============

*   **Customer**
    
    *   Search & filter venues by sport, price, rating
        
    *   Real-time availability calendar for courts
        
    *   Book & cancel slots (cancellation policy configurable)
        
    *   My Bookings — history & quick actions
        
*   **Facility Owner**
    
    *   Create/manage venues & courts
        
    *   Set availability and block maintenance slots
        
    *   Owner dashboard: bookings list, earnings, peak hours
        
*   **Admin**
    
    *   Approve/reject new venues
        
    *   Platform metrics & moderation tools
        
*   **System**
    
    *   Prevents overlapping bookings with PostgreSQL tstzrange + EXCLUDE constraint
        
    *   Image uploads (Cloudinary), background jobs (Redis/Bull), simulated payment flow for MVP
        

Tech Stack
=======================

| Technology                        | Usage in QuickCourt                                                 |
| --------------------------------- | ------------------------------------------------------------------- |
| **Next.js 15**                    | Frontend framework (App Router) for fast SSR/SSG and routing        |
| **React**                         | UI components and interactivity                                     |
| **Tailwind CSS**                  | Rapid, consistent styling and responsive design                     |
| **Framer Motion**                 | Smooth transitions & micro-interactions                             |
| **Node.js (NestJS / Express)**    | Backend API and business logic                                      |
| **PostgreSQL**                    | Primary relational DB — time range handling & exclusion constraints |
| **Prisma**                        | ORM for type-safe DB access and migrations                          |
| **Redis (Upstash)**               | Short-term locks, caching, BullMQ job broker                        |
| **Cloudinary / S3**               | Image storage for venue photos & avatars                            |
| **Stripe / Razorpay (simulated)** | Payment processing (real integration optional)                      |
| **Vercel**                        | Frontend hosting & CI integration                                   |
| **Render / Fly / Railway**        | Backend hosting (Docker or managed)                                 |
| **GitHub Actions**                | CI (build, tests, deploy)                                           |
| **Sentry**                        | Error tracking & performance monitoring                             |


Database Schema (detailed, ready-to-use)
========================================

Below is a clear model layout, relationships, and both Prisma + SQL tips for critical constraints.

Entities & important fields
---------------------------

*   **User**
    
    *   id (uuid), name, email (unique), password\_hash, role (CUSTOMER|OWNER|ADMIN), phone, avatar\_url, created\_at
        
*   **Venue**
    
    *   id (uuid), owner\_id -> User.id, name, description, address, short\_location, rating (float), photos\[\], created\_at, status (PENDING|APPROVED|REJECTED)
        
*   **Court**
    
    *   id (uuid), venue\_id -> Venue.id, name, sport\_type (enum), price\_per\_hour (numeric), capacity, operating\_hours (JSON), created\_at
        
*   **Booking**
    
    *   id (uuid), user\_id -> User.id, court\_id -> Court.id, slot tstzrange (start,end), total\_price (numeric), status (PENDING|CONFIRMED|CANCELLED|COMPLETED), paid (bool), cancel\_reason, created\_at
        
*   **AvailabilityBlock**
    
    *   id, court\_id, block\_range tstzrange, type (MAINTENANCE|OWNER\_BLOCK)
        
*   **Review**
    
    *   id, user\_id, venue\_id, rating (1–5), comment, created\_at
        
*   **Payment**
    
    *   id, booking\_id, provider\_id, status, amount, provider\_response\_json
        

Prisma model (example snippet)
------------------------------

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  password    String
  role        String
  phone       String?
  avatarUrl   String?
  venues      Venue[]  @relation("owner_venues")
  bookings    Booking[]
  createdAt   DateTime @default(now())
}

model Venue {
  id         String  @id @default(uuid())
  ownerId    String
  owner      User    @relation(fields: [ownerId], references: [id])
  name       String
  description String?
  address    String?
  shortLocation String?
  rating     Float? 
  photos     String[] @default([])
  status     String   @default("PENDING")
  courts     Court[]
  createdAt  DateTime @default(now())
}

model Court {
  id            String  @id @default(uuid())
  venueId       String
  venue         Venue   @relation(fields: [venueId], references: [id])
  name          String
  sportType     String
  pricePerHour  Float
  capacity      Int?
  operatingHours Json?
  bookings      Booking[]
}

model Booking {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  courtId   String
  court     Court    @relation(fields: [courtId], references: [id])
  slot      String   // store as tstzrange in postgres via raw SQL migration
  totalPrice Float
  status    String   @default("PENDING")
  paid      Boolean  @default(false)
  cancelReason String?
  createdAt DateTime @default(now())
}

```

> **Important:** Prisma doesn’t directly expose tstzrange types natively in models — store slot as tstzrange via a raw SQL migration or use String + CHECK in Prisma and run raw SQL to add range column and exclusion constraint.

Relationships (ER summary)
--------------------------

*   User (1) — (N) Venue as owner
    
*   Venue (1) — (N) Court
    
*   Court (1) — (N) Booking
    
*   User (1) — (N) Booking
    
*   Venue (1) — (N) Review
    
*   Booking (1) — (1) Payment (optional)
    

Booking Flow (concise bullets)
==============================

*   Customer selects venue → picks court → selects start & end times (client-side validation).
    
*   Frontend calls POST /api/bookings to create a PENDING booking with slot value.
    
*   Backend:
    
    * Begins DB transaction.
        
    * Attempts to insert and set status to CONFIRMED (exclusion constraint will prevent overlap).
        
    * If CONFIRMED succeeds → simulate/perform payment → mark paid = true and commit.
        
    * If fails due to overlap → return 409 Conflict: Slot unavailable.
        
*   Cancellation:
    
    * Customer calls POST /api/bookings/:id/cancel.
        
    * If within free cancellation window → status = CANCELLED, free slot.
        
    * If late → apply cancellation fee logic (simple percentage or fixed fee).
        
*   Owner receives booking via owner dashboard (live via websocket or polling).
    

Folder Structure (recommended)
==============================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML
```
ODOO FINAL/
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── .env                 # (ignored in Git)
│
├── frontend/
│   ├── public/
│   │   └── window.svg
│   │   └── favicon.ico  # could also be in src/app/
│   │
│   ├── src/
│   │   └── app/
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
│
├── backend/             # (if Odoo or Node backend present)
│   ├── odoo/            # custom Odoo modules or addons
│   ├── requirements.txt # if using Python
│   ├── config/          # Odoo config files
│   └── ...
│
└── node_modules/        # (ignored in Git)
```

Roadmap (Diagram form + timeline)
=================================

```
[ Customer / Owner / Admin ]
          |
   Next.js 15 (SSR/SSG)
 React + Tailwind + Framer Motion
          |
       API Layer
 Node.js (NestJS / Express)
          |
   Prisma ORM  → PostgreSQL (tstzrange + EXCLUDE)
          |                    |
       Redis (Upstash)   Cloudinary
          |                    |
   Stripe / Razorpay     Images & Avatars
          |
   GitHub Actions CI/CD
   Deploy: Vercel (frontend) + Render (backend)
```

* **Phase 0 — MVP (24h)**
    
  * Auth, Venue & Court CRUD, Booking create/confirm/cancel, Owner dashboard basic, seeded demo data, deploy to Vercel+Render
        
* **Phase 1 — Polish (first 8 hrs)**
    
  * Real payment integration, email notifications, improved mobile UX, WebSocket live updates, PDF/XLS export of reports
        
* **Phase 2 — Growth (next 10 hrs)**
    
  * Dynamic pricing & promos, SEO & marketing pages, user onboarding flows, clinic/match creation/social features
        
* **Phase 3 — Enterprise / Odoo (final 6 hrs)**
    
  * Full Odoo module integration (synchronization), invoicing, advanced reporting, role-based access for organizations, multi-tenant support
        

### Gantt-like mini-timeline (quick)

* Day 0: Setup, DB schema, seed data
    
* Day 1 (0–6h): Core booking + frontend booking UI
    
* Day 1 (6–12h): Owner dashboard + admin approve flows
    
* Day 1 (12–18h): Polish, seeding, fix race conditions
    
* Day 1 (18–24h): Deploy & demo prep
    
* Week 1–2: Payments + emails
    
* Month 1–2: Features + Odoo connector planning
    

Deployment (short)
==================

* Frontend: Vercel (automatic from main branch)
    
* Backend: Render / Fly with Dockerfile or managed Node service
    
* DB: Supabase / Railway (managed Postgres)
    
* Redis: Upstash (serverless)
    
* CI: GitHub Actions pipeline -> run tests, lint, deploy to target
    

API Quick Reference (essential)
===============================

* POST /api/auth/signup — create account
    
* POST /api/auth/login — login (returns JWT & role)
    
* GET /api/venues — list & filters (sport, price)
    
* GET /api/venues/:id — venue details & courts
    
* POST /api/venues — owner creates venue (status PENDING)
    
* POST /api/courts — create court (owner only)
    
* POST /api/bookings — create booking (PENDING → CONFIRM flow)
    
* POST /api/bookings/:id/confirm — confirm + pay (MVP: simulated)
    
* POST /api/bookings/:id/cancel — cancel booking
    
* GET /api/owner/bookings — owner dashboard data
    
* GET /api/admin/pending-venues — admin approvals
    
Demo Credentials (seeded for demo)
==================================

* Customer: customer@quickcourt.test / password123
    
* Owner: owner@quickcourt.test / password123
    
* Admin: admin@quickcourt.test / password123
    

Contact & Support
=================
    
* Demo & questions: ping in Slack/Discord during judging.
