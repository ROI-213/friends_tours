/* ==========================================================================
   BANGALORE & KARNATAKA PACKAGES DATA MODEL
   Dynamic dataset for all curated tour journeys from Bangalore with authentic local photos
   ========================================================================== */

export const PACKAGES_DATA = [
  {
    id: 'pkg-nandi',
    name: 'Nandi Hills Sunrise Tour',
    slug: 'nandi-hills-sunrise',
    destination: 'Nandi Hills',
    state: 'Karnataka',
    country: 'India',
    heroImage: '/destinations/nandi-hills-sunrise.jpg',
    gallery: [
      '/destinations/nandi-hills-sunrise.jpg',
      '/destinations/bangalore-city.jpg',
      '/destinations/ramanagara-hills.jpg',
      '/destinations/savandurga.jpg',
    ],
    badge: 'BEST SELLER',
    duration: '1 Day',
    nights: 'Same Day Return',
    travelType: 'Sunrise & Scenic Hill Drive',
    vehicleOptions: ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'],
    defaultVehicle: 'Sedan / SUV',
    groupSize: '1–6 Persons',
    bestFor: 'Couples, Friends & Early Morning Explorers',
    shortDescription: 'Catch the famous cloud-bed sunrise at Nandi Hills with an early morning private chauffeur pickup from Bangalore.',
    overview: 'Experience the magic of twilight transforming into a sea of clouds above the Deccan plains. Our private early morning journey picks you up from your doorstep at 4:30 AM in a clean, sanitized cab for a serene highway drive, followed by breakfast at highway artisanal restaurants.',
    highlights: [
      'Early morning 4:30 AM doorstep pickup across Bangalore',
      'Spectacular view of sunrise above the mist and clouds at Nandi Peak',
      'Visit to Tipu Sultan’s Summer Residence and Bhoga Nandeeshwara Temple',
      'Breakfast stop at renowned highway breakfast spots',
      'Comfortable return to Bangalore by early afternoon'
    ],
    itinerary: [
      {
        day: '4:30 AM',
        title: 'Doorstep Pickup & Highway Drive',
        description: 'Chauffeur arrives at your location in Bangalore. Smooth drive along NH44 towards Chikkaballapur with pleasant early morning breeze.'
      },
      {
        day: '6:00 AM',
        title: 'Nandi Hills Sunrise & Viewpoint',
        description: 'Arrive at the hilltop before dawn. Enjoy the breathtaking sunrise over the mist-covered valleys and historic viewpoints.'
      },
      {
        day: '8:30 AM',
        title: 'Heritage Temple Visit & Breakfast',
        description: 'Explore the 1000-year-old Bhoga Nandeeshwara Temple at the foothill, followed by a south Indian breakfast.'
      },
      {
        day: '11:30 AM',
        title: 'Return Journey to Bangalore',
        description: 'Smooth highway drive back to Bangalore with drop-off directly at your residence or airport.'
      }
    ],
    inclusions: [
      'Private air-conditioned vehicle for the entire round trip',
      'Dedicated professional driver with highway expertise',
      'All toll charges, hill entry parking, and fuel',
      'Doorstep pickup and return drop-off'
    ],
    exclusions: [
      'Food, beverages, and restaurant bills',
      'Hilltop entry ticket fees',
      'Personal expenses'
    ],
    travelInformation: {
      pickup: 'Any location in Bangalore',
      drop: 'Any location in Bangalore',
      distance: 'Approx. 60 km one-way (120 km round trip)',
      bestTime: 'All Year Round (5:30 AM – 7:00 AM)',
      tollIncluded: 'Yes, airport expressway tolls included',
      driverAllowance: 'Included',
      sanitization: 'Fully sanitized vehicle'
    },
    pricingType: 'Custom Quote',
    priceStarting: '₹1,999'
  },
  {
    id: 'pkg-mysore',
    name: 'Mysore Heritage Escape',
    slug: 'mysore-heritage-escape',
    destination: 'Mysore',
    state: 'Karnataka',
    country: 'India',
    heroImage: '/destinations/mysore-palace.jpg',
    gallery: [
      '/destinations/mysore-palace.jpg',
      '/destinations/bangalore-city.jpg',
      '/destinations/coorg-abbey-falls.jpg',
      '/destinations/ramanagara-hills.jpg',
    ],
    badge: 'POPULAR',
    duration: '1 Day',
    nights: 'Same Day or Optional 1 Night',
    travelType: 'Royal Heritage & Culture',
    vehicleOptions: ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'],
    defaultVehicle: 'Sedan / SUV / Innova',
    groupSize: '1–7 Persons',
    bestFor: 'Families, Heritage Lovers & Day Getaways',
    shortDescription: 'Explore the grandeur of the illuminated Mysore Palace, Chamundi Hills, St. Philomena’s Church and Srirangapatna.',
    overview: 'Travel comfortably along the modern Bangalore-Mysore Expressway in a private chauffeur cab. Discover centuries of royal Wodeyar heritage, royal architecture, silk weavers, and the illuminated palace at dusk before returning home.',
    highlights: [
      'Fast travel via the 10-lane Bangalore-Mysore Expressway (under 2 hours)',
      'Grand Mysore Palace tour with royal durbar halls',
      'Scenic climb to Chamundi Hill temple with panoramic city views',
      'Historic stop at Tipu Sultan’s summer palace in Srirangapatna',
      'Evening illuminated palace view & authentic Mysore Pak tasting'
    ],
    itinerary: [
      {
        day: '7:00 AM',
        title: 'Bangalore Departure via Expressway',
        description: 'Doorstep pickup in Bangalore. Drive down the new expressway with a breakfast stop for Bidadi Thatte Idli.'
      },
      {
        day: '10:00 AM',
        title: 'Srirangapatna & Chamundi Hill',
        description: 'Explore the historic island fortress of Srirangapatna, followed by Chamundeshwari Temple atop the hill.'
      },
      {
        day: '1:30 PM',
        title: 'Mysore Palace & Royal Art Gallery',
        description: 'Marvel at the architecture of the Mysore Maharaja Palace, followed by lunch and silk shopping.'
      },
      {
        day: '6:30 PM',
        title: 'Brindavan Gardens & Return Drive',
        description: 'Visit the musical fountains at Brindavan Gardens (or illuminated palace facade) before returning to Bangalore by 10:30 PM.'
      }
    ],
    inclusions: [
      'Private luxury vehicle for full-day Bangalore–Mysore round trip',
      'Expressway toll charges and interstate/parking permits',
      'Experienced chauffeur with route familiarity',
      'Doorstep pickup and drop'
    ],
    exclusions: [
      'Palace and garden entrance tickets',
      'Lunch, dinner, and personal shopping'
    ],
    travelInformation: {
      pickup: 'Any Bangalore location / Airport',
      drop: 'Any Bangalore location / Airport',
      distance: 'Approx. 145 km each way (290 km total)',
      bestTime: 'All Year (Sundays/holidays for evening palace lights)',
      tollIncluded: 'Yes, all expressway tolls covered',
      driverAllowance: 'Included',
      sanitization: 'Deep cleaned before pickup'
    },
    pricingType: 'Custom Quote',
    priceStarting: '₹3,499'
  },
  {
    id: 'pkg-coorg',
    name: 'Coorg Nature Retreat',
    slug: 'coorg-nature-retreat',
    destination: 'Coorg (Madikeri)',
    state: 'Karnataka',
    country: 'India',
    heroImage: '/destinations/coorg-abbey-falls.jpg',
    gallery: [
      '/destinations/coorg-abbey-falls.jpg',
      '/destinations/chikmagalur-mullayanagiri.jpg',
      '/destinations/mysore-palace.jpg',
      '/destinations/nandi-hills-sunrise.jpg',
    ],
    badge: 'WEEKEND DEAL',
    duration: '2 Days / 1 Night',
    nights: '1 Night Stay',
    travelType: 'Coffee Estates & Hill Retreat',
    vehicleOptions: ['SUV', 'Innova Crysta', 'Toyota Fortuner', 'Tempo Traveller'],
    defaultVehicle: 'SUV / Innova / Tempo Traveller',
    groupSize: '2–12 Persons',
    bestFor: 'Couples, Families & Nature Enthusiasts',
    shortDescription: 'Escape to the Scotland of India with lush coffee plantations, cascading Abbey Falls, and Tibetan monastery peace.',
    overview: 'Rejuvenate amidst the misty hills and aromatic spice plantations of Coorg. Enjoy a stress-free highway drive in an Innova Crysta or SUV, with private transfers between Namdroling Monastery, Dubare Elephant Camp, Raja’s Seat, and private estate trails.',
    highlights: [
      'Doorstep pickup from Bangalore in comfortable Innova Crysta / SUV',
      'Visit Golden Temple Tibetan Monastery at Bylakuppe',
      'Elephant bathing & river crossing at Dubare Camp',
      'Abbey Falls waterfall visit & scenic Raja’s Seat sunset',
      'Private coffee plantation tour & authentic Kodava cuisine'
    ],
    itinerary: [
      {
        day: 'DAY 01',
        title: 'Bangalore to Coorg via Bylakuppe',
        description: 'Early morning 6:00 AM pickup. Drive via Mysore Expressway. Stop at the majestic Golden Temple in Bylakuppe. Check in to Coorg resort. Evening sunset at Raja’s Seat.'
      },
      {
        day: 'DAY 02',
        title: 'Abbey Falls, Dubare & Return Drive',
        description: 'Morning visit to Abbey Falls and Dubare Elephant Camp. Post lunch, visit Madikeri Fort before a relaxed highway drive back to Bangalore by 9:30 PM.'
      }
    ],
    inclusions: [
      'Private AC vehicle for full 2-day itinerary from Bangalore',
      'Experienced hill-route driver with allowance & accommodation',
      'All toll charges, interstate taxes, and parking fees',
      'Complimentary bottled water'
    ],
    exclusions: [
      'Resort / homestay accommodation (booking assistance available)',
      'Entry tickets and elephant activity fees',
      'Meals and personal expenses'
    ],
    travelInformation: {
      pickup: 'Any location in Bangalore',
      drop: 'Any location in Bangalore',
      distance: 'Approx. 260 km each way',
      bestTime: 'October to May (Monsoons for waterfalls)',
      tollIncluded: 'Yes, all toll gates covered',
      driverAllowance: 'Included for overnight stay',
      sanitization: 'Premium sanitized cabin'
    },
    pricingType: 'Custom Quote',
    priceStarting: '₹6,499'
  },
  {
    id: 'pkg-chikmagalur',
    name: 'Chikkamagaluru Coffee Escape',
    slug: 'chikkamagaluru-escape',
    destination: 'Chikkamagaluru',
    state: 'Karnataka',
    country: 'India',
    heroImage: '/destinations/chikmagalur-mullayanagiri.jpg',
    gallery: [
      '/destinations/chikmagalur-mullayanagiri.jpg',
      '/destinations/coorg-abbey-falls.jpg',
      '/destinations/savandurga.jpg',
      '/destinations/nandi-hills-sunrise.jpg',
    ],
    badge: 'SPECIAL',
    duration: '2 Days / 1 Night',
    nights: '1 Night Stay',
    travelType: 'Mountain Trails & Coffee Estates',
    vehicleOptions: ['SUV', 'Innova Crysta', 'Toyota Fortuner', 'Tempo Traveller'],
    defaultVehicle: 'SUV / Innova / Tempo Traveller',
    groupSize: '2–12 Persons',
    bestFor: 'Couples, Trekking Enthusiasts & Coffee Lovers',
    shortDescription: 'Trek to Karnataka’s highest peak Mullayanagiri, explore Hebbe Falls, and stay in verdant coffee estates.',
    overview: 'Known as the coffee cradle of India, Chikkamagaluru offers rugged mountain passes, serene tea and coffee valleys, and cool mountain breezes. Our chauffeur service takes you up winding mountain roads with complete safety and local sightseeing guidance.',
    highlights: [
      'Drive to Mullayanagiri Peak — highest point in Karnataka',
      'Jeep safari to hidden waterfalls like Hebbe and Jhari Falls',
      'Guided walkthrough of private coffee and spice plantations',
      'Visit Belur and Halebidu UNESCO Hoysala temple heritage stops on the way',
      'Scenic Western Ghats mountain driving with experienced hill chauffeurs'
    ],
    itinerary: [
      {
        day: 'DAY 01',
        title: 'Bangalore to Chikkamagaluru via Belur',
        description: 'Morning 6:30 AM pickup from Bangalore. Drive through Hassan with a stop at Belur Chennakeshava Temple. Arrive at Chikkamagaluru, check in to coffee estate homestay. Visit Hirekolale Lake at sunset.'
      },
      {
        day: 'DAY 02',
        title: 'Mullayanagiri, Baba Budangiri & Return',
        description: 'Early morning drive to Mullayanagiri & Baba Budangiri peak viewpoints. Afternoon visit to Jhari Falls followed by relaxed drive back to Bangalore.'
      }
    ],
    inclusions: [
      'Private SUV or Innova Crysta for full 2-day tour',
      'Hill-certified highway chauffeur with driver allowance',
      'All toll charges, parking, and state permits',
      'Doorstep pickup and return drop'
    ],
    exclusions: [
      'Off-road Jeep charges for remote peak areas (if applicable)',
      'Resort / homestay stay and food bills'
    ],
    travelInformation: {
      pickup: 'Any location in Bangalore',
      drop: 'Any location in Bangalore',
      distance: 'Approx. 245 km each way',
      bestTime: 'September to March',
      tollIncluded: 'Yes, all NH tolls covered',
      driverAllowance: 'Included',
      sanitization: 'Deep cleaned and verified safe'
    },
    pricingType: 'Custom Quote',
    priceStarting: '₹5,999'
  }
];

export const getPackageBySlug = (slug) => {
  return PACKAGES_DATA.find((pkg) => pkg.slug === slug);
};

export const getAllPackages = () => {
  return PACKAGES_DATA;
};
