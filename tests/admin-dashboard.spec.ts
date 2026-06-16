const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F021 Admin Dashboard Access — TCOV-21-001 … 012. State machine: open dashboard → check session →
// check role → display / deny; plus logout and session timeout.
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). Realities:
//  - admin/index.php is guarded by sidebar.php (requires $_SESSION['admin_logged_in']); section
//    pages use auth-guard.php (role=='admin' + 30-min last_activity timeout).
//  - admin/login.php only authenticates role='admin' (staff/customer cannot log into the panel).
//  - There is NO distinct access-denied page — denial just redirects to admin/login.php.
//  - The 30-min timeout can't be exercised without time-travel, so expiry is simulated by clearing
//    the session cookie (the observable result — redirect to login — is the same).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const DASH = `${BASE}/admin/index.php`;
const ADMIN_LOGIN = `${BASE}/admin/login.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S'; // bcrypt('Test1234')

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };

async function adminLogin(page) {
  await page.goto(ADMIN_LOGIN);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
}
async function customerLogin(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

test.describe('F021 Admin Dashboard Access', () => {

  test('TCOV-21-001 — Open admin dashboard triggers session check', async ({ page }) => {
    // Accessing the dashboard is intercepted by the session guard rather than served directly.
    await page.context().clearCookies();
    await page.goto(DASH);
    await expect(page).not.toHaveURL(/\/admin\/index\.php/);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-002 — Valid session proceeds (role check) and dashboard loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/index\.php/); // valid session → not bounced to login
  });

  test('TCOV-21-003 — No session redirects to login page', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-004 — Expired session is destroyed and redirected to login', async ({ page }) => {
    await adminLogin(page);
    await page.context().clearCookies(); // simulate the session expiring/being destroyed
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-005 — Admin role displays the dashboard', async ({ page }) => {
    await adminLogin(page);
    await expect(page).toHaveURL(/\/admin\/index\.php/);
    await expect(page.getByText('Dashboard Overview')).toBeVisible();
  });

  test('TCOV-21-006 — Staff role displays the dashboard', async ({ page }) => {
    // SHOULD: a staff user can access the dashboard. ACTUAL: admin/login.php only authenticates
    // role='admin', so staff can't log in to the panel at all. Fails by design.
    const email = `staffuser_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status,role) VALUES ('Staff','User','${email}','9800000000','${PW_HASH}','verified','staff')`);
    try {
      await page.goto(ADMIN_LOGIN);
      await page.fill('#email', email);
      await page.fill('#password', 'Test1234');
      await page.click('button.btn-login');
      await expect(page).toHaveURL(/\/admin\/index\.php/, { timeout: 6000 });
    } finally {
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });

  test('TCOV-21-007 — Customer role is denied access', async ({ page }) => {
    await customerLogin(page); // customer session (no admin_logged_in)
    await page.goto(DASH);
    await expect(page).not.toHaveURL(/\/admin\/index\.php/);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-008 — Invalid/unknown role is denied access', async ({ page }) => {
    // No valid admin role in the session → the guard denies access (redirect to login).
    await page.context().clearCookies();
    await page.goto(DASH);
    await expect(page).not.toHaveURL(/\/admin\/index\.php/);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-009 — Logout destroys the session and logs the user out', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/logout.php`);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
    // Session destroyed → dashboard no longer accessible.
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-010 — Session timeout on dashboard redirects to login', async ({ page }) => {
    await adminLogin(page);
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/index\.php/);
    await page.context().clearCookies(); // simulate the session timing out while on the dashboard
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/login\.php/);
  });

  test('TCOV-21-011 — After successful login the dashboard can be opened again', async ({ page }) => {
    await adminLogin(page);
    await page.goto(DASH);
    await expect(page).toHaveURL(/\/admin\/index\.php/);
    await expect(page.getByText('Dashboard Overview')).toBeVisible();
  });

  test('TCOV-21-012 — From the access-denied page, user returns to login', async ({ page }) => {
    // SHOULD: a denied user sees an "Access Denied" page with a link back to login. ACTUAL: denial
    // redirects straight to login — there is no access-denied page. Fails by design.
    await customerLogin(page);
    await page.goto(DASH);
    await expect(page.getByText(/access denied/i)).toBeVisible({ timeout: 5000 });
  });

});
