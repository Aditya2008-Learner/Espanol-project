// Playwright test for Chapter 3 interactions
import { test, expect } from '@playwright/test';

// Desktop configuration
test.use({
  viewport: { width: 1280, height: 800 },
  ignoreHTTPSErrors: true,
});

// Mobile configuration (iPhone SE)
const mobileDevice = {
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
};

test.describe('Chapter 3 End-to-End', () => {
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  });

  test('Desktop flow', async ({ page }) => {
    // 1. No console errors
    expect(consoleErrors).toHaveLength(0);

    // 2. Click Chapter 3 in header navigation
    await page.locator('header nav a[href="#chapter-3"]').click();
    await expect(page.locator('#chapter-3')).toBeInViewport();
    // URL may not change due to custom navigation, so skip URL check
    await page.screenshot({ path: 'ch3-repaired-desktop.png' });

    // 3. Verify active card is index 0 (Real Madrid)
    const activeCard = page.locator('.ch3-card.scale-105');
    await expect(activeCard).toBeVisible();
    await expect(activeCard.locator('h3')).toHaveText('Real Madrid CF');

    // 4. Click Next 5 times, verify each club becomes active
    const clubNames = [
      'Real Madrid CF',
      'FC Barcelona',
      'Atlético Madrid',
      'Athletic Club Bilbao',
      'Sevilla FC',
      'Valencia CF',
    ];
    for (let i = 1; i <= 5; i++) {
      await page.locator('button[aria-label="Next club"]').click();
      await page.waitForTimeout(300);
      const name = await page.locator('.ch3-card.scale-105 h3').textContent();
      expect(name.trim()).toBe(clubNames[i]);
    }

    // 5. Click Previous (should go back to Sevilla)
    await page.locator('button[aria-label="Previous club"]').click();
    await expect(page.locator('.ch3-card.scale-105 h3')).toHaveText('Sevilla FC');

    // 6. Click an indicator dot (choose first dot to go to Real Madrid)
    await page.locator('.flex.items-center button').first().click();
    await expect(page.locator('.ch3-card.scale-105 h3')).toHaveText('Real Madrid CF');

    // 7. Open modal by clicking active card
    await page.locator('.ch3-card.scale-105').click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    // Verify stadium photo and history text present
    await expect(modal.locator('img')).toHaveAttribute('src', /real-madrid-stadium/);
    await expect(modal.locator('text=Royalty, European dominance')).toBeVisible();
    // Verify modal fits viewport
    const modalBox = await modal.boundingBox();
    const viewport = page.viewportSize();
    expect(modalBox.width).toBeLessThanOrEqual(viewport.width);
    expect(modalBox.height).toBeLessThanOrEqual(viewport.height);
    await page.screenshot({ path: 'ch3-repaired-modal-desktop.png' });
    // Close modal via close button
    await modal.locator('button[aria-label="Close dialog"]').click();
    await expect(modal).toBeHidden();
  });

  test('Mobile flow', async ({ page }) => {
    // Apply mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.locator('header nav a[href="#chapter-3"]').click();
    await expect(page.locator('#chapter-3')).toBeInViewport();
    await page.screenshot({ path: 'ch3-repaired-mobile.png' });
    await page.locator('.ch3-card.scale-105').click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await page.screenshot({ path: 'ch3-repaired-modal-mobile.png' });
    await modal.locator('button[aria-label="Close dialog"]').click();
    await expect(modal).toBeHidden();
  });
});
