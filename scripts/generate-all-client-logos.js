import sharp from 'sharp';
import fs from 'fs';

const otherClients = [
  { file: 'quest.png', text: 'QUEST GLOBAL', color: '#E31B23', font: 'Arial, sans-serif' },
  { file: 'geodis.png', text: 'GEODIS', color: '#002B49', font: 'Arial, sans-serif' },
  { file: 'travix.png', text: 'travix', color: '#00A0DF', font: 'Arial, sans-serif' },
  { file: 'employvision.png', text: 'Employvision', color: '#005691', font: 'Arial, sans-serif' },
  { file: 'cip.png', text: 'CIP / Potato Centre', color: '#007A3D', font: 'Arial, sans-serif' },
  { file: 'laguna.png', text: 'LAGUNA INDIA', color: '#1B365D', font: 'Arial, sans-serif' },
  { file: 'texport.png', text: 'TEXPORT OVERSEAS', color: '#8B0000', font: 'Arial, sans-serif' },
  { file: 'vistra.png', text: 'VISTRA', color: '#E4002B', font: 'Arial, sans-serif' },
  { file: 'itti.png', text: 'ITTI', color: '#1E398B', font: 'Arial, sans-serif' },
  { file: 'bhartiya.png', text: 'BHARTIYA', color: '#000000', font: 'Arial, sans-serif' }
];

async function generateRemainingLogos() {
  for (const c of otherClients) {
    const dest = `public/clients/${c.file}`;
    if (!fs.existsSync(dest)) {
      const svg = `
        <svg width="240" height="90" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="${c.font}" font-size="24" font-weight="900" fill="${c.color}" letter-spacing="0.05em">${c.text}</text>
        </svg>
      `;
      await sharp(Buffer.from(svg))
        .png()
        .toFile(dest);
      console.log(`Generated ${dest}`);
    }
  }
}

generateRemainingLogos().catch(console.error);
