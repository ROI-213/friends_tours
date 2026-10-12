import sharp from 'sharp';
import fs from 'fs';

async function updateFavicon() {
  // Generate 32x32, 64x64, 192x192, 512x512 png icons
  await sharp('public/logo-icon.png')
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon.png');

  await sharp('public/logo-icon.png')
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/logo192.png');

  await sharp('public/logo-icon.png')
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/logo512.png');

  console.log('Favicon images generated successfully.');
}

updateFavicon().catch(console.error);
