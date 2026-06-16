const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F025 Order Management — TCOV-25-001 … 009 for api/admin-orders.php (admin order-status updates).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). The orders.status enum is only
// pending/confirmed/completed/cancelled, and admin-orders.php validates against exactly those — so
// 'preparing', 'ready' and 'refunded' are unsupported (those cases fail by design).
// Run isolated/serial (it writes orders).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ADMIN_ORDERS = `${BASE}/api/admin-orders.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const USER_ID = sql(`SELECT id FROM users WHERE email='yangenna20@gmail.com'`);

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

// Insert a test order. If `status` is omitted, the column default ('pending') applies.
function createOrder(status) {
  const ref = `OMTEST${Date.now()}${Math.floor(Math.random() * 1000)}`;
  if (status) {
    sql(`INSERT INTO orders (user_id,order_type,item_id,item_name,quantity,price,booking_reference,status) VALUES (${USER_ID},'food',1,'OM Test',1,100,'${ref}','${status}')`);
  } else {
    sql(`INSERT INTO orders (user_id,order_type,item_id,item_name,quantity,price,booking_reference) VALUES (${USER_ID},'food',1,'OM Test',1,100,'${ref}')`);
  }
  return { id: sql(`SELECT id FROM orders WHERE booking_reference='${ref}'`), ref };
}
const statusOf = (id) => sql(`SELECT status FROM orders WHERE id=${id}`);
const cleanup = (ref) => sql(`DELETE FROM orders WHERE booking_reference='${ref}'`);
const updateStatus = (page, id, status) =>
  page.request.post(ADMIN_ORDERS, { form: { action: 'update_order_status', order_id: String(id), status } });

test.describe('F025 Order Management', () => {

  test('TCOV-25-001 — Order is created and becomes pending confirmation', async ({ page }) => {
    const o = createOrder(); // no explicit status → default
    try {
      expect(statusOf(o.id)).toBe('pending');
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-002 — Pending order is confirmed', async ({ page }) => {
    const o = createOrder('pending');
    try {
      const body = await (await updateStatus(page, o.id, 'confirmed')).json();
      expect(body.success).toBe(true);
      expect(statusOf(o.id)).toBe('confirmed');
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-003 — Pending order is cancelled', async ({ page }) => {
    const o = createOrder('pending');
    try {
      const body = await (await updateStatus(page, o.id, 'cancelled')).json();
      expect(body.success).toBe(true);
      expect(statusOf(o.id)).toBe('cancelled');
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-004 — Confirmed order starts preparing', async ({ page }) => {
    // SHOULD: a confirmed order can move to 'preparing'. ACTUAL: 'preparing' is not a valid status
    // (not in the enum; admin-orders rejects it). Fails by design.
    const o = createOrder('confirmed');
    try {
      const body = await (await updateStatus(page, o.id, 'preparing')).json();
      expect(body.success).toBe(true);
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-005 — Confirmed order is cancelled', async ({ page }) => {
    const o = createOrder('confirmed');
    try {
      const body = await (await updateStatus(page, o.id, 'cancelled')).json();
      expect(body.success).toBe(true);
      expect(statusOf(o.id)).toBe('cancelled');
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-006 — Preparing order is marked ready for pickup/delivery', async ({ page }) => {
    // SHOULD: a preparing order can move to 'ready'. ACTUAL: neither 'preparing' nor 'ready' exists.
    // Fails by design.
    const o = createOrder('confirmed');
    try {
      const body = await (await updateStatus(page, o.id, 'ready')).json();
      expect(body.success).toBe(true);
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-007 — Preparing order is cancelled', async ({ page }) => {
    // SHOULD: an order in 'preparing' can be cancelled. ACTUAL: 'preparing' isn't a reachable state
    // (unsupported), so this flow can't exist. Fails by design (setting 'preparing' is rejected).
    const o = createOrder('confirmed');
    try {
      const body = await (await updateStatus(page, o.id, 'preparing')).json();
      expect(body.success).toBe(true);
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-008 — Ready order is completed', async ({ page }) => {
    // SHOULD: a 'ready' order can be completed. ACTUAL: 'ready' is not a valid status. Fails by design.
    const o = createOrder('confirmed');
    try {
      const body = await (await updateStatus(page, o.id, 'ready')).json();
      expect(body.success).toBe(true);
    } finally { cleanup(o.ref); }
  });

  test('TCOV-25-009 — Cancelled order is refunded', async ({ page }) => {
    // SHOULD: a cancelled order can be refunded. ACTUAL: 'refunded' is not a valid order status
    // (nor a payment_status value). Fails by design.
    const o = createOrder('cancelled');
    try {
      const body = await (await updateStatus(page, o.id, 'refunded')).json();
      expect(body.success).toBe(true);
    } finally { cleanup(o.ref); }
  });

});
