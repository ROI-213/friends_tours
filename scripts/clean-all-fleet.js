import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const fleetDir = 'public/fleet';
const files = [
  'tempo-traveller.jpg',
  'executive-sedan.jpg',
  'luxury-class.jpg',
  'toyota-innova.jpg',
  'innova-crysta.jpg',
  'mini-bus.jpg',
  'toyota-fortuner.jpg',
  'corporate-cab.jpg',
  'compact-sedan.jpg'
];

async function cleanAll() {
  for (const filename of files) {
    const srcPath = path.join(fleetDir, filename);
    if (!fs.existsSync(srcPath)) continue;

    const baseName = filename.replace('.jpg', '');
    const outName = `${baseName}-clean.jpg`;
    const outPath = path.join(fleetDir, outName);

    const meta = await sharp(srcPath).metadata();
    console.log(`Processing ${filename}: ${meta.width}x${meta.height}`);

    // Crop top 82% to completely eliminate any bottom yellow banner/strip
    const cropHeight = Math.round(meta.height * 0.82);
    await sharp(srcPath)
      .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
      .resize(900, 580, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 94 })
      .toFile(outPath);

    console.log(`-> Saved ${outName}`);
  }
}

cleanAll().catch(console.error);
