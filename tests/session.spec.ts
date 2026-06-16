const { test, expect } = require('@playwright/test');

// F003 Session Verification — state-machine transitions (TCOV-03-001 … 008).
//
// States: S1 Accessing Protected Page · S2 Checking Session · S3 Viewing Protected Page
//         S4 Redirecting to Login · S5 Logging Out
//
// App facts (Hotel Annapurna):
//   - Protected page profile.php guards with:
//       if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) { header("Location: login.php"); }
//   - login-handler.php sets $_SESSION['logged_in']=true and redirects to index.php (no redirect-back).
//   - logout.php clears the session and redirects to index.php.
//   - Customer pages have NO server-side inactivity timeout (only the admin panel does), so an
//     "expired / timed-out" session is simulated here by clearing the session cookie — the same
//     observable effect: the next request has no valid session and the guard redirects to login.

const LOGIN_URL = 'http://localhost/Hotel-Annapurna-Web/login.php';
const PROFILE_URL = 'http://localhost/Hotel-Annapurna-Web/profile.php';
const errorBox = (page) => page.locator('div[style*="background: var(--color-cancelled-bg)"]');

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };

async function loginAsCustomer(page) {
  await page.goto(LOGIN_URL);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  // Successful login lands on the customer homepage.
  await expect(page).toHaveURL(/\/Hotel-Annapurna-Web\/index\.php/);
}

test.describe('F003 Session Verification', () => {

  test('TCOV-03-001 — S1 Accessing Protected Page → S2 Checking Session', async ({ page }) => {
    // Accessing a protected page is intercepted by the session-verification guard rather
    // than served directly. With no session, the guard routes the request into the check
    // and away from the protected content (here it ends at the login page).
    await page.context().clearCookies();
    await page.goto(PROFILE_URL);
    await expect(page).not.toHaveURL(/profile\.php/);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-03-002 — S2 Checking Session → S3 Viewing Protected Page (valid session)', async ({ page }) => {
    await loginAsCustomer(page);
    // With a valid session the guard passes and the protected page renders.
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/profile\.php/);
  });

  test('TCOV-03-003 — S2 Checking Session → S4 Redirecting to Login (invalid session)', async ({ page }) => {
    // No session at all → guard redirects to login.
    await page.context().clearCookies();
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-03-004 — S2 Checking Session → S4 Redirecting to Login (expired session)', async ({ page }) => {
    // Establish a valid session, then expire it (clear the session cookie). The next access
    // is checked, found invalid, and redirected to login.
    await loginAsCustomer(page);
    await page.context().clearCookies(); // simulate session expiry
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-03-005 — S3 Viewing Protected Page → S5 Logging Out', async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/profile\.php/);
    // The logout control is present on the protected page (inside the user dropdown, which
    // renders display:none until opened — hence we activate its target rather than click it).
    await expect(page.locator('a[href="logout.php"]')).toBeAttached();
    // Logging out: hit the handler the logout link points to.
    await page.goto('http://localhost/Hotel-Annapurna-Web/logout.php');
    // logout.php destroys the session and redirects to the homepage.
    await expect(page).toHaveURL(/\/Hotel-Annapurna-Web\/index\.php/);
    // Confirm the session is gone: the protected page now redirects to login.
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-03-006 — S3 Viewing Protected Page → S4 Redirecting to Login (session times out)', async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/profile\.php/); // S3: viewing the page
    // Session times out while viewing (simulated by clearing the session cookie).
    await page.context().clearCookies();
    await page.reload();
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-03-007 — S4 Redirecting to Login → S3 Viewing Protected Page (login succeeds)', async ({ page }) => {
    // Start unauthenticated: accessing the protected page redirects to login (S4).
    await page.context().clearCookies();
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/login\.php/);
    // Log in successfully. (The app has no redirect-back; it lands on index.php, after which
    // the now-authenticated user can view the protected page — S3.)
    await page.fill('#email', CUSTOMER.email);
    await page.fill('#password', CUSTOMER.password);
    await page.click('button.login-button');
    await expect(page).toHaveURL(/\/Hotel-Annapurna-Web\/index\.php/);
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/profile\.php/);
  });

  test('TCOV-03-008 — S4 Redirecting to Login stays at S4 (login fails)', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(PROFILE_URL);
    await expect(page).toHaveURL(/login\.php/);
    // Failed login keeps the user on the login page with an error.
    await page.fill('#email', CUSTOMER.email);
    await page.fill('#password', 'wrongpassword');
    await page.click('button.login-button');
    await expect(page).toHaveURL(/login\.php/);
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Invalid email or password');
  });

});
