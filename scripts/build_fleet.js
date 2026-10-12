import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const fleetDir = path.resolve('public/fleet');
if (!fs.existsSync(fleetDir)) {
  fs.mkdirSync(fleetDir, { recursive: true });
}

const headers = { 'User-Agent': 'FriendsToursFleetBuilder/1.0 (contact@friendstoursbangalore.com)' };

const FLEET_CONFIG = [
  {
    id: 'innova-crysta',
    title: 'File:Toyota Innova Crysta 2.4 Z front right.jpg',
    plate: 'KA 01 AF 4040',
    permitType: 'ALL KARNATAKA TOURIST PERMIT',
    filename: 'innova-crysta.jpg'
  },
  {
    id: 'toyota-innova',
    title: 'File:Toyota Innova 2.8 V White Pearl Crystal Shine.jpg',
    plate: 'KA 04 MC 1888',
    permitType: 'KARNATAKA STATE COMMERCIAL PERMIT',
    filename: 'toyota-innova.jpg'
  },
  {
    id: 'compact-sedan',
    title: 'File:Suzuki Swift Dzire 1.2 GL 2015.jpg',
    plate: 'KA 03 AB 7722',
    permitType: 'BANGALORE CITY TAXI PERMIT',
    filename: 'compact-sedan.jpg'
  },
  {
    id: 'executive-sedan',
    title: 'File:2024 Honda City 1.5 S in Taffeta White, front left, 06-20-2024.jpg',
    plate: 'KA 05 EX 9911',
    permitType: 'EXECUTIVE CORPORATE CHAUFFEUR',
    filename: 'executive-sedan.jpg'
  },
  {
    id: 'premium-suv',
    title: 'File:Toyota Fortuner India.jpg',
    plate: 'KA 51 F 5005',
    permitType: 'KARNATAKA VIP TOURIST PERMIT',
    filename: 'toyota-fortuner.jpg'
  },
  {
    id: 'tempo-traveller',
    title: 'File:Force Traveller Luxury.jpg',
    plate: 'KA 01 TT 2468',
    permitType: 'ALL INDIA TOURIST OMNI BUS PERMIT',
    filename: 'tempo-traveller.jpg'
  },
  {
    id: 'mini-bus',
    title: 'File:Volvo-9700 3axle.jpg',
    plate: 'KA 02 MB 7700',
    permitType: 'COMMERCIAL LUXURY COACH PERMIT',
    filename: 'mini-bus.jpg'
  },
  {
    id: 'luxury-class',
    title: 'File:Mercedes-Benz W214 E 300 4MATIC EXCLUSIVE Polar White (14).jpg',
    plate: 'KA 01 VIP 0001',
    permitType: 'LUXURY VIP CHAUFFEUR PERMIT',
    filename: 'luxury-class.jpg'
  },
  {
    id: 'corporate-cab',
    title: 'File:Toyota Etios saloon, Jakarta.jpg',
    plate: 'KA 03 CP 3690',
    permitType: 'BANGALORE CORPORATE MOBILITY CAB',
    filename: 'corporate-cab.jpg'
  }
];

function createPlateSvg(plateNumber, permitType, width = 1200, height = 750) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="60%" stop-color="#05050A" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#05050A" stop-opacity="0.95" />
        </linearGradient>
        <filter id="plateDropShadow" x="-10%" y="-10%" width="125%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.75" />
        </filter>
      </defs>

      <rect x="0" y="${height - 180}" width="${width}" height="180" fill="url(#bottomShadow)" />

      <!-- Top Right Badge: White Commercial Taxi Fleet -->
      <g transform="translate(${width - 250}, 24)">
        <rect x="0" y="0" width="226" height="34" rx="8" fill="rgba(0, 0, 0, 0.75)" stroke="#F7C600" stroke-width="1.5" />
        <circle cx="16" cy="17" r="5" fill="#F7C600" />
        <text x="30" y="22" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" letter-spacing="1">WHITE FLEET · KA REG</text>
      </g>

      <!-- Authentic Karnataka Yellow Commercial License Plate Graphic -->
      <g transform="translate(32, ${height - 95})" filter="url(#plateDropShadow)">
        <!-- Outer Plate Border (Yellow Commercial Board) -->
        <rect x="0" y="0" width="300" height="66" rx="8" fill="#FACC15" stroke="#111111" stroke-width="3.5" />
        
        <!-- Left IND Blue Band -->
        <path d="M 0 8 Q 0 0 8 0 L 38 0 L 38 66 L 8 66 Q 0 66 0 58 Z" fill="#003399" />
        
        <!-- IND Circle / Chakra Emblem & IND text -->
        <circle cx="19" cy="24" r="9" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
        <circle cx="19" cy="24" r="3.5" fill="#FFFFFF" />
        <text x="19" y="52" font-family="system-ui, Arial, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">IND</text>
        
        <!-- Plate Number (Authentic Black on Yellow Bold Font) -->
        <text x="168" y="44" font-family="'Impact', 'Arial Black', -apple-system, sans-serif" font-weight="900" font-size="32" fill="#111111" text-anchor="middle" letter-spacing="2.5">${plateNumber}</text>
      </g>

      <!-- Permit Badge in Overlay -->
      <g transform="translate(350, ${height - 84})">
        <rect x="0" y="0" width="250" height="24" rx="5" fill="#FACC15" />
        <circle cx="12" cy="12" r="4" fill="#000000" />
        <text x="24" y="16" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#000000" letter-spacing="0.5">KARNATAKA YELLOW BOARD</text>
        
        <text x="2" y="42" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#E2E8F0" letter-spacing="0.5">${permitType}</text>
      </g>
    </svg>
  `);
}

async function getWikiImageUrl(title) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url|dimensions&format=json';
  const res = await fetch(url, { headers });
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  return page?.imageinfo?.[0]?.url;
}

async function processVehicle(config) {
  try {
    console.log(`Processing ${config.id} (${config.title})...`);
    let imgUrl = await getWikiImageUrl(config.title);
    if (!imgUrl) {
      console.error(`Could not find URL for ${config.title}`);
      return;
    }

    const imgRes = await fetch(imgUrl, { headers });
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const width = 1200;
    const height = 750;

    const baseImage = await sharp(buffer)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .toBuffer();

    const svgPlate = createPlateSvg(config.plate, config.permitType, width, height);

    await sharp(baseImage)
      .composite([{ input: svgPlate, top: 0, left: 0 }])
      .jpeg({ quality: 92 })
      .toFile(path.join(fleetDir, config.filename));

    console.log(`✓ Successfully updated ${config.filename}`);
  } catch (err) {
    console.error(`Error processing ${config.id}:`, err.message);
  }
}

async function run() {
  console.log('Generating updated fleet images with authentic KA yellow registration boards...');
  for (const config of FLEET_CONFIG) {
    await processVehicle(config);
  }
  console.log('All fleet images processed successfully!');
}

run();
