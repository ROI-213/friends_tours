import sharp from 'sharp';

async function processLogo() {
  // 1. Load cropped logo icon
  const iconCrop = await sharp('scripts/logo-icon-crop.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = iconCrop.info;
  const data = iconCrop.data;

  // Create clean RGBA buffer
  const outData = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    // Check if pixel is white or near white (background)
    // Distance from pure white (255, 255, 255)
    const diffFromWhite = Math.sqrt(
      Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
    );

    // Also check for light grey watermark or drop shadow outside the circle
    const isLightGrey = r > 215 && g > 215 && b > 215;
    const isGreyShadow = (r > 180 && g > 180 && b > 180) && Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15;

    // Check if pixel has green, blue, or dark color
    const isBlue = (b > 110 && b > r + 30);
    const isGreen = (g > 110 && g > b + 25);
    const isDarkLogoPart = (r < 80 && g < 80 && b < 80);

    if (diffFromWhite < 25 || (isLightGrey && !isBlue && !isGreen)) {
      // Completely transparent
      outData[dstIdx] = 0;
      outData[dstIdx + 1] = 0;
      outData[dstIdx + 2] = 0;
      outData[dstIdx + 3] = 0;
    } else if (diffFromWhite < 60 && !isBlue && !isGreen) {
      // Fade out edge anti-aliasing
      const alpha = Math.min(255, Math.max(0, Math.round(((diffFromWhite - 25) / 35) * 255)));
      outData[dstIdx] = r;
      outData[dstIdx + 1] = g;
      outData[dstIdx + 2] = b;
      outData[dstIdx + 3] = alpha;
    } else if (isGreyShadow && !isBlue && !isGreen) {
      // Remove drop shadow at bottom
      outData[dstIdx] = 0;
      outData[dstIdx + 1] = 0;
      outData[dstIdx + 2] = 0;
      outData[dstIdx + 3] = 0;
    } else {
      // Logo content
      outData[dstIdx] = r;
      outData[dstIdx + 1] = g;
      outData[dstIdx + 2] = b;
      outData[dstIdx + 3] = 255;
    }
  }

  // Save transparent logo icon
  await sharp(outData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/logo-icon.png');

  console.log('Saved transparent icon to public/logo-icon.png');

  // 2. Process text from Image 2
  const textCrop = await sharp('scripts/text-crop.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const tWidth = textCrop.info.width;
  const tHeight = textCrop.info.height;
  const tData = textCrop.data;
  const tOutData = Buffer.alloc(tWidth * tHeight * 4);

  for (let i = 0; i < tWidth * tHeight; i++) {
    const srcIdx = i * textCrop.info.channels;
    const dstIdx = i * 4;

    const r = tData[srcIdx];
    const g = tData[srcIdx + 1];
    const b = tData[srcIdx + 2];

    // In img2, background is light greenish/teal (e.g. r: 180-220, g: 210-240, b: 215-245)
    // "FRIENDS" is orange (r > 150, g < 130, b < 100)
    // "TOURS & TRAVELS" is navy blue (r < 90, g < 110, b > 70)
    const isOrange = r > 130 && (r > g + 40) && (r > b + 50);
    const isNavy = b > 60 && (r < 100) && (g < 130);

    if (isOrange) {
      tOutData[dstIdx] = r;
      tOutData[dstIdx + 1] = g;
      tOutData[dstIdx + 2] = b;
      tOutData[dstIdx + 3] = 255;
    } else if (isNavy) {
      tOutData[dstIdx] = r;
      tOutData[dstIdx + 1] = g;
      tOutData[dstIdx + 2] = b;
      tOutData[dstIdx + 3] = 255;
    } else {
      // Check if it's antialiased edge
      const orangeDist = Math.max(0, (r - g) - 20);
      const navyDist = Math.max(0, (b - r) - 20);

      if (orangeDist > 15) {
        tOutData[dstIdx] = r;
        tOutData[dstIdx + 1] = g;
        tOutData[dstIdx + 2] = b;
        tOutData[dstIdx + 3] = Math.min(255, orangeDist * 4);
      } else if (navyDist > 15) {
        tOutData[dstIdx] = r;
        tOutData[dstIdx + 1] = g;
        tOutData[dstIdx + 2] = b;
        tOutData[dstIdx + 3] = Math.min(255, navyDist * 4);
      } else {
        tOutData[dstIdx] = 0;
        tOutData[dstIdx + 1] = 0;
        tOutData[dstIdx + 2] = 0;
        tOutData[dstIdx + 3] = 0;
      }
    }
  }

  await sharp(tOutData, {
    raw: {
      width: tWidth,
      height: tHeight,
      channels: 4
    }
  })
    .trim()
    .png()
    .toFile('scripts/text-transparent.png');

  console.log('Saved transparent text to scripts/text-transparent.png');
}

processLogo().catch(console.error);
