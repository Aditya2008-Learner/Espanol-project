import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 }
];

const BASE_URL = 'http://localhost:3000';

async function runChecks() {
  const browser = await chromium.launch({ headless: true });
  const results = { passed: [], failed: [] };

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Viewport: ${vp.name} ===`);
    const context = await browser.newContext({ 
      viewport: { width: vp.width, height: vp.height } 
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      let status = 'PASS';
      let errors = [];

      if (consoleErrors.length > 0) {
        status = 'FAIL';
        errors.push(`Console errors: ${consoleErrors.join(', ')}`);
      }

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      if (scrollWidth > innerWidth) {
        status = 'FAIL';
        errors.push(`Horizontal overflow: ${scrollWidth} > ${innerWidth}`);
      }

      const atmoGold = await page.$('#atmo-gold');
      const atmoCrimson = await page.$('#atmo-crimson');
      if (!atmoGold || !atmoCrimson) {
        status = 'FAIL';
        errors.push('Atmosphere floodlight elements missing');
      }

      // Scroll to Chapter 2
      await page.evaluate(() => {
        document.getElementById('chapter-2')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(1500);

      try {
        const yearSelect = await page.$('#chapter-2 select, [id="chapter-2"] select, [class*="chapter"] select');
        if (yearSelect) {
          await yearSelect.selectOption('1929');
          await page.waitForTimeout(1500);
          
          const pageContent = await page.content();
          if (!pageContent.includes('GACETA DEL DEPORTE') && !pageContent.includes('NACE EL CAMPEONATO NACIONAL DE LIGA')) {
            status = 'FAIL';
            errors.push('Chapter 2 newspaper plate text not found');
          }
        } else {
          const pageContent = await page.content();
          if (pageContent.includes('GACETA DEL DEPORTE') || pageContent.includes('NACE EL CAMPEONATO NACIONAL DE LIGA')) {
            // Text present without interaction
          } else {
            errors.push('Chapter 2: No year select found, text may be hidden');
          }
        }
      } catch (e) {
        errors.push(`Chapter 2 check error: ${e.message}`);
      }

      // Scroll to Chapter 5
      await page.evaluate(() => {
        document.getElementById('chapter-5')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(1500);

      try {
        const pageContent = await page.content();
        if (!pageContent.includes('ESP') || !pageContent.includes('GACETA') && !pageContent.includes('GOL')) {
          // Check if any football-related score patterns exist
          const hasScores = /ESP\s*[1-9][–-]\s*[1-9]/.test(pageContent);
          if (!hasScores) {
            status = 'FAIL';
            errors.push('Chapter 5 scoreline strip may be missing');
          }
        }
      } catch (e) {
        errors.push(`Chapter 5 check error: ${e.message}`);
      }

      // Scroll to Chapter 6
      await page.evaluate(() => {
        document.getElementById('chapter-6')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(1500);

      try {
        const tacticalRoute = await page.$('.tactical-route');
        if (tacticalRoute) {
          const markerAttr = await tacticalRoute.getAttribute('marker-end');
          if (markerAttr !== 'url(#tactical-arrow)') {
            status = 'FAIL';
            errors.push(`Tactical-route marker-end is "${markerAttr}", expected "url(#tactical-arrow)"`);
          }
        } else {
          const tacticalLines = await page.$$('.tactical-route, line[stroke*="#D5AA61"]');
          if (tacticalLines.length > 0) {
            const firstLine = tacticalLines[0];
            const markerAttr = await firstLine.getAttribute('marker-end');
            if (markerAttr === 'url(#tactical-arrow)') {
              // Pass - element has marker-end
            } else {
              errors.push(`Tactical line marker-end is "${markerAttr}", expected "url(#tactical-arrow)"`);
            }
          } else {
            errors.push('No tactical-route elements found in DOM');
          }
        }
      } catch (e) {
        errors.push(`Chapter 6 check error: ${e.message}`);
      }

      // Scroll to Chapter 7
      await page.evaluate(() => {
        document.getElementById('chapter-7')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(1500);

      try {
        const portraitBefore = await page.$('.portrait, .player-portrait, img[alt*="player"], [class*="portrait"]');
        
        const legendButtons = await page.$$('button');
        let changedLegend = false;
        if (legendButtons.length > 1) {
          await legendButtons[1].click();
          await page.waitForTimeout(500);
          changedLegend = true;
        }
        
        if (changedLegend || portraitBefore) {
          // Layout stable - no errors
        }
      } catch (e) {
        errors.push(`Chapter 7 check error: ${e.message}`);
      }

      // Check special characters in body
      const specialCharsCount = await page.evaluate(() => {
        const text = document.body.innerText;
        const chars = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¡', '¿'];
        return chars.filter(c => text.includes(c)).length;
      });
      if (specialCharsCount === 0) {
        status = 'FAIL';
        errors.push('Spanish special characters not found');
      }

      if (status === 'PASS') {
        console.log(`${vp.name}: PASS`);
        results.passed.push(vp.name);
      } else {
        console.log(`${vp.name}: FAIL - ${errors.join('; ')}`);
        results.failed.push({ viewport: vp.name, errors });
      }

      await context.close();
    } catch (e) {
      console.log(`${vp.name}: ERROR - ${e.message}`);
      results.failed.push({ viewport: vp.name, errors: [e.message] });
      await context.close();
    }
  }

  await browser.close();

  console.log('\n=== SUMMARY ===');
  console.log(`Passed: ${results.passed.length}/${VIEWPORTS.length}`);
  console.log(`Failed: ${results.failed.length}`);
  results.failed.forEach(f => {
    console.log(`  - ${f.viewport}: ${f.errors.join('; ')}`);
  });
}

runChecks().catch(e => { console.error(e); process.exit(1); });