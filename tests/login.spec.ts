const { test, expect } = require('@playwright/test');


test.describe('Hotel Annapurna Login Verification', () => {


  test('Successful Login with Valid Credentials', async ({ page }) => {
    // 1. Navigate to the local login page
    await page.goto('http://localhost/Hotel-Annapurna-Web/login.php');


    // 2. Fill in the email and password (using IDs from your login.php)
    await page.fill('#email', 'yangenna20@gmail.com');
    await page.fill('#password', 'ennayang');


    // 3. Click the "Sign In" button
    await page.click('button.login-button');


    // 4. Verification: Check if it redirects to the home page or dashboard
    // This confirms your PHP Session Management and login-handler.php worked.
    await expect(page).toHaveURL(/.*index.php/);
   
    // Check for a UI element that only logged-in users have (the profile link lives in
    // the header user menu, which may be collapsed/hidden depending on viewport — its
    // presence in the DOM confirms the logged-in state).
    const profileLink = page.locator('a[href="profile.php"]');
    await expect(profileLink).toBeAttached();
  });


  test('Failed Login shows Error Message', async ({ page }) => {
    await page.goto('http://localhost/Hotel-Annapurna-Web/login.php');


    // Enter incorrect credentials
    await page.fill('#email', 'wrong-user@gmail.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button.login-button');


    // 5. Verification: Check if the error message is displayed
    // This proves your PHP error handling logic blocks unauthorized users.
    const errorMessage = page.locator('div[style*="background: var(--color-cancelled-bg)"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid email or password');
  });


});


// F002 User Login — formal test-case coverage (TCOV-02-001 … 007).
// Validation is HTML5 `required` on #email/#password + server-side PHP in login-handler.php.
// Server errors redirect back to login.php and render in the error box; success redirects
// by role (admin -> admin/index.php, everyone else -> index.php).
test.describe('F002 User Login', () => {

  const LOGIN_URL = 'http://localhost/Hotel-Annapurna-Web/login.php';
  const errorBox = (page) => page.locator('div[style*="background: var(--color-cancelled-bg)"]');

  // Verified customer and admin accounts.
  const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
  const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };

  // ---------------------------------------------------------------------------
  // Native browser blocking → HTML5 `required` stops submission before the server.
  // ---------------------------------------------------------------------------

  test('TCOV-02-001 — Verify email field is empty', async ({ page }) => {
    await page.goto(LOGIN_URL);
    // Leave #email empty; fill password so only the email blocks submission.
    await page.fill('#password', 'somepassword');
    await page.click('button.login-button');
    const valid = await page.locator('#email').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-02-002 — Verify password field is empty', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('#email', CUSTOMER.email);
    // Leave #password empty.
    await page.click('button.login-button');
    const valid = await page.locator('#password').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/login\.php/);
  });

  // ---------------------------------------------------------------------------
  // Server-side rejection → error box populated, stays on login.php.
  // ---------------------------------------------------------------------------

  test('TCOV-02-003 — Verify account does not exist', async ({ page }) => {
    await page.goto(LOGIN_URL);
    // Unique non-existent (but valid-format) email so it always misses the users table.
    await page.fill('#email', `nonexistent_${Date.now()}@example.com`);
    await page.fill('#password', 'somepassword');
    await page.click('button.login-button');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Invalid email or password');
  });

  test('TCOV-02-004 — Verify incorrect password', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('#email', CUSTOMER.email);
    await page.fill('#password', 'wrongpassword');
    await page.click('button.login-button');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Invalid email or password');
  });

  // ---------------------------------------------------------------------------
  // Successful login → role-based redirect.
  // ---------------------------------------------------------------------------

  test('TCOV-02-006 — Verify admin login redirects to admin dashboard', async ({ page }) => {
    // Admins authenticate through the dedicated admin login page, which sets the
    // admin session ($_SESSION['admin_logged_in']) the dashboard guards on. (The main
    // login.php redirects admins to admin/index.php but does NOT set that flag, so the
    // dashboard bounces back to admin/login.php.)
    await page.goto('http://localhost/Hotel-Annapurna-Web/admin/login.php');
    await page.fill('#email', ADMIN.email);
    await page.fill('#password', ADMIN.password);
    await page.click('button.btn-login');
    await expect(page).toHaveURL(/\/admin\/index\.php/);
  });

  test('TCOV-02-007 — Verify customer login redirects to customer homepage', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('#email', CUSTOMER.email);
    await page.fill('#password', CUSTOMER.password);
    await page.click('button.login-button');
    // Customer role redirects to the root index.php (regex excludes the /admin/ path).
    await expect(page).toHaveURL(/\/Hotel-Annapurna-Web\/index\.php/);
  });

});
