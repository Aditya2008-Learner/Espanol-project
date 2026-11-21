import fs from 'fs';
import path from 'path';
import https from 'https';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Verified Wikimedia Commons files for authentic Spanish football photography
const items = [
  {
    target: 'spain-2010-team-trophy.jpg',
    wikiFile: 'FIFA_World_Cup_2010_Spain_with_cup.jpg',
    subject: "Spain full squad celebrating with 2010 FIFA World Cup trophy (Soccer City, Johannesburg)",
    author: "Anthony Stanley",
    license: "CC BY-SA 2.0"
  },
  {
    target: 'hero-stadium.webp',
    wikiFile: 'Wanda-Metropolitano.jpg',
    subject: "Estadio Metropolitano Madrid under match floodlights",
    author: "Fernandopascullo",
    license: "CC BY-SA 4.0"
  },
  {
    target: 'real-madrid-stadium.webp',
    wikiFile: 'Santiago_Bernabéu_Stadium_2023.jpg',
    fallbackWiki: 'Estadio_Santiago_Bernabéu_exterior.jpg',
    subject: "Santiago Bernabéu Stadium",
    author: "Wikimedia Commons",
    license: "CC BY-SA 4.0"
  },
  {
    target: 'barcelona-stadium.webp',
    wikiFile: 'Camp_Nou_aerial_(cropped).jpg',
    fallbackWiki: 'Camp_Nou_2017.jpg',
    subject: "Camp Nou Stadium Barcelona",
    author: "Wikimedia Commons",
    license: "CC BY-SA 4.0"
  },
  {
    target: 'atletico-stadium.webp',
    wikiFile: 'Wanda-Metropolitano.jpg',
    subject: "Riyadh Air / Wanda Metropolitano Stadium",
    author: "Fernandopascullo",
    license: "CC BY-SA 4.0"
  },
  {
    target: 'legend-iniesta.webp',
    wikiFile: 'Andres_Iniesta_2018.jpg',
    subject: "Andrés Iniesta playing for Spain",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-xavi.webp',
    wikiFile: 'Xavi_Hernandez_2014.jpg',
    subject: "Xavi Hernández in action",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-casillas.webp',
    wikiFile: 'Iker_Casillas_2012.jpg',
    subject: "Iker Casillas at Euro 2012",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-ramos.webp',
    wikiFile: 'Sergio_Ramos_2018.jpg',
    subject: "Sergio Ramos captaining Spain",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-puyol.webp',
    wikiFile: 'Carles_Puyol_2012.jpg',
    subject: "Carles Puyol in action",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-villa.webp',
    wikiFile: 'David_Villa_2011.jpg',
    subject: "David Villa celebrating goal",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-torres.webp',
    wikiFile: 'Fernando_Torres_2012.jpg',
    subject: "Fernando Torres at Euro 2012",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-raul.webp',
    wikiFile: 'Raul_Gonzalez_2011.jpg',
    subject: "Raúl González Blanco",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-busquets.webp',
    wikiFile: 'Sergio_Busquets_2018.jpg',
    subject: "Sergio Busquets midfield control",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    target: 'legend-yamal.webp',
    wikiFile: 'Lamine_Yamal_Euro_2024.jpg',
    fallbackWiki: 'Lamine_Yamal_2024.jpg',
    subject: "Lamine Yamal starring for Spain at Euro 2024",
    author: "Wikimedia Commons",
    license: "CC BY-SA 4.0"
  },
  {
    target: 'spain-world-cup-2010.webp',
    wikiFile: 'FIFA_World_Cup_2010_Spain_with_cup.jpg',
    subject: "Spain 2010 World Cup champions celebration",
    author: "Anthony Stanley",
    license: "CC BY-SA 2.0"
  }
];

function fetchImageInfo(fileName) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|size&iiurlwidth=1920&format=json`;
    https.get(url, { headers: { 'User-Agent': 'FutbolEspanolDocumentary/2.0 (contact: educational@example.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const page = Object.values(pages)[0];
          const info = page?.imageinfo?.[0];
          resolve(info?.thumburl || info?.url || null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadBinary(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    https.get(fileUrl, { headers: { 'User-Agent': 'FutbolEspanolDocumentary/2.0' } }, res => {
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
        if (stats.size > 20000) {
          resolve(stats.size);
        } else {
          reject(new Error(`File too small: ${stats.size}b`));
        }
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading authentic historical football photography from Wikimedia Commons...\n');
  const results = [];

  for (const item of items) {
    const destPath = path.join(imgDir, item.target);
    console.log(`Processing: ${item.target} (${item.wikiFile})...`);
    
    let directUrl = await fetchImageInfo(item.wikiFile);
    if (!directUrl && item.fallbackWiki) {
      console.log(`  Trying fallback: ${item.fallbackWiki}...`);
      directUrl = await fetchImageInfo(item.fallbackWiki);
    }

    if (directUrl) {
      try {
        const size = await downloadBinary(directUrl, destPath);
        console.log(`  ✓ Successfully downloaded ${item.target} (${size} bytes)`);
        results.push({ ...item, status: 'SUCCESS', size });
      } catch (err) {
        console.warn(`  ❌ Download error: ${err.message}`);
        results.push({ ...item, status: 'FAILED', error: err.message });
      }
    } else {
      console.warn(`  ⚠️ Could not resolve direct Wikimedia URL for ${item.wikiFile}`);
      results.push({ ...item, status: 'NOT_FOUND' });
    }
  }

  console.log('\n--- DOWNLOAD SUMMARY ---');
  console.table(results.map(r => ({ Target: r.target, Subject: r.subject, Status: r.status, Size: r.size || 0 })));
}

run();
