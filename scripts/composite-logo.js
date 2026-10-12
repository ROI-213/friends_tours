import sharp from 'sharp';
import fs from 'fs';

async function composite() {
  const iconBuffer = await sharp('public/logo-icon.png')
    .resize({ height: 180, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const iconMeta = await sharp(iconBuffer).metadata();

  // Create SVG text that matches the exact font style from Image 2:
  // "FRIENDS" in bold serif terracotta/orange (#E05A2B / #C94C1B)
  // "TOURS & TRAVELS" in classic navy serif (#19355E)
  const svgText = `
    <svg width="600" height="180" viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&amp;family=Playfair+Display:wght@700;800;900&amp;family=Outfit:wght@700;800&amp;display=swap');
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
          .tagline-txt {
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 700;
            fill: #666666;
            letter-spacing: 0.22em;
          }
        </style>
      </defs>
      <text x="10" y="85" class="friends-txt">FRIENDS</text>
      <text x="15" y="145" class="travels-txt">TOURS &amp; TRAVELS</text>
    </svg>
  `;

  const svgTextBuffer = Buffer.from(svgText);
  const textRaster = await sharp(svgTextBuffer).png().toBuffer();
  const textMeta = await sharp(textRaster).metadata();

  // Create horizontal combined logo: [ICON] [TEXT]
  const totalWidth = iconMeta.width + 20 + textMeta.width + 20;
  const totalHeight = 180;

  const horizontalLogo = await sharp({
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

  console.log('Saved horizontal logo to public/logo.png');

  // Also create a compact navbar logo (height 60px)
  await sharp('public/logo.png')
    .resize({ height: 80, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/logo-nav.png');

  console.log('Saved navbar logo to public/logo-nav.png');

  // Create SVG standalone version
  const base64Icon = (await fs.promises.readFile('public/logo-icon.png')).toString('base64');
  const fullSvg = `
<svg width="680" height="180" viewBox="0 0 680 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Icon}" x="10" y="5" width="170" height="170" />
  <text x="200" y="90" font-family="'Playfair Display', 'Georgia', 'Cinzel', serif" font-size="80" font-weight="900" fill="#D85524" letter-spacing="0.08em">FRIENDS</text>
  <text x="204" y="148" font-family="'Playfair Display', 'Georgia', 'Cinzel', serif" font-style="italic" font-size="40" font-weight="900" fill="#000000" letter-spacing="0.12em">TOURS &amp; TRAVELS</text>
</svg>
`;

  await fs.promises.writeFile('public/logo.svg', fullSvg.trim());
  console.log('Saved full vector SVG to public/logo.svg');
}

composite().catch(console.error);
