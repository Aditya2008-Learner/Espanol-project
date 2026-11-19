import fs from 'fs';
import path from 'path';

const rootDir = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const destDir = path.join(rootDir, 'public', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const userImages = [
  { src: 'OIP-3971910036.jpg', dest: 'user-legend-1.webp' },
  { src: 'OIP-2005887238.jpg', dest: 'user-legend-2.webp' },
  { src: 'OIP-1924857072.jpg', dest: 'user-stadium-1.webp' },
  { src: 'OIP-69162876.jpg', dest: 'user-match-1.webp' },
  { src: 'OIP-1144161608.jpg', dest: 'user-moment-1.webp' },
  { src: 'OIP-3534972928.jpg', dest: 'user-hero-1.webp' }
];

userImages.forEach(({ src, dest }) => {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${src} -> public/assets/images/${dest}`);
  } else {
    console.warn(`Source image not found: ${src}`);
  }
});
