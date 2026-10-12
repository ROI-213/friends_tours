import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const framesDir = 'public/hero-frames';

async function eraseBumperPlateCompletely() {
  const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} frames...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(framesDir, file);
    const img = sharp(filePath);
    const { width, height } = await img.metadata();
    const raw = await img.raw().toBuffer({ resolveWithObject: true });
    const { data } = raw;

    // As the car moves from frame 001 to 077, the plate moves from:
    // Frame 001 (distant): x ~ 48% to 54%, y ~ 64% to 68%
    // Frame 077 (close): x ~ 45% to 56%, y ~ 59% to 67%
    // Let's compute dynamic bounds based on frame progress
    const progress = i / (files.length - 1);
    
    // Find the yellow/dark plate area
    const minX = Math.round(width * 0.40);
    const maxX = Math.round(width * 0.60);
    const minY = Math.round(height * 0.50);
    const maxY = Math.round(height * 0.72);

    let plateMinX = width, plateMaxX = 0, plateMinY = height, plateMaxY = 0;
    let foundPlate = false;

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Detect yellow or brownish plate pixels or plate border
        const isYellow = (r > 130 && g > 90 && b < 110 && (r - b) > 50 && (g - b) > 30);
        if (isYellow) {
          foundPlate = true;
          if (x < plateMinX) plateMinX = x;
          if (x > plateMaxX) plateMaxX = x;
          if (y < plateMinY) plateMinY = y;
          if (y > plateMaxY) plateMaxY = y;
        }
      }
    }

    if (foundPlate) {
      // Expand bounding box by 4px to cover border
      plateMinX = Math.max(minX, plateMinX - 4);
      plateMaxX = Math.min(maxX, plateMaxX + 4);
      plateMinY = Math.max(minY, plateMinY - 4);
      plateMaxY = Math.min(maxY, plateMaxY + 4);

      // Clean white bumper paint
      for (let y = plateMinY; y <= plateMaxY; y++) {
        for (let x = plateMinX; x <= plateMaxX; x++) {
          const idx = (y * width + x) * 3;
          // Smooth silver-white bumper tone
          const v = 236 + Math.round(Math.sin((x - plateMinX) * 0.1) * 4);
          data[idx] = v;
          data[idx + 1] = v;
          data[idx + 2] = v + 3;
        }
      }
    }

    await sharp(data, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 96 })
      .toFile(filePath);
  }

  console.log('Successfully erased number plates completely across all frames!');
}

eraseBumperPlateCompletely().catch(console.error);
