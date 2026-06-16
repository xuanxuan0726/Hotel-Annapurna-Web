const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F026 Customer Management — TCOV-26-001 … 008 for api/admin-users.php (+ admin/sections/customers.php).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). The admin user API implements list (page) / get /
// update / delete with admin auth, but there is NO customer search, so the search-based cases
// (003 no-match, 004 matching) fail by design. Run isolated/serial (writes users).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const API_USERS = `${BASE}/api/admin-users.php`;
const CUSTOMERS_PAGE = `${BASE}/admin/index.php`; // the dashboard includes the customers section
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S'; // bcrypt('Test1234')

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const EXISTING_EMAIL = 'yangenna20@gmail.com'; // used for the duplicate-email rejection

async function adminLogin(page) {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
}

function createCustomer() {
  const email = `cmtest_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
  sql(`INSERT INTO users (first_name,last_name,email,contact,password,status,role) VALUES ('Cust','Test','${email}','9800000000','${PW_HASH}','verified','customer')`);
  return { id: sql(`SELECT id FROM users WHERE email='${email}'`), email };
}
const cleanup = (email) => sql(`DELETE FROM users WHERE email='${email}'`);
const update = (page, form) => page.request.post(API_USERS, { form: { action: 'update', ...form } });

test.describe('F026 Customer Management', () => {

  test('TCOV-26-001 — Customer list is displayed and customer record is updated successfully', async ({ page }) => {
    await adminLogin(page);
    const c = createCustomer();
    try {
      await page.goto(CUSTOMERS_PAGE);
      // The customers section is rendered on the dashboard (in a tab that may be inactive/hidden).
      await expect(page.locator('.customers-table')).toBeAttached();
      expect(await page.locator('#customersTableBody tr').count()).toBeGreaterThan(0);
      // Update the customer record.
      const body = await (await update(page, { id: String(c.id), first_name: 'Updated', last_name: 'Name', email: c.email, contact: '9811111111', status: 'verified' })).json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT first_name FROM users WHERE id=${c.id}`)).toBe('Updated');
    } finally {
      cleanup(c.email);
    }
  });

  test('TCOV-26-002 — Reject unauthorized user access', async ({ page }) => {
    // No admin session → the API rejects the request.
    const resp = await page.request.get(`${API_USERS}?action=get&id=1`);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Unauthorized');
  });

  test('TCOV-26-003 — Display no customer record found message', async ({ page }) => {
    // SHOULD: searching customers with no match shows a "no customer record found" message.
    // ACTUAL: there is no customer search feature on the management page. Fails by design.
    await adminLogin(page);
    await page.goto(CUSTOMERS_PAGE);
    const search = page.locator('input[type="search"], #customerSearch, input[placeholder*="Search" i]');
    await search.fill('zzz_no_such_customer_zzz');
    await expect(page.getByText(/no customer record found|no customers? found/i)).toBeVisible({ timeout: 5000 });
  });

  test('TCOV-26-004 — Display matching customer records', async ({ page }) => {
    // SHOULD: searching customers returns matching records. ACTUAL: no search feature. Fails by design.
    await adminLogin(page);
    await page.goto(CUSTOMERS_PAGE);
    const search = page.locator('input[type="search"], #customerSearch, input[placeholder*="Search" i]');
    await search.fill('yangenna');
    await expect(page.locator('#customersTableBody tr', { hasText: 'yangenna' })).toBeVisible({ timeout: 5000 });
  });

  test('TCOV-26-005 — Display customer record not found message', async ({ page }) => {
    await adminLogin(page);
    const resp = await page.request.get(`${API_USERS}?action=get&id=999999`);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('not found');
  });

  test('TCOV-26-006 — Reject invalid customer update data', async ({ page }) => {
    await adminLogin(page);
    const c = createCustomer();
    try {
      // Missing required email → rejected.
      const body = await (await update(page, { id: String(c.id), first_name: 'X', last_name: 'Y', email: '' })).json();
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('Missing required fields');
    } finally {
      cleanup(c.email);
    }
  });

  test('TCOV-26-007 — Customer account is deleted', async ({ page }) => {
    await adminLogin(page);
    const c = createCustomer();
    try {
      const body = await (await page.request.post(API_USERS, { form: { action: 'delete', id: String(c.id) } })).json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT COUNT(*) FROM users WHERE id=${c.id}`)).toBe('0');
    } finally {
      cleanup(c.email);
    }
  });

  test('TCOV-26-008 — Display error and keep customer data unchanged', async ({ page }) => {
    await adminLogin(page);
    const c = createCustomer();
    try {
      // Update to an email already used by another user → rejected, record unchanged.
      const body = await (await update(page, { id: String(c.id), first_name: 'Should', last_name: 'NotApply', email: EXISTING_EMAIL, contact: '9800000000', status: 'verified' })).json();
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('Email already exists');
      // The customer's email and name are unchanged.
      expect(sql(`SELECT email FROM users WHERE id=${c.id}`)).toBe(c.email);
      expect(sql(`SELECT first_name FROM users WHERE id=${c.id}`)).toBe('Cust');
    } finally {
      cleanup(c.email);
    }
  });

});
