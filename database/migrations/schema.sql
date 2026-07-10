-- EventHive Database Migrations
-- Run these in order: 001 → 004

-- ── 001 Users ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  bio         TEXT,
  avatar_url  VARCHAR(500),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 002 Events ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        VARCHAR(255)  NOT NULL,
  description  TEXT,
  location     VARCHAR(255),
  latitude     DECIMAL(10, 8),
  longitude    DECIMAL(11, 8),
  start_date   TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date     TIMESTAMP WITH TIME ZONE NOT NULL,
  visibility   VARCHAR(10)   NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  category     VARCHAR(50)   DEFAULT 'Other',
  cover_image  VARCHAR(500),
  host_id      UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  in_trash     BOOLEAN       DEFAULT FALSE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_host_id    ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_visibility ON events(visibility);

-- ── 003 RSVPs ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvps (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  status      VARCHAR(10) NOT NULL CHECK (status IN ('going', 'maybe', 'declined')),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_id  ON rsvps(user_id);

-- ── 004 Gallery ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id      UUID NOT NULL REFERENCES events(id)  ON DELETE CASCADE,
  image_url     VARCHAR(500) NOT NULL,
  storage_path  VARCHAR(500),
  uploaded_by   UUID NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON gallery(event_id);
