import sharp from 'sharp';

const img2Path = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787569735344.png';

async function analyzeImage2() {
  const { data, info } = await sharp(img2Path).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Detect non-background pixels (background in img2 is light teal/cyan: roughly r: 170-220, g: 210-235, b: 215-240)
      // Orange text "FRIENDS": r is high (180-240), g is low-mid (60-120), b is low (20-70)
      // Blue text "TOURS & TRAVELS": r is low (10-60), g is low-mid (40-90), b is mid (80-140)
      const isOrange = r > 150 && g < 130 && b < 100;
      const isBlue = b > 60 && r < 80 && g < 100;

      if (isOrange || isBlue) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Text bounds in Image 2: left=${minX}, top=${minY}, right=${maxX}, bottom=${maxY}, width=${maxX - minX}, height=${maxY - minY}`);

  const pad = 10;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, (maxX - minX) + pad * 2);
  const cropHeight = Math.min(height - cropTop, (maxY - minY) + pad * 2);

  await sharp(img2Path)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png()
    .toFile('scripts/text-crop.png');

  console.log('Saved text crop to scripts/text-crop.png');
}

analyzeImage2().catch(console.error);
