import { query } from '../db.js';
import bcrypt from 'bcryptjs';

// ─── MIGRATIONS ────────────────────────────────────────────────────────────────
export async function runMigrations() {
  console.log('Running database migrations...');

  // --- ADMIN USERS ---
  await query(`
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
    )
  `);

  // Ensure default superadmin accounts ALWAYS exist in the database
  try {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin@FT2026!';
    const defaultHash = await bcrypt.hash(defaultPassword, 12);
    const emails = [
      (process.env.ADMIN_EMAIL || 'admin@friendstours.in').toLowerCase().trim(),
      'admin@friendstours.com',
      'admin'
    ];

    for (const email of emails) {
      await query(`
        INSERT INTO admin_users (email, password_hash, name, role, is_active)
        VALUES ($1, $2, 'Admin', 'superadmin', true)
        ON CONFLICT (email) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          is_active = true
      `, [email, defaultHash]);
    }
    console.log('✅ Verified default admin accounts: admin@friendstours.in, admin@friendstours.com, admin');
  } catch (adminErr) {
    console.warn('Admin seed warning in migrate.js:', adminErr.message);
  }

  // --- VEHICLES / FLEET ---
  await query(`
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
    )
  `);

  // --- TOUR PACKAGES ---
  await query(`
    CREATE TABLE IF NOT EXISTS packages (
      id VARCHAR(100) PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      destination VARCHAR(255),
      state VARCHAR(100),
      country VARCHAR(100) DEFAULT 'India',
      hero_image VARCHAR(500),
      gallery JSONB DEFAULT '[]',
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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- BOOKING ENQUIRIES ---
  await query(`
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
    )
  `);

  // --- TESTIMONIALS / REVIEWS ---
  await query(`
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
    )
  `);

  // --- GALLERY IMAGES ---
  await query(`
    CREATE TABLE IF NOT EXISTS gallery (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255),
      caption TEXT,
      image_url VARCHAR(500) NOT NULL,
      image_path VARCHAR(500),
      category VARCHAR(100) DEFAULT 'general',
      tags JSONB DEFAULT '[]',
      sort_order INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- CONTACT MESSAGES ---
  await query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'unread',
      is_read BOOLEAN DEFAULT false,
      replied_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- SITE SETTINGS ---
  await query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT,
      label VARCHAR(255),
      type VARCHAR(50) DEFAULT 'text',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- TARIFF CARDS ---
  await query(`
    CREATE TABLE IF NOT EXISTS tariff_local (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vehicle_name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      package_4hr_40km INTEGER,
      package_8hr_80km INTEGER,
      extra_hour INTEGER,
      extra_km INTEGER,
      night_bata INTEGER,
      sort_order INTEGER DEFAULT 0,
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tariff_outstation (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vehicle_name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      min_amount_per_day INTEGER,
      extra_per_km INTEGER,
      driver_bata_day INTEGER,
      night_bata_extra INTEGER,
      sort_order INTEGER DEFAULT 0,
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- SERVICES ---
  await query(`
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
    )
  `);

  // --- AIRPORT LOCALITIES & FARES ---
  await query(`
    CREATE TABLE IF NOT EXISTS airport_areas (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      distance_km INTEGER,
      est_time VARCHAR(100),
      city_to_airport_fare INTEGER NOT NULL,
      airport_to_city_fare INTEGER NOT NULL,
      active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- OUTSTATION DESTINATIONS ---
  await query(`
    CREATE TABLE IF NOT EXISTS outstation_destinations (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      state VARCHAR(100),
      distance_km INTEGER,
      est_drive_time VARCHAR(100),
      starting_price INTEGER,
      tag VARCHAR(100),
      image VARCHAR(500),
      active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // --- CREATE INDEXES ---
  await query(`CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON enquiries(phone)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_vehicles_enabled ON vehicles(enabled)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_packages_enabled ON packages(enabled)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category)`);

  // --- AUTO-SEED INITIAL DATA IF TABLES ARE EMPTY ---
  await autoSeedIfEmpty();

  console.log('✅ All migrations completed successfully.');
}

async function autoSeedIfEmpty() {
  try {
    // 1. SERVICES
    const srvCheck = await query('SELECT count(*) FROM services');
    if (parseInt(srvCheck.rows[0].count) === 0) {
      const initialServices = [
        {
          id: 'srv-employee', slug: 'employee-transportation', title: 'EMPLOYEE TRANSPORTATION',
          badge: 'SERVICE 01 • CORPORATE MOBILITY', category: 'Corporate Mobility',
          short_desc: 'Dedicated daily employee pickup and drop services for Bangalore tech parks, IT/BPO companies, and corporate offices.',
          full_desc: 'Dedicated daily employee pickup and drop services for Bangalore tech parks (Whitefield, Electronic City, Manyata, ORR), IT/BPO companies, and corporate offices. Includes centralized monthly GST billing, automated MIS logs, and vetted chauffeurs.',
          features: ['Scheduled Shift Pickups', 'Tech Park Transit', 'Monthly GST Invoicing', 'Vetted & Uniformed Drivers', '24/7 Dispatch Desk'],
          image: '/services/employee-transport.jpg', target_route: '/services/corporate-travel', sort_order: 1
        },
        {
          id: 'srv-airport', slug: 'airport-transport', title: 'AIRPORT TRANSPORT',
          badge: 'SERVICE 02 • 24/7 AIRPORT SERVICE', category: 'Airport Transfers',
          short_desc: 'Reliable airport pickup and drop services connecting Kempegowda International Airport (BLR) with all Bangalore areas.',
          full_desc: 'Reliable airport pickup and drop services connecting Kempegowda International Airport (BLR) with all Bangalore areas. Real-time flight tracking ensures chauffeurs adjust automatically for flight delays with zero waiting surcharges.',
          features: ['Kempegowda Airport Drops', 'Terminal 1 & 2 Pickups', 'Live Flight Delay Tracking', 'Expressway Toll Management', 'Luggage Handling Assistance'],
          image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', target_route: '/services/airport-transfer', sort_order: 2
        },
        {
          id: 'srv-local-outstation', slug: 'local-and-outstation-rentals', title: 'LOCAL AND OUTSTATION RENTALS',
          badge: 'SERVICE 03 • HOURLY & HIGHWAY', category: 'Car Rentals',
          short_desc: 'Flexible hourly rentals (4hr/40km & 8hr/80km) for Bangalore city transit, plus outstation highway rentals (min 300 km/day).',
          full_desc: 'Flexible hourly rentals (4hr/40km & 8hr/80km) for Bangalore city transit, business errands, and shopping, plus outstation highway rentals (min 300 km/day) to Mysore, Coorg, Ooty, Chikmagalur, Hampi, and South India.',
          features: ['4hr/40km Half Day', '8hr/80km Full Day', 'Outstation Min 300km/Day', 'Transparent Per-Km Rates', 'Highway Verified Drivers'],
          image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', target_route: '/local-packages', sort_order: 3
        },
        {
          id: 'srv-shuttle', slug: 'shuttle-services', title: 'SHUTTLE SERVICES',
          badge: 'SERVICE 04 • GROUP & EVENT FLEET', category: 'Group Transit',
          short_desc: 'Cost-effective point-to-point shuttle transportation for corporate delegations, tech conferences, and wedding convoys.',
          full_desc: 'Cost-effective point-to-point shuttle transportation for corporate delegations, tech conferences, wedding guest convoys, and group tours with 12–17 seater AC & Non-AC Tempo Travellers.',
          features: ['Corporate Office Shuttles', 'Wedding & Event Transfers', '12–17 Seater Tempo AC', 'Conference Transit', 'Large Group Economy'],
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', target_route: '/rental-cars', sort_order: 4
        }
      ];
      for (const s of initialServices) {
        await query(`
          INSERT INTO services (id, slug, title, badge, category, short_desc, full_desc, features, image, target_route, sort_order, enabled)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
          ON CONFLICT (id) DO NOTHING
        `, [s.id, s.slug, s.title, s.badge, s.category, s.short_desc, s.full_desc, JSON.stringify(s.features), s.image, s.target_route, s.sort_order]);
      }
      console.log('✅ Seeded initial services.');
    }

    // 2. SITE SETTINGS & CONTENT
    const settings = [
      ['site_name', 'Friends Tours & Travels', 'Site Name', 'text'],
      ['site_tagline', 'Your Journey. Our Priority.', 'Tagline', 'text'],
      ['phone', '+91 82773 93089', 'Phone Number', 'text'],
      ['whatsapp', '+918277393089', 'WhatsApp Number', 'text'],
      ['email', 'friendstravelsone@gmail.com', 'Email', 'email'],
      ['address', '#18, 24TH Main 5th Phase, J.P. Nagar, Bangalore – 560078', 'Address', 'text'],
      ['google_maps_url', 'https://maps.google.com', 'Google Maps URL', 'url'],
      ['instagram_url', '', 'Instagram URL', 'url'],
      ['facebook_url', '', 'Facebook URL', 'url'],
      ['hero_eyebrow', 'FRIENDS TOURS & TRAVELS • J.P. NAGAR, BANGALORE', 'Hero Eyebrow Tag', 'text'],
      ['hero_title', 'YOUR JOURNEY. OUR PRIORITY.', 'Hero Main Headline', 'text'],
      ['hero_subtitle', 'Bangalore\'s trusted partner for Employee Transportation, Airport Transport, Local & Outstation Rentals, and Shuttle Services.', 'Hero Subtitle', 'text'],
      ['about_title', 'MORE THAN A RIDE. A PROMISE.', 'About Section Title', 'text'],
      ['about_story', 'Founded with the ambition to set the gold standard in Bangalore commercial passenger transport, Friends Tours & Travels has grown into a premier fleet operator trusted by tech executives, corporate HR desks, and holidaying families.', 'About Story Paragraph', 'text'],
      ['stat_years_exp', '15+', 'Years in Bangalore', 'text'],
      ['stat_trips_completed', '50,000+', 'Completed Journeys', 'text'],
      ['stat_client_rating', '4.9 / 5', 'Customer Star Rating', 'text'],
      ['safety_gps', '100% GPS Fleet Tracking & Speed Governors', 'Safety Standard 1', 'text'],
      ['safety_police', 'Police Verified & Background Checked Chauffeurs', 'Safety Standard 2', 'text'],
      ['safety_sanitized', 'Deep Cleaned & Sanitized Cabins Before Every Trip', 'Safety Standard 3', 'text'],
      ['safety_billing', 'Transparent Computerized / Printed Receipt Billing', 'Safety Standard 4', 'text']
    ];
    for (const [key, value, label, type] of settings) {
      await query(`
        INSERT INTO site_settings (key, value, label, type)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (key) DO NOTHING
      `, [key, value, label, type]);
    }

    // 3. AIRPORT AREAS
    const airportCheck = await query('SELECT count(*) FROM airport_areas');
    if (parseInt(airportCheck.rows[0].count) === 0) {
      const airportAreas = [
        { id: 'yelahanka', name: 'Yelahanka', distance_km: 18, est_time: '25-35 mins', city_to_airport_fare: 700, airport_to_city_fare: 700, sort_order: 1 },
        { id: 'hebbal', name: 'Hebbal / Manyata Tech Park', distance_km: 28, est_time: '35-45 mins', city_to_airport_fare: 850, airport_to_city_fare: 850, sort_order: 2 },
        { id: 'mg-road', name: 'MG Road / Brigade / CBD', distance_km: 35, est_time: '50-65 mins', city_to_airport_fare: 950, airport_to_city_fare: 950, sort_order: 3 },
        { id: 'indiranagar', name: 'Indiranagar', distance_km: 38, est_time: '55-70 mins', city_to_airport_fare: 1000, airport_to_city_fare: 1000, sort_order: 4 },
        { id: 'koramangala', name: 'Koramangala', distance_km: 41, est_time: '65-80 mins', city_to_airport_fare: 1050, airport_to_city_fare: 1050, sort_order: 5 },
        { id: 'hsr-layout', name: 'HSR Layout', distance_km: 44, est_time: '70-85 mins', city_to_airport_fare: 1100, airport_to_city_fare: 1100, sort_order: 6 },
        { id: 'jp-nagar', name: 'J.P. Nagar / Jayanagar', distance_km: 43, est_time: '70-90 mins', city_to_airport_fare: 1100, airport_to_city_fare: 1100, sort_order: 7 },
        { id: 'whitefield', name: 'Whitefield / ITPL / Kadugodi', distance_km: 42, est_time: '60-80 mins', city_to_airport_fare: 1150, airport_to_city_fare: 1150, sort_order: 8 },
        { id: 'electronic-city', name: 'Electronic City (Phase 1 & 2)', distance_km: 55, est_time: '80-100 mins', city_to_airport_fare: 1350, airport_to_city_fare: 1350, sort_order: 9 },
        { id: 'bellandur-orr', name: 'Bellandur / Outer Ring Road', distance_km: 45, est_time: '70-90 mins', city_to_airport_fare: 1150, airport_to_city_fare: 1150, sort_order: 10 },
      ];
      for (const a of airportAreas) {
        await query(`
          INSERT INTO airport_areas (id, name, distance_km, est_time, city_to_airport_fare, airport_to_city_fare, active, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, true, $7)
          ON CONFLICT (id) DO NOTHING
        `, [a.id, a.name, a.distance_km, a.est_time, a.city_to_airport_fare, a.airport_to_city_fare, a.sort_order]);
      }
      console.log('✅ Seeded initial airport areas.');
    }

    // 4. OUTSTATION DESTINATIONS
    const outstationCheck = await query('SELECT count(*) FROM outstation_destinations');
    if (parseInt(outstationCheck.rows[0].count) === 0) {
      const outstationDestinations = [
        { id: 'nandi-hills', name: 'Nandi Hills', state: 'Karnataka', distance_km: 60, est_drive_time: '1.5 Hours', starting_price: 1999, tag: 'SUNRISE DRIVE', image: '/destinations/nandi-hills-sunrise.jpg', sort_order: 1 },
        { id: 'mysore', name: 'Mysore', state: 'Karnataka', distance_km: 145, est_drive_time: '2.5 Hours (Expressway)', starting_price: 3499, tag: 'ROYAL HERITAGE', image: '/destinations/mysore-palace.jpg', sort_order: 2 },
        { id: 'coorg', name: 'Coorg (Madikeri)', state: 'Karnataka', distance_km: 260, est_drive_time: '5.5 Hours', starting_price: 6499, tag: 'COFFEE ESTATES', image: '/destinations/coorg-abbey-falls.jpg', sort_order: 3 },
        { id: 'chikmagalur', name: 'Chikkamagaluru', state: 'Karnataka', distance_km: 245, est_drive_time: '4.5 Hours', starting_price: 5999, tag: 'PEAK TRAILS', image: '/destinations/chikmagalur-mullayanagiri.jpg', sort_order: 4 },
        { id: 'ooty', name: 'Ooty (Nilgiris)', state: 'Tamil Nadu', distance_km: 275, est_drive_time: '6.0 Hours', starting_price: 7499, tag: 'QUEEN OF HILLS', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', sort_order: 5 },
        { id: 'wayanad', name: 'Wayanad', state: 'Kerala', distance_km: 280, est_drive_time: '6.5 Hours', starting_price: 7299, tag: 'MISTY FORESTS', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', sort_order: 6 },
        { id: 'hampi', name: 'Hampi Heritage', state: 'Karnataka', distance_km: 345, est_drive_time: '6.5 Hours', starting_price: 8999, tag: 'UNESCO RUINS', image: 'https://images.unsplash.com/photo-1599827552599-ea260f85cb68?auto=format&fit=crop&w=800&q=80', sort_order: 7 },
        { id: 'pondicherry', name: 'Pondicherry', state: 'Tamil Nadu', distance_km: 310, est_drive_time: '6.5 Hours', starting_price: 7999, tag: 'FRENCH COLONIAL', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', sort_order: 8 }
      ];
      for (const d of outstationDestinations) {
        await query(`
          INSERT INTO outstation_destinations (id, name, state, distance_km, est_drive_time, starting_price, tag, image, active, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)
          ON CONFLICT (id) DO NOTHING
        `, [d.id, d.name, d.state, d.distance_km, d.est_drive_time, d.starting_price, d.tag, d.image, d.sort_order]);
      }
      console.log('✅ Seeded initial outstation destinations.');
    }

    // 5. TARIFF LOCAL
    const tariffCheck = await query('SELECT count(*) FROM tariff_local');
    if (parseInt(tariffCheck.rows[0].count) === 0) {
      const localTariff = [
        { vehicle_name: 'Etios / Swift Dzire / Logan', category: 'Compact Sedan', package_4hr_40km: 900, package_8hr_80km: 1700, extra_hour: 150, extra_km: 12, night_bata: 100, sort_order: 1 },
        { vehicle_name: 'Toyota Innova AC', category: 'Comfort MPV', package_4hr_40km: 1300, package_8hr_80km: 2800, extra_hour: 200, extra_km: 15, night_bata: 200, sort_order: 2 },
        { vehicle_name: 'Toyota Innova Crysta', category: 'Premium MPV', package_4hr_40km: null, package_8hr_80km: 3200, extra_hour: 250, extra_km: 19, night_bata: 200, sort_order: 3 },
        { vehicle_name: 'Toyota Corolla', category: 'Executive Sedan', package_4hr_40km: 1600, package_8hr_80km: 3200, extra_hour: 275, extra_km: 22, night_bata: 250, sort_order: 4 },
        { vehicle_name: 'Tempo Traveller AC (12-17 Seater)', category: 'Group Van', package_4hr_40km: null, package_8hr_80km: 4500, extra_hour: 300, extra_km: 23, night_bata: 300, sort_order: 5 },
        { vehicle_name: 'BMW 7 Series', category: 'Luxury Sedan', package_4hr_40km: 3000, package_8hr_80km: 6000, extra_hour: 450, extra_km: 44, night_bata: 500, sort_order: 6 },
        { vehicle_name: 'M.Benz-E Class E-350', category: 'Executive Luxury', package_4hr_40km: 3250, package_8hr_80km: 6500, extra_hour: 450, extra_km: 48, night_bata: 500, sort_order: 7 },
        { vehicle_name: 'M.Benz-S Class S-350', category: 'Ultra Luxury', package_4hr_40km: null, package_8hr_80km: 11000, extra_hour: 1100, extra_km: 110, night_bata: 750, sort_order: 8 },
        { vehicle_name: 'Audi A-6', category: 'Premium Luxury', package_4hr_40km: null, package_8hr_80km: 5250, extra_hour: 500, extra_km: 50, night_bata: 250, sort_order: 9 },
      ];
      for (const t of localTariff) {
        await query(`INSERT INTO tariff_local (vehicle_name, category, package_4hr_40km, package_8hr_80km, extra_hour, extra_km, night_bata, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`, [t.vehicle_name, t.category, t.package_4hr_40km, t.package_8hr_80km, t.extra_hour, t.extra_km, t.night_bata, t.sort_order]);
      }
    }

    // 6. TARIFF OUTSTATION
    const outTariffCheck = await query('SELECT count(*) FROM tariff_outstation');
    if (parseInt(outTariffCheck.rows[0].count) === 0) {
      const outstationTariff = [
        { vehicle_name: 'Etios / Swift Dzire', category: 'Compact Sedan', min_amount_per_day: 3600, extra_per_km: 12, driver_bata_day: 300, night_bata_extra: 300, sort_order: 1 },
        { vehicle_name: 'Toyota Innova AC', category: 'Comfort MPV', min_amount_per_day: 5100, extra_per_km: 17, driver_bata_day: 300, night_bata_extra: 350, sort_order: 2 },
        { vehicle_name: 'Toyota Innova Crysta', category: 'Premium MPV', min_amount_per_day: 5700, extra_per_km: 19, driver_bata_day: 350, night_bata_extra: 400, sort_order: 3 },
        { vehicle_name: 'Toyota Innova Hycross', category: 'Hybrid Luxury MPV', min_amount_per_day: 5700, extra_per_km: 19, driver_bata_day: 400, night_bata_extra: 400, sort_order: 4 },
        { vehicle_name: 'Tempo Traveller AC (12-17 Seater)', category: 'Group Van', min_amount_per_day: 6000, extra_per_km: 20, driver_bata_day: 400, night_bata_extra: 500, sort_order: 5 },
      ];
      for (const t of outstationTariff) {
        await query(
          `INSERT INTO tariff_outstation (vehicle_name, category, min_amount_per_day, extra_per_km, driver_bata_day, night_bata_extra, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
          [t.vehicle_name, t.category, t.min_amount_per_day, t.extra_per_km, t.driver_bata_day, t.night_bata_extra, t.sort_order]
        );
      }
    }

    // 7. VEHICLES
    const vehCheck = await query('SELECT count(*) FROM vehicles');
    if (parseInt(vehCheck.rows[0].count) === 0) {
      const vehicles = [
        {
          id: 'etios-dzire-logan', slug: 'etios-swift-dzire-logan',
          name: 'Etios / Swift Dzire / Logan', category: 'Compact Sedan', type_category: 'SEDAN',
          badge: 'BEST VALUE', color: 'White', passenger_capacity: '4 Passengers', passenger_count: 4,
          luggage_capacity: '2 Bags', air_conditioning: 'AC',
          best_suited_for: 'Airport Transfers / Local Sightseeing / Budget Outstation',
          image: '/fleet/dzire-white.jpg',
          gallery: ['/fleet/dzire-white.jpg', '/fleet/corolla-white.jpg', '/fleet/innova-white.jpg', '/fleet/innova-crysta-white.jpg'],
          description: 'Fuel-efficient, smart, and dependable for Bangalore city sightseeing, airport transfers, and economical outstation trips across Karnataka.',
          features: ['Clean, air-conditioned compact sedan with yellow board', '4hr/40km package at ₹900 & 8hr/80km package at ₹1,700', 'Outstation tariff: ₹3,600/day (300 km min) + ₹12/km extra', 'Experienced polite local driver with route expertise', 'Dedicated luggage trunk space for 2 standard suitcases', '24/7 round-the-clock booking availability'],
          rental_types: ['Local Bangalore (4hr/8hr)', 'Airport Transfer', 'Outstation (Min 300km)', 'Employee Commute'],
          rental_durations: ['Half Day (4hr/40km)', 'Full Day (8hr/80km)', 'Outstation Daily'],
          package_4hr_40km: 900, package_8hr_80km: 1700, extra_km: 12, extra_hour: 150, night_bata: 100,
          outstation_rate_per_km: 12, outstation_min_per_day: 3600,
          pricing_type: 'Local & Outstation Packages', price_note: 'Local 8hr/80km from ₹1,700 | Outstation from ₹3,600/day (300 km min)',
          featured: true, enabled: true, sort_order: 1,
        },
        {
          id: 'toyota-innova-ac', slug: 'toyota-innova-ac',
          name: 'Toyota Innova AC', category: 'Comfort MPV', type_category: 'MPV',
          badge: 'FAMILY FAVORITE', color: 'White', passenger_capacity: '6–7 Passengers', passenger_count: 7,
          luggage_capacity: '4 Bags', air_conditioning: 'Dual AC',
          best_suited_for: 'Family Vacations / Outstation / Airport Drops',
          image: '/fleet/innova-white.jpg',
          gallery: ['/fleet/innova-white.jpg', '/fleet/innova-crysta-white.jpg', '/fleet/tempo-white.jpg', '/fleet/dzire-white.jpg'],
          description: 'Renowned for rugged reliability, expansive legroom, and passenger comfort on long distance road trips from Bangalore to Coorg, Mysore, Wayanad and beyond.',
          features: ['Reliable 7-seater MPV with dual air conditioning', '4hr/40km package at ₹1,300 & 8hr/80km package at ₹2,800', 'Outstation tariff: ₹5,100/day (300 km min) + ₹17/km extra', 'High ground clearance ideal for hill station terrain', 'Generous luggage storage with foldable rear seats', 'Verified commercial tourist yellow board permit'],
          rental_types: ['Local Bangalore', 'Airport Transfer', 'Outstation (Min 300km)', 'Family Trips'],
          rental_durations: ['Half Day (4hr/40km)', 'Full Day (8hr/80km)', 'Outstation Daily'],
          package_4hr_40km: 1300, package_8hr_80km: 2800, extra_km: 15, extra_hour: 200, night_bata: 200,
          outstation_rate_per_km: 17, outstation_min_per_day: 5100,
          pricing_type: 'Local & Outstation Packages', price_note: 'Local 8hr/80km from ₹2,800 | Outstation from ₹5,100/day (300 km min)',
          featured: true, enabled: true, sort_order: 2,
        },
        {
          id: 'innova-crysta', slug: 'toyota-innova-crysta',
          name: 'Toyota Innova Crysta', category: 'Premium MPV', type_category: 'MPV',
          badge: 'MOST POPULAR', color: 'White', passenger_capacity: '6–7 Passengers', passenger_count: 7,
          luggage_capacity: '4 Bags', air_conditioning: 'Dual AC Climate',
          best_suited_for: 'Executive Travel / Family Tours / Mysore & Coorg',
          image: '/fleet/innova-crysta-white.jpg',
          gallery: ['/fleet/innova-crysta-white.jpg', '/fleet/innova-white.jpg', '/fleet/corolla-white.jpg', '/fleet/tempo-white.jpg'],
          description: 'The definitive benchmark for highway comfort in India. Features plush captain seating, smooth suspension, dual climate control, and supreme quietness.',
          features: ['Ergonomic captain seating with plush cushioning', 'Local 8hr/80km package at ₹3,200 (Extra Hr ₹250 | Extra Km ₹19)', 'Outstation tariff: ₹5,700/day (300 km min) + ₹19/km extra', 'Dual-zone climate control air conditioning for all rows', 'Spacious dedicated rear luggage compartment', 'Senior highway certified chauffeur'],
          rental_types: ['Local Bangalore (8hr/80km)', 'Airport Transfer', 'Outstation (Min 300km)', 'Corporate Travel'],
          rental_durations: ['Full Day (8hr/80km)', 'Outstation Multi-Day'],
          package_4hr_40km: null, package_8hr_80km: 3200, extra_km: 19, extra_hour: 250, night_bata: 200,
          outstation_rate_per_km: 19, outstation_min_per_day: 5700,
          pricing_type: 'Premium Packages', price_note: 'Local 8hr/80km from ₹3,200 | Outstation from ₹5,700/day',
          featured: true, enabled: true, sort_order: 3,
        },
        {
          id: 'tempo-traveller', slug: 'tempo-traveller-ac',
          name: 'Tempo Traveller AC (12–17 Seater)', category: 'Group Van', type_category: 'TEMPO TRAVELLER',
          badge: 'GROUP COMMUTE', color: 'White', passenger_capacity: '12–17 Passengers', passenger_count: 17,
          luggage_capacity: '8 Bags', air_conditioning: 'Roof-Mounted AC',
          best_suited_for: 'Corporate Outings / Pilgrimages / Wedding Convoys',
          image: '/fleet/tempo-white.jpg',
          gallery: ['/fleet/tempo-white.jpg', '/fleet/innova-crysta-white.jpg', '/fleet/innova-white.jpg'],
          description: 'Spacious high-roof van for family reunions, corporate teams, and pilgrim tours with wide aisle walk-through space.',
          features: ['Pushback bucket seats with generous legroom', 'Local 8hr/80km package at ₹4,500', 'Outstation tariff: ₹6,000/day (300 km min) + ₹20/km extra', 'Individual AC vents with ambient reading lights', 'Spacious dedicated rear luggage compartment', 'Senior highway coach pilot'],
          rental_types: ['Corporate Shuttles', 'Outstation Trips', 'Event Transport'],
          rental_durations: ['Full Day (8hr/80km)', 'Multi-Day Outstation'],
          package_4hr_40km: null, package_8hr_80km: 4500, extra_km: 23, extra_hour: 300, night_bata: 300,
          outstation_rate_per_km: 20, outstation_min_per_day: 6000,
          pricing_type: 'Group Transit Packages', price_note: 'Local 8hr/80km ₹4,500 | Outstation from ₹6,000/day',
          featured: true, enabled: true, sort_order: 4,
        }
      ];
      for (const v of vehicles) {
        await query(`
          INSERT INTO vehicles (
            id, slug, name, category, type_category, badge, color, passenger_capacity,
            passenger_count, luggage_capacity, air_conditioning, best_suited_for,
            image, gallery, description, features, rental_types, rental_durations,
            package_4hr_40km, package_8hr_80km, extra_km, extra_hour, night_bata,
            outstation_rate_per_km, outstation_min_per_day, pricing_type, price_note,
            featured, enabled, sort_order
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
            $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30
          ) ON CONFLICT (id) DO NOTHING
        `, [
          v.id, v.slug, v.name, v.category, v.type_category, v.badge, v.color,
          v.passenger_capacity, v.passenger_count, v.luggage_capacity, v.air_conditioning,
          v.best_suited_for, v.image, JSON.stringify(v.gallery), v.description,
          JSON.stringify(v.features), JSON.stringify(v.rental_types), JSON.stringify(v.rental_durations),
          v.package_4hr_40km, v.package_8hr_80km, v.extra_km, v.extra_hour, v.night_bata,
          v.outstation_rate_per_km, v.outstation_min_per_day, v.pricing_type, v.price_note,
          v.featured, v.enabled, v.sort_order,
        ]);
      }
      console.log('✅ Seeded initial vehicles.');
    }

    // 8. TOUR PACKAGES
    const pkgCheck = await query('SELECT count(*) FROM packages');
    if (parseInt(pkgCheck.rows[0].count) === 0) {
      const packages = [
        {
          id: 'pkg-nandi', slug: 'nandi-hills-sunrise', name: 'Nandi Hills Sunrise Tour',
          destination: 'Nandi Hills', state: 'Karnataka', country: 'India',
          hero_image: '/destinations/nandi-hills-sunrise.jpg',
          gallery: ['/destinations/nandi-hills-sunrise.jpg', '/destinations/bangalore-city.jpg'],
          badge: 'BEST SELLER', duration: '1 Day', nights: 'Same Day Return',
          travel_type: 'Sunrise & Scenic Hill Drive',
          vehicle_options: ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'],
          default_vehicle: 'Sedan / SUV', group_size: '1–6 Persons',
          best_for: 'Couples, Friends & Early Morning Explorers',
          short_description: 'Catch the famous cloud-bed sunrise at Nandi Hills with an early morning private chauffeur pickup from Bangalore.',
          overview: 'Experience the magic of twilight transforming into a sea of clouds above the Deccan plains.',
          highlights: ['Early morning 4:30 AM doorstep pickup across Bangalore', 'Spectacular view of sunrise above the mist and clouds at Nandi Peak', 'Visit to historic Bhoga Nandeeshwara Temple'],
          itinerary: [{ day: '4:30 AM', title: 'Doorstep Pickup & Highway Drive', description: 'Chauffeur arrives at your location in Bangalore.' }, { day: '6:00 AM', title: 'Nandi Hills Sunrise & Viewpoint', description: 'Arrive at the hilltop before dawn.' }],
          inclusions: ['Private air-conditioned vehicle for the entire round trip', 'Dedicated professional driver', 'All toll charges and fuel'],
          exclusions: ['Food, beverages, and personal expenses'],
          travel_information: { pickup: 'Any location in Bangalore', drop: 'Any location in Bangalore' },
          pricing_type: 'Custom Quote', price_starting: '₹1,999', featured: true, enabled: true, sort_order: 1,
        },
        {
          id: 'pkg-mysore', slug: 'mysore-heritage-escape', name: 'Mysore Heritage Escape',
          destination: 'Mysore', state: 'Karnataka', country: 'India',
          hero_image: '/destinations/mysore-palace.jpg',
          gallery: ['/destinations/mysore-palace.jpg'],
          badge: 'POPULAR', duration: '1 Day', nights: 'Same Day Return',
          travel_type: 'Heritage & Cultural Day Tour',
          vehicle_options: ['Sedan', 'Innova Crysta'],
          default_vehicle: 'Sedan / Innova', group_size: '1–7 Persons',
          best_for: 'Families, History Enthusiasts & Heritage Lovers',
          short_description: 'A full-day guided heritage excursion to the City of Palaces via the Bangalore-Mysore Expressway.',
          overview: 'Discover grand Mysore royal heritage, Chamundi Hill temple vistas, and the magnificent illuminated palace.',
          highlights: ['Expressway cruising from Bangalore', 'Chamundeshwari Temple & Nandi Bull', 'Mysore Palace Grand Tour', 'Brindavan Gardens Musical Fountain'],
          itinerary: [{ day: '6:30 AM', title: 'Departure from Bangalore', description: 'Swift drive via Expressway.' }, { day: '9:30 AM', title: 'Chamundi Hills', description: 'Panoramic temple hill view.' }],
          inclusions: ['Private AC car & chauffeur', 'Fuel, tolls, parking fees'],
          exclusions: ['Palace entry tickets', 'Meals & refreshments'],
          travel_information: { distance: 'Approx. 145 km one-way' },
          pricing_type: 'Fixed Tariff', price_starting: '₹3,499', featured: true, enabled: true, sort_order: 2,
        },
        {
          id: 'pkg-coorg', slug: 'coorg-coffee-hills-getaway', name: 'Coorg Coffee & Misty Hills Getaway',
          destination: 'Coorg (Madikeri)', state: 'Karnataka', country: 'India',
          hero_image: '/destinations/coorg-abbey-falls.jpg',
          gallery: ['/destinations/coorg-abbey-falls.jpg'],
          badge: 'FEATURED ESCAPE', duration: '2 Days / 1 Night', nights: '1 Night',
          travel_type: 'Hill Station & Nature Retreat',
          vehicle_options: ['Innova Crysta', 'Toyota Innova AC', 'Etios Sedan'],
          default_vehicle: 'Innova Crysta', group_size: '2–7 Persons',
          best_for: 'Family Holidays, Romantic Getaways & Nature Lovers',
          short_description: 'Rejuvenating road trip to the Scotland of India. Coffee estate aromas, waterfalls, and panoramic peaks.',
          overview: 'Leave the city behind and ascend into the cool Western Ghats of Kodagu.',
          highlights: ['Scenic Western Ghats mountain drive', 'Abbey Falls visit', 'Raja\'s Seat sunset viewpoint', 'Dubare Elephant Camp'],
          itinerary: [{ day: 'Day 1', title: 'Bangalore to Madikeri', description: 'Drive to Coorg with stops at Bylakuppe Tibetan Monastery.' }, { day: 'Day 2', title: 'Sightseeing & Return', description: 'Abbey Falls and scenic return.' }],
          inclusions: ['Dedicated private cab for 2 full days', 'Driver allowance & tolls'],
          exclusions: ['Hotel accommodations', 'Entry fees'],
          travel_information: { distance: 'Approx. 260 km' },
          pricing_type: 'Custom Quote', price_starting: '₹6,499', featured: true, enabled: true, sort_order: 3,
        }
      ];
      for (const p of packages) {
        await query(`
          INSERT INTO packages (
            id, slug, name, destination, state, country, hero_image, gallery, badge,
            duration, nights, travel_type, vehicle_options, default_vehicle, group_size,
            best_for, short_description, overview, highlights, itinerary, inclusions,
            exclusions, travel_information, pricing_type, price_starting, featured, enabled, sort_order
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
            $19,$20,$21,$22,$23,$24,$25,$26,$27,$28
          ) ON CONFLICT (id) DO NOTHING
        `, [
          p.id, p.slug, p.name, p.destination, p.state, p.country, p.hero_image,
          JSON.stringify(p.gallery), p.badge, p.duration, p.nights, p.travel_type,
          JSON.stringify(p.vehicle_options), p.default_vehicle, p.group_size, p.best_for,
          p.short_description, p.overview, JSON.stringify(p.highlights), JSON.stringify(p.itinerary),
          JSON.stringify(p.inclusions), JSON.stringify(p.exclusions), JSON.stringify(p.travel_information),
          p.pricing_type, p.price_starting, p.featured, p.enabled, p.sort_order,
        ]);
      }
      console.log('✅ Seeded initial tour packages.');
    }

    // 9. TESTIMONIALS
    const testCheck = await query('SELECT count(*) FROM testimonials');
    if (parseInt(testCheck.rows[0].count) === 0) {
      const testimonials = [
        { customer_name: 'Rajesh Kumar', designation: 'Software Engineer', location: 'Koramangala, Bangalore', rating: 5, review: 'Excellent service! The driver was punctual and the car was very clean. Booked an Innova Crysta for Coorg trip and it was absolutely comfortable. Will definitely book again.', trip_type: 'Outstation', vehicle_used: 'Innova Crysta', travel_date: 'Jan 2026', is_featured: true },
        { customer_name: 'Priya Sharma', designation: 'HR Manager', location: 'Whitefield, Bangalore', rating: 5, review: 'Used Friends Tours for our company employee shuttle. Very reliable and professional. The drivers are polite and always on time.', trip_type: 'Employee Transport', vehicle_used: 'Tempo Traveller', travel_date: 'Dec 2025', is_featured: true },
        { customer_name: 'Mohammed Irfan', designation: 'Business Owner', location: 'Shivajinagar, Bangalore', rating: 5, review: 'Booked for my family trip to Mysore. Excellent driver, clean vehicle, and very affordable rates. The best cab service I have used in Bangalore.', trip_type: 'Outstation', vehicle_used: 'Toyota Innova', travel_date: 'Feb 2026', is_featured: true },
        { customer_name: 'Ananya Reddy', designation: 'Doctor', location: 'JP Nagar, Bangalore', rating: 5, review: 'Perfect airport transfer service. Driver was waiting at the terminal with a name board. Very professional and comfortable ride to my hotel.', trip_type: 'Airport Transfer', vehicle_used: 'Swift Dzire', travel_date: 'Mar 2026', is_featured: true },
      ];
      for (const t of testimonials) {
        await query(`
          INSERT INTO testimonials (customer_name, designation, location, rating, review, trip_type, vehicle_used, travel_date, is_featured, is_approved)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true)
          ON CONFLICT DO NOTHING
        `, [t.customer_name, t.designation, t.location, t.rating, t.review, t.trip_type, t.vehicle_used, t.travel_date, t.is_featured]);
      }
      console.log('✅ Seeded initial testimonials.');
    }
  } catch (err) {
    console.warn('Auto-seed non-fatal notice:', err.message);
  }
}
