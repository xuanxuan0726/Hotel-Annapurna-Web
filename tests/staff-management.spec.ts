const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F027 Staff Management — TCOV-27-003 … 008 for api/admin-users.php (create/update/delete, admin-only).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). The `create` action validates required fields and
// duplicate email, but does NOT validate email format — so the invalid-email case (004) fails by
// design. Run isolated/serial (writes users).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const API_USERS = `${BASE}/api/admin-users.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const EXISTING_EMAIL = 'yangenna20@gmail.com';
const staffEmail = () => `stafftest_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

const post = (page, form) => page.request.post(API_USERS, { form });
const cleanup = (email) => sql(`DELETE FROM users WHERE email='${email}'`);

test.describe('F027 Staff Management', () => {

  test('TCOV-27-003 — Verify missing staff details are rejected', async ({ page }) => {
    // Missing password (a required field) → rejected.
    const body = await (await post(page, { action: 'create', first_name: 'Staff', last_name: 'Test', email: staffEmail(), role: 'staff' })).json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Missing required fields');
  });

  test('TCOV-27-004 — Verify invalid staff email format is rejected', async ({ page }) => {
    // SHOULD: a malformed email is rejected. ACTUAL: the create action does no email-format
    // validation, so the staff account is created. Fails by design.
    try {
      const body = await (await post(page, { action: 'create', first_name: 'Staff', last_name: 'Test', email: 'notanemail', password: 'Test1234', role: 'staff' })).json();
      expect(body.success).toBe(false);
    } finally {
      cleanup('notanemail');
    }
  });

  test('TCOV-27-005 — Verify duplicate staff account cannot be created', async ({ page }) => {
    const body = await (await post(page, { action: 'create', first_name: 'Dup', last_name: 'Staff', email: EXISTING_EMAIL, password: 'Test1234', role: 'staff' })).json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Email already exists');
  });

  test('TCOV-27-006 — Verify new staff account can be created successfully', async ({ page }) => {
    const email = staffEmail();
    try {
      const body = await (await post(page, { action: 'create', first_name: 'New', last_name: 'Staff', email, contact: '9800000000', password: 'Test1234', role: 'staff', status: 'verified' })).json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT role FROM users WHERE email='${email}'`)).toBe('staff');
    } finally {
      cleanup(email);
    }
  });

  test('TCOV-27-007 — Verify update/delete is rejected when staff record does not exist', async ({ page }) => {
    const upd = await (await post(page, { action: 'update', id: '999999', first_name: 'X', last_name: 'Y', email: 'ghost@example.com' })).json();
    expect(upd.success).toBe(false);
    expect(String(upd.message)).toContain('User not found');

    const del = await (await post(page, { action: 'delete', id: '999999' })).json();
    expect(del.success).toBe(false);
    expect(String(del.message)).toContain('User not found');
  });

  test('TCOV-27-008 — Verify existing staff account can be updated successfully', async ({ page }) => {
    const email = staffEmail();
    try {
      const created = await (await post(page, { action: 'create', first_name: 'Edit', last_name: 'Me', email, contact: '9800000000', password: 'Test1234', role: 'staff', status: 'verified' })).json();
      expect(created.success).toBe(true);
      const id = sql(`SELECT id FROM users WHERE email='${email}'`);

      const body = await (await post(page, { action: 'update', id: String(id), first_name: 'Edited', last_name: 'Staff', email, contact: '9811111111', status: 'verified' })).json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT first_name FROM users WHERE id=${id}`)).toBe('Edited');
    } finally {
      cleanup(email);
    }
  });

});
