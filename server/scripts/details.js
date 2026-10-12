import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function extractDetails() {
  // BMW
  await sharp(path.join(root, 'public/fleet/bmw-7-white.jpg'))
    .extract({ left: 180, top: 400, width: 150, height: 80 })
    .toFile(path.join(root, 'public/fleet/detail-bmw.jpg'));

  // Mercedes E
  await sharp(path.join(root, 'public/fleet/mercedes-e-white.jpg'))
    .extract({ left: 730, top: 330, width: 140, height: 80 })
    .toFile(path.join(root, 'public/fleet/detail-mercedes-e.jpg'));

  // Mercedes S
  await sharp(path.join(root, 'public/fleet/mercedes-s-white.jpg'))
    .extract({ left: 740, top: 390, width: 140, height: 80 })
    .toFile(path.join(root, 'public/fleet/detail-mercedes-s.jpg'));

  // Corolla
  await sharp(path.join(root, 'public/fleet/corolla-white.jpg'))
    .extract({ left: 140, top: 350, width: 150, height: 80 })
    .toFile(path.join(root, 'public/fleet/detail-corolla.jpg'));

  console.log('All details extracted');
}

extractDetails().catch(console.error);
