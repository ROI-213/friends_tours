import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function inspectFrame() {
  const meta = await sharp('public/hero-frames/ezgif-frame-040.jpg').metadata();
  console.log('Frame dims:', meta.width, meta.height);
}

inspectFrame().catch(console.error);
