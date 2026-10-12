import fs from 'fs';
import path from 'path';

const srcDir = 'src';

const replacements = [
  // Primary magenta -> Deep Brand Royal/Navy Blue
  { from: /#8B126F/gi, to: '#0D256C' },
  { from: /#6D0C56/gi, to: '#071746' },
  { from: /#A61B82/gi, to: '#1A49B8' },
  // Magenta light/vibrant -> Brand Orange
  { from: /#D56BB7/gi, to: '#FA4616' },
  // Lavender -> Soft Ice Blue
  { from: /#E9D7E8/gi, to: '#DCE8FA' },
  { from: /#E2D1E0/gi, to: '#CADBF2' },
  { from: /#F0E6EF/gi, to: '#E2ECF8' },
  // Soft pink -> Soft light blue / orange tints
  { from: /#F7EAF4/gi, to: '#EBF2FF' },
  { from: /#FAF5F9/gi, to: '#F5F8FF' },
  { from: /#FAF7FA/gi, to: '#F7FAFF' },
  { from: /#FCF5FA/gi, to: '#F8FAFF' },
  // Dark plum containers / headings -> Deep Navy
  { from: /#1F0D1C/gi, to: '#071746' },
  { from: /#1F171E/gi, to: '#0A1938' },
  // RGBA Plum values -> RGBA Blue values
  { from: /rgba\(139,\s*18,\s*111/g, to: 'rgba(13, 37, 108' },
  { from: /rgba\(18,\s*5,\s*15/g, to: 'rgba(7, 23, 70' },
  { from: /rgba\(31,\s*5,\s*25/g, to: 'rgba(7, 23, 70' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(css|jsx|js|html)$/.test(file.name)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated theme colors in: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
processDirectory('index.html');
console.log('Finished updating color palette to Blue and Orange.');
