import { test, expect } from '@playwright/test';

/* The plan her is to : 
   This test simulates a user just playing the game.
   They switch rations randomly, toggle scavenging on and off, and spam "Next Day."
   We just want to see if the app handles the chaos until the bunker eventually dies (or survives the limit).
*/

test.describe('System Simulation: Random User Survival Run', () => {
    
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
  });

  test('Simulate chaotic user gameplay (Ration Switching & Scavenging)', async ({ page }) => {
    
    // --- 1. GRAB THE UI ELEMENTS ---
    const healthContainer = page.getByTestId('health-value');
    await expect(healthContainer).toBeVisible();

    const nextDayBtn = page.getByText('Next Day', { exact: false });
    const scavengeSwitch = page.getByRole('switch').last();

    // Store our 3 ration buttons so we can pick one randomly later
    const rationButtons = [
        { name: 'Low',    locator: page.getByText('Low', { exact: false }) },
        { name: 'Medium', locator: page.getByText('Medium', { exact: false }) },
        { name: 'High',   locator: page.getByText('High', { exact: false }) }
    ];

    console.log('--- STARTING RUN ---');
    
    let isAlive = true;
    let daysSurvived = 0;
    const MAX_DAYS_LIMIT = 20; 
    let isScavenging = false;

    // --- 2. THE GAME LOOP ---
    while (isAlive && daysSurvived < MAX_DAYS_LIMIT) {
        const healthText = await healthContainer.innerText();
        const healthValue = parseInt(healthText.match(/-?\d+/)?.[0] || '0', 10);

        console.log(`\n--- Day ${daysSurvived} | Health: ${healthValue}% ---`);

        if (healthValue <= 0) {
            console.log('Bunker reached 0 Health.');
            isAlive = false;
            break; 
        }

        // Randomly pick a Ration level (0, 1, or 2)
        const randomIndex = Math.floor(Math.random() * 3);
        const selectedRation = rationButtons[randomIndex];
        
        if (await selectedRation.locator.isVisible()) {
            await selectedRation.locator.click({ force: true });
            console.log(`   [Action] User switched rations to: ${selectedRation.name}`);
        }

        if (Math.random() > 0.5) {
            if (await scavengeSwitch.isVisible()) {
                await scavengeSwitch.click({ force: true });
                isScavenging = !isScavenging;
                console.log(`   [Action] User toggled Scavenging ${isScavenging ? 'ON' : 'OFF'}`);
            }
        }

        await nextDayBtn.click();
        daysSurvived++;
        
        await page.waitForTimeout(1000); 
    }

    // --- 3. FINAL SCORE ---
    console.log(`\n==========================================`);
    console.log(`Total Survival Time: ${daysSurvived} Days`);
    console.log(`==========================================`);

    if (daysSurvived >= MAX_DAYS_LIMIT) {
        console.log(` Bunker survived the chaos for ${MAX_DAYS_LIMIT} days!`);
        expect(true).toBeTruthy(); // Pass
    } else {
        const finalHealthText = await healthContainer.innerText();
        const finalHealth = parseInt(finalHealthText.match(/-?\d+/)?.[0] || '0', 10);
        
        expect(finalHealth).toBeLessThanOrEqual(0);
        console.log(`Validated death sequence.`);
    }
  });
});
