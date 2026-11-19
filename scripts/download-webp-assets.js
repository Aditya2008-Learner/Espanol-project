import fs from 'fs';
import path from 'path';
import https from 'https';

const assets = [
  { 
    name: 'hero-stadium.webp', 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Estadio_Ol%C3%ADmpico_Metropolitano_at_night.jpg/1280px-Estadio_Ol%C3%ADmpico_Metropolitano_at_night.jpg',
    credit: 'Chepo, Wikimedia Commons, CC BY-SA 4.0'
  },
  { 
    name: 'spain-world-cup-2010.webp', 
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=85',
    credit: 'Unsplash Community, Unsplash License'
  },
  { 
    name: 'real-madrid-stadium.webp', 
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=85',
    credit: 'Unsplash Community, Unsplash License'
  },
  { 
    name: 'barcelona-stadium.webp', 
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=85',
    credit: 'Unsplash Community, Unsplash License'
  },
  { 
    name: 'atletico-stadium.webp', 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Wanda-Metropolitano.jpg/1280px-Wanda-Metropolitano.jpg',
    credit: 'Fernandopascullo, Wikimedia Commons, CC BY-SA 4.0'
  },
  { 
    name: 'spanish-football-legends.webp', 
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=85',
    credit: 'Unsplash Community, Unsplash License'
  },
  { 
    name: 'tiki-taka-tactics.webp', 
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85',
    credit: 'Unsplash Community, Unsplash License'
  },
  { 
    name: 'football-crowd.webp', 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Football_supporters_at_the_2018_FIFA_World_Cup.jpg/1280px-Football_supporters_at_the_2018_FIFA_World_Cup.jpg',
    credit: 'Wikimedia Commons, CC BY-SA 4.0'
  }
];

const dir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'public', 'assets', 'images');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadAsset({ name, url, credit }) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dir, name);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 10000) {
        console.log(`Skipping ${name} (already exists, ${stats.size} bytes)`);
        resolve();
        return;
      }
    }

    const request = https.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        console.log(`Redirect for ${name}: ${redirectUrl}`);
        https.get(redirectUrl, { timeout: 30000 }, (redirectRes) => {
          if (redirectRes.statusCode === 200 && redirectRes.headers['content-type']?.startsWith('image/')) {
            const fileStream = fs.createWriteStream(filePath);
            redirectRes.pipe(fileStream);
            fileStream.on('finish', () => {
              console.log(`✓ Downloaded ${name} (${redirectRes.headers['content-length']} bytes) — ${credit}`);
              resolve();
            });
            fileStream.on('error', reject);
          } else {
            reject(new Error(`Redirect failed for ${name}: Status ${redirectRes.statusCode}`));
          }
        }).on('error', reject);
      } else if (res.statusCode === 200 && res.headers['content-type']?.startsWith('image/')) {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`✓ Downloaded ${name} (${res.headers['content-length']} bytes) — ${credit}`);
          resolve();
        });
        fileStream.on('error', reject);
      } else {
        reject(new Error(`Failed ${name}: Status ${res.statusCode}, Content-Type: ${res.headers['content-type']}`));
      }
    });

    request.on('error', (err) => {
      console.error(`✗ Error downloading ${name}: ${err.message}`);
      reject(err);
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${name}`));
    });
  });
}

async function downloadAll() {
  console.log('Starting asset downloads...\n');
  for (const asset of assets) {
    try {
      await downloadAsset(asset);
    } catch (err) {
      console.error(`✗ ${asset.name}: ${err.message}`);
    }
  }
  console.log('\nDownload complete.');
}

downloadAll();
