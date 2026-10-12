import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = 'public/hero-frames-2';
const destDir = 'public/hero-frames';

async function restoreAndCleanSeamless() {
  const files = fs.readdirSync(destDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} frames...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    if (!fs.existsSync(srcFile)) continue;

    const img = sharp(srcFile);
    const { width, height } = await img.metadata();
    const raw = await img.raw().toBuffer({ resolveWithObject: true });
    const { data } = raw;

    const minX = Math.round(width * 0.44);
    const maxX = Math.round(width * 0.58);
    const minY = Math.round(height * 0.56);
    const maxY = Math.round(height * 0.70);

    // 1. Find tight exact bounding box of the yellow plate
    let pMinX = width, pMaxX = 0, pMinY = height, pMaxY = 0;
    let found = false;

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Yellow plate detection
        if (r > 150 && g > 110 && b < 110 && (r - b) > 55 && (g - b) > 35) {
          found = true;
          if (x < pMinX) pMinX = x;
          if (x > pMaxX) pMaxX = x;
          if (y < pMinY) pMinY = y;
          if (y > pMaxY) pMaxY = y;
        }
      }
    }

    if (found && pMaxX > pMinX && pMaxY > pMinY) {
      // Sample the actual car bumper color from just above and just below the plate
      const topIdx = ((pMinY - 1) * width + Math.round((pMinX + pMaxX) / 2)) * 3;
      const topR = data[topIdx] || 220;
      const topG = data[topIdx + 1] || 220;
      const topB = data[topIdx + 2] || 225;

      const botIdx = ((pMaxY + 1) * width + Math.round((pMinX + pMaxX) / 2)) * 3;
      const botR = data[botIdx] || 200;
      const botG = data[botIdx + 1] || 200;
      const botB = data[botIdx + 2] || 205;

      // Fill ONLY the tight yellow plate area with a natural vertical gradient of the bumper
      for (let y = pMinY; y <= pMaxY; y++) {
        const t = (y - pMinY) / (pMaxY - pMinY);
        const curR = Math.round(topR * (1 - t) + botR * t);
        const curG = Math.round(topG * (1 - t) + botG * t);
        const curB = Math.round(topB * (1 - t) + botB * t);

        for (let x = pMinX; x <= pMaxX; x++) {
          const idx = (y * width + x) * 3;
          data[idx] = curR;
          data[idx + 1] = curG;
          data[idx + 2] = curB;
        }
      }
    }

    await sharp(data, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 96 })
      .toFile(destFile);
  }

  console.log('Restored all frames with seamless tight bumper inpainting and ZERO white blank space!');
}

restoreAndCleanSeamless().catch(console.error);
