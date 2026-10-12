import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const destDir = 'public/destinations';

const categories = [
  {
    name: 'Mysore Palace',
    category: 'Mysore_Palace',
    targets: ['mysore-palace.jpg', 'mysore-palace-day.jpg', 'mysore-palace-dome.jpg']
  },
  {
    name: 'Hogenakkal Falls',
    category: 'Hogenakkal_Falls',
    targets: ['hogenakkal-falls.jpg', 'hogenakkal-coracle.jpg', 'hogenakkal-river.jpg']
  },
  {
    name: 'Nandi Hills',
    category: 'Nandi_Hills',
    targets: ['nandi-hills-sunrise.jpg', 'nandi-viewpoint.jpg', 'nandi-valley.jpg']
  },
  {
    name: 'Ramanagara',
    category: 'Ramanagara',
    targets: ['ramanagara-hills.jpg', 'ramanagara-boulders.jpg', 'ramanagara-trek.jpg']
  },
  {
    name: 'Savandurga',
    category: 'Savandurga',
    targets: ['savandurga.jpg', 'savandurga-rock.jpg', 'savandurga-view.jpg']
  },
  {
    name: 'Chikmagalur',
    category: 'Chikmagalur',
    targets: ['chikmagalur-mullayanagiri.jpg', 'chikmagalur-coffee.jpg', 'chikmagalur-hills.jpg']
  }
];

async function fetchCategoryImages(cat) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:${encodeURIComponent(cat.category)}&gcmtype=file&gcmlimit=15&prop=imageinfo&iiprop=url|size&iiurlwidth=1280&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'FriendsToursTravelsBot/1.0 (contact@friendstours.in)' } });
  const data = await res.json();
  if (!data.query || !data.query.pages) return [];

  const pages = Object.values(data.query.pages);
  const validImages = [];

  for (const p of pages) {
    if (p.imageinfo && p.imageinfo[0]) {
      const info = p.imageinfo[0];
      const thumbUrl = info.thumburl || info.url;
      if (thumbUrl && (thumbUrl.endsWith('.jpg') || thumbUrl.endsWith('.JPG') || thumbUrl.endsWith('.jpeg') || thumbUrl.includes('/thumb/'))) {
        validImages.push(thumbUrl);
      }
    }
  }
  return validImages;
}

async function downloadAll() {
  for (const item of categories) {
    console.log(`Fetching authentic photos for ${item.name}...`);
    try {
      const imgUrls = await fetchCategoryImages(item);
      console.log(`Found ${imgUrls.length} photos for ${item.name}`);

      for (let i = 0; i < item.targets.length && i < imgUrls.length; i++) {
        const targetName = item.targets[i];
        const imgUrl = imgUrls[i];
        console.log(`Downloading ${targetName} from ${imgUrl.slice(0, 70)}...`);

        const res = await fetch(imgUrl, { headers: { 'User-Agent': 'FriendsToursTravelsBot/1.0 (contact@friendstours.in)' } });
        if (!res.ok) {
          console.warn(`Failed ${imgUrl}: ${res.status}`);
          continue;
        }

        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf)
          .resize(1200, 800, { fit: 'cover' })
          .jpeg({ quality: 92 })
          .toFile(path.join(destDir, targetName));

        console.log(`Saved ${targetName} successfully!`);
      }
    } catch (err) {
      console.error(`Error with ${item.name}:`, err.message);
    }
  }
  console.log('Finished downloading all verified authentic Karnataka destination photos!');
}

downloadAll().catch(console.error);
