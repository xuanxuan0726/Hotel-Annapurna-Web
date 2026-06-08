const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F012 Cart Checkout — TCOV-12-010 … 016.
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red) to surface the gap.
//
// Checkout is driven by api/create-cart-order.php (login-gated, JSON body). It validates room/
// table availability but does NOT validate food item data and does NOT require a payment method
// (it defaults to 'cash'). The empty-cart guard is client-side in cart.php. Coupons are validated
// by api/validate-coupon.php.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const CART = `${BASE}/cart.php`;
const API_ORDER = `${BASE}/api/create-cart-order.php`;
const API_COUPON = `${BASE}/api/validate-coupon.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);

async function login(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

// A valid food-only checkout payload (food has no availability check, so it just inserts an order).
function foodOrder(food) {
  return {
    cart: { food, rooms: [], tables: [] },
    subtotal: 100, discount: 0, total: 100,
    coupon: null, payment_method: 'cash', payment_status: 'pending',
  };
}
// Delete any orders the API created, using the ids and/or the unique booking reference it returns.
function cleanupOrders(body) {
  if (!body) return;
  const ids = body.order_ids || (body.order_id ? [body.order_id] : []);
  if (ids && ids.length) sql(`DELETE FROM orders WHERE id IN (${ids.filter(Boolean).join(',') || 0})`);
  if (body.booking_reference) sql(`DELETE FROM orders WHERE booking_reference='${body.booking_reference}'`);
}

test.describe('F012 Cart Checkout', () => {

  test('TCOV-12-010 — Verify checkout is rejected when user is not logged in', async ({ page }) => {
    // No login → the order API rejects with 401.
    const resp = await page.request.post(API_ORDER, { data: foodOrder([{ id: 1, quantity: 1, price: 100, food_name: 'Test' }]) });
    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.success).toBe(false);
  });

  test('TCOV-12-011 — Verify checkout is rejected when cart is empty', async ({ page }) => {
    let dialog = '';
    page.on('dialog', (d) => { dialog = d.message(); d.accept(); });
    await page.goto(CART); // fresh context → empty localStorage cart
    await page.evaluate(() => proceedCheckout());
    expect(dialog).toContain('Your cart is empty');
  });

  test('TCOV-12-012 — Verify checkout is rejected when cart contains invalid item data', async ({ page }) => {
    // SHOULD: a food item with no/garbage id is invalid and the checkout is rejected. ACTUAL: the
    // API does not validate food item data — it creates the order with item_id=0 (and even leaks a
    // PHP "Undefined array key 'id'" warning into the response). Fails by design.
    await login(page);
    try {
      const resp = await page.request.post(API_ORDER, { data: foodOrder([{ quantity: 1, price: 100 }]) }); // no id, no name
      const text = await resp.text();
      const body = JSON.parse(text.slice(text.indexOf('{'))); // strip any leaked PHP warning HTML
      expect(body.success).toBe(false);
    } finally {
      // Remove the invalid order the API created (item_id=0 only happens for this bad input).
      sql(`DELETE FROM orders WHERE user_id=${USER_ID} AND order_type='food' AND item_id=0`);
    }
  });

  test('TCOV-12-013 — Verify checkout is rejected when selected item is unavailable', async ({ page }) => {
    await login(page);
    const bookedRoom = sql(`SELECT id FROM rooms WHERE status='booked' LIMIT 1`);
    const payload = {
      cart: { food: [], rooms: [{ id: Number(bookedRoom), price: 1000, room_no: 'x', room_type: 'single' }], tables: [] },
      subtotal: 1000, discount: 0, total: 1000, coupon: null, payment_method: 'cash', payment_status: 'pending',
    };
    const resp = await page.request.post(API_ORDER, { data: payload });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('not available');
  });

  test('TCOV-12-014 — Verify invalid coupon is rejected during checkout', async ({ page }) => {
    const resp = await page.request.post(API_COUPON, { data: { code: 'NOTAREALCODE123', subtotal: 1000 } });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid coupon code');
  });

  test('TCOV-12-015 — Verify checkout is rejected when payment method is not selected', async ({ page }) => {
    // SHOULD: checkout without a chosen payment method is rejected. ACTUAL: the API defaults a
    // missing payment_method to 'cash' and proceeds. Fails by design.
    await login(page);
    const payload = foodOrder([{ id: 1, quantity: 1, price: 100, food_name: 'Test' }]);
    delete payload.payment_method;
    const resp = await page.request.post(API_ORDER, { data: payload });
    const body = await resp.json();
    try {
      expect(body.success).toBe(false);
    } finally {
      cleanupOrders(body);
    }
  });

  test('TCOV-12-016 — Verify checkout is successful when all conditions are valid', async ({ page }) => {
    await login(page);
    const resp = await page.request.post(API_ORDER, { data: foodOrder([{ id: 1, quantity: 1, price: 100, food_name: 'Test' }]) });
    const body = await resp.json();
    try {
      expect(body.success).toBe(true);
      expect(body.order_ids || body.order_id).toBeTruthy();
    } finally {
      cleanupOrders(body);
    }
  });

});
