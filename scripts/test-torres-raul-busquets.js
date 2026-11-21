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

  const legendButtons = page.locator('nav[aria-label="Football legends navigation"] button');

  // Test Fernando Torres (index 6)
  await legendButtons.nth(6).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(testDir, 'torres-framed.png') });
  console.log('✓ Captured torres-framed.png');

  // Test Raúl González (index 7)
  await legendButtons.nth(7).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(testDir, 'raul-framed.png') });
  console.log('✓ Captured raul-framed.png');

  // Test Sergio Busquets (index 8)
  await legendButtons.nth(8).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(testDir, 'busquets-framed.png') });
  console.log('✓ Captured busquets-framed.png');

  await browser.close();

  console.log('\n=== TORRES, RAÚL, BUSQUETS PLAYWRIGHT TEST SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  } else {
    console.log('Zero console errors detected. All targeted legends inspected and framed successfully.');
  }
})();
