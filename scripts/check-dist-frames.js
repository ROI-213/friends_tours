import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function checkDist() {
  if (fs.existsSync('dist/hero-frames/ezgif-frame-040.jpg')) {
    const meta = await sharp('dist/hero-frames/ezgif-frame-040.jpg').metadata();
    console.log('dist/hero-frames 40 dims:', meta.width, meta.height);
  }
}

checkDist().catch(console.error);
