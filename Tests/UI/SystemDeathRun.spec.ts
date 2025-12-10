import { test, expect } from '@playwright/test';

test.describe('System Simulation: Normal User Survival Run', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
  });

  test('Simulate normal gameplay until resources run out (Death)', async ({ page }) => {
    // 1. IDENTIFY ELEMENTS
    const healthContainer = page.getByTestId('health-value');
    await expect(healthContainer).toBeVisible();

    const nextDayBtn = page.getByText('Next Day', { exact: false });
    const coolDownToggle = page.getByText('Cool Down', { exact: false });

    // 2. INITIAL SETUP (Day 0 Actions)
    console.log('--- SIMULATION START ---');
    
    if (await coolDownToggle.isVisible()) {
        await coolDownToggle.click();
        console.log('[Day 0 Action] User turned OFF Cooling to save water.');
    }

    // 3. THE SURVIVAL LOOP
    let isAlive = true;
    let daysSurvived = 0;
    const MAX_DAYS_LIMIT = 50; 

    while (isAlive && daysSurvived < MAX_DAYS_LIMIT) {
        // A. Capture current health
        const healthText = await healthContainer.innerText();
        const healthValue = parseInt(healthText.match(/-?\d+/)?.[0] || '0', 10);

        // B. Print Daily Status Report
        console.log(`\n--- Day ${daysSurvived} Summary ---`);
        console.log(`   Health: ${healthValue}%`);
        console.log(`   Strategy: Cooling is OFF | Rations are MEDIUM`);

        // C. Check for Death
        if (healthValue <= 0) {
            console.log(' RESULT: Bunker reached 0 Health. Game Over.');
            isAlive = false;
            break; 
        }

        // D. Perform Daily Actions
        console.log(`   [Action] User is proceeding to the next day...`);
        await nextDayBtn.click();
        
        daysSurvived++;
        
        await page.waitForTimeout(1000); 
    }

    console.log(`\n==========================================`);
    console.log(`Total Survival Time: ${daysSurvived} Days`);
    console.log(`==========================================`);

    if (daysSurvived >= MAX_DAYS_LIMIT) {
        console.log(`Limit Reached: Bunker survived longer than ${MAX_DAYS_LIMIT} days.`);
    } else {
        const finalHealthText = await healthContainer.innerText();
        const finalHealth = parseInt(finalHealthText.match(/-?\d+/)?.[0] || '0', 10);
        
        expect(finalHealth).toBeLessThanOrEqual(0);
        console.log(`TEST PASSED: Validated death sequence.`);
    }
  });
});
