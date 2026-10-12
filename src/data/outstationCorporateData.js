/**
 * Central Configuration and Official Outstation & Corporate Tariff
 * Friends Tours & Travels Bangalore (Rates with effect from 01 JAN 2026)
 */

export const OUTSTATION_CONFIG = {
  defaultMinKmPerDay: 300,
  effectiveDate: '01 JAN 2026',
  nightTimeStart: '22:00',
  nightTimeEnd: '06:00',
  disclaimerText: 'Outstation trips are calculated with a mandatory minimum of 300 KM per calendar day. Tolls, state permits, and parking tickets are extra at actual receipts. Night driver allowance applies after 10:00 PM.'
};

/**
 * Official Outstation Tariff Matrix (Minimum 300 Km Per Day)
 */
export const OUTSTATION_VEHICLE_RATES = [
  {
    vehicleId: 'etios-dzire-logan',
    vehicleName: 'Etios / Swift Dzire / Logan',
    category: 'Compact Sedan',
    capacity: '4 Passengers',
    minKmPerDay: 300,
    minAmountPerDay: 3600, // ₹12/km × 300 km = ₹3,600
    extraPerKm: 12,
    driverBataDay: 300,
    nightBataExtra: 300,
    tag: 'BUDGET HIGHWAY',
    active: true
  },
  {
    vehicleId: 'toyota-innova-ac',
    vehicleName: 'Toyota Innova AC',
    category: 'Comfort MPV',
    capacity: '6–7 Passengers',
    minKmPerDay: 300,
    minAmountPerDay: 5100, // ₹17/km × 300 km = ₹5,100
    extraPerKm: 17,
    driverBataDay: 300,
    nightBataExtra: 350,
    tag: 'FAMILY FAVORITE',
    active: true
  },
  {
    vehicleId: 'innova-crysta-hybrid',
    vehicleName: 'Innova Crysta / hybrid',
    category: 'Premium MPV / Hybrid',
    capacity: '6–7 Passengers',
    minKmPerDay: 300,
    minAmountPerDay: 5700, // ₹19/km × 300 km = ₹5,700
    extraPerKm: 19,
    driverBataDay: 400,
    nightBataExtra: 400,
    tag: 'PREMIUM COMFORT',
    active: true
  },
  {
    vehicleId: 'tempo-traveller-non-ac',
    vehicleName: 'Tempo Traveller Non AC',
    category: 'Group Tourist Van (12–17 Seater)',
    capacity: '12–17 Passengers',
    minKmPerDay: 300,
    minAmountPerDay: 6300, // ₹19/km (with base allowance)
    extraPerKm: 19,
    driverBataDay: 400,
    nightBataExtra: 400,
    tag: 'LARGE GROUP NON-AC',
    active: true
  },
  {
    vehicleId: 'tempo-traveller-ac',
    vehicleName: 'Tempo Traveller AC',
    category: 'Group Tourist Van (12–17 Seater AC)',
    capacity: '12–17 Passengers',
    minKmPerDay: 300,
    minAmountPerDay: 6000, // ₹20/km × 300 km = ₹6,000
    extraPerKm: 20,
    driverBataDay: 400,
    nightBataExtra: 400,
    tag: 'LARGE GROUP AC',
    active: true
  },
  {
    vehicleId: 'toyota-corolla-ac',
    vehicleName: 'Toyota Corolla AC',
    category: 'Executive Highway Sedan',
    capacity: '4 Passengers',
    minKmPerDay: 300,
    minAmountPerDay: 6000, // ₹20/km × 300 km = ₹6,000
    extraPerKm: 20,
    driverBataDay: 300,
    nightBataExtra: 300,
    tag: 'EXECUTIVE SEDAN',
    active: true
  }
];

/**
 * Popular Bangalore Outstation Destinations Benchmarks
 */
export const POPULAR_OUTSTATION_ROUTES = [
  {
    id: 'mysore',
    name: 'Mysore (Heritage Capital)',
    distanceOneWay: 145,
    estDriveTime: '3.5 Hours',
    popularVehicle: 'Innova Crysta / Hybrid',
    sedanDayRate: 3600,
    innovaDayRate: 5100,
    tag: 'HERITAGE CIRCUIT'
  },
  {
    id: 'coorg',
    name: 'Coorg (Madikeri / Coffee Estates)',
    distanceOneWay: 265,
    estDriveTime: '5.5 Hours',
    popularVehicle: 'Innova Crysta',
    sedanDayRate: 3600,
    innovaDayRate: 5700,
    tag: 'HILL STATION'
  },
  {
    id: 'chikmagalur',
    name: 'Chikkamagaluru (Mullayanagiri)',
    distanceOneWay: 245,
    estDriveTime: '4.5 Hours',
    popularVehicle: 'Toyota Innova AC',
    sedanDayRate: 3600,
    innovaDayRate: 5100,
    tag: 'COFFEE TRAILS'
  },
  {
    id: 'ooty',
    name: 'Ooty (Nilgiris / Tea Gardens)',
    distanceOneWay: 275,
    estDriveTime: '6.5 Hours',
    popularVehicle: 'Innova Crysta / Hybrid',
    sedanDayRate: 3600,
    innovaDayRate: 5700,
    tag: 'MOUNTAIN PASS'
  },
  {
    id: 'wayanad',
    name: 'Wayanad (Kerala Nature)',
    distanceOneWay: 275,
    estDriveTime: '6.0 Hours',
    popularVehicle: 'Innova Crysta',
    sedanDayRate: 3600,
    innovaDayRate: 5700,
    tag: 'WILDLIFE & NATURE'
  },
  {
    id: 'hampi',
    name: 'Hampi (Vijayanagara Ruins)',
    distanceOneWay: 340,
    estDriveTime: '6.5 Hours',
    popularVehicle: 'Toyota Corolla AC',
    sedanDayRate: 3600,
    innovaDayRate: 5700,
    tag: 'UNESCO HERITAGE'
  },
  {
    id: 'tirupati',
    name: 'Tirupati (Balaji Temple)',
    distanceOneWay: 250,
    estDriveTime: '5.0 Hours',
    popularVehicle: 'Etios / Swift Dzire',
    sedanDayRate: 3600,
    innovaDayRate: 5100,
    tag: 'PILGRIMAGE'
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry (French Quarter)',
    distanceOneWay: 310,
    estDriveTime: '6.0 Hours',
    popularVehicle: 'Toyota Corolla AC',
    sedanDayRate: 3600,
    innovaDayRate: 6000,
    tag: 'COASTAL GETAWAY'
  }
];

/**
 * Corporate Mobility Pricing Matrix & Retainer Contracts
 */
export const CORPORATE_RATES = {
  dailyPackages: [
    {
      vehicleId: 'etios-dzire-logan',
      vehicleName: 'Etios / Swift Dzire / Logan',
      rate4hr40km: 900,
      rate8hr80km: 1700,
      extraKm: 32,
      extraHour: 150
    },
    {
      vehicleId: 'toyota-innova-ac',
      vehicleName: 'Toyota Innova AC',
      rate4hr40km: 1300,
      rate8hr80km: 2800,
      extraKm: 17,
      extraHour: 200
    },
    {
      vehicleId: 'innova-crysta',
      vehicleName: 'Toyota Innova Crysta',
      rate4hr40km: 1600,
      rate8hr80km: 3200,
      extraKm: 19,
      extraHour: 250
    },
    {
      vehicleId: 'tempo-traveller-ac',
      vehicleName: 'Tempo Traveller AC (12–17 Seater)',
      rate4hr40km: 2400,
      rate8hr80km: 4500,
      extraKm: 23,
      extraHour: 300
    }
  ],

  monthlyPlans: [
    {
      planId: 'corp-basic',
      planName: 'Employee Mobility Retainer',
      vehicle: 'Etios / Swift Dzire / Logan',
      monthlyKm: 2000,
      monthlyHours: 260, // 26 working days × 10 hours
      monthlyPrice: 48000,
      features: [
        'Dedicated vehicle & background-checked chauffeur',
        '26 Days / 2,000 KM included monthly',
        'Fuel & routine sanitization maintenance included',
        'Itemized monthly GST invoicing & MIS shift reporting'
      ]
    },
    {
      planId: 'corp-standard',
      planName: 'Executive Mobility Retainer',
      vehicle: 'Toyota Corolla AC / Innova Crysta',
      monthlyKm: 2200,
      monthlyHours: 260,
      monthlyPrice: 75000,
      features: [
        'Premium sedan/MPV with climate control & acoustic comfort',
        '26 Days / 2,200 KM included monthly',
        'Dedicated senior chauffeur with English fluency',
        'Priority airport drop dispatch guarantee'
      ]
    },
    {
      planId: 'corp-shuttle',
      planName: 'Tech Park Shift Shuttle Retainer',
      vehicle: 'Tempo Traveller AC (12–17 Seater)',
      monthlyKm: 2500,
      monthlyHours: 260,
      monthlyPrice: 98000,
      features: [
        'Scheduled employee pickup & drop routes for tech parks',
        '26 Days / 2,500 KM included monthly',
        'Live vehicle tracking & safety compliance',
        'Dedicated corporate account manager support'
      ]
    }
  ]
};

/**
 * Calculate Outstation Estimated Fare
 * Minimum 300 Km per day base amount rule
 */
export const calculateOutstationFare = (vehicleObj, tripType = 'roundTrip', totalKm = 300, totalDays = 1) => {
  if (!vehicleObj) return { totalFare: 0 };

  const days = Math.max(1, totalDays);
  const minKmAllowed = (vehicleObj.minKmPerDay || 300) * days;
  const billableKm = Math.max(totalKm, minKmAllowed);

  // Minimum base amount for the days
  const baseDayAmount = (vehicleObj.minAmountPerDay || 3600) * days;
  
  // Extra km beyond total minimum
  const extraKm = Math.max(0, billableKm - minKmAllowed);
  const extraKmFare = extraKm * (vehicleObj.extraPerKm || 12);

  const baseFare = baseDayAmount + extraKmFare;
  const totalDayBata = (vehicleObj.driverBataDay || 300) * days;

  const totalEstimated = baseFare + totalDayBata;

  return {
    days,
    minKmAllowed,
    billableKm,
    extraKm,
    extraKmFare,
    baseDayAmount,
    perKmRate: vehicleObj.extraPerKm,
    driverBataDay: vehicleObj.driverBataDay,
    nightBataExtra: vehicleObj.nightBataExtra,
    totalDayBata,
    totalFare: Math.round(totalEstimated)
  };
};

/**
 * SEO FAQs for Outstation & Corporate Cabs
 */
export const OUTSTATION_FAQS = [
  {
    question: "What is the minimum distance charged for Bangalore outstation cabs?",
    answer: "As per our official outstation tariff, a minimum of 300 kilometres per calendar day is applied for all outstation bookings."
  },
  {
    question: "What are the outstation cab rates per day?",
    answer: "Daily minimum rates (covering 300 km): Etios / Swift Dzire / Logan: ₹3,600/day (Extra ₹12/km); Toyota Innova AC: ₹5,100/day (Extra ₹17/km); Innova Crysta / Hybrid: ₹5,700/day (Extra ₹19/km); Tempo Traveller AC: ₹6,000/day (Extra ₹20/km); Toyota Corolla AC: ₹6,000/day (Extra ₹20/km)."
  },
  {
    question: "What is Driver Bata for outstation trips?",
    answer: "Day driver bata is ₹300/day for sedans and ₹400/day for Innova / Tempo Travellers. If the trip extends past 10:00 PM, an additional night driver bata of ₹300 to ₹400 applies."
  },
  {
    question: "Are interstate toll charges and state entry permits included?",
    answer: "Tolls, expressway fees, parking tickets, and interstate permits (e.g. crossing into Tamil Nadu or Kerala) are payable directly at actual physical receipts."
  }
];
