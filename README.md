# QuickCourt

**A local sports booking platform for customers, facility owners, and admins — built as a fast, scalable MVP for Odoo Hackathon 2025.**

---

## Project Overview

QuickCourt enables users to **discover sports venues, check real-time court availability, and book instantly** — all from a mobile-friendly interface. Facility owners can manage their venues, while admins keep the platform safe and growing.

**User Roles:**  
- **Customer** — Search, book, and manage sports court reservations.  
- **Facility Owner** — Create and manage venues, courts, and schedules.  
- **Admin** — Approve venues, view analytics, and moderate content.

**Design Goals:**  
- Zero double-bookings (transaction-safe).
- Fast, intuitive booking flow.
- Mobile-first design for on-the-go users.
- Extendable for ERP/Odoo integration.

---

## Team & Roles

**Team Number:-** 331

| Member | GitHub | Responsibilities |
| ------ | ------ | ---------------- |
| **Hem Patel** | [@hemathens](https://github.com/hemathens) | **Backend Lead** — Designed and implemented booking logic with PostgreSQL `tstzrange` constraints, developed REST API with NestJS/Express, integrated Redis (Upstash) for concurrency locks and real-time updates, built payment simulation flow (Stripe/Razorpay), connected Cloudinary for image uploads, set up CI/CD pipelines, and deployed backend on Render. |
| **Laukik Rajput** | [@lokixshr](https://github.com/lokixshr) | **Frontend Lead** — Developed UI with Next.js 15 App Router, React, and Tailwind CSS. Created responsive booking pages, search & filter interface, and owner/admin dashboards. Integrated Framer Motion for animations, implemented live court availability via WebSocket polling, connected frontend to API, and deployed frontend on Vercel. |

---

## Key Features

**Customer**
- Search & filter venues by sport, price, and rating.
- Real-time court availability calendar.
- Book & cancel slots (configurable cancellation policy).
- Booking history with quick actions.

**Facility Owner**
- Create/manage venues & courts.
- Define availability, block maintenance slots.
- Dashboard with bookings list, earnings, and peak hours.

**Admin**
- Approve/reject new venues.
- View platform metrics and manage reports.
- Moderate reviews and content.

**System**
- Prevent overlapping bookings with PostgreSQL range constraints.
- Real-time updates via Redis locks & subscriptions.
- Cloudinary image uploads.
- Background jobs with BullMQ.
- Simulated payments (ready for Stripe/Razorpay integration).

---

## Tech Stack

| Technology                        | Usage |
| --------------------------------- | ----- |
| **Next.js 15 (App Router)**       | Frontend SSR/SSG, routing |
| **React**                         | UI components |
| **Tailwind CSS**                  | Styling & responsiveness |
| **Framer Motion**                 | Animations |
| **NestJS / Express.js**           | Backend API |
| **PostgreSQL**                    | Database with exclusion constraints |
| **Prisma ORM**                    | DB access & migrations |
| **Redis (Upstash)**               | Caching & concurrency locks |
| **BullMQ**                        | Background job processing |
| **Cloudinary**                    | Image storage |
| **Stripe / Razorpay (simulated)** | Payment flow |
| **Vercel**                        | Frontend hosting |
| **Render**                        | Backend hosting |
| **GitHub Actions**                | CI/CD |
| **Sentry**                        | Error tracking |

---

## Database Schema

**Entities:**  
- **User** — Roles: CUSTOMER, OWNER, ADMIN.  
- **Venue** — Linked to Owner.  
- **Court** — Linked to Venue.  
- **Booking** — Linked to User & Court, stores `tstzrange`.  
- **AvailabilityBlock** — Owner maintenance & block slots.  
- **Review** — Customer feedback.  
- **Payment** — Linked to Booking.

> Prisma snippet and ER diagram in full schema section above.

---

## Booking Flow

1. Customer selects venue & court → chooses slot.
2. Frontend sends booking request to backend.
3. Backend:
   - Starts transaction.
   - Inserts booking with `tstzrange` constraint.
   - Confirms booking if slot available; otherwise, rejects with 409.
4. Payment processed (simulated).
5. Owners get notified via dashboard (WebSocket/polling).

---

## Folder Structure
```
quickcourt/
│
├── frontend/ # Next.js + Tailwind + Framer Motion
│ ├── public/
│ └── src/app/
│
├── backend/ # NestJS + Express + PostgreSQL
│ ├── src/
│ ├── prisma/
│
├── .env
├── README.md
└── package.json
```


---

## Deployment

- **Frontend** — Vercel (auto-deploy from main branch).
- **Backend** — Render/Fly/Railway (Docker or managed Node).
- **Database** — Supabase/Railway PostgreSQL.
- **Redis** — Upstash.
- **CI/CD** — GitHub Actions.

---

## API Reference (Essential)

- `POST /api/auth/signup` — Register user.  
- `POST /api/auth/login` — Authenticate & return JWT.  
- `GET /api/venues` — Search venues.  
- `POST /api/bookings` — Create booking.  
- `POST /api/bookings/:id/cancel` — Cancel booking.  
- `GET /api/owner/bookings` — Owner dashboard data.  
- `GET /api/admin/pending-venues` — Admin approvals.

---

## Demo Accounts

- **Customer**: `customer@quickcourt.test` / `password123`  
- **Owner**: `owner@quickcourt.test` / `password123`  
- **Admin**: `admin@quickcourt.test` / `password123`  

---

## Contact

### • **Hem Patel**  
[![Kaggle Profile](https://img.shields.io/badge/Kaggle-hem%20ajit%20patel-20BEFF?logo=kaggle)](https://www.kaggle.com/hemajitpatel)  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Hem%20Ajit%20Patel-0A66C2?logo=linkedin)](https://www.linkedin.com/in/hem-patel19)  [![GitHub](https://img.shields.io/badge/GitHub-hemathens-181717?logo=github)](https://github.com/hemathens)

### • **Laukik Rajput**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Laukik%20Rajput-0A66C2?logo=linkedin)](https://www.linkedin.com/in/laukik-rajput-95bb48300)  [![GitHub](https://img.shields.io/badge/GitHub-lokixshr-181717?logo=github)](https://github.com/lokixshr)

For demo requests & support, reach out via our hackathon Slack channel.
