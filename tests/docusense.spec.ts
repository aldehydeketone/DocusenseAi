import { test, expect } from '@playwright/test';

test.describe('DocuSense AI Platform End-to-End Suite', () => {
  test('Landing page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/DocuSense AI/);
    await expect(page.getByText('Reason Across High-Stakes Documents.')).toBeVisible();
  });

  test('Dashboard loads overview and document list', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.getByText('Welcome back, John')).toBeVisible();
    await expect(page.getByText('DocuSense AI: An AI-Powered Document Intelligence and Reasoning Platform')).toBeVisible();
  });

  test('AI Chat interface submits query and displays grounded citations', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/chat');
    await expect(page.getByText('DocuSense RAG Assistant')).toBeVisible();
    
    // Fill query and press Enter
    const input = page.locator('input[placeholder="Ask a question about selected documents..."]');
    await input.fill('What is the base salary?');
    await input.press('Enter');

    // Verify grounded citations appear with regex match
    await expect(page.getByText(/Grounded Source Citations/i)).toBeVisible({ timeout: 15000 });
  });

  test('Side-by-side comparison matrix renders differences', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/compare');
    await expect(page.getByText('Side-by-Side Document Comparison')).toBeVisible();
    await expect(page.getByText('Base Annual Compensation')).toBeVisible();
  });
});
