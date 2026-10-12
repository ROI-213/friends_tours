/**
 * Master Location Database for Friends Tours & Travels Bangalore
 * Covers Bengaluru Localities, Terminals, Stations, Tech Parks, Hospitals, Hotels, and Outstation Getaways.
 */

export const CURATED_LOCATIONS = [
  // --- AIRPORTS & TERMINALS ---
  {
    id: 'loc-blr-t1',
    name: 'Kempegowda International Airport (BLR) - Terminal 1',
    category: 'Airport',
    area: 'Devanahalli, Bangalore',
    keywords: ['bangalore airport', 'blr airport', 'terminal 1', 't1', 'kempegowda', 'airport', 'ba'],
  },
  {
    id: 'loc-blr-t2',
    name: 'Kempegowda International Airport (BLR) - Terminal 2 (Garden Terminal)',
    category: 'Airport',
    area: 'Devanahalli, Bangalore',
    keywords: ['bangalore airport', 'blr airport', 'terminal 2', 't2', 'garden terminal', 'kempegowda', 'airport', 'ba'],
  },
  {
    id: 'loc-hal-airport',
    name: 'HAL Old Airport Bangalore',
    category: 'Airport',
    area: 'Old Airport Road, Bangalore',
    keywords: ['hal airport', 'old airport', 'domlur', 'marathahalli', 'bangalore', 'ba'],
  },
  {
    id: 'loc-mys-airport',
    name: 'Mysore Airport (MYQ)',
    category: 'Airport',
    area: 'Mandakalli, Mysuru',
    keywords: ['mysore airport', 'myq', 'mysuru'],
  },

  // --- BANGALORE LOCALITIES (Priority for "Ba" and top city areas) ---
  {
    id: 'loc-bangalore-city',
    name: 'Bangalore / Bengaluru City Center',
    category: 'City',
    area: 'Central Bengaluru, Karnataka',
    keywords: ['bangalore', 'bengaluru', 'city', 'ba', 'central'],
  },
  {
    id: 'loc-banashankari',
    name: 'Banashankari (BSK Stage 1, 2, 3, 6)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['banashankari', 'bsk', 'banashankari 2nd stage', 'banashankari 3rd stage', 'ba'],
  },
  {
    id: 'loc-banaswadi',
    name: 'Banaswadi / HRBR Layout',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['banaswadi', 'hrbr', 'kalyan nagar', 'east bangalore', 'ba'],
  },
  {
    id: 'loc-bannerghatta',
    name: 'Bannerghatta Road (Gottigere / Hulimavu / Meenakshi Mall)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['bannerghatta road', 'bannerghatta', 'hulimavu', 'gottigere', 'jigani', 'national park', 'ba'],
  },
  {
    id: 'loc-basavanagudi',
    name: 'Basavanagudi (Gandhi Bazaar / Bull Temple)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['basavanagudi', 'gandhi bazaar', 'bull temple', 'dvg road', 'ba'],
  },
  {
    id: 'loc-basaveshwaranagar',
    name: 'Basaveshwaranagar',
    category: 'Bangalore Area',
    area: 'West Bangalore',
    keywords: ['basaveshwaranagar', 'west bangalore', 'rajajinagar', 'ba'],
  },
  {
    id: 'loc-btm-layout',
    name: 'BTM Layout (Stage 1 & 2 / Udupi Garden)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['btm', 'btm layout', 'udupi garden', 'madiwala lake', 'ba'],
  },
  {
    id: 'loc-baiyappanahalli',
    name: 'Baiyappanahalli / Old Madras Road',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['baiyappanahalli', 'metro', 'smvt', 'old madras road', 'ba'],
  },
  {
    id: 'loc-jp-nagar',
    name: 'J.P. Nagar (Phases 1 to 9 / Friends Tours Office)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['jp nagar', 'jayanagar south', 'puttenahalli', 'sarakki', '24th main'],
  },
  {
    id: 'loc-jayanagar',
    name: 'Jayanagar (Blocks 1 to 9 / 4th Block Complex)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['jayanagar', '4th block', 'south bangalore'],
  },
  {
    id: 'loc-indiranagar',
    name: 'Indiranagar (100ft Road / 12th Main / CMH Road)',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['indiranagar', '100ft road', '12th main', 'cmh road', 'hal 2nd stage'],
  },
  {
    id: 'loc-koramangala',
    name: 'Koramangala (Blocks 1 to 8 / Sony World Signal)',
    category: 'Bangalore Area',
    area: 'South-East Bangalore',
    keywords: ['koramangala', 'sony world', 'forum', 'block 4', 'block 5'],
  },
  {
    id: 'loc-whitefield',
    name: 'Whitefield (ITPL / Hope Farm / Kadugodi)',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['whitefield', 'itpl', 'hope farm', 'kadugodi', 'channasandra'],
  },
  {
    id: 'loc-electronic-city',
    name: 'Electronic City (Phase 1 & Phase 2 / Infosys / Wipro)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['electronic city', 'ecity', 'phase 1', 'phase 2', 'infosys gate', 'wipro gate'],
  },
  {
    id: 'loc-hsr-layout',
    name: 'HSR Layout (Sectors 1 to 7 / 27th Main)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['hsr', 'hsr layout', 'sector 1', 'sector 2', '27th main', 'agara'],
  },
  {
    id: 'loc-bellandur',
    name: 'Bellandur (Outer Ring Road / Green Glen Layout)',
    category: 'Bangalore Area',
    area: 'South-East Bangalore',
    keywords: ['bellandur', 'outer ring road', 'green glen', 'ecospace'],
  },
  {
    id: 'loc-marathahalli',
    name: 'Marathahalli (Bridge / Outer Ring Road)',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['marathahalli', 'bridge', 'kalamandir', 'outer ring road'],
  },
  {
    id: 'loc-hebbal',
    name: 'Hebbal (Flyover / Kempapura / Bellary Road)',
    category: 'Bangalore Area',
    area: 'North Bangalore',
    keywords: ['hebbal', 'flyover', 'bellary road', 'kempapura', 'nagawara'],
  },
  {
    id: 'loc-yelahanka',
    name: 'Yelahanka (New Town / Old Town / Kogilu Cross)',
    category: 'Bangalore Area',
    area: 'North Bangalore',
    keywords: ['yelahanka', 'yelahanka new town', 'kogilu', 'jakkar', 'attur'],
  },
  {
    id: 'loc-yeshwanthpur',
    name: 'Yeshwanthpur (APMC Yard / Industrial Area)',
    category: 'Bangalore Area',
    area: 'North-West Bangalore',
    keywords: ['yeshwanthpur', 'yesvantpur', 'apmc yard', 'peenya'],
  },
  {
    id: 'loc-malleshwaram',
    name: 'Malleshwaram (Sampige Road / Margosa Road / 8th Cross)',
    category: 'Bangalore Area',
    area: 'Central-West Bangalore',
    keywords: ['malleshwaram', 'malleswaram', 'sampige road', 'margosa road'],
  },
  {
    id: 'loc-rajajinagar',
    name: 'Rajajinagar (Blocks 1-6 / Navrang / Orion)',
    category: 'Bangalore Area',
    area: 'West Bangalore',
    keywords: ['rajajinagar', 'navrang', 'orion', 'isckon'],
  },
  {
    id: 'loc-mg-road',
    name: 'MG Road / Brigade Road / Church Street / CBD',
    category: 'Bangalore Area',
    area: 'Central Bangalore',
    keywords: ['mg road', 'brigade road', 'church street', 'cbd', 'cubbon park', 'residency road'],
  },
  {
    id: 'loc-sarjapur-road',
    name: 'Sarjapur Road (Carmelaram / Doddakannelli / Rainbow Drive)',
    category: 'Bangalore Area',
    area: 'South-East Bangalore',
    keywords: ['sarjapur', 'sarjapur road', 'carmelaram', 'wipro corporate'],
  },
  {
    id: 'loc-kengeri',
    name: 'Kengeri / Mysore Road (Satellite Town)',
    category: 'Bangalore Area',
    area: 'West Bangalore',
    keywords: ['kengeri', 'mysore road', 'satellite town', 'rr nagar'],
  },
  {
    id: 'loc-kr-puram',
    name: 'KR Puram (Hanging Bridge / Tin Factory)',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['kr puram', 'hanging bridge', 'tin factory', 'ramamurthy nagar'],
  },
  {
    id: 'loc-domlur',
    name: 'Domlur / Old Airport Road / EGL',
    category: 'Bangalore Area',
    area: 'East Bangalore',
    keywords: ['domlur', 'egl', 'embassy golf links', 'old airport road'],
  },
  {
    id: 'loc-vijayanagar',
    name: 'Vijayanagar / RPC Layout',
    category: 'Bangalore Area',
    area: 'West Bangalore',
    keywords: ['vijayanagar', 'rpc layout', 'chord road'],
  },
  {
    id: 'loc-kanakapura-road',
    name: 'Kanakapura Road (Art of Living / Thalaghattapura)',
    category: 'Bangalore Area',
    area: 'South Bangalore',
    keywords: ['kanakapura road', 'art of living', 'thalaghattapura', 'kaggalipura', 'vajarahalli'],
  },
  {
    id: 'loc-peenya',
    name: 'Peenya Industrial Area',
    category: 'Bangalore Area',
    area: 'North-West Bangalore',
    keywords: ['peenya', 'industrial area', 'jalahalli', 'dasarahalli'],
  },
  {
    id: 'loc-devanahalli',
    name: 'Devanahalli (Near Airport / DC Office)',
    category: 'Bangalore Area',
    area: 'North Bangalore Rural',
    keywords: ['devanahalli', 'airport road', 'aerotropolis'],
  },

  // --- RAILWAY STATIONS & BUS TERMINALS ---
  {
    id: 'loc-ksr-majestic',
    name: 'KSR Bengaluru City Railway Station (Majestic Station)',
    category: 'Railway Station',
    area: 'Majestic / Sevashrama, Bangalore',
    keywords: ['ksr', 'bangalore city railway station', 'majestic station', 'central railway station', 'ba'],
  },
  {
    id: 'loc-yeshwantpur-stn',
    name: 'Yesvantpur Junction Railway Station (YPR)',
    category: 'Railway Station',
    area: 'Yeshwanthpur, Bangalore',
    keywords: ['yesvantpur railway station', 'ypr', 'yeshwantpur station'],
  },
  {
    id: 'loc-cantt-stn',
    name: 'Bangalore Cantonment Railway Station (BNC)',
    category: 'Railway Station',
    area: 'Vasanth Nagar / Cantonment, Bangalore',
    keywords: ['bangalore cantonment', 'bnc', 'cantonment railway station', 'ba'],
  },
  {
    id: 'loc-smvt-stn',
    name: 'Sir M. Visvesvaraya Terminal (SMVT Baiyappanahalli)',
    category: 'Railway Station',
    area: 'Baiyappanahalli, Bangalore',
    keywords: ['smvt', 'sir m visvesvaraya terminal', 'smvt railway station', 'baiyappanahalli terminal', 'ba'],
  },
  {
    id: 'loc-kjm-stn',
    name: 'Krishnarajapuram Railway Station (KJM)',
    category: 'Railway Station',
    area: 'KR Puram, Bangalore',
    keywords: ['kr puram station', 'kjm railway station', 'krishnarajapuram'],
  },
  {
    id: 'loc-majestic-bus',
    name: 'Kempegowda Bus Station (Majestic KSRTC / BMTC Terminus)',
    category: 'Bus Terminal',
    area: 'Majestic, Bangalore',
    keywords: ['majestic bus stand', 'kempegowda bus station', 'ksrtc', 'bmtc central', 'ba'],
  },
  {
    id: 'loc-shantinagar-bus',
    name: 'Shantinagar Bus Station (KSRTC Inter-State Terminal)',
    category: 'Bus Terminal',
    area: 'Shantinagar / KH Road, Bangalore',
    keywords: ['shantinagar bus stand', 'ksrtc bus station', 'tamil nadu bus stand'],
  },
  {
    id: 'loc-satellite-bus',
    name: 'Mysore Road Satellite Bus Station (MCTC)',
    category: 'Bus Terminal',
    area: 'Mysore Road, Bangalore',
    keywords: ['satellite bus stand', 'mysore road bus stand', 'mctc'],
  },

  // --- MAJOR TECH PARKS & CORPORATE HUBS ---
  {
    id: 'loc-manyata-tech-park',
    name: 'Manyata Embassy Business Park',
    category: 'Tech Park',
    area: 'Nagawara / Hebbal, Bangalore',
    keywords: ['manyata', 'manyata tech park', 'nagawara', 'philips', 'cognizant', 'ibm'],
  },
  {
    id: 'loc-itpl-whitefield',
    name: 'International Tech Park Bangalore (ITPL)',
    category: 'Tech Park',
    area: 'Whitefield, Bangalore',
    keywords: ['itpl', 'international tech park', 'whitefield', 'tcs', 'patni'],
  },
  {
    id: 'loc-ecospace',
    name: 'Ecospace Business Park (Outer Ring Road)',
    category: 'Tech Park',
    area: 'Bellandur, Bangalore',
    keywords: ['ecospace', 'rmz ecospace', 'bellandur', 'outer ring road'],
  },
  {
    id: 'loc-ecoworld',
    name: 'RMZ Ecoworld Business Park',
    category: 'Tech Park',
    area: 'Devarabeesanahalli / Bellandur, Bangalore',
    keywords: ['ecoworld', 'rmz ecoworld', 'outer ring road', 'kpmg', 'honeywell'],
  },
  {
    id: 'loc-bagmane-tech-park',
    name: 'Bagmane Tech Park (CV Raman Nagar)',
    category: 'Tech Park',
    area: 'CV Raman Nagar, Bangalore',
    keywords: ['bagmane', 'bagmane tech park', 'cv raman nagar', 'boeing', 'oracle', 'ba'],
  },
  {
    id: 'loc-bagmane-constellation',
    name: 'Bagmane Constellation Business Park',
    category: 'Tech Park',
    area: 'Doddanekundi / Marathahalli, Bangalore',
    keywords: ['bagmane constellation', 'marathahalli', 'amazon', 'samsung', 'ba'],
  },
  {
    id: 'loc-prestige-tech-park',
    name: 'Prestige Tech Park (Kadubeesanahalli)',
    category: 'Tech Park',
    area: 'Outer Ring Road, Bangalore',
    keywords: ['prestige tech park', 'kadubeesanahalli', 'jpmorgan', 'cisco'],
  },
  {
    id: 'loc-egl-domlur',
    name: 'Embassy GolfLinks Business Park (EGL)',
    category: 'Tech Park',
    area: 'Domlur / Indiranagar, Bangalore',
    keywords: ['egl', 'embassy golf links', 'domlur', 'ibm', 'microsoft', 'goldman sachs'],
  },
  {
    id: 'loc-global-village',
    name: 'Global Village Tech Park (RR Nagar)',
    category: 'Tech Park',
    area: 'Rajarajeshwari Nagar, Bangalore',
    keywords: ['global village', 'rr nagar', 'mindtree', 'mysore road'],
  },
  {
    id: 'loc-cessna-park',
    name: 'Cessna Business Park (Kadubeesanahalli)',
    category: 'Tech Park',
    area: 'Outer Ring Road, Bangalore',
    keywords: ['cessna', 'cessna business park', 'kadubeesanahalli', 'cisco'],
  },

  // --- PROMINENT LANDMARKS, MALLS & LUXURY HOTELS ---
  {
    id: 'loc-vidhana-soudha',
    name: 'Vidhana Soudha / High Court of Karnataka',
    category: 'Landmark',
    area: 'Ambedkar Veedhi, Central Bangalore',
    keywords: ['vidhana soudha', 'high court', 'cubbon park', 'governor house', 'ba'],
  },
  {
    id: 'loc-ub-city',
    name: 'UB City / Collection Mall (Vittal Mallya Road)',
    category: 'Landmark',
    area: 'Lavelle Road / Central Bangalore',
    keywords: ['ub city', 'vittal mallya road', 'jw marriott', 'luxury mall', 'ba'],
  },
  {
    id: 'loc-lalbagh',
    name: 'Lalbagh Botanical Garden (Main Gate / West Gate)',
    category: 'Landmark',
    area: 'Mavalli / Basavanagudi, Bangalore',
    keywords: ['lalbagh', 'botanical garden', 'flower show', 'glass house', 'ba'],
  },
  {
    id: 'loc-cubbon-park',
    name: 'Cubbon Park (Kasturba Road / Hudson Circle)',
    category: 'Landmark',
    area: 'Central Bangalore',
    keywords: ['cubbon park', 'kasturba road', 'state library', 'museum', 'ba'],
  },
  {
    id: 'loc-iskcon-temple',
    name: 'ISKCON Temple Bangalore (Hare Krishna Hill)',
    category: 'Landmark',
    area: 'Rajajinagar, Bangalore',
    keywords: ['iskcon', 'iskcon temple', 'hare krishna hill', 'rajajinagar', 'ba'],
  },
  {
    id: 'loc-bangalore-palace',
    name: 'Bangalore Palace (Vasanth Nagar)',
    category: 'Landmark',
    area: 'Palace Grounds, Bangalore',
    keywords: ['bangalore palace', 'palace grounds', 'vasanth nagar', 'ba'],
  },
  {
    id: 'loc-orion-mall',
    name: 'Orion Mall / Brigade Gateway (Rajajinagar)',
    category: 'Mall',
    area: 'Rajajinagar / Yeshwanthpur, Bangalore',
    keywords: ['orion mall', 'brigade gateway', 'sheraton grand', 'wto'],
  },
  {
    id: 'loc-phoenix-marketcity',
    name: 'Phoenix Marketcity & VR Bengaluru (Whitefield Rd)',
    category: 'Mall',
    area: 'Mahadevapura / Whitefield, Bangalore',
    keywords: ['phoenix marketcity', 'vr mall', 'mahadevapura', 'whitefield'],
  },
  {
    id: 'loc-phoenix-mall-asia',
    name: 'Phoenix Mall of Asia (Hebbal / Byatarayanapura)',
    category: 'Mall',
    area: 'Bellary Road / Hebbal, Bangalore',
    keywords: ['mall of asia', 'phoenix mall of asia', 'hebbal', 'byatarayanapura', 'ba'],
  },
  {
    id: 'loc-leela-palace',
    name: 'The Leela Palace Bangalore',
    category: 'Hotel',
    area: 'Old Airport Road, Kodihalli, Bangalore',
    keywords: ['leela palace', 'old airport road', 'hotel leela', 'kodihalli', 'ba'],
  },
  {
    id: 'loc-taj-west-end',
    name: 'Taj West End Hotel',
    category: 'Hotel',
    area: 'Race Course Road, Bangalore',
    keywords: ['taj west end', 'race course road', 'taj hotel', 'ba'],
  },
  {
    id: 'loc-itc-gardenia',
    name: 'ITC Gardenia Luxury Hotel',
    category: 'Hotel',
    area: 'Residency Road, Bangalore',
    keywords: ['itc gardenia', 'residency road', 'richmond circle', 'itc hotel', 'ba'],
  },
  {
    id: 'loc-itc-windsor',
    name: 'ITC Windsor Hotel',
    category: 'Hotel',
    area: 'Golf Course Road, Sankey Road, Bangalore',
    keywords: ['itc windsor', 'golf course', 'sankey road', 'itc hotel', 'ba'],
  },
  {
    id: 'loc-jw-marriott',
    name: 'JW Marriott Hotel Bangalore (Vittal Mallya Rd)',
    category: 'Hotel',
    area: 'Near UB City, Central Bangalore',
    keywords: ['jw marriott', 'vittal mallya road', 'marriott bangalore', 'ba'],
  },
  {
    id: 'loc-manipal-hospital',
    name: 'Manipal Hospital (Old Airport Road)',
    category: 'Hospital',
    area: 'HAL Old Airport Road, Bangalore',
    keywords: ['manipal hospital', 'old airport road', 'kodihalli', 'ba'],
  },
  {
    id: 'loc-narayana-health',
    name: 'Narayana Health City (Bommasandra)',
    category: 'Hospital',
    area: 'Hosur Road, Bommasandra, Bangalore',
    keywords: ['narayana health city', 'narayana hrudayalaya', 'bommasandra', 'ba'],
  },
  {
    id: 'loc-aster-cmi',
    name: 'Aster CMI Hospital (Hebbal)',
    category: 'Hospital',
    area: 'Bellary Road, Hebbal, Bangalore',
    keywords: ['aster cmi', 'hebbal hospital', 'aster hospital', 'ba'],
  },
  {
    id: 'loc-apollo-bannerghatta',
    name: 'Apollo Hospital (Bannerghatta Road)',
    category: 'Hospital',
    area: 'Bannerghatta Road, Bangalore',
    keywords: ['apollo hospital', 'bannerghatta road', 'apollo bannerghatta', 'ba'],
  },

  // --- OUTSTATION DESTINATIONS FROM BANGALORE ---
  {
    id: 'loc-mysore',
    name: 'Mysore / Mysuru (Palace, Chamundi Hill)',
    category: 'Outstation City',
    area: 'Karnataka (145 km from Bangalore via Expressway)',
    keywords: ['mysore', 'mysuru', 'mysore palace', 'chamundi hill', 'brindavan gardens'],
  },
  {
    id: 'loc-coorg',
    name: 'Coorg / Madikeri (Coffee County, Abbey Falls)',
    category: 'Outstation Destination',
    area: 'Karnataka (260 km from Bangalore)',
    keywords: ['coorg', 'madikeri', 'kushalnagar', 'abbey falls', 'raja seat', 'talacauvery'],
  },
  {
    id: 'loc-ooty',
    name: 'Ooty / Udhagamandalam & Nilgiris',
    category: 'Outstation Destination',
    area: 'Tamil Nadu (280 km from Bangalore)',
    keywords: ['ooty', 'udhagamandalam', 'nilgiris', 'coonoor', 'botanical gardens'],
  },
  {
    id: 'loc-chikmagalur',
    name: 'Chikmagalur / Chikkamagaluru (Mullayanagiri, Baba Budangiri)',
    category: 'Outstation Destination',
    area: 'Karnataka (245 km from Bangalore)',
    keywords: ['chikmagalur', 'chikkamagaluru', 'mullayanagiri', 'baba budangiri', 'kemmangundi'],
  },
  {
    id: 'loc-nandi-hills',
    name: 'Nandi Hills Sunrise Viewpoint',
    category: 'Outstation / Day Trip',
    area: 'Chikkaballapur (60 km from Bangalore)',
    keywords: ['nandi hills', 'nandi', 'sunrise', 'chikkaballapur', 'day trip'],
  },
  {
    id: 'loc-wayanad',
    name: 'Wayanad (Kalpetta, Sultan Bathery, Chembra)',
    category: 'Outstation Destination',
    area: 'Kerala (275 km from Bangalore)',
    keywords: ['wayanad', 'kalpetta', 'sultan bathery', 'banasura sagar', 'chembra peak'],
  },
  {
    id: 'loc-kabini',
    name: 'Kabini / Nagarhole National Park',
    category: 'Outstation Destination',
    area: 'Karnataka (215 km from Bangalore)',
    keywords: ['kabini', 'nagarhole', 'safari', 'wildlife', 'jungle lodges'],
  },
  {
    id: 'loc-bandipur',
    name: 'Bandipur National Park & Tiger Reserve',
    category: 'Outstation Destination',
    area: 'Karnataka (220 km from Bangalore)',
    keywords: ['bandipur', 'tiger reserve', 'safari', 'mudumalai'],
  },
  {
    id: 'loc-tirupati',
    name: 'Tirupati & Tirumala Balaji Temple',
    category: 'Outstation Destination',
    area: 'Andhra Pradesh (250 km from Bangalore)',
    keywords: ['tirupati', 'tirumala', 'balaji temple', 'venkateswara', 'alipiri'],
  },
  {
    id: 'loc-pondicherry',
    name: 'Pondicherry / Puducherry (French Quarter, Auroville)',
    category: 'Outstation Destination',
    area: 'Puducherry (310 km from Bangalore)',
    keywords: ['pondicherry', 'puducherry', 'auroville', 'promenade beach', 'french quarter'],
  },
  {
    id: 'loc-hampi',
    name: 'Hampi / Vijayanagara UNESCO Heritage Site',
    category: 'Outstation Destination',
    area: 'Karnataka (350 km from Bangalore)',
    keywords: ['hampi', 'vijayanagara', 'virupaksha', 'stone chariot', 'unesco'],
  },
  {
    id: 'loc-shravanabelagola',
    name: 'Shravanabelagola, Belur & Halebidu',
    category: 'Outstation Destination',
    area: 'Hassan, Karnataka (150-210 km from Bangalore)',
    keywords: ['shravanabelagola', 'belur', 'halebidu', 'gommateshwara', 'hassan'],
  },
  {
    id: 'loc-sakleshpur',
    name: 'Sakleshpur (Western Ghats / Manjarabad Fort)',
    category: 'Outstation Destination',
    area: 'Hassan, Karnataka (220 km from Bangalore)',
    keywords: ['sakleshpur', 'manjarabad', 'bisle ghat', 'coffee estate'],
  },
  {
    id: 'loc-kodaikanal',
    name: 'Kodaikanal (Princess of Hill Stations)',
    category: 'Outstation Destination',
    area: 'Tamil Nadu (460 km from Bangalore)',
    keywords: ['kodaikanal', 'kodai', 'coakers walk', 'pillar rocks'],
  },
  {
    id: 'loc-chennai',
    name: 'Chennai (Central / Marina / Airport)',
    category: 'Outstation City',
    area: 'Tamil Nadu (350 km from Bangalore)',
    keywords: ['chennai', 'madras', 'tambaram', 'guindy', 'chennai airport'],
  },
  {
    id: 'loc-coimbatore',
    name: 'Coimbatore (Gandhipuram / RS Puram / Isha)',
    category: 'Outstation City',
    area: 'Tamil Nadu (360 km from Bangalore)',
    keywords: ['coimbatore', 'kovai', 'isha yoga center', 'peelamedu'],
  },
  {
    id: 'loc-hyderabad',
    name: 'Hyderabad (HITEC City / Secunderabad)',
    category: 'Outstation City',
    area: 'Telangana (570 km via NH44 from Bangalore)',
    keywords: ['hyderabad', 'secunderabad', 'hitec city', 'gachibowli'],
  },
  {
    id: 'loc-mangalore',
    name: 'Mangalore / Udupi & Coastal Karnataka',
    category: 'Outstation City',
    area: 'Coastal Karnataka (350 km from Bangalore)',
    keywords: ['mangalore', 'mangaluru', 'udupi', 'malpe', 'kateel', 'dharmasthala'],
  },
  {
    id: 'loc-gokarna',
    name: 'Gokarna / Murudeshwar Beach & Temples',
    category: 'Outstation Destination',
    area: 'Uttara Kannada, Karnataka (490 km from Bangalore)',
    keywords: ['gokarna', 'murudeshwar', 'om beach', 'kudle beach'],
  },
  {
    id: 'loc-dandeli',
    name: 'Dandeli (River Rafting & Jungle Camps)',
    category: 'Outstation Destination',
    area: 'Karnataka (460 km from Bangalore)',
    keywords: ['dandeli', 'river rafting', 'kali river', 'jungle safari'],
  },
  {
    id: 'loc-salem',
    name: 'Salem / Yercaud Hill Station',
    category: 'Outstation Destination',
    area: 'Tamil Nadu (215 km from Bangalore)',
    keywords: ['salem', 'yercaud', 'shevaroy hills'],
  },
  {
    id: 'loc-vellore',
    name: 'Vellore (Golden Temple / CMC)',
    category: 'Outstation City',
    area: 'Tamil Nadu (210 km from Bangalore)',
    keywords: ['vellore', 'golden temple', 'cmc hospital', 'sripuram'],
  },
  {
    id: 'loc-shivanasamudra',
    name: 'Shivanasamudra Waterfalls & Talakadu',
    category: 'Outstation / Day Trip',
    area: 'Mandya / Chamarajanagar (135 km from Bangalore)',
    keywords: ['shivanasamudra', 'gaganachukki', 'bharachukki', 'talakadu'],
  },
  {
    id: 'loc-lepakshi',
    name: 'Lepakshi (Veerabhadra Temple & Hanging Pillar)',
    category: 'Outstation / Day Trip',
    area: 'Andhra Pradesh (120 km from Bangalore)',
    keywords: ['lepakshi', 'veerabhadra temple', 'nandi', 'day trip'],
  },
];

/**
 * Filter curated locations with smart ranking
 * Gives priority to:
 * 1. Name starting with query
 * 2. Words in name starting with query
 * 3. Keywords matching query
 * 4. Substring in name or area
 */
export function searchCuratedLocations(query, maxResults = 8) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const scored = [];

  for (const loc of CURATED_LOCATIONS) {
    const nameLower = loc.name.toLowerCase();
    const areaLower = loc.area.toLowerCase();
    let score = 0;

    // Exact start of name (e.g. "Ba" -> "Bangalore", "Banashankari", "Banaswadi", "Bannerghatta")
    if (nameLower.startsWith(q)) {
      score += 100;
    } else {
      // Word inside name starts with query (e.g. "Kempegowda International Airport" -> "airport")
      const words = nameLower.split(/[\s,()/-]+/);
      if (words.some(w => w.startsWith(q))) {
        score += 70;
      } else if (nameLower.includes(q)) {
        score += 40;
      }
    }

    // Area match
    if (areaLower.startsWith(q)) {
      score += 30;
    } else if (areaLower.includes(q)) {
      score += 20;
    }

    // Keywords match
    if (loc.keywords && loc.keywords.some(k => k.startsWith(q))) {
      score += 50;
    } else if (loc.keywords && loc.keywords.some(k => k.includes(q))) {
      score += 25;
    }

    if (score > 0) {
      scored.push({ loc, score });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map(item => item.loc);
}

/**
 * Online OpenStreetMap Geocoding Fallback (Photon / Nominatim)
 * Useful for specific apartment complexes, street addresses, or obscure hotels
 */
export async function searchOnlineLocations(query, maxResults = 5) {
  if (!query || query.trim().length < 3) return [];
  try {
    // Bounded search prioritizing India / Karnataka
    const encoded = encodeURIComponent(query.trim());
    const url = `https://photon.komoot.io/api/?q=${encoded}&limit=${maxResults}&lat=12.9716&lon=77.5946&lang=en`;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data || !data.features) return [];

    return data.features.map((feat, idx) => {
      const props = feat.properties || {};
      const name = props.name || props.street || query;
      const details = [props.district, props.city, props.state, props.country]
        .filter(Boolean)
        .join(', ');

      return {
        id: `osm-${props.osm_id || idx}-${Date.now()}`,
        name: name,
        category: props.osm_value ? props.osm_value.replace(/_/g, ' ').toUpperCase() : 'Location',
        area: details || 'Karnataka / India',
        isOnline: true
      };
    });
  } catch (err) {
    // Silently fall back to curated database on timeout/offline
    return [];
  }
}
