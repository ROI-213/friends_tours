import sharp from 'sharp';
import fs from 'fs';

async function processNewBatch() {
  const lagunaSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824509423.jpg';
  const bhartiyaSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824509425.jpg';
  const texportSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824509467.png';
  const cipSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824509467.webp';
  const questSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824509470.webp';

  // 1. Laguna
  if (fs.existsSync(lagunaSrc)) {
    await sharp(lagunaSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/laguna.png');
    console.log('Processed laguna.png');
  }

  // 2. Bhartiya
  if (fs.existsSync(bhartiyaSrc)) {
    await sharp(bhartiyaSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/bhartiya.png');
    console.log('Processed bhartiya.png');
  }

  // 3. Texport Overseas
  if (fs.existsSync(texportSrc)) {
    await sharp(texportSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/texport.png');
    console.log('Processed texport.png');
  }

  // 4. CIP (Potato Center)
  if (fs.existsSync(cipSrc)) {
    await sharp(cipSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/cip.png');
    console.log('Processed cip.png');
  }

  // 5. Quest Global
  if (fs.existsSync(questSrc)) {
    await sharp(questSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/quest.png');
    console.log('Processed quest.png');
  }
}

processNewBatch().catch(console.error);
