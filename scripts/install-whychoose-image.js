import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\30702a02-de35-4b13-a167-486be86b623f';
const servDir = 'public/services';

if (!fs.existsSync(servDir)) {
  fs.mkdirSync(servDir, { recursive: true });
}

async function installImg() {
  const brainFiles = fs.readdirSync(brainDir);
  const found = brainFiles.filter(f => f.startsWith('why_choose_chauffeur_route_') && f.endsWith('.jpg')).pop();
  if (!found) return;

  const src = path.join(brainDir, found);
  const dest = path.join(servDir, 'why-choose-chauffeur.jpg');
  
  await sharp(src)
    .resize(1000, 750, { fit: 'cover' })
    .jpeg({ quality: 94 })
    .toFile(dest);

  console.log('Saved public/services/why-choose-chauffeur.jpg');
}

installImg().catch(console.error);
