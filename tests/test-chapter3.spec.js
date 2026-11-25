import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1280, height: 800 },
  ignoreHTTPSErrors: true,
  baseURL: 'http://localhost:3000',
});

test.describe('Chapter 3 End-to-End', () => {
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));
  });

  test('Desktop flow', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    expect(consoleErrors).toHaveLength(0);

    await page.locator('header nav a[href="#chapter-3"]').click();
    await expect(page.locator('#chapter-3')).toBeInViewport();
    
    await page.waitForSelector('.ch3-card.scale-105', { timeout: 15000 });
    await page.screenshot({ path: 'ch3-repaired-desktop.png' });

    const activeCard = page.locator('.ch3-card.scale-105');
    await expect(activeCard).toBeVisible();
    await expect(activeCard.locator('h3')).toContainText('Real Madrid');

    const clubNames = [
      'Real Madrid',
      'FC Barcelona',
      'Atlético Madrid',
      'Athletic Club Bilbao',
      'Sevilla FC',
      'Valencia CF',
    ];
    for (let i = 1; i <= 5; i++) {
      await page.getByRole('button', { name: 'Next club' }).click();
      await page.waitForTimeout(150);
      const name = await page.locator('.ch3-card.scale-105 h3').textContent();
      expect(name.trim()).toContain(clubNames[i]);
    }

    await page.getByRole('button', { name: 'Previous club' }).click();
    await page.waitForTimeout(150);
    await expect(page.locator('.ch3-card.scale-105 h3')).toContainText('Sevilla');
    await page.waitForTimeout(150);

    await page.getByRole('button', { name: 'Select Real Madrid' }).click();
    await page.waitForTimeout(150);
    await expect(page.locator('.ch3-card.scale-105 h3')).toContainText('Real Madrid');

    await activeCard.click();
    const modal = page.locator('[role="dialog"]');
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
    
    await expect(modal.locator('h3')).toContainText('Real Madrid');
    
    const modalBox = await modal.boundingBox();
    const viewport = page.viewportSize();
    expect(modalBox.width).toBeLessThanOrEqual(viewport.width);
    expect(modalBox.height).toBeLessThanOrEqual(viewport.height);
    await page.screenshot({ path: 'ch3-repaired-modal-desktop.png' });
    
    await modal.getByRole('button', { name: 'Close dialog' }).click();
    await expect(modal).toBeHidden();
  });

  test('Mobile flow - basic navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scroll(0, 0));
    await page.waitForTimeout(1000);
    
    await page.locator('main').evaluate((el, pos) => el.scrollLeft = pos, 0);
    await page.locator('main').evaluate((el, pos) => el.scrollTop = pos, 0);
    
    await page.locator('a[href="#chapter-3"]').last().click({ force: true });
    await page.waitForTimeout(2000);
    await page.waitForSelector('#chapter-3', { state: 'visible', timeout: 10000 });
    await page.screenshot({ path: 'ch3-repaired-mobile.png' });
    
    await page.waitForSelector('.ch3-card', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.ch3-card.scale-105 h3').first()).toContainText('Real Madrid');
    
    await page.locator('.ch3-card').first().click({ force: true });
    const modal = page.locator('[role="dialog"]');
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });
    await page.screenshot({ path: 'ch3-repaired-modal-mobile.png' });
    
    await modal.getByRole('button', { name: 'Close dialog' }).click({ force: true });
    await expect(modal).toBeHidden();
  });
});