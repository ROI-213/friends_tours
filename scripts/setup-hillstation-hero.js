import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\30702a02-de35-4b13-a167-486be86b623f';
const heroDir = 'public/hero';

if (!fs.existsSync(heroDir)) {
  fs.mkdirSync(heroDir, { recursive: true });
}

async function processHero() {
  const brainFiles = fs.readdirSync(brainDir);
  const found = brainFiles.filter(f => f.startsWith('hillstation_scenic_highway_') && f.endsWith('.jpg')).pop();
  
  if (!found) {
    console.error('Hillstation image not found in brainDir');
    return;
  }

  const src = path.join(brainDir, found);
  
  // Save full 2K resolution hillstation hero image
  await sharp(src)
    .resize(2200, 1240, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(heroDir, 'hillstation-hero.jpg'));

  console.log('Saved public/hero/hillstation-hero.jpg');
}

processHero().catch(console.error);
