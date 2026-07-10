# 🐝 EventHive

> A full-stack event management web application — create, discover, RSVP, chat, and share photos for events.

---

## 📋 Project Structure

```
eventhive/
├── client/              # React.js (Vite) Frontend
│   ├── src/
│   │   ├── components/  # Navbar, EventCard, RSVPWidget, ChatPanel, GalleryGrid, MapEmbed
│   │   ├── context/     # AuthContext (JWT)
│   │   ├── pages/       # Landing, Login, Register, Dashboard, CreateEvent, EventDetail, Profile
│   │   └── services/    # api.js (Axios), firebase.js
│   └── .env.example
│
├── server/              # Node.js + Express Backend
│   ├── controllers/     # authController, eventController, rsvpController, galleryController
│   ├── routes/          # authRoutes, eventRoutes, rsvpRoutes, galleryRoutes
│   ├── middleware/      # authMiddleware (JWT verify)
│   ├── config/          # db.js (PostgreSQL pool)
│   └── .env.example
│
└── database/
    ├── migrations/      # schema.sql (all 4 tables)
    └── seeders/         # seed.sql (sample data)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Firebase project (for chat, storage, notifications)
- Google Cloud project (for Maps + Calendar APIs)

---

### 1. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE eventhive;"

# Run migrations
psql -U postgres -d eventhive -f database/migrations/schema.sql

# (Optional) Load seed data
psql -U postgres -d eventhive -f database/seeders/seed.sql
```

---

### 2. Backend Setup

```bash
cd server

# Copy and fill in environment variables
cp .env.example .env

# Install nodemon for dev (optional)
npm install -g nodemon

# Start dev server
npm run dev
# → Running on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd client

# Copy and fill in environment variables
cp .env.example .env

# Start dev server
npm run dev
# → Running on http://localhost:5173
```

---

## 🔑 API Keys Needed

| Service | Where to get |
|---|---|
| PostgreSQL | Local install or [Supabase](https://supabase.com) |
| Firebase | [Firebase Console](https://console.firebase.google.com) |
| Google Maps API | [Google Cloud Console](https://console.cloud.google.com) |
| Google Calendar API | [Google Cloud Console](https://console.cloud.google.com) |

---

## 🛣️ API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register user |
| POST | `/api/login` | Login user |
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/password` | Change password |
| POST | `/api/logout` | Logout |

### Events
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/events` | Create event |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### RSVP
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/events/:id/rsvp` | Submit RSVP |
| GET | `/api/events/:id/guests` | Guest list |

### Gallery
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/gallery/upload` | Save image URL |
| GET | `/api/gallery/:eventId` | Get gallery |
| DELETE | `/api/gallery/:imageId` | Delete image |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (pg) |
| Auth | JWT + bcryptjs |
| Real-time Chat | Firebase Realtime Database |
| Image Storage | Firebase Storage |
| Notifications | Firebase Cloud Messaging |
| Maps | Google Maps Embed API |
| Calendar | Google Calendar API |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 rounds)
- Routes protected with **JWT** Bearer tokens
- Soft-delete for events (`in_trash` flag)
- Owner-only delete for gallery images
- Input validation on all endpoints

---

## 🗺️ User Flow

```
Register / Login
      ↓
Browse Events (Dashboard)
      ↓
View Event Details
      ↓
RSVP (Going / Maybe / Decline)
      ↓
Join Event Chat (Firebase)
      ↓
Upload Photos to Gallery (Firebase Storage)
      ↓
Add to Google Calendar
      ↓
Receive Notifications (FCM)
```

---

*Built with ❤️ from EventHive Notion specs (PRD + TDD)*
