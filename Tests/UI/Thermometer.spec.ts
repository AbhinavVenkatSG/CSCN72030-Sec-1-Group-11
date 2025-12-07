import { test } from '@playwright/test';

test.describe('Thermometer Component', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the local app
    await page.goto('http://localhost:8081');
  });

  test('press Next Day button', async ({ page }) => {
    const nextDay = page.locator('text=Next Day');
    await nextDay.click();
  });

});