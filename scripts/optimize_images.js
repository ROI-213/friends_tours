import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');

async function getDirStats(dirPath) {
  let totalBytes = 0;
  let count = 0;
  if (!fs.existsSync(dirPath)) return { totalBytes: 0, count: 0 };
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const sub = await getDirStats(fullPath);
      totalBytes += sub.totalBytes;
      count += sub.count;
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      const stat = fs.statSync(fullPath);
      totalBytes += stat.size;
      count += 1;
    }
  }
  return { totalBytes, count };
}

async function optimizeHeroFrames(folderName, maxW = 1200, quality = 80) {
  const folderPath = path.join(PUBLIC_DIR, folderName);
  if (!fs.existsSync(folderPath)) return;
  const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg)$/i.test(f));
  console.log(`Optimizing ${files.length} frames in ${folderName}...`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const tempPath = filePath + '.tmp.jpg';
    try {
      const image = sharp(filePath);
      const meta = await image.metadata();
      
      let pipeline = sharp(filePath);
      if (meta.width && meta.width > maxW) {
        pipeline = pipeline.resize(maxW, null, { fit: 'inside', withoutEnlargement: true });
      }
      
      await pipeline
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toFile(tempPath);
      
      fs.renameSync(tempPath, filePath);
    } catch (err) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`Failed to optimize frame ${file}:`, err.message);
    }
  }
}

async function optimizeFolderImages(folderName, maxW = 1400, quality = 82) {
  const folderPath = path.join(PUBLIC_DIR, folderName);
  if (!fs.existsSync(folderPath)) return;
  const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`Optimizing ${files.length} images in ${folderName}...`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const ext = path.extname(file).toLowerCase();
    const tempPath = filePath + `.tmp${ext}`;
    try {
      const image = sharp(filePath);
      const meta = await image.metadata();

      let pipeline = sharp(filePath);
      if (meta.width && meta.width > maxW) {
        pipeline = pipeline.resize(maxW, null, { fit: 'inside', withoutEnlargement: true });
      }

      if (ext === '.png') {
        await pipeline
          .png({ quality: 82, compressionLevel: 9, palette: true })
          .toFile(tempPath);
      } else {
        await pipeline
          .jpeg({ quality, progressive: true, mozjpeg: true })
          .toFile(tempPath);
      }

      fs.renameSync(tempPath, filePath);
    } catch (err) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`Failed to optimize image ${file}:`, err.message);
    }
  }
}

async function main() {
  console.log('=== Image Optimization Started ===');
  const beforeStats = await getDirStats(PUBLIC_DIR);
  console.log(`Original Assets Total: ${(beforeStats.totalBytes / 1024 / 1024).toFixed(2)} MB across ${beforeStats.count} files.\n`);

  // 1. Optimize Hero Frames (77 & 208 frames)
  await optimizeHeroFrames('hero-frames', 1200, 78);
  await optimizeHeroFrames('hero-frames-2', 1200, 78);

  // 2. Optimize Section Image Folders
  await optimizeFolderImages('about', 1400, 82);
  await optimizeFolderImages('destinations', 1400, 82);
  await optimizeFolderImages('fleet', 1400, 82);
  await optimizeFolderImages('gallery', 1400, 82);
  await optimizeFolderImages('services', 1400, 82);

  // 3. Optimize Root Cars PNGs
  const rootFiles = ['car-luxury.png', 'car-sedan.png', 'car-suv.png', 'hero-car.png'];
  for (const file of rootFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    if (fs.existsSync(filePath)) {
      const tempPath = filePath + '.tmp.png';
      try {
        await sharp(filePath)
          .png({ quality: 80, compressionLevel: 9, palette: true })
          .toFile(tempPath);
        fs.renameSync(tempPath, filePath);
        console.log(`✓ Optimized root graphic ${file}`);
      } catch (err) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.error(`Error optimizing ${file}:`, err.message);
      }
    }
  }

  const afterStats = await getDirStats(PUBLIC_DIR);
  const savedMB = ((beforeStats.totalBytes - afterStats.totalBytes) / 1024 / 1024).toFixed(2);
  const percent = (((beforeStats.totalBytes - afterStats.totalBytes) / beforeStats.totalBytes) * 100).toFixed(1);

  console.log(`\n=== Optimization Summary ===`);
  console.log(`Before: ${(beforeStats.totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`After:  ${(afterStats.totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:  ${savedMB} MB (${percent}% reduction)`);
}

main().catch(console.error);
