import fs from 'fs';
import path from 'path';

const srcDir = 'public/hero-frames-2';
const destDir = 'public/hero-frames';

function restoreOriginals() {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Copying ${files.length} original frames from ${srcDir} to ${destDir}...`);

  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    fs.copyFileSync(src, dest);
  }

  console.log('Successfully restored original frames exactly like earlier!');
}

restoreOriginals();
