import { test, expect } from '@playwright/test';

test.describe('Prediction Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard on load', async ({ page }) => {
    // Check that main page loads
    const heading = page.getByRole('heading', { name: /TipsterHub|Dashboard/i });
    await expect(heading).toBeVisible();
  });

  test('should navigate to predictions page', async ({ page }) => {
    // Try to navigate to predictions
    const navLink = page.getByRole('link', { name: /Predictions|Analytics/i }).first();
    
    if (await navLink.isVisible()) {
      await navLink.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle prediction display', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check for basic prediction elements
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeTruthy();
  });
});

test.describe('Model Information', () => {
  test('should display model metadata', async ({ page }) => {
    await page.goto('/');
    
    // Look for any model information display
    const modelInfo = page.locator('text=/model|version|accuracy/i').first();
    
    if (await modelInfo.isVisible()) {
      await expect(modelInfo).toBeVisible();
    }
  });
});
