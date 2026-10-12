import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const framesDir = 'public/hero-frames';

async function cleanAllFrames() {
  const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
  console.log(`Processing ${files.length} frames...`);

  for (const file of files) {
    const filePath = path.join(framesDir, file);
    const img = sharp(filePath);
    const { width, height } = await img.metadata();
    const raw = await img.raw().toBuffer({ resolveWithObject: true });
    const { data } = raw;

    // Search in the lower middle area of the frame where the car number plate is
    // x: 30% to 70%, y: 45% to 85%
    const minX = Math.round(width * 0.3);
    const maxX = Math.round(width * 0.7);
    const minY = Math.round(height * 0.45);
    const maxY = Math.round(height * 0.85);

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Detect yellow plate color (yellow has high red and green, low blue)
        // e.g. R: 180-255, G: 140-230, B: 0-90
        const isYellow = (r > 150 && g > 120 && b < 100 && (r - b) > 70 && (g - b) > 50);

        if (isYellow) {
          // Replace with clean white/silver bumper color
          data[idx] = 238;     // R
          data[idx + 1] = 238; // G
          data[idx + 2] = 240; // B
        }
      }
    }

    await sharp(data, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 95 })
      .toFile(filePath);
  }

  console.log('Successfully cleaned number plates across all 77 frames!');
}

cleanAllFrames().catch(console.error);
