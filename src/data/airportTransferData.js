/**
 * Central Configuration and Pricing Database for Bengaluru Airport Transfers
 * Friends Tours & Travels Bangalore (BLR Airport / Kempegowda International Airport)
 */

export const AIRPORT_TRANSFER_CONFIG = {
  defaultDestination: "Kempegowda International Airport (BLR)",
  defaultCityName: "Bengaluru",
  
  // Default vehicle multipliers relative to sedan starting fare
  vehiclePricing: {
    sedan: {
      id: 'sedan',
      name: 'Sedan',
      example: 'Dzire / Etios or equivalent',
      multiplier: 1.0,
      passengers: 'Up to 3-4 passengers',
      luggage: '2-3 Bags',
      icon: 'Car'
    },
    suv: {
      id: 'suv',
      name: 'SUV',
      example: 'Ertiga / XL6 or equivalent',
      multiplier: 1.75,
      passengers: 'Up to 6 passengers',
      luggage: '3-4 Bags',
      icon: 'CarFront'
    },
    premium: {
      id: 'premium',
      name: 'Premium / Large SUV',
      example: 'Innova Crysta or equivalent',
      multiplier: 2.05,
      passengers: 'Up to 6-7 passengers',
      luggage: '4-5 Bags',
      icon: 'Shield'
    }
  },

  // Service Inclusions & Policies metadata
  inclusions: [
    { label: 'Private vehicle door-to-door transfer', active: true },
    { label: 'Professional highway chauffeur', active: true },
    { label: 'Flight tracking (delay adjustment)', active: true },
    { label: 'Zero surge charges', active: true },
    { label: 'GST included in fare', active: true },
    { label: 'Toll extra at actuals (Airport Expressway)', active: false, info: 'Tolls & airport parking charged as per actual receipts' }
  ],

  // Fallback distance calculation rate for custom unlisted localities (Per KM rate)
  fallbackRatePerKm: 18,
  fallbackBaseCharge: 400,

  disclaimerText: "*Prices shown are estimated starting fares and may vary based on specific vehicle category, pickup location sub-point, tolls, parking, waiting time, and route conditions. Final fare will be confirmed upon reservation."
};

/**
 * Helper to round calculated prices to nearest ₹50 for clean display
 */
export const roundToNearest50 = (amount) => {
  return Math.round(amount / 50) * 50;
};

/**
 * Bengaluru Locality Pricing Database
 */
export const BENGALURU_AIRPORT_AREAS = [
  {
    id: 'yelahanka',
    name: 'Yelahanka',
    aliases: ['yelahanka', 'yelahanka new town', 'yelahanka old town', 'kogilu', 'kogilu cross'],
    distanceKm: 18,
    estTime: '25-35 mins',
    cityToAirportFare: 700,
    airportToCityFare: 700,
    active: true
  },
  {
    id: 'hebbal',
    name: 'Hebbal / Nagawara',
    aliases: ['hebbal', 'nagawara', 'hebbal flyover', 'veannapalya', 'kempapura'],
    distanceKm: 24,
    estTime: '30-40 mins',
    cityToAirportFare: 700,
    airportToCityFare: 700,
    active: true
  },
  {
    id: 'manyata',
    name: 'Manyata Tech Park',
    aliases: ['manyata', 'manyata tech park', 'thanisandra', 'thanisandra main road', 'nagawara tech park'],
    distanceKm: 26,
    estTime: '35-45 mins',
    cityToAirportFare: 800,
    airportToCityFare: 800,
    active: true
  },
  {
    id: 'malleswaram',
    name: 'Malleshwaram',
    aliases: ['malleswaram', 'malleshwaram', 'sampige road', 'margosa road', 'yeshwanthpur'],
    distanceKm: 32,
    estTime: '45-60 mins',
    cityToAirportFare: 900,
    airportToCityFare: 900,
    active: true
  },
  {
    id: 'rajajinagar',
    name: 'Rajajinagar',
    aliases: ['rajajinagar', 'isckon temple', 'orion mall', 'basaveshwaranagar', 'navrang'],
    distanceKm: 34,
    estTime: '50-65 mins',
    cityToAirportFare: 900,
    airportToCityFare: 900,
    active: true
  },
  {
    id: 'mg-road',
    name: 'MG Road / CBD',
    aliases: ['mg road', 'cbd', 'central business district', 'brigade road', 'residency road', 'lavelle road', 'cubbon park', 'ub city'],
    distanceKm: 35,
    estTime: '50-70 mins',
    cityToAirportFare: 950,
    airportToCityFare: 950,
    active: true
  },
  {
    id: 'indiranagar',
    name: 'Indiranagar',
    aliases: ['indiranagar', '100ft road', '12th main', 'old airport road', 'domlur', 'hal'],
    distanceKm: 38,
    estTime: '55-75 mins',
    cityToAirportFare: 1000,
    airportToCityFare: 1000,
    active: true
  },
  {
    id: 'marathahalli',
    name: 'Marathahalli',
    aliases: ['marathahalli', 'marathahalli bridge', 'kalamandir', 'belandur', 'bellandur', 'outer ring road'],
    distanceKm: 42,
    estTime: '60-80 mins',
    cityToAirportFare: 1000,
    airportToCityFare: 1000,
    active: true
  },
  {
    id: 'whitefield',
    name: 'Whitefield / ITPL',
    aliases: ['whitefield', 'itpl', 'international tech park', 'whitefield main road', 'hoodi', 'kadugodi', 'hope farm', 'vaidehi'],
    distanceKm: 45,
    estTime: '65-85 mins',
    cityToAirportFare: 1050,
    airportToCityFare: 1050,
    active: true
  },
  {
    id: 'koramangala',
    name: 'Koramangala',
    aliases: ['koramangala', 'forum mall', 'koramangala 1st block', 'koramangala 4th block', 'koramangala 5th block', 'intermediate ring road'],
    distanceKm: 41,
    estTime: '60-80 mins',
    cityToAirportFare: 1100,
    airportToCityFare: 1100,
    active: true
  },
  {
    id: 'hsr-layout',
    name: 'HSR Layout',
    aliases: ['hsr', 'hsr layout', 'hsr 27th main', 'silk board', 'hsr sector 1', 'hsr sector 2', 'hsr sector 7'],
    distanceKm: 45,
    estTime: '65-90 mins',
    cityToAirportFare: 1200,
    airportToCityFare: 1200,
    active: true
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar',
    aliases: ['jayanagar', 'jayanagar 4th block', 'jayanagar 3rd block', 'south end circle'],
    distanceKm: 40,
    estTime: '60-85 mins',
    cityToAirportFare: 1150,
    airportToCityFare: 1150,
    active: true
  },
  {
    id: 'jp-nagar',
    name: 'JP Nagar',
    aliases: ['jp nagar', 'jayanagar post', 'jp nagar 6th phase', 'jp nagar 2nd phase', 'sarakki'],
    distanceKm: 44,
    estTime: '70-95 mins',
    cityToAirportFare: 1250,
    airportToCityFare: 1250,
    active: true
  },
  {
    id: 'banashankari',
    name: 'Banashankari',
    aliases: ['banashankari', 'bsk 2nd stage', 'bsk 3rd stage', 'padmanabhanagar', 'chennammanakere'],
    distanceKm: 43,
    estTime: '65-90 mins',
    cityToAirportFare: 1250,
    airportToCityFare: 1250,
    active: true
  },
  {
    id: 'bannerghatta-road',
    name: 'Bannerghatta Road',
    aliases: ['bannerghatta road', 'bannerghatta', 'hulimavu', 'arekere', 'fortis hospital bg road', 'meenakshi mall'],
    distanceKm: 46,
    estTime: '70-95 mins',
    cityToAirportFare: 1200,
    airportToCityFare: 1200,
    active: true
  },
  {
    id: 'sarjapur-road',
    name: 'Sarjapur Road',
    aliases: ['sarjapur', 'sarjapur road', 'wipro sarjapur', 'carmelaram', 'kaikondrahalli'],
    distanceKm: 50,
    estTime: '75-100 mins',
    cityToAirportFare: 1400,
    airportToCityFare: 1400,
    active: true
  },
  {
    id: 'electronic-city',
    name: 'Electronic City',
    aliases: ['electronic city', 'e-city', 'electronics city', 'electronic city phase 1', 'electronic city phase 2', 'infosys e-city'],
    distanceKm: 54,
    estTime: '80-110 mins',
    cityToAirportFare: 1300,
    airportToCityFare: 1300,
    active: true
  }
];

/**
 * 10 Popular Bengaluru Airport Transfer Routes for Card Grid
 */
export const POPULAR_AIRPORT_ROUTES = [
  { areaId: 'whitefield', tag: 'IT Corridor' },
  { areaId: 'electronic-city', tag: 'Tech Hub' },
  { areaId: 'koramangala', tag: 'Central South' },
  { areaId: 'hsr-layout', tag: 'Residential' },
  { areaId: 'indiranagar', tag: 'East Bangalore' },
  { areaId: 'marathahalli', tag: 'ORR Belt' },
  { areaId: 'mg-road', tag: 'CBD District' },
  { areaId: 'hebbal', tag: 'North Gate' },
  { areaId: 'yelahanka', tag: 'Nearest Zone' },
  { areaId: 'jp-nagar', tag: 'South Bangalore' }
];

/**
 * Airport Transfer FAQs for SEO & Conversion
 */
export const AIRPORT_FAQS = [
  {
    question: "What is the taxi fare from Bangalore to BLR Airport?",
    answer: "Sedan starting fares for private airport transfers in Bangalore range from ₹700 (Hebbal/Yelahanka) to ₹1,300–₹1,400 (Electronic City/Sarjapur Road) depending on your pickup locality and distance to Kempegowda International Airport (BLR)."
  },
  {
    question: "How much does an airport taxi from Whitefield to BLR Airport cost?",
    answer: "A private sedan airport transfer from Whitefield or ITPL to Kempegowda International Airport starts at ₹1,050. SUV options (Ertiga) start around ₹1,850 and Premium SUVs (Innova Crysta) start around ₹2,150."
  },
  {
    question: "How much does an Electronic City to Bangalore Airport taxi cost?",
    answer: "An airport taxi from Electronic City (Phase 1 & 2) to BLR Airport starts at ₹1,300 for a sedan for a distance of approximately 54 km via the elevated expressway and Outer Ring Road."
  },
  {
    question: "How long does it take to reach Kempegowda International Airport?",
    answer: "Travel time varies by pickup area and time of day. North Bangalore (Hebbal/Yelahanka) takes 25-45 minutes, Central areas (MG Road/Indiranagar) take 50-75 minutes, while South/East tech corridors (Whitefield/Electronic City/HSR) take 65-100 minutes during peak hours."
  },
  {
    question: "Are airport transfer fares fixed with zero surge?",
    answer: "Yes, Friends Tours & Travels provides pre-confirmed fixed fares for scheduled airport pickups and drops, protecting you from sudden surge pricing or peak-hour multiplier charges."
  },
  {
    question: "Do airport transfer fares include tolls and taxes?",
    answer: "Base fares include driver charges, fuel, and applicable GST. Airport toll charges and airport terminal parking fees are calculated transparently as per actual highway receipts."
  },
  {
    question: "Can I book an airport pickup from BLR back to Bangalore city?",
    answer: "Absolutely! We provide both City → BLR Airport drops and BLR Airport → City pickups. For airport pickups, our flight telemetry service monitors your flight status for flight delay adjustments at no extra charge."
  }
];
