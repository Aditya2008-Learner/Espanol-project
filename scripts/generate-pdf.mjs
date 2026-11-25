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
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const chapters = [
    'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 
    'chapter-5', 'chapter-6', 'chapter-7', 'chapter-8', 
    'chapter-9', 'chapter-10', 'chapter-11'
  ];

  for (const ch of chapters) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }, ch);
    await page.waitForTimeout(500);
  }

  console.log('Injecting print styles for clean page breaks per chapter...');
  await page.evaluate(() => {
    // 1. Unconstrain main container
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.style.height = 'auto';
      mainEl.style.maxHeight = 'none';
      mainEl.style.overflow = 'visible';
      mainEl.style.position = 'static';
      mainEl.classList.remove('snap-y', 'snap-mandatory', 'overflow-y-scroll', 'h-screen');
    }

    // 2. Hide fixed floating overlays that obscure text
    const toHide = document.querySelectorAll('header, [aria-label="Chapter progress"], .fixed.top-0, nav.fixed');
    toHide.forEach((el) => {
      el.style.display = 'none';
    });

    // 3. Configure each section as its own dedicated page
    const sections = document.querySelectorAll('main > section');
    sections.forEach((sec, idx) => {
      sec.style.height = 'auto';
      sec.style.minHeight = '100vh';
      sec.style.overflow = 'visible';
      sec.classList.remove('snap-start', 'min-h-screen');
      sec.style.pageBreakBefore = 'always';
      sec.style.breakBefore = 'page';
      sec.style.pageBreakInside = 'avoid';
      sec.style.breakInside = 'avoid';
    });

    // 4. Force reveal all GSAP hidden text/blocks
    const hiddenElements = document.querySelectorAll(
      '.intro-char, .intro-sub, .intro-cta, .word-reveal, .reveal-block, .clip-reveal, .section-title, .ch3-card, .leg-card, .mod-card'
    );
    hiddenElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
      el.style.filter = 'none';
    });
  });

  await page.waitForTimeout(2000);

  const outputPath = path.join('C:\\Users\\dell\\Espanol-project', 'Futbol_Espanol_Documentary.pdf');
  console.log(`Generating multi-page PDF to ${outputPath}...`);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });

  console.log('PDF generated successfully!');

  await browser.close();
  previewProcess.kill();
}

generatePDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
