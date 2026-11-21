import fs from 'fs';
import path from 'path';
import https from 'https';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const exactManifest = [
  {
    target: 'spain-2010-team-trophy.jpg',
    pageTitle: 'File:FIFA World Cup 2010 Spain with cup.jpg',
    desc: 'Spain squad celebrating with 2010 FIFA World Cup trophy'
  },
  {
    target: 'athletic-stadium.webp',
    pageTitle: 'File:San Mames Barria eta Bilboko ikuspegia.jpg',
    desc: 'Athletic Club San Mames Stadium'
  },
  {
    target: 'legend-ramos.webp',
    pageTitle: 'File:Sergio Ramos Interview 2021 (cropped).jpg',
    desc: 'Sergio Ramos'
  },
  {
    target: 'legend-puyol.webp',
    pageTitle: 'File:Carles Puyol 2011.jpg',
    desc: 'Carles Puyol'
  },
  {
    target: 'legend-torres.webp',
    pageTitle: 'File:Fernando Torres 2017.jpg',
    desc: 'Fernando Torres'
  },
  {
    target: 'legend-raul.webp',
    pageTitle: 'File:Raul Gonzalez 2012 2.jpg',
    desc: 'Raul Gonzalez'
  },
  {
    target: 'legend-yamal.webp',
    pageTitle: 'File:Lamine Yamal, Sánchez se reunió con los futbolistas de la selección española tras ganar la Eurocopa 2024 (3) (cropped).jpg',
    desc: 'Lamine Yamal with Spain national team Euro 2024 celebration'
  }
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getDirectImageUrl(pageTitle) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`;
    https.get(url, { headers: { 'User-Agent': 'FutbolEspanolManifest/4.0 (contact: info@example.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const page = Object.values(json.query?.pages || {})[0];
          const info = page?.imageinfo?.[0];
          resolve(info?.thumburl || info?.url || null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'FutbolEspanolManifest/4.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        const stats = fs.statSync(dest);
        if (stats.size > 10000) {
          resolve(stats.size);
        } else {
          reject(new Error(`Size too small: ${stats.size}b`));
        }
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading exact manifest images...\n');
  for (const item of exactManifest) {
    const dest = path.join(imgDir, item.target);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 50000 && item.target !== 'spain-2010-team-trophy.jpg') {
      console.log(`Skipping ${item.target} (already exists, ${fs.statSync(dest).size}b)`);
      continue;
    }

    console.log(`Resolving: ${item.pageTitle} -> ${item.target}...`);
    await sleep(2000);
    const directUrl = await getDirectImageUrl(item.pageTitle);

    if (directUrl) {
      console.log(`  Downloading from: ${directUrl.substring(0, 70)}...`);
      await sleep(1500);
      try {
        const size = await download(directUrl, dest);
        console.log(`  ✓ Saved ${item.target} (${size} bytes)`);
      } catch (err) {
        console.warn(`  ❌ Download error: ${err.message}`);
      }
    } else {
      console.warn(`  ⚠️ Could not resolve URL for ${item.pageTitle}`);
    }
  }
  console.log('\nManifest download complete.');
}

run();
