const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F015 Order History Viewing — TCOV-15-001 … 006 for my-orders.php (+ order-details API).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red). TCOV-15-006 briefly renames the `orders`
// table to simulate a retrieval failure, so this spec must run isolated (--workers=1, one project).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const MYORDERS = `${BASE}/my-orders.php`;
const ORDER_API = `${BASE}/api/order-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S'; // bcrypt('Test1234')

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);

// Seed a food order for the customer; returns its booking_reference (used to clean up).
function seedFoodOrder(name = 'History Test Momo') {
  const ref = `HISTTEST${Date.now()}${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, payment_method, payment_status, booking_reference, status) VALUES (${USER_ID},'food',999999,'${name}',2,200,'cash','pending','${ref}','confirmed')`);
  return ref;
}
const cleanupOrder = (ref) => sql(`DELETE FROM orders WHERE booking_reference='${ref}'`);

async function loginAs(page, email, password) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

test.describe('F015 Order History Viewing', () => {

  test('TCOV-15-001 — Order history is displayed successfully', async ({ page }) => {
    const ref = seedFoodOrder();
    try {
      await loginAs(page, CUSTOMER.email, CUSTOMER.password);
      await page.goto(MYORDERS);
      await expect(page.locator('.orders-list')).toBeVisible();
      expect(await page.locator('.order-card').count()).toBeGreaterThan(0);
    } finally {
      cleanupOrder(ref);
    }
  });

  test('TCOV-15-002 — Redirect user to login or display login required message', async ({ page }) => {
    await page.goto(MYORDERS); // not logged in
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-15-003 — Display no order history message', async ({ page }) => {
    // A throwaway user with no orders sees the empty-state message.
    const email = `histuser_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Hist','User','${email}','9800000000','${PW_HASH}','verified')`);
    try {
      await loginAs(page, email, 'Test1234');
      await page.goto(MYORDERS);
      await expect(page.locator('.empty-state')).toBeVisible();
      await expect(page.locator('.empty-state h3')).toHaveText('No Orders Yet');
    } finally {
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });

  test('TCOV-15-004 — Display selected order details', async ({ page }) => {
    const ref = seedFoodOrder();
    try {
      await loginAs(page, CUSTOMER.email, CUSTOMER.password);
      await page.goto(MYORDERS);
      await page.locator('.order-card').first().locator('.btn-action.btn-primary').click();
      await expect(page.locator('#orderModal')).toBeVisible();
      await expect(page.locator('#modalItemName')).toContainText('History Test Momo');
    } finally {
      cleanupOrder(ref);
    }
  });

  test('TCOV-15-005 — Display order details not found message', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const resp = await page.request.get(`${ORDER_API}?action=get_order_details&order_id=999999`);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Order not found');
  });

  test('TCOV-15-006 — Display error message when order retrieval fails', async ({ page }) => {
    // SHOULD: when the orders query fails, a user-facing error message is shown. ACTUAL: my-orders.php
    // silently falls back to an empty list (no error message). We simulate a retrieval failure by
    // briefly renaming the orders table; the page shows no error message → fails by design.
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    let renamed = false;
    try {
      sql('RENAME TABLE orders TO orders_f015bak');
      renamed = true;
      await page.goto(MYORDERS);
      await expect(
        page.getByText(/unable to load orders|failed to load|error loading|could not load your orders/i)
      ).toBeVisible({ timeout: 5000 });
    } finally {
      if (renamed) sql('RENAME TABLE orders_f015bak TO orders');
    }
  });

});
