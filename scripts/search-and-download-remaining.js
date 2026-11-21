import fs from 'fs';
import path from 'path';
import https from 'https';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');

const searches = [
  { target: 'athletic-stadium.webp', query: 'San Mames stadium' },
  { target: 'sevilla-stadium.webp', query: 'Estadio Ramon Sanchez Pizjuan' },
  { target: 'legend-xavi.webp', query: 'Xavi Hernandez' },
  { target: 'legend-ramos.webp', query: 'Sergio Ramos' },
  { target: 'legend-puyol.webp', query: 'Carles Puyol' },
  { target: 'legend-villa.webp', query: 'David Villa' },
  { target: 'legend-torres.webp', query: 'Fernando Torres' },
  { target: 'legend-raul.webp', query: 'Raul Gonzalez' },
  { target: 'legend-yamal.webp', query: 'Lamine Yamal' }
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function searchWikimedia(term) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size&iiurlwidth=1000&format=json`;
    const req = https.get(url, { headers: { 'User-Agent': 'FutbolEspanolDocEducational/3.0 (info@example.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const list = Object.values(pages);
          const valid = list.find(p => p.imageinfo?.[0]?.url && p.imageinfo[0].size > 20000);
          if (valid) {
            resolve({
              title: valid.title,
              url: valid.imageinfo[0].thumburl || valid.imageinfo[0].url
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
  });
}

function downloadBinary(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const req = https.get(fileUrl, { headers: { 'User-Agent': 'FutbolEspanolDocEducational/3.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadBinary(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => {
        const stats = fs.statSync(destPath);
        if (stats.size > 15000) {
          resolve(stats.size);
        } else {
          reject(new Error(`File too small: ${stats.size}b`));
        }
      });
      stream.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function run() {
  console.log('Downloading with rate-limit pacing (2.5s delay)...\n');
  for (const s of searches) {
    const dest = path.join(imgDir, s.target);
    console.log(`Searching for: ${s.query} -> ${s.target}...`);
    
    await sleep(2500); // 2.5s polite delay
    const match = await searchWikimedia(s.query);
    
    if (match) {
      await sleep(1500); // polite delay before image fetch
      try {
        const size = await downloadBinary(match.url, dest);
        console.log(`  ✓ Saved: ${s.target} (${match.title}, ${size} bytes)`);
      } catch (e) {
        console.warn(`  ❌ Download error: ${e.message}`);
      }
    } else {
      console.warn(`  ⚠️ No match found for: ${s.query}`);
    }
  }
  console.log('\nAll downloads complete.');
}

run();
