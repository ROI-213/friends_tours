import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function probeEX() {
  const { data, info } = await sharp(path.join(root, 'public/fleet/backup-mercedes-e-white.jpg')).raw().toBuffer({ resolveWithObject: true });
  for (let x = 750; x <= 855; x += 5) {
    const idx = (365 * info.width + x) * 3;
    console.log(`x=${x}: rgb(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`);
  }
}

probeEX().catch(console.error);
