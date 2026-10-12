import sharp from 'sharp';
import fs from 'fs';

async function processBatch3() {
  const travixSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824677832.png';
  const geodisSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824913733.png';
  const employvisionSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787824957887.png';
  const ittiSrc = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787825141125.png';

  // 1. Travix
  if (fs.existsSync(travixSrc)) {
    await sharp(travixSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/travix.png');
    console.log('Processed travix.png');
  }

  // 2. Geodis
  if (fs.existsSync(geodisSrc)) {
    await sharp(geodisSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/geodis.png');
    console.log('Processed geodis.png');
  }

  // 3. Employvision
  if (fs.existsSync(employvisionSrc)) {
    await sharp(employvisionSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/employvision.png');
    console.log('Processed employvision.png');
  }

  // 4. ITTI
  if (fs.existsSync(ittiSrc)) {
    await sharp(ittiSrc)
      .trim()
      .resize(220, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile('public/clients/itti.png');
    console.log('Processed itti.png');
  }
}

processBatch3().catch(console.error);
