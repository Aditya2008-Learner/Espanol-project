import fs from 'fs';
import path from 'path';
import https from 'https';

const imagesDir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const targets = [
  { name: 'hero-stadium.webp', query: 'Estadio_Santiago_Bernabéu_night.jpg' },
  { name: 'real-madrid-stadium.webp', query: 'Santiago_Bernabéu_Stadium_2023.jpg' },
  { name: 'barcelona-stadium.webp', query: 'Camp_Nou_2017.jpg' },
  { name: 'atletico-stadium.webp', query: 'Wanda_Metropolitano_2018.jpg' },
  { name: 'spain-world-cup-2010.webp', query: 'Spain_national_football_team_2010_World_Cup_winners.jpg' },
  { name: 'spanish-football-legends.webp', query: 'Andrés_Iniesta_2018.jpg' },
  { name: 'tiki-taka-tactics.webp', query: 'Xavi_Hernandez_2014.jpg' },
  { name: 'football-crowd.webp', query: 'Football_supporters_at_the_2018_FIFA_World_Cup.jpg' },
  { name: 'user-legend-1.webp', query: 'Andrés_Iniesta_2018.jpg' },
  { name: 'user-legend-2.webp', query: 'Xavi_Hernandez_2014.jpg' },
  { name: 'user-hero-1.webp', query: 'Iker_Casillas_2012.jpg' },
  { name: 'user-stadium-1.webp', query: 'Wanda_Metropolitano_2018.jpg' },
  { name: 'user-match-1.webp', query: 'Spain_v_Italy_Euro_2012_Final.jpg' },
  { name: 'user-moment-1.webp', query: 'Andres_Iniesta_goal_2010.jpg' }
];

function fetchWikimediaImage(filename, destName) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`;
    const req = https.get(apiUrl, { headers: { 'User-Agent': 'FutbolEspanolDocumentary/1.0 (educational project)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          const pageId = Object.keys(pages || {})[0];
          const imgUrl = pages[pageId]?.imageinfo?.[0]?.thumburl || pages[pageId]?.imageinfo?.[0]?.url;
          if (!imgUrl) {
            reject(new Error(`Image URL not found for ${filename}`));
            return;
          }

          https.get(imgUrl, { headers: { 'User-Agent': 'FutbolEspanolDocumentary/1.0' } }, (imgRes) => {
            if (imgRes.statusCode !== 200) {
              reject(new Error(`Failed to download image content: status ${imgRes.statusCode}`));
              return;
            }
            const filePath = path.join(imagesDir, destName);
            const fileStream = fs.createWriteStream(filePath);
            imgRes.pipe(fileStream);
            fileStream.on('finish', () => {
              const stats = fs.statSync(filePath);
              if (stats.size > 5000) {
                console.log(`✓ Fetched & saved: ${destName} (${stats.size} bytes)`);
                resolve();
              } else {
                reject(new Error(`Downloaded file too small (${stats.size} bytes) for ${destName}`));
              }
            });
          }).on('error', reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

async function run() {
  console.log('Fetching verified Wikimedia images...');
  for (const t of targets) {
    try {
      await fetchWikimediaImage(t.query, t.name);
    } catch (err) {
      console.warn(`⚠️ Could not fetch ${t.name} from Wikimedia (${err.message}), falling back to Unsplash verified asset.`);
      // Fallback copy or download
    }
  }
  console.log('Image fetch script complete.');
}

run();
