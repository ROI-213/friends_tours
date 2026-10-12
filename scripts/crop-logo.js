import sharp from 'sharp';
import fs from 'fs';

const img1Path = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787569732458.png';
const img2Path = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787569735344.png';

async function locateLogo() {
  const { data, info } = await sharp(img1Path).raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Let's find rows and columns that contain the bright white square of the logo preview
  // In the screenshot, the white square with the logo is in the middle of the screen
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 100; y < height - 200; y++) {
    for (let x = 20; x < width - 20; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Detect the white card / popup background (r > 245, g > 245, b > 245) or colored logo pixels
      // But not the dark background outside
      if (r > 230 && g > 230 && b > 230) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`White box bounds: left=${minX}, top=${minY}, width=${maxX - minX}, height=${maxY - minY}`);

  // Let's crop the white box region
  const cropLeft = Math.max(0, minX + 5);
  const cropTop = Math.max(0, minY + 5);
  const cropWidth = Math.min(width - cropLeft, (maxX - minX) - 10);
  const cropHeight = Math.min(height - cropTop, (maxY - minY) - 10);

  console.log(`Cropping logo region: left=${cropLeft}, top=${cropTop}, width=${cropWidth}, height=${cropHeight}`);

  await sharp(img1Path)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png()
    .toFile('scripts/cropped-logo-raw.png');

  console.log('Saved raw cropped logo to scripts/cropped-logo-raw.png');
}

locateLogo().catch(console.error);
