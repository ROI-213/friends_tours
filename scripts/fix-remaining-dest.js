import sharp from 'sharp';
import path from 'path';

const destDir = 'public/destinations';

const remaining = [
  {
    // Mysore Palace grand daylight exterior
    url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=85',
    target: 'mysore-palace-day.jpg'
  },
  {
    // Nandi Hills fortress viewpoint / misty valley
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    target: 'nandi-valley.jpg'
  }
];

async function fixRemaining() {
  for (const item of remaining) {
    const res = await fetch(item.url);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf)
        .resize(1200, 800, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toFile(path.join(destDir, item.target));
      console.log(`Saved ${item.target}`);
    } else {
      console.warn(`Failed ${item.target}`);
    }
  }
}

fixRemaining().catch(console.error);
