import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = 'public/hero-frames-2';
const destDir = 'public/hero-frames';

async function processAllFrames() {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} frames to apply FRIENDS TOURS & TRAVELS branding...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    const img = sharp(srcFile);
    const { width, height } = await img.metadata();
    const raw = await img.raw().toBuffer({ resolveWithObject: true });
    const { data } = raw;

    // Search for yellow plate bounding box in lower-center area
    const minX = Math.round(width * 0.40);
    const maxX = Math.round(width * 0.60);
    const minY = Math.round(height * 0.54);
    const maxY = Math.round(height * 0.72);

    let pMinX = width, pMaxX = 0, pMinY = height, pMaxY = 0;
    let foundPlate = false;

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Yellow plate color threshold
        if (r > 135 && g > 95 && b < 110 && (r - b) > 45 && (g - b) > 25) {
          foundPlate = true;
          if (x < pMinX) pMinX = x;
          if (x > pMaxX) pMaxX = x;
          if (y < pMinY) pMinY = y;
          if (y > pMaxY) pMaxY = y;
        }
      }
    }

    // Clean any old text on the door panel (x: 11% to 26%, y: 35% to 52%)
    const doorMinX = Math.round(width * 0.11);
    const doorMaxX = Math.round(width * 0.26);
    const doorMinY = Math.round(height * 0.35);
    const doorMaxY = Math.round(height * 0.52);

    for (let y = doorMinY; y < doorMaxY; y++) {
      for (let x = doorMinX; x < doorMaxX; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Dark text pixels on white door
        if (r < 175 && g < 175 && b < 180 && r > 50 && g > 50) {
          data[idx] = 226;
          data[idx + 1] = 228;
          data[idx + 2] = 232;
        }
      }
    }

    const baseBuf = await sharp(data, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 96 })
      .toBuffer();

    const composites = [];

    // 1. Overlay crisp FRIENDS TOURS & TRAVELS on the Yellow Number Plate
    if (foundPlate && pMaxX > pMinX && pMaxY > pMinY) {
      const plateW = pMaxX - pMinX;
      const plateH = pMaxY - pMinY;

      if (plateW >= 18 && plateH >= 8) {
        const plateSvg = `
          <svg width="${plateW}" height="${plateH}" viewBox="0 0 ${plateW} ${plateH}" xmlns="http://www.w3.org/2000/svg">
            <!-- Commercial Taxi Yellow Board with subtle border -->
            <rect width="${plateW}" height="${plateH}" rx="2" fill="#ECA600" stroke="#7A5200" stroke-width="1" />
            
            <!-- FRIENDS Text -->
            <text 
              x="${plateW / 2}" 
              y="${plateH * 0.58}" 
              font-family="'Impact', 'Arial Black', Arial, sans-serif" 
              font-size="${Math.max(7, Math.round(plateH * 0.52))}" 
              font-weight="900" 
              fill="#381300" 
              text-anchor="middle"
              letter-spacing="0.8"
            >FRIENDS</text>
            
            <!-- TOURS & TRAVELS Subtext -->
            <text 
              x="${plateW / 2}" 
              y="${plateH * 0.88}" 
              font-family="Arial, Helvetica, sans-serif" 
              font-size="${Math.max(4.5, Math.round(plateH * 0.24))}" 
              font-weight="800" 
              fill="#220B00" 
              text-anchor="middle"
              letter-spacing="0.3"
            >TOURS &amp; TRAVELS</text>
          </svg>
        `;

        composites.push({
          input: Buffer.from(plateSvg),
          left: pMinX,
          top: pMinY,
        });
      }
    }

    // 2. Overlay FRIENDS TOURS & TRAVELS on the car door panel when close
    if (i > 25) {
      const doorW = Math.round(width * 0.12);
      const doorH = Math.round(height * 0.08);
      const doorPosX = Math.round(width * 0.13);
      const doorPosY = Math.round(height * 0.39);

      const doorSvg = `
        <svg width="${doorW}" height="${doorH}" viewBox="0 0 ${doorW} ${doorH}" xmlns="http://www.w3.org/2000/svg">
          <text 
            x="${doorW / 2}" 
            y="${doorH * 0.45}" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="${Math.max(8, Math.round(doorH * 0.40))}" 
            font-weight="850" 
            fill="#4A5568" 
            text-anchor="middle"
            letter-spacing="0.8"
            transform="rotate(-5 ${doorW / 2} ${doorH / 2})"
          >FRIENDS</text>
          <text 
            x="${doorW / 2}" 
            y="${doorH * 0.82}" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="${Math.max(6, Math.round(doorH * 0.26))}" 
            font-weight="750" 
            fill="#718096" 
            text-anchor="middle"
            letter-spacing="0.4"
            transform="rotate(-5 ${doorW / 2} ${doorH / 2})"
          >TOURS &amp; TRAVELS</text>
        </svg>
      `;

      composites.push({
        input: Buffer.from(doorSvg),
        left: doorPosX,
        top: doorPosY,
      });
    }

    if (composites.length > 0) {
      await sharp(baseBuf)
        .composite(composites)
        .jpeg({ quality: 96 })
        .toFile(destFile);
    } else {
      await sharp(baseBuf)
        .jpeg({ quality: 96 })
        .toFile(destFile);
    }
  }

  console.log('Successfully completed processing all frames with FRIENDS TOURS & TRAVELS branding!');
}

processAllFrames().catch(console.error);
