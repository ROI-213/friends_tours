import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const destDir = 'public/destinations';

async function fetchMullayanagiri() {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Mullayanagiri&gcmtype=file&gcmlimit=5&prop=imageinfo&iiprop=url|size&iiurlwidth=1280&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'FriendsToursTravelsBot/1.0 (contact@friendstours.in)' } });
  const data = await res.json();
  if (data.query && data.query.pages) {
    const pages = Object.values(data.query.pages);
    for (const p of pages) {
      if (p.imageinfo && p.imageinfo[0]) {
        const info = p.imageinfo[0];
        const imgUrl = info.thumburl || info.url;
        console.log('Downloading Mullayanagiri:', imgUrl);
        const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'FriendsToursTravelsBot/1.0 (contact@friendstours.in)' } });
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          await sharp(buf)
            .resize(1200, 800, { fit: 'cover' })
            .jpeg({ quality: 92 })
            .toFile(path.join(destDir, 'chikmagalur-hills.jpg'));
          console.log('Saved chikmagalur-hills.jpg successfully!');
          break;
        }
      }
    }
  }
}

fetchMullayanagiri().catch(console.error);
