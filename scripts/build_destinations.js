import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const destDir = path.resolve('public/destinations');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const headers = { 'User-Agent': 'FriendsToursDestinations/1.0 (contact@friendstoursbangalore.com)' };

const DESTINATIONS_CONFIG = [
  {
    id: 'mysore-palace',
    title: 'File:Illuminated Mysore palace at night.JPG',
    fallback: 'File:Mysore Palace (1).jpg',
    filename: 'mysore-palace.jpg'
  },
  {
    id: 'coorg-abbey-falls',
    title: 'File:Abbey falls- Coorg❤.jpg',
    filename: 'coorg-abbey-falls.jpg'
  },
  {
    id: 'nandi-hills',
    title: 'File:Sun rising over a blanket of clouds, Nandi Hills, Karnataka (edit).jpg',
    filename: 'nandi-hills-sunrise.jpg'
  },
  {
    id: 'bangalore-city',
    title: 'File:Vidhan Soudha Bangalore Front view.JPG',
    fallback: 'File:Bangalore Palace facade on a cloudy day.jpg',
    filename: 'bangalore-city.jpg'
  },
  {
    id: 'chikmagalur',
    title: 'File:Mullayanagiri in Chikmagalur district of Karnataka.jpg',
    fallback: 'File:Peaks of Mullayanagiri.jpg',
    filename: 'chikmagalur-mullayanagiri.jpg'
  },
  {
    id: 'ramanagara',
    title: 'File:Ramanagara .jpg',
    filename: 'ramanagara-hills.jpg'
  },
  {
    id: 'savandurga',
    title: 'File:Savandurga Hill 02.jpg',
    filename: 'savandurga.jpg'
  },
  {
    id: 'hogenakkal',
    title: 'File:Hogenakkal Falls and Coracle Ride.jpg',
    filename: 'hogenakkal-falls.jpg'
  },
  {
    id: 'ooty',
    title: 'File:Tea garden ooty nilgiris, india.jpg',
    filename: 'ooty-tea-gardens.jpg'
  },
  {
    id: 'wayanad',
    title: 'File:Chembra Peak Heart Lake.jpg',
    filename: 'wayanad-hills.jpg'
  }
];

async function getWikiImageUrl(title) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url|dimensions&format=json';
  const res = await fetch(url, { headers });
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  return page?.imageinfo?.[0]?.url;
}

async function processDestination(config) {
  try {
    console.log(`Fetching destination ${config.id} (${config.title})...`);
    let imgUrl = await getWikiImageUrl(config.title);
    if (!imgUrl && config.fallback) {
      console.log(`Trying fallback for ${config.id} (${config.fallback})...`);
      imgUrl = await getWikiImageUrl(config.fallback);
    }

    if (!imgUrl) {
      console.error(`Could not find URL for ${config.id}`);
      return;
    }

    const imgRes = await fetch(imgUrl, { headers });
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const width = 1200;
    const height = 800;

    await sharp(buffer)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92 })
      .toFile(path.join(destDir, config.filename));

    console.log(`✓ Successfully saved original destination photo: ${config.filename}`);
  } catch (err) {
    console.error(`Error processing destination ${config.id}:`, err.message);
  }
}

async function run() {
  console.log('Downloading and optimizing original Bangalore Getaway destination photos...');
  for (const config of DESTINATIONS_CONFIG) {
    await processDestination(config);
  }
  console.log('Finished saving all original getaway place images!');
}

run();
