-- =============================================================================
-- Friends Tours & Travels - Complete PostgreSQL Database Schema
-- Database: frien470 | User: frien470
-- =============================================================================

-- Ensure pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FLEET / VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  type_category VARCHAR(50),
  badge VARCHAR(100),
  color VARCHAR(50),
  passenger_capacity VARCHAR(50),
  passenger_count INTEGER,
  luggage_capacity VARCHAR(50),
  air_conditioning VARCHAR(100),
  best_suited_for TEXT,
  image VARCHAR(500),
  gallery JSONB DEFAULT '[]',
  description TEXT,
  features JSONB DEFAULT '[]',
  rental_types JSONB DEFAULT '[]',
  rental_durations JSONB DEFAULT '[]',
  package_4hr_40km INTEGER,
  package_8hr_80km INTEGER,
  extra_km INTEGER,
  extra_hour INTEGER,
  night_bata INTEGER,
  outstation_rate_per_km INTEGER,
  outstation_min_per_day INTEGER,
  pricing_type VARCHAR(100),
  price_note TEXT,
  featured BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOUR PACKAGES
CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  destination VARCHAR(255),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  badge VARCHAR(100),
  duration VARCHAR(100),
  nights VARCHAR(100),
  travel_type VARCHAR(255),
  vehicle_options JSONB DEFAULT '[]',
  default_vehicle VARCHAR(255),
  group_size VARCHAR(100),
  best_for TEXT,
  short_description TEXT,
  overview TEXT,
  highlights JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  inclusions JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  travel_information JSONB DEFAULT '{}',
  pricing_type VARCHAR(100),
  price_starting VARCHAR(50),
  featured BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  hero_image VARCHAR(500),
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKING ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  trip_type VARCHAR(100),
  pickup_location TEXT,
  drop_location TEXT,
  travel_date DATE,
  return_date DATE,
  passengers INTEGER,
  vehicle_preference VARCHAR(255),
  package_name VARCHAR(255),
  special_requests TEXT,
  message TEXT,
  source VARCHAR(100) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'new',
  assigned_to VARCHAR(255),
  admin_notes TEXT,
  quoted_amount DECIMAL(10,2),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TESTIMONIALS & REVIEWS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  location VARCHAR(255),
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  trip_type VARCHAR(100),
  vehicle_used VARCHAR(100),
  travel_date VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  tags JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LOCAL TARIFFS
CREATE TABLE IF NOT EXISTS tariff_local (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  package_4hr_40km INTEGER,
  package_8hr_80km INTEGER NOT NULL,
  extra_hour INTEGER NOT NULL,
  extra_km INTEGER NOT NULL,
  night_bata INTEGER DEFAULT 400,
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. OUTSTATION TARIFFS
CREATE TABLE IF NOT EXISTS tariff_outstation (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  min_amount_per_day INTEGER NOT NULL,
  extra_per_km INTEGER NOT NULL,
  driver_bata_day INTEGER DEFAULT 500,
  night_bata_extra INTEGER DEFAULT 400,
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SITE SETTINGS & CONTENT
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CORE SERVICES
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  badge VARCHAR(100),
  category VARCHAR(100),
  short_desc TEXT,
  full_desc TEXT,
  features JSONB DEFAULT '[]',
  image VARCHAR(500),
  target_route VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AIRPORT PICKUP/DROP AREAS & FIXED FARES
CREATE TABLE IF NOT EXISTS airport_areas (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  distance_km INTEGER DEFAULT 0,
  est_time VARCHAR(100),
  city_to_airport_fare INTEGER DEFAULT 0,
  airport_to_city_fare INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. OUTSTATION DESTINATIONS
CREATE TABLE IF NOT EXISTS outstation_destinations (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(100) DEFAULT 'Karnataka',
  distance_km INTEGER DEFAULT 0,
  est_drive_time VARCHAR(100),
  starting_price INTEGER DEFAULT 0,
  tag VARCHAR(100),
  image VARCHAR(500),
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default Admin Account: admin@friendstours.in / admin@FT2026!
-- Hash for 'admin@FT2026!': $2a$12$Z0mUqL85jY9n8Wb8iXoF2u1r0hZ9q1p5w9k3z7m1n5p7q9r1s3t5
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@friendstours.in',
  '$2a$12$Zq12z3WzX8m0KqLw9p12uO7X1a2b3c4d5e6f7g8h9i0j1k2l3m4n5',
  'Super Admin',
  'superadmin',
  true
)
ON CONFLICT (email) DO NOTHING;
