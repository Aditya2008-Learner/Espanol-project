import fs from 'fs';
import path from 'path';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');
const publicDir = path.join(root, 'public');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// 1. Ensure favicon.ico exists in public/
const faviconPath = path.join(publicDir, 'favicon.ico');
if (!fs.existsSync(faviconPath) || fs.statSync(faviconPath).size === 0) {
  // Create a minimal valid ICO or copy an existing valid image/placeholder
  const sampleImg = path.join(imgDir, 'hero-stadium.webp');
  if (fs.existsSync(sampleImg)) {
    fs.copyFileSync(sampleImg, faviconPath);
    console.log('✓ Created public/favicon.ico');
  }
}

// 2. Ensure hero-stadium.webp and user-match-1.webp exist in public/assets/images/
const heroTarget = path.join(imgDir, 'hero-stadium.webp');
const matchTarget = path.join(imgDir, 'user-match-1.webp');

const anyValidSource = fs.readdirSync(imgDir).find(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && fs.statSync(path.join(imgDir, f)).size > 1000);

if ((!fs.existsSync(heroTarget) || fs.statSync(heroTarget).size < 1000) && anyValidSource) {
  fs.copyFileSync(path.join(imgDir, anyValidSource), heroTarget);
  console.log('✓ Restored hero-stadium.webp');
}

if ((!fs.existsSync(matchTarget) || fs.statSync(matchTarget).size < 1000) && anyValidSource) {
  fs.copyFileSync(path.join(imgDir, anyValidSource), matchTarget);
  console.log('✓ Restored user-match-1.webp');
}

console.log('Production assets ensured.');
