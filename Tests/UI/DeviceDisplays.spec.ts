import { test, expect } from '@playwright/test';

test.describe('Bunker Device Displays', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
  });

  // User Story 1: Thermometer
  test('Thermometer should be visible and display formatted temperature', async ({ page }) => {
    const therm = page.getByTestId('thermometer-value');
    await expect(therm).toBeVisible();
    await expect(therm).toContainText('°C');
  });

  // User Story 2: Dosimeter
  test('Dosimeter should be visible', async ({ page }) => {
    const dosi = page.getByTestId('dosimeter-value');
    await expect(dosi).toBeVisible();
  });

  // User Story 3: Food Sensor
  test('Food Sensor should be visible', async ({ page }) => {
    const food = page.getByTestId('food-value');
    await expect(food).toBeVisible();
  });

  // User Story 4: Water Sensor
  test('Water Sensor should be visible', async ({ page }) => {
    const water = page.getByTestId('water-value');
    await expect(water).toBeVisible();
  });

  // User Story 5: Generator
  test('Generator should be visible', async ({ page }) => {
    const gen = page.getByTestId('generator-value');
    await expect(gen).toBeVisible();
  });

  // User Story 6: O2 Scrubber
  test('O2 Scrubber should be visible', async ({ page }) => {
    const o2 = page.getByTestId('o2scrubber-value');
    await expect(o2).toBeVisible();
  });

  // User Story 7: Health Monitor
  test('Health Monitor should be visible', async ({ page }) => {
    const health = page.getByTestId('health-value');
    await expect(health).toBeVisible();
  });
});
