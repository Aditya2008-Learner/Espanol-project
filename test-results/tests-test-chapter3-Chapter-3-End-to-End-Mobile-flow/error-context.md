# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\test-chapter3.spec.js >> Chapter 3 End-to-End >> Mobile flow
- Location: tests\test-chapter3.spec.js:88:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "networkidle"

```

# Test source

```ts
  1   | // Playwright test for Chapter 3 interactions
  2   | import { test, expect } from '@playwright/test';
  3   | 
  4   | // Desktop configuration
  5   | test.use({
  6   |   viewport: { width: 1280, height: 800 },
  7   |   ignoreHTTPSErrors: true,
  8   | });
  9   | 
  10  | // Mobile configuration (iPhone SE)
  11  | const mobileDevice = {
  12  |   viewport: { width: 375, height: 667 },
  13  |   deviceScaleFactor: 2,
  14  |   isMobile: true,
  15  |   hasTouch: true,
  16  |   userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
  17  | };
  18  | 
  19  | test.describe('Chapter 3 End-to-End', () => {
  20  |   let consoleErrors = [];
  21  | 
  22  |   test.beforeEach(async ({ page }) => {
  23  |     consoleErrors = [];
  24  |     page.on('console', msg => {
  25  |       if (msg.type() === 'error') consoleErrors.push(msg.text());
  26  |     });
  27  |     page.on('pageerror', err => consoleErrors.push(err.message));
> 28  |     await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  29  |   });
  30  | 
  31  |   test('Desktop flow', async ({ page }) => {
  32  |     // 1. No console errors
  33  |     expect(consoleErrors).toHaveLength(0);
  34  | 
  35  |     // 2. Click Chapter 3 in header navigation
  36  |     await page.locator('header nav a[href="#chapter-3"]').click();
  37  |     await expect(page.locator('#chapter-3')).toBeInViewport();
  38  |     // URL may not change due to custom navigation, so skip URL check
  39  |     await page.screenshot({ path: 'ch3-repaired-desktop.png' });
  40  | 
  41  |     // 3. Verify active card is index 0 (Real Madrid)
  42  |     const activeCard = page.locator('.ch3-card.scale-105');
  43  |     await expect(activeCard).toBeVisible();
  44  |     await expect(activeCard.locator('h3')).toHaveText('Real Madrid CF');
  45  | 
  46  |     // 4. Click Next 5 times, verify each club becomes active
  47  |     const clubNames = [
  48  |       'Real Madrid CF',
  49  |       'FC Barcelona',
  50  |       'Atlético Madrid',
  51  |       'Athletic Club Bilbao',
  52  |       'Sevilla FC',
  53  |       'Valencia CF',
  54  |     ];
  55  |     for (let i = 1; i <= 5; i++) {
  56  |       await page.locator('button[aria-label="Next club"]').click();
  57  |       await page.waitForTimeout(300);
  58  |       const name = await page.locator('.ch3-card.scale-105 h3').textContent();
  59  |       expect(name.trim()).toBe(clubNames[i]);
  60  |     }
  61  | 
  62  |     // 5. Click Previous (should go back to Sevilla)
  63  |     await page.locator('button[aria-label="Previous club"]').click();
  64  |     await expect(page.locator('.ch3-card.scale-105 h3')).toHaveText('Sevilla FC');
  65  | 
  66  |     // 6. Click an indicator dot (choose first dot to go to Real Madrid)
  67  |     await page.locator('.flex.items-center button').first().click();
  68  |     await expect(page.locator('.ch3-card.scale-105 h3')).toHaveText('Real Madrid CF');
  69  | 
  70  |     // 7. Open modal by clicking active card
  71  |     await page.locator('.ch3-card.scale-105').click();
  72  |     const modal = page.locator('[role="dialog"]');
  73  |     await expect(modal).toBeVisible();
  74  |     // Verify stadium photo and history text present
  75  |     await expect(modal.locator('img')).toHaveAttribute('src', /real-madrid-stadium/);
  76  |     await expect(modal.locator('text=Royalty, European dominance')).toBeVisible();
  77  |     // Verify modal fits viewport
  78  |     const modalBox = await modal.boundingBox();
  79  |     const viewport = page.viewportSize();
  80  |     expect(modalBox.width).toBeLessThanOrEqual(viewport.width);
  81  |     expect(modalBox.height).toBeLessThanOrEqual(viewport.height);
  82  |     await page.screenshot({ path: 'ch3-repaired-modal-desktop.png' });
  83  |     // Close modal via close button
  84  |     await modal.locator('button[aria-label="Close dialog"]').click();
  85  |     await expect(modal).toBeHidden();
  86  |   });
  87  | 
  88  |   test('Mobile flow', async ({ page }) => {
  89  |     // Apply mobile viewport
  90  |     await page.setViewportSize({ width: 375, height: 667 });
  91  |     await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  92  |     await page.locator('header nav a[href="#chapter-3"]').click();
  93  |     await expect(page.locator('#chapter-3')).toBeInViewport();
  94  |     await page.screenshot({ path: 'ch3-repaired-mobile.png' });
  95  |     await page.locator('.ch3-card.scale-105').click();
  96  |     const modal = page.locator('[role="dialog"]');
  97  |     await expect(modal).toBeVisible();
  98  |     await page.screenshot({ path: 'ch3-repaired-modal-mobile.png' });
  99  |     await modal.locator('button[aria-label="Close dialog"]').click();
  100 |     await expect(modal).toBeHidden();
  101 |   });
  102 | });
  103 | 
```