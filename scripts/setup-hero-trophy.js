import fs from 'fs';
import path from 'path';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');

const sourcePath = path.join(imgDir, 'spain-world-cup-2010.webp');
const targetPath = path.join(imgDir, 'spain-2010-team-trophy.jpg');

if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, targetPath);
  console.log('✓ Created spain-2010-team-trophy.jpg from verified celebration source');
} else {
  console.error('❌ Source spain-world-cup-2010.webp not found');
}
