import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function probeCorolla() {
  const { data, info } = await sharp(path.join(root, 'public/fleet/backup-corolla-white.jpg')).raw().toBuffer({ resolveWithObject: true });
  for (let y = 350; y <= 400; y++) {
    for (let x = 175; x <= 245; x++) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // screw hole is very dark (< 30) while surrounding is white (> 200)
      if (r < 30 && g < 30 && b < 30) {
        console.log(`screw pixel at x=${x}, y=${y}`);
      }
    }
  }
}

probeCorolla().catch(console.error);
