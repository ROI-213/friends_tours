import { query } from '../db.js';

export async function addServicesTable() {
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

  const initialServices = [
    {
      id: 'srv-employee',
      slug: 'employee-transportation',
      title: 'EMPLOYEE TRANSPORTATION',
      badge: 'SERVICE 01 • CORPORATE MOBILITY',
      category: 'Corporate Mobility',
      short_desc: 'Dedicated daily employee pickup and drop services for Bangalore tech parks, IT/BPO companies, and corporate offices.',
      full_desc: 'Dedicated daily employee pickup and drop services for Bangalore tech parks (Whitefield, Electronic City, Manyata, ORR), IT/BPO companies, and corporate offices. Includes centralized monthly GST billing, automated MIS logs, and vetted chauffeurs.',
      features: ['Scheduled Shift Pickups', 'Tech Park Transit', 'Monthly GST Invoicing', 'Vetted & Uniformed Drivers', '24/7 Dispatch Desk'],
      image: '/services/employee-transport.jpg',
      target_route: '/services/corporate-travel',
      sort_order: 1
    },
    {
      id: 'srv-airport',
      slug: 'airport-transport',
      title: 'AIRPORT TRANSPORT',
      badge: 'SERVICE 02 • 24/7 AIRPORT SERVICE',
      category: 'Airport Transfers',
      short_desc: 'Reliable airport pickup and drop services connecting Kempegowda International Airport (BLR) with all Bangalore areas.',
      full_desc: 'Reliable airport pickup and drop services connecting Kempegowda International Airport (BLR) with all Bangalore areas. Real-time flight tracking ensures chauffeurs adjust automatically for flight delays with zero waiting surcharges.',
      features: ['Kempegowda Airport Drops', 'Terminal 1 & 2 Pickups', 'Live Flight Delay Tracking', 'Expressway Toll Management', 'Luggage Handling Assistance'],
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      target_route: '/services/airport-transfer',
      sort_order: 2
    },
    {
      id: 'srv-local-outstation',
      slug: 'local-and-outstation-rentals',
      title: 'LOCAL AND OUTSTATION RENTALS',
      badge: 'SERVICE 03 • HOURLY & HIGHWAY',
      category: 'Car Rentals',
      short_desc: 'Flexible hourly rentals (4hr/40km & 8hr/80km) for Bangalore city transit, plus outstation highway rentals (min 300 km/day).',
      full_desc: 'Flexible hourly rentals (4hr/40km & 8hr/80km) for Bangalore city transit, business errands, and shopping, plus outstation highway rentals (min 300 km/day) to Mysore, Coorg, Ooty, Chikmagalur, Hampi, and South India.',
      features: ['4hr/40km Half Day', '8hr/80km Full Day', 'Outstation Min 300km/Day', 'Transparent Per-Km Rates', 'Highway Verified Drivers'],
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      target_route: '/local-packages',
      sort_order: 3
    },
    {
      id: 'srv-shuttle',
      slug: 'shuttle-services',
      title: 'SHUTTLE SERVICES',
      badge: 'SERVICE 04 • GROUP & EVENT FLEET',
      category: 'Group Transit',
      short_desc: 'Cost-effective point-to-point shuttle transportation for corporate delegations, tech conferences, and wedding convoys.',
      full_desc: 'Cost-effective point-to-point shuttle transportation for corporate delegations, tech conferences, wedding guest convoys, and group tours with 12–17 seater AC & Non-AC Tempo Travellers.',
      features: ['Corporate Office Shuttles', 'Wedding & Event Transfers', '12–17 Seater Tempo AC', 'Conference Transit', 'Large Group Economy'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      target_route: '/rental-cars',
      sort_order: 4
    }
  ];

  for (const s of initialServices) {
    await query(`
      INSERT INTO services (id, slug, title, badge, category, short_desc, full_desc, features, image, target_route, sort_order, enabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
      ON CONFLICT (id) DO NOTHING
    `, [s.id, s.slug, s.title, s.badge, s.category, s.short_desc, s.full_desc, JSON.stringify(s.features), s.image, s.target_route, s.sort_order]);
  }

  // Also add rich section content settings if not present
  const richSettings = [
    ['hero_eyebrow', 'Premier Chauffeur & Travel Partner in Bangalore', 'Hero Eyebrow Tag', 'text'],
    ['hero_title', 'DISCOVER THE JOY OF EFFORTLESS TRAVEL', 'Hero Main Headline', 'text'],
    ['hero_subtitle', 'Clean, commercial yellow-board sedans, spacious MPVs, executive luxury coaches, and reliable group shuttles with vetted highway chauffeurs.', 'Hero Subtitle', 'text'],
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

  for (const [key, value, label, type] of richSettings) {
    await query(`
      INSERT INTO site_settings (key, value, label, type)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (key) DO NOTHING
    `, [key, value, label, type]);
  }

  console.log('✅ Services table & rich site content settings initialized.');
}

addServicesTable().catch(console.error);
