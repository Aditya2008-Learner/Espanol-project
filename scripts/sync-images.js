import fs from 'fs';
import path from 'path';

const root = path.join('D:', 'Raaj Imp Files', 'Spanish Website');
const imagesFolder = path.join(root, 'public', 'assets', 'images');
const sourceImagesFolder = path.join(root, 'public', 'images');

if (fs.existsSync(sourceImagesFolder)) {
  const files = fs.readdirSync(sourceImagesFolder);
  files.forEach(file => {
    const src = path.join(sourceImagesFolder, file);
    const dest = path.join(imagesFolder, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to public/assets/images/`);
  });
}
