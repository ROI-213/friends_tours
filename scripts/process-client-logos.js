import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const clientsDir = 'public/clients';
if (!fs.existsSync(clientsDir)) {
  fs.mkdirSync(clientsDir, { recursive: true });
}

async function processLogos() {
  const adventSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787823580547.jpg';
  const caiSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787823580542.jpg';
  const dentsuSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787823580544.png';
  const herbalifeSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787823580547.png';

  // 1. Advent Global
  if (fs.existsSync(adventSrc)) {
    await sharp(adventSrc)
      .trim()
      .resize(200, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/advent.png');
    console.log('Saved advent.png');
  }

  // 2. CAI
  if (fs.existsSync(caiSrc)) {
    await sharp(caiSrc)
      .trim()
      .resize(200, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/cai.png');
    console.log('Saved cai.png');
  }

  // 3. Dentsu
  if (fs.existsSync(dentsuSrc)) {
    await sharp(dentsuSrc)
      .trim()
      .resize(200, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/dentsu.png');
    console.log('Saved dentsu.png');
  }

  // 4. Herbalife
  if (fs.existsSync(herbalifeSrc)) {
    await sharp(herbalifeSrc)
      .trim()
      .resize(200, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/herbalife.png');
    console.log('Saved herbalife.png');
  }
}

processLogos().catch(console.error);
