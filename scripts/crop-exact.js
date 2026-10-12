import sharp from 'sharp';

const img1Path = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787569732458.png';

async function findExactLogoBounds() {
  const { data, info } = await sharp(img1Path).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's find the bounding box of the circular green/blue logo
  // Blue hand is roughly r: 30-70, g: 110-180, b: 200-245
  // Green car/hand is roughly r: 100-170, g: 170-220, b: 30-80
  // Background inside the card is white (r > 240, g > 240, b > 240)
  // Background outside the card is grey/dark (r < 180, g < 180, b < 180)

  let logoMinX = width, logoMaxX = 0, logoMinY = height, logoMaxY = 0;

  for (let y = 200; y < 700; y++) {
    for (let x = 30; x < width - 30; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Check if this pixel is part of the blue hand, green car/hand, or blue outer curve
      const isBlue = (b > 140 && b > r + 40 && b > g - 20) || (b > 180 && r < 100);
      const isGreen = (g > 130 && g > b + 40 && g > r - 10) || (g > 160 && b < 120);
      const isColored = isBlue || isGreen;

      if (isColored) {
        if (x < logoMinX) logoMinX = x;
        if (x > logoMaxX) logoMaxX = x;
        if (y < logoMinY) logoMinY = y;
        if (y > logoMaxY) logoMaxY = y;
      }
    }
  }

  console.log(`Logo bounds: left=${logoMinX}, top=${logoMinY}, right=${logoMaxX}, bottom=${logoMaxY}, width=${logoMaxX - logoMinX}, height=${logoMaxY - logoMinY}`);

  // Let's crop with a small padding
  const pad = 10;
  const cropLeft = Math.max(0, logoMinX - pad);
  const cropTop = Math.max(0, logoMinY - pad);
  const cropWidth = Math.min(width - cropLeft, (logoMaxX - logoMinX) + pad * 2);
  const cropHeight = Math.min(height - cropTop, (logoMaxY - logoMinY) + pad * 2);

  await sharp(img1Path)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png()
    .toFile('scripts/logo-icon-crop.png');

  console.log('Saved exact logo icon crop to scripts/logo-icon-crop.png');
}

findExactLogoBounds().catch(console.error);
