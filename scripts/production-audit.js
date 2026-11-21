import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('requestfailed', req => {
    failedRequests.push(`${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const testDir = path.join('D:', 'Raaj Imp Files', 'Spanish Website', 'test-results');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  await page.screenshot({ path: path.join(testDir, 'audit-ch1-hero.png') });

  // Scroll through chapters via rail / nav links
  const chapters = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6', 'chapter-7', 'chapter-8', 'chapter-9', 'chapter-10'];
  for (const ch of chapters) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'auto' });
    }, ch);
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: path.join(testDir, 'audit-ch10-end.png') });
  await browser.close();

  console.log('\n=== PRODUCTION AUDIT SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) console.log(consoleErrors);
  console.log(`Failed Network Requests: ${failedRequests.length}`);
  if (failedRequests.length > 0) console.log(failedRequests);
  if (consoleErrors.length === 0 && failedRequests.length === 0) {
    console.log('✓ 100% clean audit: Zero console errors, zero failed network requests.');
  }
})();
