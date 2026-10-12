import sharp from 'sharp';
import fs from 'fs';

async function fixCompactSedan() {
  const file = 'public/fleet/compact-sedan.jpg';
  if (fs.existsSync(file)) {
    const meta = await sharp(file).metadata();
    console.log('Compact sedan dimensions:', meta.width, meta.height);
    
    // We can crop out the bottom 18% where the number plate badge was baked in, or resize from top/center
    // If the baked-in plate is at the bottom, crop top 85% and resize cleanly
    const cropHeight = Math.round(meta.height * 0.85);
    await sharp(file)
      .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
      .resize(800, 520, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 92 })
      .toFile('public/fleet/compact-sedan-clean.jpg');
    
    fs.copyFileSync('public/fleet/compact-sedan-clean.jpg', file);
    fs.unlinkSync('public/fleet/compact-sedan-clean.jpg');
    console.log('Successfully cropped and cleaned compact-sedan.jpg');
  }
}

fixCompactSedan().catch(console.error);
