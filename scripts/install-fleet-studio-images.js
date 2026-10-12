import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\30702a02-de35-4b13-a167-486be86b623f';
const fleetDir = 'public/fleet';

const map = [
  { prefix: 'maruti_dzire_sedan_studio_', target: 'dzire-white.jpg' },
  { prefix: 'toyota_innova_ac_studio_', target: 'innova-white.jpg' },
  { prefix: 'toyota_innova_crysta_studio_', target: 'innova-crysta-white.jpg' },
  { prefix: 'tempo_traveller_studio_', target: 'tempo-white.jpg' },
  { prefix: 'toyota_corolla_studio_', target: 'corolla-white.jpg' },
  { prefix: 'bmw_7_series_studio_', target: 'bmw-7-white.jpg' },
  { prefix: 'mercedes_e_class_studio_', target: 'mercedes-e-white.jpg' },
  { prefix: 'mercedes_s_class_studio_', target: 'mercedes-s-white.jpg' },
  { prefix: 'audi_a6_studio_', target: 'audi-a6-white.jpg' },
];

async function installImages() {
  const brainFiles = fs.readdirSync(brainDir);

  for (const item of map) {
    const found = brainFiles.filter(f => f.startsWith(item.prefix) && f.endsWith('.jpg')).pop();
    if (!found) {
      console.warn('Not found for prefix:', item.prefix);
      continue;
    }
    const src = path.join(brainDir, found);
    const dest = path.join(fleetDir, item.target);

    await sharp(src)
      .resize(1000, 600, { fit: 'contain', background: '#FFFFFF' })
      .jpeg({ quality: 92 })
      .toFile(dest);

    console.log(`Copied and optimized: ${found} -> ${item.target}`);
  }
}

installImages().catch(console.error);
