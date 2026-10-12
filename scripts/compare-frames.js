import sharp from 'sharp';
import fs from 'fs';

async function compareFrames() {
  if (fs.existsSync('dist/hero-frames/ezgif-frame-001.jpg')) {
    const dMeta = await sharp('dist/hero-frames/ezgif-frame-001.jpg').metadata();
    console.log('dist frame 001:', dMeta.width, dMeta.height);
  }
  if (fs.existsSync('public/hero-frames-2/ezgif-frame-001.jpg')) {
    const pMeta = await sharp('public/hero-frames-2/ezgif-frame-001.jpg').metadata();
    console.log('public hero-frames-2 frame 001:', pMeta.width, pMeta.height);
  }
  if (fs.existsSync('public/hero-frames/ezgif-frame-001.jpg')) {
    const hMeta = await sharp('public/hero-frames/ezgif-frame-001.jpg').metadata();
    console.log('public hero-frames frame 001:', hMeta.width, hMeta.height);
  }
}

compareFrames().catch(console.error);
