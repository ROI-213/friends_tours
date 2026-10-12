/**
 * Central Configuration & Official Price List for Bangalore Local Transfers
 * Friends Tours & Travels Bangalore (Rates with effect from 01 JAN 2026)
 */

export const LOCAL_TRANSFER_CONFIG = {
  currencySymbol: '₹',
  effectiveDate: '01 JAN 2026',
  defaultPackage: '8hr80km', // '4hr40km' | '8hr80km'
  
  packages: {
    '4hr40km': {
      id: '4hr40km',
      name: '4 Hours / 40 KM',
      subtitle: 'Half Day City Errands & Quick Meetings',
      includedKm: 40,
      includedHours: 4,
      tag: 'HALF DAY'
    },
    '8hr80km': {
      id: '8hr80km',
      name: '8 Hours / 80 KM',
      subtitle: 'Full Day City Tour, Shopping & Multi-point Transit',
      includedKm: 80,
      includedHours: 8,
      tag: 'FULL DAY (8 HR / 80 KM)'
    }
  },

  termsAndConditions: [
    'Rates with effect from 01 JAN 2026.',
    'Parking Fees Actual as per parking receipts.',
    'Rates Subject to change in case of change in fuel Rates.',
    'For Local if it exceeds 6Hr will be considered as full day i.e. 8hrs.',
    'After 10.00pm / Before 6.00am Driver Bata applies as specified per vehicle.'
  ],

  inclusions: [
    'Clean, air-conditioned yellow-board vehicle',
    'Professional verified chauffeur in uniform',
    'Fuel charges up to the included package KMs',
    'Doorstep pickup & drop anywhere in Bangalore',
    '24/7 Operations Desk support'
  ],

  exclusions: [
    'Parking tickets & toll expressway charges at actual physical receipts',
    'Night Driver Bata (After 10:00 PM / Before 6:00 AM) as indicated per vehicle tier'
  ],

  disclaimerText: 'Rates with effect from 01 JAN 2026. Parking Fees Actual. Rates Subject to change in case of change in fuel Rates. For Local if it exceeds 6Hr will be considered as full day i.e. 8hrs.'
};

/**
 * Complete Official Local Price List Matrix (12 Vehicles)
 */
export const LOCAL_VEHICLE_PRICING = [
  {
    vehicleId: 'etios-dzire-logan',
    vehicleName: 'Etios / Swift Dzire / Logan',
    category: 'Compact Sedan',
    passengerCapacity: '4 Passengers',
    luggageCapacity: '2 Bags',
    acType: 'AC',
    image: '/fleet/compact-sedan.jpg',
    package4hr40km: 900,
    package8hr80km: 1700,
    extraHour: 150,
    extraKm: 32,
    nightBata: 100,
    featuredPackage: 'Best Value Local Cab',
    active: true
  },
  {
    vehicleId: 'toyota-innova-ac',
    vehicleName: 'Toyota Innova AC',
    category: 'Comfort MPV',
    passengerCapacity: '6–7 Passengers',
    luggageCapacity: '4 Bags',
    acType: 'AC',
    image: '/fleet/toyota-innova.jpg',
    package4hr40km: 1300,
    package8hr80km: 2800,
    extraHour: 200,
    extraKm: 17,
    nightBata: 200,
    featuredPackage: 'Family Favorite MPV',
    active: true
  },
  {
    vehicleId: 'innova-crysta',
    vehicleName: 'Innova Crysta',
    category: 'Premium MPV',
    passengerCapacity: '6–7 Passengers',
    luggageCapacity: '4 Bags',
    acType: 'Dual AC',
    image: '/fleet/innova-crysta.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 3200,
    extraHour: 250,
    extraKm: 19,
    nightBata: 200,
    featuredPackage: 'Premium Reclining Seats',
    active: true
  },
  {
    vehicleId: 'innova-hycross',
    vehicleName: 'Innova Hycross',
    category: 'Luxury Hybrid MPV',
    passengerCapacity: '6–7 Passengers',
    luggageCapacity: '4 Bags',
    acType: 'Climate Control',
    image: '/fleet/innova-crysta.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 3500,
    extraHour: 300,
    extraKm: 22,
    nightBata: 200,
    featuredPackage: 'Modern Hybrid Luxury',
    active: true
  },
  {
    vehicleId: 'tempo-traveller-non-ac',
    vehicleName: 'Tempo Traveller Non AC',
    category: '12–17 Seater Van',
    passengerCapacity: '12–17 Passengers',
    luggageCapacity: '8 Bags',
    acType: 'Non AC',
    image: '/fleet/tempo-traveller.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 4000,
    extraHour: 300,
    extraKm: 21,
    nightBata: 250,
    featuredPackage: 'Group Non-AC Economy',
    active: true
  },
  {
    vehicleId: 'tempo-traveller-ac',
    vehicleName: 'Tempo Traveller AC',
    category: '12–17 Seater Van',
    passengerCapacity: '12–17 Passengers',
    luggageCapacity: '8 Bags',
    acType: 'High Capacity AC',
    image: '/fleet/tempo-traveller.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 4500,
    extraHour: 300,
    extraKm: 23,
    nightBata: 300,
    featuredPackage: 'Group AC Comfort',
    active: true
  },
  {
    vehicleId: 'toyota-corolla-ac',
    vehicleName: 'Toyota Corolla AC',
    category: 'Executive Sedan',
    passengerCapacity: '4 Passengers',
    luggageCapacity: '3 Bags',
    acType: 'Climate Control AC',
    image: '/fleet/executive-sedan.jpg',
    package4hr40km: 1600,
    package8hr80km: 3200,
    extraHour: 275,
    extraKm: 22,
    nightBata: 250,
    featuredPackage: 'Executive Business Sedan',
    active: true
  },
  {
    vehicleId: 'bmw-7-series',
    vehicleName: 'BMW 7 Series',
    category: 'Luxury Sedan',
    passengerCapacity: '3–4 Passengers',
    luggageCapacity: '2 Bags',
    acType: 'Multi-Zone Climate',
    image: '/fleet/luxury-class.jpg',
    package4hr40km: 3000,
    package8hr80km: 6000,
    extraHour: 450,
    extraKm: 44,
    nightBata: 500,
    featuredPackage: 'VIP German Luxury',
    active: true
  },
  {
    vehicleId: 'mercedes-e-class',
    vehicleName: 'M.Benz-E Class E-350',
    category: 'Executive Luxury Sedan',
    passengerCapacity: '3–4 Passengers',
    luggageCapacity: '2 Bags',
    acType: 'Multi-Zone Climate',
    image: '/fleet/luxury-class.jpg',
    package4hr40km: 3250,
    package8hr80km: 6500,
    extraHour: 450,
    extraKm: 48,
    nightBata: 500,
    featuredPackage: 'Corporate Executive VIP',
    active: true
  },
  {
    vehicleId: 'mercedes-s-class',
    vehicleName: 'M.Benz-S Class S-350',
    category: 'Ultra Luxury Flagship',
    passengerCapacity: '3–4 Passengers',
    luggageCapacity: '2 Bags',
    acType: 'Multi-Zone Climate',
    image: '/fleet/luxury-class.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 11000,
    extraHour: 1100,
    extraKm: 110,
    nightBata: 750,
    featuredPackage: 'Ultra VIP Flagship',
    active: true
  },
  {
    vehicleId: 'bmw-7-series-luxury',
    vehicleName: 'BMW 7 Series (Luxury High-End)',
    category: 'Ultra Luxury Flagship',
    passengerCapacity: '3–4 Passengers',
    luggageCapacity: '2 Bags',
    acType: 'Multi-Zone Climate',
    image: '/fleet/luxury-class.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 12000,
    extraHour: 1200,
    extraKm: 115,
    nightBata: 750,
    featuredPackage: 'Supreme Executive Chauffeur',
    active: true
  },
  {
    vehicleId: 'audi-a6',
    vehicleName: 'Audi A-6',
    category: 'Premium Luxury Sedan',
    passengerCapacity: '3–4 Passengers',
    luggageCapacity: '2 Bags',
    acType: 'Multi-Zone Climate',
    image: '/fleet/luxury-class.jpg',
    package4hr40km: null, // N/A
    package8hr80km: 5250,
    extraHour: 500,
    extraKm: 50,
    nightBata: 250,
    featuredPackage: 'Prestige Business Sedan',
    active: true
  }
];

/**
 * Calculation Helper for Local City Transfer Fares
 * Rule: If duration exceeds 6 hours, it is considered as full day (8 hours package).
 */
export const calculateLocalTransferFare = (vehiclePricing, packageType, estKm = 0, estHours = 0) => {
  if (!vehiclePricing) return { totalFare: 0, extraKmFare: 0, extraHourFare: 0, isAutoUpgraded: false };

  // Rule: If local exceeds 6 hours, auto upgraded to 8hr80km package
  let effectivePkg = packageType;
  let isAutoUpgraded = false;
  if (estHours > 6 && packageType === '4hr40km') {
    effectivePkg = '8hr80km';
    isAutoUpgraded = true;
  }

  // If 4hr40km is not available for this vehicle, fallback to 8hr80km
  if (effectivePkg === '4hr40km' && vehiclePricing.package4hr40km === null) {
    effectivePkg = '8hr80km';
    isAutoUpgraded = true;
  }

  const pkgConfig = LOCAL_TRANSFER_CONFIG.packages[effectivePkg] || LOCAL_TRANSFER_CONFIG.packages['8hr80km'];
  const baseFare = effectivePkg === '4hr40km' ? vehiclePricing.package4hr40km : vehiclePricing.package8hr80km;

  const extraKm = Math.max(0, estKm - pkgConfig.includedKm);
  const extraHours = Math.max(0, estHours - pkgConfig.includedHours);

  const extraKmFare = extraKm * vehiclePricing.extraKm;
  const extraHourFare = extraHours * vehiclePricing.extraHour;

  const totalFare = baseFare + extraKmFare + extraHourFare;

  return {
    baseFare,
    effectivePkg,
    isAutoUpgraded,
    extraKm,
    extraKmFare,
    extraHours,
    extraHourFare,
    nightBata: vehiclePricing.nightBata,
    totalFare: Math.round(totalFare)
  };
};

/**
 * SEO FAQs for Local Cab Rentals in Bangalore
 */
export const LOCAL_TRANSFER_FAQS = [
  {
    question: "What are the rates for Bangalore local cab rental?",
    answer: "Our local packages start at ₹900 for 4hr/40km and ₹1,700 for 8hr/80km on Etios / Swift Dzire / Logan. Innova AC is ₹1,300 (4hr) / ₹2,800 (8hr), Innova Crysta is ₹3,200 (8hr), and Tempo Traveller AC is ₹4,500 (8hr)."
  },
  {
    question: "What is the policy if my local rental exceeds 6 hours?",
    answer: "As per our official tariff terms: for local rentals, if usage exceeds 6 hours, it will automatically be considered as a full day package (i.e. 8 Hours / 80 KM)."
  },
  {
    question: "What are the extra kilometre and extra hour charges?",
    answer: "Extra hours and kilometres are charged transparently as per our tariff card. For example, Swift Dzire / Etios is ₹150/extra hr and ₹32/extra km. Innova AC is ₹200/extra hr and ₹17/extra km."
  },
  {
    question: "What is Driver Bata for late night or early morning travel?",
    answer: "For trips operating after 10:00 PM or before 6:00 AM, a night Driver Bata applies (₹100 for Dzire/Etios, ₹200 for Innova, ₹250–₹300 for Tempo Traveller, ₹500–₹750 for luxury cars)."
  },
  {
    question: "Are parking and toll charges included?",
    answer: "Parking fees and toll charges are charged extra at actuals as per physical printed receipts."
  }
];
