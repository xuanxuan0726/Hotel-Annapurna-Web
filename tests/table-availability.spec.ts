const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F010 Table Availability Checking — TCOV-10-010 … 018.
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red) to surface the gap.
//
// Reality: table "availability" is only checked by api/create-booking.php (login required),
// which validates table existence + booking_status==='available'. There is NO reservation-date
// validation, NO reservation-time concept at all, and NO overlap detection.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const TABLES = `${BASE}/tables.php`;
const API = `${BASE}/api/create-booking.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);

function createTable() {
  const table_no = `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO tables (table_no, total_chairs, booking_status, price_main, location) VALUES ('${table_no}',4,'available',500.00,'ground floor')`);
  return { id: sql(`SELECT id FROM tables WHERE table_no='${table_no}'`), table_no };
}
function cleanupTable(id) {
  sql(`DELETE FROM orders WHERE order_type='table' AND item_id=${id}`);
  sql(`DELETE FROM tables WHERE id=${id}`);
}

async function login(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

// POST a table reservation through the availability/booking API (shares the page's session cookie).
function bookTable(page, { id, table_no = 'TST', check_in, check_out, reservation_time }) {
  const form = {
    item_type: 'table',
    item_id: String(id),
    item_data: JSON.stringify({ table_no, location: 'ground floor' }),
    price: '500',
  };
  if (check_in !== undefined) form.check_in = check_in;
  if (check_out !== undefined) form.check_out = check_out;
  if (reservation_time !== undefined) form.reservation_time = reservation_time;
  return page.request.post(API, { form });
}

test.describe('F010 Table Availability Checking', () => {

  test('TCOV-10-010 — Verify table does not exist', async ({ page }) => {
    await login(page);
    const resp = await bookTable(page, { id: 999999, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Table not found');
  });

  test('TCOV-10-011 — Verify table exists but is not available', async ({ page }) => {
    await login(page);
    const bookedId = sql(`SELECT id FROM tables WHERE booking_status='booked' LIMIT 1`);
    const resp = await bookTable(page, { id: bookedId, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('not available');
  });

  test('TCOV-10-012 — Verify invalid reservation date', async ({ page }) => {
    // SHOULD: a reservation date in the past is rejected. ACTUAL: no date validation — the
    // reservation is created. Fails by design.
    await login(page);
    const table = createTable();
    try {
      const resp = await bookTable(page, { id: table.id, table_no: table.table_no, check_in: '2020-01-01', check_out: '2020-01-02' });
      const body = await resp.json();
      expect(body.success).toBe(false);
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-10-013 — Verify invalid reservation time', async ({ page }) => {
    // SHOULD: an invalid reservation time is rejected. ACTUAL: the booking API has no concept of
    // reservation time at all (it is ignored), so the reservation is created. Fails by design.
    await login(page);
    const table = createTable();
    try {
      const resp = await bookTable(page, { id: table.id, table_no: table.table_no, check_in: '2099-01-01', check_out: '2099-01-02', reservation_time: '99:99' });
      const body = await resp.json();
      expect(body.success).toBe(false);
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-10-014 — Verify table already reserved', async ({ page }) => {
    // SHOULD: a table already reserved for the requested date/time cannot be reserved again.
    // ACTUAL: no overlap detection, so a second reservation for the same table+date succeeds.
    // Fails by design. (The table is kept 'available' so the status flag doesn't mask the gap.)
    await login(page);
    const table = createTable();
    try {
      const notes = JSON.stringify({ check_in: '2099-06-01', check_out: '2099-06-01' }).replace(/"/g, '\\"');
      sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, booking_reference, status, notes) VALUES (${USER_ID},'table',${table.id},'Test Table',1,500,'TESTREF${Date.now()}','pending','${notes}')`);
      const resp = await bookTable(page, { id: table.id, table_no: table.table_no, check_in: '2099-06-01', check_out: '2099-06-01' });
      const body = await resp.json();
      expect(body.success).toBe(false); // should be rejected as already reserved
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-10-015 — Verify available table is displayed', async ({ page }) => {
    await page.goto(TABLES);
    await expect(page.locator('.tables-status-badge', { hasText: 'Available' }).first()).toBeVisible();
  });

  test('TCOV-10-016 — Verify invalid table selection is rejected', async ({ page }) => {
    await login(page);
    const resp = await bookTable(page, { id: 0, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
  });

  test('TCOV-10-017 — Verify error message is displayed for invalid table availability checking', async ({ page }) => {
    await login(page);
    const resp = await bookTable(page, { id: 999999, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message || '').length).toBeGreaterThan(0);
  });

  test('TCOV-10-018 — Verify user can proceed to table reservation when table is available', async ({ page }) => {
    await login(page);
    const table = createTable();
    try {
      const resp = await bookTable(page, { id: table.id, table_no: table.table_no, check_in: '2099-07-01', check_out: '2099-07-02' });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(body.booking_id).toBeTruthy();
    } finally {
      cleanupTable(table.id);
    }
  });

});
