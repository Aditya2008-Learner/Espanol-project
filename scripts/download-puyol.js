import fs from 'fs';
import path from 'path';
import https from 'https';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const dest = path.join(root, 'public', 'assets', 'images', 'legend-puyol.webp');

const url = 'https://upload.wikimedia.org/wikipedia/commons/5/52/Carles_Puyol_2011.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled';

https.get(url, { headers: { 'User-Agent': 'SpanishFootballDoc/1.0 (admin@spanishfootball.org)' } }, res => {
  if (res.statusCode === 200) {
    const stream = fs.createWriteStream(dest);
    res.pipe(stream);
    stream.on('finish', () => {
      console.log(`✓ Saved legend-puyol.webp (${fs.statSync(dest).size} bytes)`);
    });
  } else {
    console.log(`Status: ${res.statusCode}`);
    process.exit(1);
  }
}).on('error', err => {
  console.error(err);
  process.exit(1);
});
