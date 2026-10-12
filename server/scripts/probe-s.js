import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function probeS() {
  const { data, info } = await sharp(path.join(root, 'public/fleet/backup-mercedes-s-white.jpg')).raw().toBuffer({ resolveWithObject: true });
  // Find where the white bumper bar is on Mercedes S (at x=800)
  for (let y = 390; y <= 440; y += 2) {
    const idx = (y * info.width + 800) * 3;
    console.log(`y=${y}: rgb(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`);
  }
}

probeS().catch(console.error);
