import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop test
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to Chapter 3 via navigation link
  await page.click('nav a[href="#chapter-3"]');
  await page.waitForTimeout(1000);

  // Take desktop carousel screenshot
  const ch3Dir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'test-results');
  if (!fs.existsSync(ch3Dir)) fs.mkdirSync(ch3Dir, { recursive: true });

  await page.screenshot({ path: path.join(ch3Dir, 'ch3-repaired-desktop.png') });
  console.log('✓ Captured ch3-repaired-desktop.png');

  // Test Next button clicks
  const nextBtn = page.locator('button[aria-label="Next club"]');
  await nextBtn.click();
  await page.waitForTimeout(400);
  await nextBtn.click();
  await page.waitForTimeout(400);

  // Click active card to open modal
  // Active card is centered
  const activeCard = page.locator('.ch3-card').nth(2); // now index 2 (Atlético Madrid)
  await activeCard.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ch3Dir, 'ch3-repaired-modal-desktop.png') });
  console.log('✓ Captured ch3-repaired-modal-desktop.png');

  // Close modal via X button
  await page.click('button[aria-label="Close dialog"]');
  await page.waitForTimeout(400);

  // 2. Mobile test (iPhone 13 dimensions: 390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('nav a[href="#chapter-3"]');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(ch3Dir, 'ch3-repaired-mobile.png') });
  console.log('✓ Captured ch3-repaired-mobile.png');

  // Open modal on mobile
  const mobileActiveCard = page.locator('.ch3-card').nth(0);
  await mobileActiveCard.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ch3Dir, 'ch3-repaired-modal-mobile.png') });
  console.log('✓ Captured ch3-repaired-modal-mobile.png');

  await browser.close();

  console.log('\n=== PLAYWRIGHT TEST SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  } else {
    console.log('Zero console errors detected.');
  }
})();
