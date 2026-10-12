import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function checkFrames() {
  const framePath = 'public/hero-frames/ezgif-frame-040.jpg';
  const meta = await sharp(framePath).metadata();
  console.log('Frame 40 dims:', meta.width, meta.height);
}

checkFrames().catch(console.error);
