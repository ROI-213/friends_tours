import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = 'public/hero-frames-2';
const destDir = 'public/hero-frames';

async function processMirroredFrames() {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} frames with car coming from right...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    // 1. Horizontally flip (flop) the base frame so car comes from the RIGHT
    const flopped = await sharp(srcFile).flop().toBuffer();

    const img = sharp(flopped);
    const { width, height } = await img.metadata();
    const raw = await img.raw().toBuffer({ resolveWithObject: true });
    const { data } = raw;

    // 2. Search for the yellow license plate bounding box in the flopped frame
    // In flopped frame, the plate is roughly between x: 42% to 62%, y: 54% to 72%
    const minX = Math.round(width * 0.40);
    const maxX = Math.round(width * 0.62);
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

        // Yellow plate detection
        if (r > 135 && g > 95 && b < 110 && (r - b) > 45 && (g - b) > 25) {
          foundPlate = true;
          if (x < pMinX) pMinX = x;
          if (x > pMaxX) pMaxX = x;
          if (y < pMinY) pMinY = y;
          if (y > pMaxY) pMaxY = y;
        }
      }
    }

    // Clean any old flopped text on the car door panel on the right side
    const doorMinX = Math.round(width * 0.74);
    const doorMaxX = Math.round(width * 0.89);
    const doorMinY = Math.round(height * 0.35);
    const doorMaxY = Math.round(height * 0.52);

    for (let y = doorMinY; y < doorMaxY; y++) {
      for (let x = doorMinX; x < doorMaxX; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

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

    // 3. Render un-mirrored, crisp "FRIENDS TOURS & TRAVELS" on the Yellow Number Plate
    if (foundPlate && pMaxX > pMinX && pMaxY > pMinY) {
      const plateW = pMaxX - pMinX;
      const plateH = pMaxY - pMinY;

      if (plateW >= 16 && plateH >= 8) {
        const plateSvg = `
          <svg width="${plateW}" height="${plateH}" viewBox="0 0 ${plateW} ${plateH}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${plateW}" height="${plateH}" rx="2" fill="#ECA600" stroke="#7A5200" stroke-width="1" />
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

    // 4. Windshield banner "FRIENDS TOURS & TRAVELS" (readable, un-mirrored)
    if (i > 15) {
      const windW = Math.round(width * 0.18);
      const windH = Math.round(height * 0.035);
      const windX = Math.round(width * 0.44);
      const windY = Math.round(height * 0.33);

      const windSvg = `
        <svg width="${windW}" height="${windH}" viewBox="0 0 ${windW} ${windH}" xmlns="http://www.w3.org/2000/svg">
          <text 
            x="${windW / 2}" 
            y="${windH * 0.75}" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="${Math.max(7, Math.round(windH * 0.72))}" 
            font-weight="850" 
            fill="#F7FAFC" 
            text-anchor="middle"
            letter-spacing="1"
          >FRIENDS TOURS &amp; TRAVELS</text>
        </svg>
      `;

      composites.push({
        input: Buffer.from(windSvg),
        left: windX,
        top: windY,
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

  console.log('Successfully completed processing all frames with car coming from RIGHT and FRIENDS branding!');
}

processMirroredFrames().catch(console.error);
