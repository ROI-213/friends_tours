import { query } from '../db.js';

export async function addAirportAndOutstationTables() {
  console.log('Adding airport_areas and outstation_destinations tables...');

  // --- AIRPORT AREAS ---
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

  console.log('✅ airport_areas and outstation_destinations tables created and seeded.');
}

addAirportAndOutstationTables().catch(console.error);
