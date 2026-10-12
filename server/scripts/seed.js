import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { runMigrations } from './migrate.js';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Run migrations first
  await runMigrations();

  // ── ADMIN USER ────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin@FT2026!', 12);
  await query(`
    INSERT INTO admin_users (email, password_hash, name, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `, ['admin@friendstours.in', passwordHash, 'Admin', 'superadmin']);

  console.log('✅ Admin user created: admin@friendstours.in / admin@FT2026!');

  // ── SITE SETTINGS ─────────────────────────────────────────────────────────
  const settings = [
    ['site_name', 'Friends Tours & Travels', 'Site Name', 'text'],
    ['site_tagline', 'Your Journey. Our Priority.', 'Tagline', 'text'],
    ['phone', '+91 98765 43210', 'Phone Number', 'text'],
    ['whatsapp', '+919876543210', 'WhatsApp Number', 'text'],
    ['email', 'info@friendstours.in', 'Email', 'email'],
    ['address', 'J.P. Nagar, Bangalore – 560078', 'Address', 'text'],
    ['google_maps_url', 'https://maps.google.com', 'Google Maps URL', 'url'],
    ['instagram_url', '', 'Instagram URL', 'url'],
    ['facebook_url', '', 'Facebook URL', 'url'],
  ];
  for (const [key, value, label, type] of settings) {
    await query(`
      INSERT INTO site_settings (key, value, label, type)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (key) DO NOTHING
    `, [key, value, label, type]);
  }
  console.log('✅ Site settings seeded.');

  // ── VEHICLES ──────────────────────────────────────────────────────────────
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
      package_4hr_40km: 900, package_8hr_80km: 1700, extra_km: 32, extra_hour: 150, night_bata: 100,
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
      package_4hr_40km: 1300, package_8hr_80km: 2800, extra_km: 17, extra_hour: 200, night_bata: 200,
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
      pricing_type: 'Local & Outstation Packages', price_note: 'Local 8hr/80km at ₹3,200 | Outstation from ₹5,700/day (300 km min)',
      featured: true, enabled: true, sort_order: 3,
    },
    {
      id: 'tempo-traveller-ac', slug: 'tempo-traveller-ac',
      name: 'Tempo Traveller AC', category: '12–17 Seater AC Van', type_category: 'TEMPO TRAVELLER',
      badge: 'GROUP FAVORITE', color: 'White', passenger_capacity: '12–17 Passengers', passenger_count: 17,
      luggage_capacity: '8–10 Bags', air_conditioning: 'Dual High AC',
      best_suited_for: 'Group Outstation / Wedding Delegations / Corporate Outings',
      image: '/fleet/tempo-white.jpg',
      gallery: ['/fleet/tempo-white.jpg', '/fleet/innova-white.jpg'],
      description: 'The premier choice for large families, wedding parties, and corporate groups travelling together with pushback reclining seats and individual AC vents.',
      features: ['Pushback reclining individual seats with generous headspace', 'Local 8hr/80km package at ₹4,500 (Extra Hr ₹300 | Extra Km ₹23)', 'Outstation tariff: ₹6,000/day (300 km min) + ₹20/km extra', 'Dual high-capacity air conditioning across all rows', 'Large rear luggage compartment & entertainment system', 'Experienced commercial highway coach chauffeur'],
      rental_types: ['Group Outstation', 'Family Weddings', 'Corporate Shuttles', 'Pilgrimage'],
      rental_durations: ['Full Day (8hr/80km)', 'Outstation Multi-Day'],
      package_4hr_40km: null, package_8hr_80km: 4500, extra_km: 23, extra_hour: 300, night_bata: 300,
      outstation_rate_per_km: 20, outstation_min_per_day: 6000,
      pricing_type: 'Group Packages', price_note: 'Local 8hr/80km at ₹4,500 | Outstation from ₹6,000/day (300 km min)',
      featured: true, enabled: true, sort_order: 4,
    },
    {
      id: 'toyota-corolla-ac', slug: 'toyota-corolla-ac',
      name: 'Toyota Corolla AC', category: 'Executive Sedan', type_category: 'SEDAN',
      badge: 'EXECUTIVE CHOICE', color: 'White', passenger_capacity: '4 Passengers', passenger_count: 4,
      luggage_capacity: '3 Bags', air_conditioning: 'Climate Control',
      best_suited_for: 'Corporate Meetings / Executive Highway Trips',
      image: '/fleet/corolla-white.jpg',
      gallery: ['/fleet/corolla-white.jpg', '/fleet/dzire-white.jpg', '/fleet/bmw-7-white.jpg'],
      description: 'Acoustic quietness and executive refinement for tech park delegates, visiting clients, and comfortable intercity business highway trips.',
      features: ['Quiet executive cabin with plush rear seating', '4hr/40km package at ₹1,600 & 8hr/80km package at ₹3,200', 'Outstation tariff: ₹6,000/day (300 km min) + ₹20/km extra', 'Automatic climate control air conditioning', 'Mobile charging ports & bottled water provided'],
      rental_types: ['Airport Transfer', 'Corporate Mobility', 'Local 4hr/8hr', 'Outstation'],
      rental_durations: ['Half Day (4hr/40km)', 'Full Day (8hr/80km)', 'Outstation Daily'],
      package_4hr_40km: 1600, package_8hr_80km: 3200, extra_km: 22, extra_hour: 275, night_bata: 250,
      outstation_rate_per_km: 20, outstation_min_per_day: 6000,
      pricing_type: 'Local & Outstation Packages', price_note: 'Local 8hr/80km at ₹3,200 | Outstation from ₹6,000/day (300 km min)',
      featured: false, enabled: true, sort_order: 5,
    },
    {
      id: 'bmw-7-series', slug: 'bmw-7-series',
      name: 'BMW 7 Series', category: 'Luxury Sedan', type_category: 'LUXURY',
      badge: 'GERMAN LUXURY', color: 'White', passenger_capacity: '3–4 Passengers', passenger_count: 4,
      luggage_capacity: '2 Bags', air_conditioning: 'Multi-Zone Climate',
      best_suited_for: 'VIP Delegations / Celebrity Transit / Luxury Weddings',
      image: '/fleet/bmw-7-white.jpg',
      gallery: ['/fleet/bmw-7-white.jpg', '/fleet/mercedes-s-white.jpg', '/fleet/mercedes-e-white.jpg'],
      description: 'Flagship German engineering, whisper-quiet cabin, and rear executive lounge comfort for high-profile business leaders and luxury weddings.',
      features: ['World-class acoustic insulation and rear lounge comfort', '4hr/40km package at ₹3,000 & 8hr/80km package at ₹6,000', 'Extra hour ₹450 | Extra km ₹44 | Night Bata ₹500', 'Multi-zone automatic climate control', 'White-glove executive chauffeur service'],
      rental_types: ['VIP Airport Transfer', 'Corporate VIP', 'Luxury Wedding'],
      rental_durations: ['4hr / 8hr Retainer', 'Full Day Event'],
      package_4hr_40km: 3000, package_8hr_80km: 6000, extra_km: 44, extra_hour: 450, night_bata: 500,
      outstation_rate_per_km: null, outstation_min_per_day: null,
      pricing_type: 'VIP Luxury Packages', price_note: '4hr/40km ₹3,000 | 8hr/80km ₹6,000 | Extra Hr ₹450',
      featured: false, enabled: true, sort_order: 6,
    },
    {
      id: 'mercedes-e-class', slug: 'mercedes-benz-e-class-e350',
      name: 'M.Benz-E Class E-350', category: 'Executive Luxury Sedan', type_category: 'LUXURY',
      badge: 'EXECUTIVE VIP', color: 'White', passenger_capacity: '3–4 Passengers', passenger_count: 4,
      luggage_capacity: '2 Bags', air_conditioning: 'Multi-Zone Climate',
      best_suited_for: 'Corporate Executives / Airport Transfers / VIP Visits',
      image: '/fleet/mercedes-e-white.jpg',
      gallery: ['/fleet/mercedes-e-white.jpg', '/fleet/mercedes-s-white.jpg', '/fleet/bmw-7-white.jpg'],
      description: 'Timeless Mercedes-Benz elegance and superior ride quality for corporate board members and dignitaries visiting Bangalore.',
      features: ['4hr/40km package at ₹3,250 & 8hr/80km package at ₹6,500', 'Extra hour ₹450 | Extra km ₹48 | Night Bata ₹500', 'Supple leather seating with individual climate zones', 'Senior executive chauffeur in formal attire'],
      rental_types: ['VIP Airport Transfer', 'Corporate Retainer', 'Luxury Events'],
      rental_durations: ['4hr / 8hr Retainer', 'Full Day Event'],
      package_4hr_40km: 3250, package_8hr_80km: 6500, extra_km: 48, extra_hour: 450, night_bata: 500,
      outstation_rate_per_km: null, outstation_min_per_day: null,
      pricing_type: 'VIP Luxury Packages', price_note: '4hr/40km ₹3,250 | 8hr/80km ₹6,500 | Extra Hr ₹450',
      featured: false, enabled: true, sort_order: 7,
    },
    {
      id: 'mercedes-s-class', slug: 'mercedes-benz-s-class-s350',
      name: 'M.Benz-S Class S-350', category: 'Ultra Luxury Flagship', type_category: 'LUXURY',
      badge: 'FLAGSHIP VIP', color: 'White', passenger_capacity: '3–4 Passengers', passenger_count: 4,
      luggage_capacity: '2 Bags', air_conditioning: 'Multi-Zone Climate',
      best_suited_for: 'Diplomats / High-Profile VIPs / Royal Weddings',
      image: '/fleet/mercedes-s-white.jpg',
      gallery: ['/fleet/mercedes-s-white.jpg', '/fleet/mercedes-e-white.jpg', '/fleet/bmw-7-white.jpg'],
      description: 'The pinnacle of luxury motoring. Reclining executive massage seats, airmatic suspension, and uncompromised prestige.',
      features: ['Local 8hr/80km package at ₹11,000', 'Extra hour ₹1,100 | Extra km ₹110 | Night Bata ₹750', 'First-class rear executive lounge seating', 'Dedicated concierge coordinator support'],
      rental_types: ['VIP Airport Transfer', 'Royal Wedding', 'Diplomatic Convoy'],
      rental_durations: ['Full Day (8hr/80km)', 'Custom VIP Event'],
      package_4hr_40km: null, package_8hr_80km: 11000, extra_km: 110, extra_hour: 1100, night_bata: 750,
      outstation_rate_per_km: null, outstation_min_per_day: null,
      pricing_type: 'Ultra Luxury Packages', price_note: '8hr/80km ₹11,000 | Extra Hr ₹1,100 | Extra Km ₹110',
      featured: false, enabled: true, sort_order: 8,
    },
    {
      id: 'audi-a6', slug: 'audi-a6-sedan',
      name: 'Audi A-6', category: 'Premium Luxury Sedan', type_category: 'LUXURY',
      badge: 'PRESTIGE LUXURY', color: 'White', passenger_capacity: '3–4 Passengers', passenger_count: 4,
      luggage_capacity: '2 Bags', air_conditioning: 'Multi-Zone Climate',
      best_suited_for: 'Corporate Leadership / Airport Drops / City Transit',
      image: '/fleet/audi-a6-white.jpg',
      gallery: ['/fleet/audi-a6-white.jpg', '/fleet/bmw-7-white.jpg', '/fleet/mercedes-e-white.jpg'],
      description: 'Contemporary styling, quattro all-wheel drive stability, and plush cabin luxury for executive travel.',
      features: ['Local 8hr/80km package at ₹5,250', 'Extra hour ₹500 | Extra km ₹50 | Night Bata ₹250', 'Matrix LED lighting and digital cockpit comfort', 'Experienced executive chauffeur'],
      rental_types: ['VIP Airport Transfer', 'Corporate Travel', 'Local 8hr/80km'],
      rental_durations: ['Full Day (8hr/80km)', 'Custom Event'],
      package_4hr_40km: null, package_8hr_80km: 5250, extra_km: 50, extra_hour: 500, night_bata: 250,
      outstation_rate_per_km: null, outstation_min_per_day: null,
      pricing_type: 'Premium Luxury Packages', price_note: '8hr/80km ₹5,250 | Extra Hr ₹500 | Extra Km ₹50',
      featured: false, enabled: true, sort_order: 9,
    },
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
  console.log(`✅ ${vehicles.length} vehicles seeded.`);

  // ── PACKAGES ──────────────────────────────────────────────────────────────
  const packages = [
    {
      id: 'pkg-nandi', slug: 'nandi-hills-sunrise', name: 'Nandi Hills Sunrise Tour',
      destination: 'Nandi Hills', state: 'Karnataka', country: 'India',
      hero_image: '/destinations/nandi-hills-sunrise.jpg',
      gallery: ['/destinations/nandi-hills-sunrise.jpg', '/destinations/bangalore-city.jpg', '/destinations/ramanagara-hills.jpg', '/destinations/savandurga.jpg'],
      badge: 'BEST SELLER', duration: '1 Day', nights: 'Same Day Return',
      travel_type: 'Sunrise & Scenic Hill Drive',
      vehicle_options: ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'],
      default_vehicle: 'Sedan / SUV', group_size: '1–6 Persons',
      best_for: 'Couples, Friends & Early Morning Explorers',
      short_description: 'Catch the famous cloud-bed sunrise at Nandi Hills with an early morning private chauffeur pickup from Bangalore.',
      overview: 'Experience the magic of twilight transforming into a sea of clouds above the Deccan plains.',
      highlights: ['Early morning 4:30 AM doorstep pickup across Bangalore', 'Spectacular view of sunrise above the mist and clouds at Nandi Peak', 'Visit to historic Bhoga Nandeeshwara Temple', 'Breakfast stop at renowned highway breakfast spots', 'Comfortable return to Bangalore by early afternoon'],
      itinerary: [{ day: '4:30 AM', title: 'Doorstep Pickup & Highway Drive', description: 'Chauffeur arrives at your location in Bangalore.' }, { day: '6:00 AM', title: 'Nandi Hills Sunrise & Viewpoint', description: 'Arrive at the hilltop before dawn.' }, { day: '8:30 AM', title: 'Heritage Temple Visit & Breakfast', description: 'Explore the Bhoga Nandeeshwara Temple, followed by a south Indian breakfast.' }, { day: '11:30 AM', title: 'Return Journey to Bangalore', description: 'Smooth highway drive back to Bangalore.' }],
      inclusions: ['Private air-conditioned vehicle for the entire round trip', 'Dedicated professional driver', 'All toll charges and fuel', 'Doorstep pickup and return drop-off'],
      exclusions: ['Food, beverages, and restaurant bills', 'Hilltop entry ticket fees', 'Personal expenses'],
      travel_information: { pickup: 'Any location in Bangalore', drop: 'Any location in Bangalore', distance: 'Approx. 60 km one-way', bestTime: 'All Year Round', tollIncluded: 'Yes', driverAllowance: 'Included' },
      pricing_type: 'Custom Quote', price_starting: '₹1,999', featured: true, enabled: true, sort_order: 1,
    },
    {
      id: 'pkg-mysore', slug: 'mysore-heritage-escape', name: 'Mysore Heritage Escape',
      destination: 'Mysore', state: 'Karnataka', country: 'India',
      hero_image: '/destinations/mysore-palace.jpg',
      gallery: ['/destinations/mysore-palace.jpg', '/destinations/bangalore-city.jpg', '/destinations/coorg-abbey-falls.jpg', '/destinations/ramanagara-hills.jpg'],
      badge: 'POPULAR', duration: '1 Day', nights: 'Same Day or Optional 1 Night',
      travel_type: 'Royal Heritage & Culture',
      vehicle_options: ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'],
      default_vehicle: 'Sedan / SUV / Innova', group_size: '1–7 Persons',
      best_for: 'Families, Heritage Lovers & Day Getaways',
      short_description: 'Explore the grandeur of the illuminated Mysore Palace, Chamundi Hills, and Srirangapatna.',
      overview: 'Travel comfortably along the modern Bangalore-Mysore Expressway in a private chauffeur cab.',
      highlights: ['Fast travel via the 10-lane Bangalore-Mysore Expressway', 'Grand Mysore Palace tour', 'Scenic climb to Chamundi Hill temple', 'Historic stop at Tipu Sultan summer palace', 'Evening illuminated palace view'],
      itinerary: [{ day: '7:00 AM', title: 'Bangalore Departure via Expressway', description: 'Doorstep pickup in Bangalore.' }, { day: '10:00 AM', title: 'Srirangapatna & Chamundi Hill', description: 'Explore the historic island fortress.' }, { day: '1:30 PM', title: 'Mysore Palace & Royal Art Gallery', description: 'Marvel at the architecture of the Mysore Maharaja Palace.' }, { day: '6:30 PM', title: 'Brindavan Gardens & Return Drive', description: 'Visit the musical fountains before returning to Bangalore.' }],
      inclusions: ['Private luxury vehicle for full-day round trip', 'Expressway toll charges', 'Experienced chauffeur', 'Doorstep pickup and drop'],
      exclusions: ['Palace and garden entrance tickets', 'Lunch, dinner, and personal shopping'],
      travel_information: { pickup: 'Any Bangalore location / Airport', drop: 'Any Bangalore location / Airport', distance: 'Approx. 145 km each way', bestTime: 'All Year', tollIncluded: 'Yes', driverAllowance: 'Included' },
      pricing_type: 'Custom Quote', price_starting: '₹3,499', featured: true, enabled: true, sort_order: 2,
    },
    {
      id: 'pkg-coorg', slug: 'coorg-nature-retreat', name: 'Coorg Nature Retreat',
      destination: 'Coorg (Madikeri)', state: 'Karnataka', country: 'India',
      hero_image: '/destinations/coorg-abbey-falls.jpg',
      gallery: ['/destinations/coorg-abbey-falls.jpg', '/destinations/chikmagalur-mullayanagiri.jpg', '/destinations/mysore-palace.jpg'],
      badge: 'WEEKEND DEAL', duration: '2 Days / 1 Night', nights: '1 Night Stay',
      travel_type: 'Coffee Estates & Hill Retreat',
      vehicle_options: ['SUV', 'Innova Crysta', 'Toyota Fortuner', 'Tempo Traveller'],
      default_vehicle: 'SUV / Innova / Tempo Traveller', group_size: '2–12 Persons',
      best_for: 'Couples, Families & Nature Enthusiasts',
      short_description: 'Escape to the Scotland of India with lush coffee plantations, cascading Abbey Falls, and Tibetan monastery peace.',
      overview: 'Rejuvenate amidst the misty hills and aromatic spice plantations of Coorg.',
      highlights: ['Doorstep pickup from Bangalore in comfortable Innova Crysta / SUV', 'Visit Golden Temple Tibetan Monastery at Bylakuppe', 'Elephant bathing & river crossing at Dubare Camp', 'Abbey Falls waterfall visit & scenic Raja\'s Seat sunset', 'Private coffee plantation tour'],
      itinerary: [{ day: 'DAY 01', title: 'Bangalore to Coorg via Bylakuppe', description: 'Early morning 6:00 AM pickup. Drive via Mysore Expressway.' }, { day: 'DAY 02', title: 'Abbey Falls, Dubare & Return Drive', description: 'Morning visit to Abbey Falls and Dubare Elephant Camp.' }],
      inclusions: ['Private AC vehicle for full 2-day itinerary', 'Experienced hill-route driver', 'All toll charges and parking fees', 'Complimentary bottled water'],
      exclusions: ['Resort / homestay accommodation', 'Entry tickets', 'Meals and personal expenses'],
      travel_information: { pickup: 'Any location in Bangalore', drop: 'Any location in Bangalore', distance: 'Approx. 260 km each way', bestTime: 'October to May', tollIncluded: 'Yes', driverAllowance: 'Included for overnight stay' },
      pricing_type: 'Custom Quote', price_starting: '₹6,499', featured: true, enabled: true, sort_order: 3,
    },
    {
      id: 'pkg-chikmagalur', slug: 'chikkamagaluru-escape', name: 'Chikkamagaluru Coffee Escape',
      destination: 'Chikkamagaluru', state: 'Karnataka', country: 'India',
      hero_image: '/destinations/chikmagalur-mullayanagiri.jpg',
      gallery: ['/destinations/chikmagalur-mullayanagiri.jpg', '/destinations/coorg-abbey-falls.jpg', '/destinations/savandurga.jpg'],
      badge: 'SPECIAL', duration: '2 Days / 1 Night', nights: '1 Night Stay',
      travel_type: 'Mountain Trails & Coffee Estates',
      vehicle_options: ['SUV', 'Innova Crysta', 'Toyota Fortuner', 'Tempo Traveller'],
      default_vehicle: 'SUV / Innova / Tempo Traveller', group_size: '2–12 Persons',
      best_for: 'Couples, Trekking Enthusiasts & Coffee Lovers',
      short_description: 'Trek to Karnataka\'s highest peak Mullayanagiri, explore Hebbe Falls, and stay in verdant coffee estates.',
      overview: 'Known as the coffee cradle of India, Chikkamagaluru offers rugged mountain passes, serene tea and coffee valleys.',
      highlights: ['Drive to Mullayanagiri Peak — highest point in Karnataka', 'Jeep safari to hidden waterfalls', 'Guided walkthrough of private coffee plantations', 'Visit Belur and Halebidu UNESCO Hoysala temples', 'Scenic Western Ghats mountain driving'],
      itinerary: [{ day: 'DAY 01', title: 'Bangalore to Chikkamagaluru via Belur', description: 'Morning 6:30 AM pickup from Bangalore.' }, { day: 'DAY 02', title: 'Mullayanagiri, Baba Budangiri & Return', description: 'Early morning drive to Mullayanagiri & Baba Budangiri peak viewpoints.' }],
      inclusions: ['Private SUV or Innova Crysta for full 2-day tour', 'Hill-certified highway chauffeur with driver allowance', 'All toll charges, parking, and state permits', 'Doorstep pickup and return drop'],
      exclusions: ['Off-road Jeep charges for remote peak areas', 'Resort / homestay stay and food bills'],
      travel_information: { pickup: 'Any location in Bangalore', drop: 'Any location in Bangalore', distance: 'Approx. 245 km each way', bestTime: 'September to March', tollIncluded: 'Yes', driverAllowance: 'Included' },
      pricing_type: 'Custom Quote', price_starting: '₹5,999', featured: true, enabled: true, sort_order: 4,
    },
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
  console.log(`✅ ${packages.length} packages seeded.`);

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
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
  console.log(`✅ ${testimonials.length} testimonials seeded.`);

  // ── TARIFF LOCAL ──────────────────────────────────────────────────────────
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

  const outstationTariff = [
    { vehicle_name: 'Etios / Swift Dzire', category: 'Compact Sedan', min_amount_per_day: 3600, extra_per_km: 12, driver_bata_day: 300, night_bata_extra: 300, sort_order: 1 },
    { vehicle_name: 'Toyota Innova AC', category: 'Comfort MPV', min_amount_per_day: 5100, extra_per_km: 17, driver_bata_day: 300, night_bata_extra: 350, sort_order: 2 },
    { vehicle_name: 'Toyota Innova Crysta', category: 'Premium MPV', min_amount_per_day: 5700, extra_per_km: 19, driver_bata_day: 350, night_bata_extra: 400, sort_order: 3 },
    { vehicle_name: 'Toyota Innova Hycross', category: 'Hybrid Luxury MPV', min_amount_per_day: 5700, extra_per_km: 19, driver_bata_day: 400, night_bata_extra: 400, sort_order: 4 },
    { vehicle_name: 'Tempo Traveller AC (12-17 Seater)', category: 'Group Van', min_amount_per_day: 6000, extra_per_km: 20, driver_bata_day: 400, night_bata_extra: 500, sort_order: 5 },
  ];
  for (const t of outstationTariff) {
    await query(`INSERT INTO tariff_outstation (vehicle_name, category, min_amount_per_day, extra_per_km, driver_bata_day, night_bata_extra, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`, [t.vehicle_name, t.category, t.min_amount_per_day, t.extra_per_km, t.driver_bata_day, t.night_bata_extra, t.sort_order]);
  }
  console.log('✅ Tariff tables seeded.');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('Admin Login: admin@friendstours.in / admin@FT2026!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
