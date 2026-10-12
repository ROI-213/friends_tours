import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const img1Path = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787569732458.png';
const img2Path = 'C:/Users/LENOVO/.gemini/antigravity/brain/30702a02-de35-4b13-a167-486be86b623f/.user_uploaded/media_1787569735344.png';

async function analyze() {
  const meta1 = await sharp(img1Path).metadata();
  console.log('Image 1 metadata:', meta1);

  const meta2 = await sharp(img2Path).metadata();
  console.log('Image 2 metadata:', meta2);
}

analyze().catch(console.error);
