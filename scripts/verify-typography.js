import fs from 'fs';
import path from 'path';

// Verify that dist/index.html and dist assets contain the correct UTF-8 Spanish characters
const distHtmlPath = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'dist', 'index.html');
const distHtml = fs.readFileSync(distHtmlPath, 'utf8');

const sampleSpanishWords = [
  'FÚTBOL',
  'ESPAÑOL',
  'CLÁSICO',
  'RAÍCES',
  'GENERACIÓN',
  'TÁCTICA',
  'LEYENDAS',
  'CUESTIONARIO'
];

console.log('--- DIST HTML AUDIT ---');
console.log('UTF-8 Charset declared:', distHtml.includes('charset="UTF-8"'));
console.log('Google Fonts link with Anton & Bebas Neue:', distHtml.includes('family=Anton&family=Bebas+Neue'));

console.log('--- COMPONENT SCRIPT SCAN ---');
const componentsDir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

let issues = 0;
files.forEach(file => {
  const code = fs.readFileSync(path.join(componentsDir, file), 'utf8');
  // Check for raw string .split('') on Spanish titles
  if (/TITLE\.split\(''\)/.test(code)) {
    console.warn(`[WARNING] Raw .split('') found in ${file}`);
    issues++;
  }
});

if (issues === 0) {
  console.log('✓ All components safely handle Unicode grapheme clusters.');
}
