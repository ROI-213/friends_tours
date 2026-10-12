import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createSeamlessCleanRoad() {
  const src = 'public/hero/hillstation-hero.jpg';
  const meta = await sharp(src).metadata();
  console.log('Image dims:', meta.width, meta.height);

  // The car is at roughly x: 35% to 57%, y: 65% to 88%
  // The road surface to the left (x: 10% to 32%, y: 65% to 88%) is clean dark asphalt
  const carWidth = Math.round(meta.width * 0.24);
  const carHeight = Math.round(meta.height * 0.22);
  const carLeft = Math.round(meta.width * 0.355);
  const carTop = Math.round(meta.height * 0.655);

  // Extract clean road asphalt texture from the lower-left road curve
  const cleanRoadPatch = await sharp(src)
    .extract({
      left: Math.round(meta.width * 0.11),
      top: Math.round(meta.height * 0.65),
      width: carWidth,
      height: carHeight,
    })
    .modulate({ brightness: 0.98 })
    .toBuffer();

  // Create clean road image by blending the clean asphalt patch over the car
  await sharp(src)
    .composite([
      {
        input: cleanRoadPatch,
        left: carLeft,
        top: carTop,
        blend: 'over',
      }
    ])
    .jpeg({ quality: 95 })
    .toFile('public/hero/clean-mountain-road.jpg');

  console.log('Created public/hero/clean-mountain-road.jpg');
}

createSeamlessCleanRoad().catch(console.error);
