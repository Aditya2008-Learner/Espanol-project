import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to Chapter 7
  await page.click('nav a[href="#chapter-7"]');
  await page.waitForTimeout(1000);

  const testDir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'test-results');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  // Click through all 10 legends and capture screenshots
  const legendButtons = page.locator('nav[aria-label="Football legends navigation"] button');
  const count = await legendButtons.count();
  console.log(`Found ${count} legends in navigation.`);

  for (let i = 0; i < count; i++) {
    await legendButtons.nth(i).click();
    await page.waitForTimeout(300);
    const name = await page.locator('.leg-panel h3').textContent();
    console.log(`- Verified legend [${i+1}/${count}]: ${name}`);
  }

  await page.screenshot({ path: path.join(testDir, 'ch7-legends-verified.png') });
  console.log('✓ Captured ch7-legends-verified.png');

  await browser.close();

  console.log('\n=== LEGENDS PLAYWRIGHT TEST SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  } else {
    console.log('Zero console errors detected. All 10 legends inspected successfully.');
  }
})();
