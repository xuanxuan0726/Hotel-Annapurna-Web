const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F014 Payment Processing — TCOV-14-010 … 017 for api/confirm-booking.php (+ eSewa flow).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red). The user also confirmed eSewa is NOT set
// up, so the eSewa tests (015, 016) are expected to fail.
//
// confirm-booking.php validates login, method, booking ownership, and payment method/status, then
// sets payment_status (as passed) and status='confirmed'. It does NOT validate the payment amount.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const CONFIRM = `${BASE}/api/confirm-booking.php`;
const PAYMENT = `${BASE}/payment.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);

// Create a throwaway pending order owned by the customer; returns its id.
function createOrder() {
  const ref = `PAYTEST${Date.now()}${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, payment_method, payment_status, booking_reference, status) VALUES (${USER_ID},'food',1,'Pay Test',1,100,'cash','pending','${ref}','pending')`);
  return sql(`SELECT id FROM orders WHERE booking_reference='${ref}'`);
}
const deleteOrder = (id) => sql(`DELETE FROM orders WHERE id=${id}`);

async function login(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

const confirm = (page, form) => page.request.post(CONFIRM, { form });

test.describe('F014 Payment Processing', () => {

  test('TCOV-14-010 — Verify payment is rejected when user is not logged in', async ({ page }) => {
    const resp = await confirm(page, { booking_id: '1', payment_method: 'cash', payment_status: 'pending' });
    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.success).toBe(false);
  });

  test('TCOV-14-011 — Verify payment is rejected when order does not exist', async ({ page }) => {
    await login(page);
    const resp = await confirm(page, { booking_id: '999999', payment_method: 'cash', payment_status: 'pending' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Booking not found');
  });

  test('TCOV-14-012 — Verify payment is rejected when payment amount is invalid', async ({ page }) => {
    // SHOULD: an invalid payment amount is rejected. ACTUAL: confirm-booking.php has no amount
    // validation (it doesn't even read an amount), so the booking is confirmed. Fails by design.
    await login(page);
    const id = createOrder();
    try {
      const resp = await confirm(page, { booking_id: id, payment_method: 'cash', payment_status: 'pending', amount: '-100' });
      const body = await resp.json();
      expect(body.success).toBe(false);
    } finally {
      deleteOrder(id);
    }
  });

  test('TCOV-14-013 — Verify payment is rejected when payment method is not selected', async ({ page }) => {
    await login(page);
    const resp = await confirm(page, { booking_id: '999999', payment_method: '', payment_status: 'pending' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Payment method is required');
  });

  test('TCOV-14-014 — Verify cash payment keeps payment status as pending', async ({ page }) => {
    await login(page);
    const id = createOrder();
    try {
      const resp = await confirm(page, { booking_id: id, payment_method: 'cash', payment_status: 'pending' });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT payment_status FROM orders WHERE id=${id}`)).toBe('pending');
      expect(sql(`SELECT status FROM orders WHERE id=${id}`)).toBe('confirmed');
    } finally {
      deleteOrder(id);
    }
  });

  test('TCOV-14-015 — Verify eSewa payment redirects user to payment gateway', async ({ page }) => {
    // The eSewa form really does submit to eSewa's RC sandbox, so the redirect to the gateway
    // works (passes). Note: this is network-dependent — it requires rc-epay.esewa.com.np to be
    // reachable. (Completing the payment is what's not configured — see 016.)
    await login(page);
    const id = createOrder();
    try {
      await page.goto(`${PAYMENT}?booking_id=${id}`);
      await page.check('input[name="payment_method"][value="esewa"]');
      await page.click('.btn.btn-primary');
      await expect(page).toHaveURL(/esewa\.com\.np/, { timeout: 6000 });
    } finally {
      deleteOrder(id);
    }
  });

  test('TCOV-14-016 — Verify successful eSewa payment updates payment status', async ({ page }) => {
    // eSewa is NOT set up, so a successful eSewa payment cannot occur and the order stays pending.
    // Fails by design (per the user).
    await login(page);
    const id = createOrder();
    try {
      // A working eSewa payment would mark this 'paid'; without eSewa configured it never does.
      expect(sql(`SELECT payment_status FROM orders WHERE id=${id}`)).toBe('paid');
    } finally {
      deleteOrder(id);
    }
  });

  test('TCOV-14-017 — Verify successful Stripe payment updates payment status', async ({ page }) => {
    await login(page);
    const id = createOrder();
    try {
      const resp = await confirm(page, { booking_id: id, payment_method: 'stripe', payment_status: 'paid' });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT payment_status FROM orders WHERE id=${id}`)).toBe('paid');
      expect(sql(`SELECT status FROM orders WHERE id=${id}`)).toBe('confirmed');
    } finally {
      deleteOrder(id);
    }
  });

});
