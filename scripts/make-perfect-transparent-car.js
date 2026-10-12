import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function makeSolidCarCutout() {
  const src = 'public/fleet/innova-crysta-white.jpg';
  const img = sharp(src);
  const { width, height } = await img.metadata();
  
  const raw = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data } = raw;

  // Flood fill background from border edges
  const visited = new Uint8Array(width * height);
  const queue = [];

  const getIdx = (x, y) => (y * width + x);
  const isWhiteBg = (x, y) => {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return (r > 235 && g > 235 && b > 235);
  };

  // Push all border pixels that are white
  for (let x = 0; x < width; x++) {
    if (isWhiteBg(x, 0)) queue.push([x, 0]);
    if (isWhiteBg(x, height - 1)) queue.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    if (isWhiteBg(0, y)) queue.push([0, y]);
    if (isWhiteBg(width - 1, y)) queue.push([width - 1, y]);
  }

  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    const cIdx = getIdx(cx, cy);
    if (visited[cIdx]) continue;
    visited[cIdx] = 1;

    // Set alpha to 0 for background
    data[cIdx * 4 + 3] = 0;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = getIdx(nx, ny);
        if (!visited[nIdx] && isWhiteBg(nx, ny)) {
          queue.push([nx, ny]);
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('public/hero/solid-moving-car.png');

  console.log('Created public/hero/solid-moving-car.png with solid car body & transparent background!');
}

makeSolidCarCutout().catch(console.error);
