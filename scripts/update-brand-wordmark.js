import sharp from 'sharp';
import fs from 'fs';

async function updateWordmark() {
  const iconBuffer = await sharp('public/logo-icon.png')
    .resize({ height: 160, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const iconMeta = await sharp(iconBuffer).metadata();

  // Reference wordmark:
  // "FRIENDS" in bold italic orange (#F04D23)
  // "TOURS AND TRAVELS" in bold italic deep navy blue (#0D256C)
  const svgText = `
    <svg width="600" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@1,800;1,900&amp;family=Montserrat:ital,wght@1,800;1,900&amp;display=swap');
          .friends-title {
            font-family: 'Montserrat', 'Plus Jakarta Sans', 'Arial Black', sans-serif;
            font-style: italic;
            font-size: 78px;
            font-weight: 900;
            fill: #FA4616;
            letter-spacing: 0.02em;
          }
          .tours-tagline {
            font-family: 'Montserrat', 'Plus Jakarta Sans', 'Arial Black', sans-serif;
            font-style: italic;
            font-size: 34px;
            font-weight: 800;
            fill: #0D256C;
            letter-spacing: 0.05em;
          }
        </style>
      </defs>
      <text x="5" y="80" class="friends-title">FRIENDS</text>
      <text x="8" y="132" class="tours-tagline">TOURS AND TRAVELS</text>
    </svg>
  `;

  const textRaster = await sharp(Buffer.from(svgText)).png().toBuffer();
  const textMeta = await sharp(textRaster).metadata();

  const totalWidth = iconMeta.width + 16 + textMeta.width + 16;
  const totalHeight = 160;

  await sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: iconBuffer, top: 0, left: 8 },
      { input: textRaster, top: 0, left: iconMeta.width + 16 }
    ])
    .png()
    .toFile('public/logo.png');

  await sharp('public/logo.png')
    .resize({ height: 75, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/logo-nav.png');

  const base64Icon = (await fs.promises.readFile('public/logo-icon.png')).toString('base64');
  const fullSvg = `
<svg width="640" height="160" viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Icon}" x="8" y="5" width="150" height="150" />
  <text x="180" y="80" font-family="'Montserrat', 'Plus Jakarta Sans', 'Arial Black', sans-serif" font-style="italic" font-size="78" font-weight="900" fill="#FA4616" letter-spacing="0.02em">FRIENDS</text>
  <text x="184" y="132" font-family="'Montserrat', 'Plus Jakarta Sans', 'Arial Black', sans-serif" font-style="italic" font-size="34" font-weight="800" fill="#0D256C" letter-spacing="0.05em">TOURS AND TRAVELS</text>
</svg>
`;
  await fs.promises.writeFile('public/logo.svg', fullSvg.trim());

  console.log('Saved exact matching logo assets successfully.');
}

updateWordmark().catch(console.error);
