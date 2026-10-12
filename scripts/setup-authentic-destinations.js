import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const destDir = 'public/destinations';

const downloads = [
  // Nandi Hills
  {
    url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=85',
    target: 'nandi-viewpoint.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1626014303757-646654271816?auto=format&fit=crop&w=1200&q=85',
    target: 'nandi-valley.jpg'
  },

  // Ramanagara (Rocky granite hills of Karnataka)
  {
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    target: 'ramanagara-boulders.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    target: 'ramanagara-trek.jpg'
  },

  // Mysore Palace (Real Wodeyar Palace Architecture)
  {
    url: 'https://images.unsplash.com/photo-1600100397608-f010f443b7ea?auto=format&fit=crop&w=1200&q=85',
    target: 'mysore-palace-day.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    target: 'mysore-palace-dome.jpg'
  },

  // Chikkamagaluru (Western Ghats coffee hills)
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85',
    target: 'chikmagalur-coffee.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85',
    target: 'chikmagalur-hills.jpg'
  },

  // Savandurga (Asia's monolithic granite hill)
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    target: 'savandurga-rock.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=85',
    target: 'savandurga-view.jpg'
  },

  // Hogenakkal Falls (Waterfalls & river gorge)
  {
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85',
    target: 'hogenakkal-coracle.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1200&q=85',
    target: 'hogenakkal-river.jpg'
  }
];

async function downloadAndOptimize() {
  for (const item of downloads) {
    try {
      const destPath = path.join(destDir, item.target);
      console.log(`Downloading ${item.target}...`);
      const res = await fetch(item.url);
      if (!res.ok) {
        console.warn(`Failed downloading ${item.url}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      await sharp(buffer)
        .resize(1200, 800, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toFile(destPath);
      console.log(`Saved ${item.target} successfully.`);
    } catch (err) {
      console.error(`Error with ${item.target}:`, err.message);
    }
  }
}

downloadAndOptimize().catch(console.error);
