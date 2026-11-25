import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function generatePDF() {
  console.log('Starting Vite preview server...');
  const previewProcess = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
    cwd: 'C:\\Users\\dell\\Espanol-project',
    shell: true,
    stdio: 'ignore'
  });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll through each section to trigger lazy-loaded images & animations
  const chapters = [
    'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 
    'chapter-5', 'chapter-6', 'chapter-7', 'chapter-8', 
    'chapter-9', 'chapter-10', 'chapter-11'
  ];

  for (const ch of chapters) {
    console.log(`Scrolling to ${ch}...`);
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }, ch);
    await page.waitForTimeout(1000);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  const outputPath = path.join('C:\\Users\\dell\\Espanol-project', 'Futbol_Espanol_Documentary.pdf');
  console.log(`Generating PDF to ${outputPath}...`);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
  });

  console.log('PDF generated successfully!');

  await browser.close();
  previewProcess.kill();
}

generatePDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
