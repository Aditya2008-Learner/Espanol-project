import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  { name: 'hero-stadium.jpg', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2000&q=85' },
  { name: 'timeline-huelva.jpg', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80' },
  { name: 'timeline-coronacion.jpg', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1000&q=80' },
  { name: 'timeline-laliga.jpg', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80' },
  { name: 'timeline-1964.jpg', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80' },
  { name: 'timeline-1992.jpg', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80' },
  { name: 'timeline-golden.jpg', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80' },
  { name: 'timeline-modern.jpg', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1000&q=80' },
  { name: 'real-madrid.jpg', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80' },
  { name: 'fc-barcelona.jpg', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80' },
  { name: 'atletico-madrid.jpg', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80' },
  { name: 'athletic-bilbao.jpg', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80' },
  { name: 'sevilla-fc.jpg', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80' },
  { name: 'valencia-cf.jpg', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80' },
  { name: 'legend-iniesta.jpg', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-xavi.jpg', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-casillas.jpg', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-ramos.jpg', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-distefano.jpg', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-villa.jpg', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-busquets.jpg', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80' },
  { name: 'legend-yamal.jpg', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' }
];

const dir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'public', 'assets', 'images');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

images.forEach(({ name, url }) => {
  const filePath = path.join(dir, name);
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log(`Downloaded: ${name}`);
      });
    } else {
      console.error(`Failed to download ${name}: Status ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${name}: ${err.message}`);
  });
});
