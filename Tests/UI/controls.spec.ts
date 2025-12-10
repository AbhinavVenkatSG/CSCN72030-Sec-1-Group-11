import { test, expect } from '@playwright/test';

test.describe('Bunker Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
  });

  // User Story 8: Ration Levels
  test('User can select Ration Levels', async ({ page }) => {
    const lowBtn = page.getByText('Low', { exact: true });
    await expect(lowBtn).toBeVisible();
    await lowBtn.click();
  });

  // User Story 9: Generator Load Threshold (Light Switch)
  test('User can adjust Light Threshold', async ({ page }) => {
    const control = page.getByText('Light Threshold', { exact: false }).first();
    await expect(control).toBeVisible();
  });

  // User Story 11: Cool Down Toggle
  test('User can toggle Cool Down', async ({ page }) => {
    const coolDown = page.getByText('Cool Down', { exact: false });
    await expect(coolDown).toBeVisible();
    await coolDown.click();
  });

  // User Story 12: Scavenge
  test('User can toggle Scavenge', async ({ page }) => {
    const scavenge = page.getByText('Scavenge', { exact: false });
    await expect(scavenge).toBeVisible();
    await scavenge.click();
  });
});
