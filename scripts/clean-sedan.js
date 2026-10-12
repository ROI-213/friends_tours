import sharp from 'sharp';
import fs from 'fs';

async function fixCompactSedan() {
  const file = 'public/fleet/compact-sedan.jpg';
  if (fs.existsSync(file)) {
    const meta = await sharp(file).metadata();
    const cropHeight = Math.round(meta.height * 0.84);
    await sharp(file)
      .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
      .resize(900, 580, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 94 })
      .toFile('public/fleet/sedan-clean.jpg');
    console.log('Saved sedan-clean.jpg without number plate badge');
  }
}

fixCompactSedan().catch(console.error);
