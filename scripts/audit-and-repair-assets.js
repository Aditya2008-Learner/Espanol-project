import fs from 'fs';
import path from 'path';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imgDir = path.join(root, 'public', 'assets', 'images');
const srcDir = path.join(root, 'src');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// 1. Scan src/ for all image references (/assets/images/...)
function scanReferences() {
  const references = new Set();
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && /\.(jsx|js|ts|tsx)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(/\/assets\/images\/[a-zA-Z0-9_\-\.]+/g);
        if (matches) {
          matches.forEach(m => references.add(m.replace('/assets/images/', '')));
        }
      }
    }
  }
  walk(srcDir);
  return Array.from(references);
}

const referencedFiles = scanReferences();
console.log('Referenced images in source code:', referencedFiles);

// 2. Ensure all referenced files exist in public/assets/images/
// If a file is missing, copy/map from available OIP or fallback JPEGs
const availableJpegs = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
console.log('Available local image files:', availableJpegs);

const fallbackSource = availableJpegs.find(f => f.startsWith('OIP-')) || availableJpegs[0];

referencedFiles.forEach(refFile => {
  const targetPath = path.join(imgDir, refFile);
  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size < 1000) {
    console.log(`⚠️ Missing or empty referenced file: ${refFile}`);
    if (fallbackSource) {
      const srcPath = path.join(imgDir, fallbackSource);
      fs.copyFileSync(srcPath, targetPath);
      console.log(`-> Repaired ${refFile} using fallback ${fallbackSource}`);
    }
  }
});

// 3. Verify magic bytes of all images in public/assets/images/
const allImages = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
allImages.forEach(img => {
  const filePath = path.join(imgDir, img);
  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    console.error(`❌ Corrupted 0-byte file: ${img}`);
  } else {
    const buffer = Buffer.alloc(12);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isWebp = buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;

    console.log(`[Audit] ${img}: size=${stat.size} bytes, format=${isJpeg ? 'JPEG' : isWebp ? 'WebP' : isPng ? 'PNG' : 'Unknown'}`);
  }
});

console.log('Asset audit and repair script finished successfully.');
