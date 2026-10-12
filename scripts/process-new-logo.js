import sharp from 'sharp';
import fs from 'fs';

const newImagePath = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787821325733.png';

async function processNewLogo() {
  console.log('Reading new logo image:', newImagePath);
  const metadata = await sharp(newImagePath).metadata();
  console.log('Image metadata:', metadata);

  // 1. Convert to raw RGBA buffer and make white background transparent
  const { data, info } = await sharp(newImagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outData = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    // Check distance from white (255, 255, 255)
    // The background is pure white #FFFFFF
    const diffFromWhite = Math.sqrt(
      Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
    );

    // Is it part of the colored logo?
    // Colors present: Green (~#77B829), Orange (~#F06522), Blue (~#1B75BC)
    const isGreen = (g > 100 && g > b + 20);
    const isOrange = (r > 130 && r > g + 20 && r > b + 40);
    const isBlue = (b > 100 && b > r + 30);
    const isColored = isGreen || isOrange || isBlue;

    if (diffFromWhite < 18) {
      // Pure white background -> completely transparent
      outData[dstIdx] = 0;
      outData[dstIdx + 1] = 0;
      outData[dstIdx + 2] = 0;
      outData[dstIdx + 3] = 0;
    } else if (diffFromWhite < 55 && !isColored) {
      // Smooth anti-aliased edge
      const alpha = Math.min(255, Math.max(0, Math.round(((diffFromWhite - 18) / 37) * 255)));
      outData[dstIdx] = r;
      outData[dstIdx + 1] = g;
      outData[dstIdx + 2] = b;
      outData[dstIdx + 3] = alpha;
    } else {
      outData[dstIdx] = r;
      outData[dstIdx + 1] = g;
      outData[dstIdx + 2] = b;
      outData[dstIdx + 3] = 255;
    }
  }

  // Save trimmed high-resolution transparent icon
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

  console.log('Saved high-res transparent icon to public/logo-icon.png');

  // Favicons & standard icons
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

  // Generate SVGs
  const base64Icon = (await fs.promises.readFile('public/logo-icon.png')).toString('base64');
  
  const iconSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Icon}" x="0" y="0" width="256" height="256" />
</svg>
`;

  await fs.promises.writeFile('public/logo-icon.svg', iconSvg.trim());
  await fs.promises.writeFile('public/favicon.svg', iconSvg.trim());

  // Create combined horizontal logo (icon + typography)
  const iconBuffer = await sharp('public/logo-icon.png')
    .resize({ height: 180, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const iconMeta = await sharp(iconBuffer).metadata();

  const svgText = `
    <svg width="600" height="180" viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&amp;display=swap');
          .friends-txt {
            font-family: 'Playfair Display', 'Cinzel', 'Georgia', serif;
            font-size: 82px;
            font-weight: 900;
            fill: #D85524;
            letter-spacing: 0.08em;
          }
          .travels-txt {
            font-family: 'Playfair Display', 'Cinzel', 'Georgia', serif;
            font-style: italic;
            font-size: 42px;
            font-weight: 900;
            fill: #000000;
            letter-spacing: 0.14em;
          }
        </style>
      </defs>
      <text x="10" y="85" class="friends-txt">FRIENDS</text>
      <text x="15" y="145" class="travels-txt">TOURS &amp; TRAVELS</text>
    </svg>
  `;

  const textRaster = await sharp(Buffer.from(svgText)).png().toBuffer();
  const textMeta = await sharp(textRaster).metadata();

  const totalWidth = iconMeta.width + 20 + textMeta.width + 20;
  const totalHeight = 180;

  await sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: iconBuffer, top: 0, left: 10 },
      { input: textRaster, top: 0, left: iconMeta.width + 20 }
    ])
    .png()
    .toFile('public/logo.png');

  await sharp('public/logo.png')
    .resize({ height: 80, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/logo-nav.png');

  const fullSvg = `
<svg width="680" height="180" viewBox="0 0 680 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Icon}" x="10" y="5" width="170" height="170" />
  <text x="200" y="90" font-family="'Playfair Display', 'Georgia', 'Cinzel', serif" font-size="80" font-weight="900" fill="#D85524" letter-spacing="0.08em">FRIENDS</text>
  <text x="204" y="148" font-family="'Playfair Display', 'Georgia', 'Cinzel', serif" font-style="italic" font-size="40" font-weight="900" fill="#000000" letter-spacing="0.12em">TOURS &amp; TRAVELS</text>
</svg>
`;
  await fs.promises.writeFile('public/logo.svg', fullSvg.trim());

  console.log('All logo assets updated successfully.');
}

processNewLogo().catch(console.error);
