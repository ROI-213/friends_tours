import sharp from 'sharp';
import fs from 'fs';

async function makeFavicons() {
  const base64Icon = (await fs.promises.readFile('public/logo-icon.png')).toString('base64');
  
  const iconSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Icon}" x="0" y="0" width="256" height="256" />
</svg>
`;

  await fs.promises.writeFile('public/logo-icon.svg', iconSvg.trim());
  await fs.promises.writeFile('public/favicon.svg', iconSvg.trim());

  await sharp('public/logo-icon.png')
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon.png');

  console.log('Saved favicons and SVG icons successfully.');
}

makeFavicons().catch(console.error);
