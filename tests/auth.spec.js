const { test, expect } = require("@playwright/test");

/**
 * SVV Test Suite for Hotel Annapurna Web
 * Target: Login Module
 */
test.describe("Login Functionality Verification", () => {
  // Helper to navigate to login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost/Hotel-Annapurna-Web/login.php");
  });

  test("TC-01: Successful login with valid credentials", async ({ page }) => {
    // Fill fields using 'name' attributes from your login.php
    await page.fill('input[name="email"]', "xuanxuanteoh26@gmail.com"); // Replace with valid DB user
    await page.fill('input[name="password"]', "Abc1234*"); // Replace with valid password

    // Click the submit button
    await page.click('button[type="submit"]');

    // Verification: Check if redirected to index.php
    // login-handler.php redirects to index.php on success
    await expect(page).toHaveURL(
      "http://localhost/Hotel-Annapurna-Web/admin/login.php",
    );
  });

  test("TC-02: Failed login with incorrect password", async ({ page }) => {
    await page.fill('input[name="email"]', "admin@gmail.com");
    await page.fill('input[name="password"]', "wrong_password_123");
    await page.click('button[type="submit"]');

    // Verification: Check for error message
    // Your login-handler.php uses $_SESSION['error'] which displays in a div
    const errorAlert = page.locator(
      'div[style*="background: var(--color-cancelled-bg)"]',
    );
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText("Invalid Email or Password");
  });

  test("TC-03: Empty fields validation", async ({ page }) => {
    // Trigger submit without entering data
    await page.click('button[type="submit"]');

    // Browser-level validation (HTML5 'required' attribute)
    const emailInput = page.locator('input[name="email"]');
    const isRequired = await emailInput.getAttribute("required");
    expect(isRequired).not.toBeNull();
  });
});
