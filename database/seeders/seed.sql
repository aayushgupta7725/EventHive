-- EventHive Seed Data
-- Run AFTER schema.sql

-- Sample Users (passwords are bcrypt hashes of 'password123')
INSERT INTO users (id, name, email, password, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Aayush Kumar',   'aayush@eventhive.com',  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniMnHqnVGRTFYqnW4Kc1X0vHO', 'EventHive founder and lead developer.'),
  ('22222222-2222-2222-2222-222222222222', 'Alice Johnson',  'alice@example.com',     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniMnHqnVGRTFYqnW4Kc1X0vHO', 'Tech enthusiast and event organizer.'),
  ('33333333-3333-3333-3333-333333333333', 'Bob Smith',      'bob@example.com',       '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniMnHqnVGRTFYqnW4Kc1X0vHO', 'Music lover and community builder.')
ON CONFLICT DO NOTHING;

-- Sample Events
INSERT INTO events (id, title, description, location, latitude, longitude, start_date, end_date, visibility, category, host_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tech Summit 2026',
   'A gathering of tech enthusiasts, developers, and innovators.', 'Moscone Center, San Francisco, CA',
   37.7845, -122.4018, '2026-08-15 09:00:00+00', '2026-08-15 18:00:00+00', 'public', 'Tech', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jazz Night Under Stars',
   'An evening of soulful jazz music with live bands.', 'Central Park, New York, NY',
   40.7829, -73.9654, '2026-08-20 19:00:00+00', '2026-08-20 23:00:00+00', 'public', 'Music', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Photography Workshop',
   'Learn street photography from award-winning photographer Alex Ray.', 'Chicago, IL',
   41.8781, -87.6298, '2026-09-05 10:00:00+00', '2026-09-05 16:00:00+00', 'private', 'Art', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- Sample RSVPs
INSERT INTO rsvps (id, event_id, user_id, status) VALUES
  (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'going'),
  (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'maybe'),
  (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'going')
ON CONFLICT DO NOTHING;
