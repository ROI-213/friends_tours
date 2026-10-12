import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const heroImgPath = 'public/hero/hillstation-hero.jpg';
const heroDir = 'public/hero';

async function prepareHeroAssets() {
  const meta = await sharp(heroImgPath).metadata();
  console.log('Hero image size:', meta.width, meta.height);

  // 1. Extract car from hillstation-hero.jpg (car is located roughly at x: 35% to 56%, y: 66% to 88%)
  const carLeft = Math.round(meta.width * 0.35);
  const carTop = Math.round(meta.height * 0.66);
  const carWidth = Math.round(meta.width * 0.22);
  const carHeight = Math.round(meta.height * 0.22);

  // Extract car image
  await sharp(heroImgPath)
    .extract({ left: carLeft, top: carTop, width: carWidth, height: carHeight })
    .toFile(path.join(heroDir, 'car-extracted.png'));

  // 2. Create clean road background by cloning a patch of the empty road over the car area
  // The asphalt road texture to the left (x: 20%, y: 66%) can cover the car
  const roadPatchLeft = Math.round(meta.width * 0.12);
  const roadPatchTop = Math.round(meta.height * 0.66);
  
  const roadPatch = await sharp(heroImgPath)
    .extract({ left: roadPatchLeft, top: roadPatchTop, width: carWidth, height: carHeight })
    .blur(1)
    .toBuffer();

  await sharp(heroImgPath)
    .composite([
      { input: roadPatch, top: carTop, left: carLeft, blend: 'over' }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(heroDir, 'hillstation-road-clean.jpg'));

  // 3. Prepare an ultra-crisp transparent cutout of the white luxury SUV
  // We can use the studio innova-crysta or dzire with threshold or transparent background
  const studioImg = 'public/fleet/innova-crysta-white.jpg';
  if (fs.existsSync(studioImg)) {
    const raw = await sharp(studioImg)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Remove white background (convert pixels with rgb > 245 to alpha = 0)
    const { data, info } = raw;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0;
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(path.join(heroDir, 'moving-car.png'));
    
    console.log('Successfully created moving-car.png with transparent alpha');
  }

  console.log('Successfully prepared hero motion assets!');
}

prepareHeroAssets().catch(console.error);
