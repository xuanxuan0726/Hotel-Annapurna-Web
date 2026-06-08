const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F011 Table Reservation — TCOV-11-024 … 035 for api/create-booking.php (item_type='table').
//
// This endpoint is properly implemented, so these tests assert its real behavior. Reservation-
// creating tests use a throwaway table and clean it up. The rollback test (035) forces the INSERT
// to fail via a foreign-key violation (the session's user is deleted, leaving orders.user_id
// dangling).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const API = `${BASE}/api/create-booking.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';
// bcrypt hash of 'Test1234' (for the throwaway rollback user).
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };

function createTable() {
  const table_no = `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO tables (table_no, total_chairs, booking_status, price_main, location) VALUES ('${table_no}',4,'available',500.00,'ground floor')`);
  return { id: sql(`SELECT id FROM tables WHERE table_no='${table_no}'`), table_no };
}
function cleanupTable(id) {
  sql(`DELETE FROM orders WHERE order_type='table' AND item_id=${id}`);
  sql(`DELETE FROM tables WHERE id=${id}`);
}

async function loginAs(page, email, password) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

const validForm = (id, table_no, check_in, check_out, price = '500') => ({
  item_type: 'table',
  item_id: String(id),
  item_data: JSON.stringify({ table_no, location: 'ground floor' }),
  price,
  check_in,
  check_out,
});

test.describe('F011 Table Reservation', () => {

  test('TCOV-11-024 — Table reservation is created successfully', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const resp = await page.request.post(API, { form: validForm(table.id, table.table_no, '2099-01-01', '2099-01-02') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(body.booking_id).toBeTruthy();
      expect(body.booking_reference).toBeTruthy();
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-11-025 — Reject reservation and require login', async ({ page }) => {
    const resp = await page.request.post(API, { form: validForm(1, 'x', '2099-01-01', '2099-01-02') });
    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(body.require_login).toBe(true);
  });

  test('TCOV-11-026 — Reject invalid request method', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const resp = await page.request.get(API);
    expect(resp.status()).toBe(405);
    const body = await resp.json();
    expect(String(body.message)).toContain('Invalid request method');
  });

  test('TCOV-11-027 — Reject incomplete reservation details', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const form = validForm(1, 'x', '2099-01-01', '2099-01-02');
    delete form.price;
    const resp = await page.request.post(API, { form });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Missing required booking information');
  });

  test('TCOV-11-028 — Reject invalid booking type', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const form = validForm(1, 'x', '2099-01-01', '2099-01-02');
    form.item_type = 'spaceship';
    const resp = await page.request.post(API, { form });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid booking type');
  });

  test('TCOV-11-029 — Reject invalid table data format', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const form = validForm(1, 'x', '2099-01-01', '2099-01-02');
    form.item_data = 'this-is-not-json';
    const resp = await page.request.post(API, { form });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid item data format');
  });

  test('TCOV-11-030 — Reject reservation when table does not exist', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const resp = await page.request.post(API, { form: validForm(999999, 'x', '2099-01-01', '2099-01-02') });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Table not found');
  });

  test('TCOV-11-031 — Reject reservation when table status is not available', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const bookedId = sql(`SELECT id FROM tables WHERE booking_status='booked' LIMIT 1`);
    const resp = await page.request.post(API, { form: validForm(bookedId, 'x', '2099-01-01', '2099-01-02') });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('not available');
  });

  test('TCOV-11-032 — Calculate reservation price correctly', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      // Single-day reservation: duration is min 1, so total = price × 1 = 500.
      const resp = await page.request.post(API, { form: validForm(table.id, table.table_no, '2099-02-01', '2099-02-01', '500') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(body.total_amount).toBe(500);
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-11-033 — Generate reservation reference successfully', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const resp = await page.request.post(API, { form: validForm(table.id, table.table_no, '2099-03-01', '2099-03-02') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      // T + Ymd(8) + zero-padded user id + rand(4).
      expect(String(body.booking_reference)).toMatch(/^T\d{12,}$/);
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-11-034 — Update table status to reserved after successful reservation', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const resp = await page.request.post(API, { form: validForm(table.id, table.table_no, '2099-04-01', '2099-04-02') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT booking_status FROM tables WHERE id=${table.id}`)).toBe('reserved');
    } finally {
      cleanupTable(table.id);
    }
  });

  test('TCOV-11-035 — Roll back transaction and keep table status unchanged', async ({ page }) => {
    // Force the INSERT to fail via a foreign-key violation: log in as a throwaway user, delete that
    // user (so the session's user_id no longer references a users row), then reserve. The
    // orders.user_id FK rejects the INSERT → the transaction rolls back: no order, table unchanged.
    const email = `tblrb_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Tbl','Rollback','${email}','9800000000','${PW_HASH}','verified')`);
    const uid = sql(`SELECT id FROM users WHERE email='${email}'`);
    const table = createTable();
    try {
      await loginAs(page, email, 'Test1234');
      sql(`DELETE FROM users WHERE id=${uid}`);
      const resp = await page.request.post(API, { form: validForm(table.id, table.table_no, '2099-05-01', '2099-05-02') });
      const body = await resp.json();
      expect(body.success).toBe(false);
      expect(sql(`SELECT COUNT(*) FROM orders WHERE order_type='table' AND item_id=${table.id}`)).toBe('0');
      expect(sql(`SELECT booking_status FROM tables WHERE id=${table.id}`)).toBe('available');
    } finally {
      cleanupTable(table.id);
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });

});
