import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function probeBMW() {
  const { data, info } = await sharp(path.join(root, 'public/fleet/backup-bmw-7-white.jpg')).raw().toBuffer({ resolveWithObject: true });
  // Find where the white rectangle is on BMW 7
  let minX = 1000, maxX = 0, minY = 600, maxY = 0;
  for (let y = 400; y <= 470; y++) {
    for (let x = 190; x <= 300; x++) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r > 190 && g > 190 && b > 190) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('BMW 7 exact plate bounds:', { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });
}

probeBMW().catch(console.error);
