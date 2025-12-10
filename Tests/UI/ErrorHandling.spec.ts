import { test, expect } from '@playwright/test';

test.describe('Error Handling (Source Disconnect)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
  });

  test('should display alert when backend fails (Source Disconnect)', async ({ page }) => {
    // 1. Intercept API to force failure
    await page.route('**/api/bunker-status/next-day', route => {
      route.fulfill({ status: 500, body: 'Critical Error' });
    });

    // 2. Listen for the "Couldn't query devices!" alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain("Couldn't query devices!");
      await dialog.accept();
    });

    // 3. Trigger error
    const nextDayBtn = page.getByText('Next Day', { exact: false });
    await nextDayBtn.click();
  });
});
