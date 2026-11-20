import fs from 'fs';
import path from 'path';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Map available OIP or user images to the exact names expected by data & components
const mappings = [
  { source: 'OIP-3534972928.jpg', target: 'hero-stadium.webp' },
  { source: 'OIP-69162876.jpg', target: 'football-crowd.webp' },
  { source: 'OIP-1924857072.jpg', target: 'atletico-stadium.webp' },
  { source: 'OIP-2005887238.jpg', target: 'user-match-1.webp' },
  { source: 'OIP-1144161608.jpg', target: 'user-moment-1.webp' },
  { source: 'OIP-3971910036.jpg', target: 'user-legend-1.webp' },
  { source: 'user-hero-1.webp', target: 'user-hero-1.webp' }
];

mappings.forEach(({ source, target }) => {
  const srcPath = path.join(imgDir, source);
  const altSrcPath = path.join(root, source);
  const destPath = path.join(imgDir, target);

  let foundSrc = null;
  if (fs.existsSync(srcPath)) foundSrc = srcPath;
  else if (fs.existsSync(altSrcPath)) foundSrc = altSrcPath;

  if (foundSrc) {
    fs.copyFileSync(foundSrc, destPath);
    console.log(`✓ Mapped ${source} -> ${target}`);
  } else {
    console.warn(`⚠️ Source not found for mapping: ${source}`);
  }
});
