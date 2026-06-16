const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F007 Add Food to Cart — TCOV-07-001 … 008.
//
// Per the user's directive, each test asserts the behavior that SHOULD exist. Where the app
// does not implement it, the test is left to FAIL (red) to surface the gap — no test.fail()
// masking. Expected results are noted on each test.
//
// Reality of the app: adding food to the cart is client-side localStorage only (menu.php
// #menu-add-cart → hotelCart.food[]). There is NO login gate and NO availability check for
// food. Login/error handling exist only in the server cart API (api/cart-handler.php).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const MENU = `${BASE}/menu.php`;
const CART = `${BASE}/cart.php`;
const API = `${BASE}/api/cart-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const firstVegCheckbox = (page) =>
  page.locator('.menu-section', { hasText: 'Vegetarian Delights' }).locator('.menu-checkbox').first();

// Seed the localStorage cart and load cart.php so it renders the items (logged-out path).
async function seedCart(page, food) {
  await page.goto(CART);
  await page.evaluate((f) => localStorage.setItem('hotelCart', JSON.stringify({ food: f, rooms: [], tables: [] })), food);
  await page.goto(CART);
}

test.describe('F007 Add Food to Cart', () => {

  test('TCOV-07-001 — Add available food item to cart successfully', async ({ page }) => {
    page.on('dialog', (d) => d.accept()); // the add handler alert()s
    await page.goto(MENU);
    const cb = firstVegCheckbox(page);
    const name = await cb.getAttribute('data-name');
    await cb.check();
    await page.click('#menu-add-cart');
    await page.waitForURL(/cart\.php/);
    await expect(page.locator('.cart-item-title', { hasText: name })).toBeVisible();
  });

  test('TCOV-07-002 — Redirect user to login or display login required message', async ({ page }) => {
    // SHOULD: adding to cart while logged out routes the user to login (or shows a login-required
    // message). ACTUAL: the food add is pure localStorage with no login gate → it goes to cart.php.
    // This test fails by design, exposing the missing login requirement.
    page.on('dialog', (d) => d.accept());
    await page.goto(MENU);
    const cb = firstVegCheckbox(page);
    await cb.check();
    await page.click('#menu-add-cart');
    await page.waitForURL(/cart\.php|login\.php/);
    expect(page.url()).toContain('login.php');
  });

  test('TCOV-07-003 — Prevent unavailable item from being added', async ({ page }) => {
    // SHOULD: an unavailable food item (its available_days excludes today) cannot be added.
    // ACTUAL: food add ignores availability entirely → the item is added. Fails by design.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    const otherDay = today === 'Mon' ? 'Tue' : 'Mon';
    const fname = `UNAVAIL_${Date.now()}`;
    sql(`INSERT INTO food_items (category,food_name,price,available_days) VALUES ('special','${fname}',500.00,'${otherDay}')`);
    try {
      page.on('dialog', (d) => d.accept());
      await page.goto(`${MENU}?special_page=100`); // ensure the new item renders
      const cb = page.locator(`.menu-checkbox[data-name="${fname}"]`);
      await expect(cb).toHaveCount(1);
      await cb.check();
      await page.click('#menu-add-cart');
      await page.waitForURL(/cart\.php/).catch(() => {});
      const food = await page.evaluate(() => {
        const c = localStorage.getItem('hotelCart');
        return c ? JSON.parse(c).food || [] : [];
      });
      const wasAdded = food.some((f) => f.name === fname);
      expect(wasAdded).toBe(false); // unavailable item should have been blocked
    } finally {
      sql(`DELETE FROM food_items WHERE food_name='${fname}'`);
    }
  });

  test('TCOV-07-004 — Verify unavailable food item cannot be added to cart', async ({ page }) => {
    // SHOULD: after attempting to add an unavailable item, the cart does not contain it.
    // ACTUAL: it is present. Fails by design.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    const otherDay = today === 'Mon' ? 'Tue' : 'Mon';
    const fname = `UNAVAIL_${Date.now()}`;
    sql(`INSERT INTO food_items (category,food_name,price,available_days) VALUES ('special','${fname}',500.00,'${otherDay}')`);
    try {
      page.on('dialog', (d) => d.accept());
      await page.goto(`${MENU}?special_page=100`);
      const cb = page.locator(`.menu-checkbox[data-name="${fname}"]`);
      await expect(cb).toHaveCount(1);
      await cb.check();
      await page.click('#menu-add-cart');
      await page.waitForURL(/cart\.php/).catch(() => {});
      await page.goto(CART);
      await expect(page.locator('.cart-item-title', { hasText: fname })).toHaveCount(0);
    } finally {
      sql(`DELETE FROM food_items WHERE food_name='${fname}'`);
    }
  });

  test('TCOV-07-005 — Verify existing food item in cart increases quantity instead of creating duplicate item', async ({ page }) => {
    page.on('dialog', (d) => d.accept());
    // First add.
    await page.goto(MENU);
    const cb1 = firstVegCheckbox(page);
    const id = await cb1.getAttribute('data-id');
    await cb1.check();
    await page.click('#menu-add-cart');
    await page.waitForURL(/cart\.php/);
    // Add the same item again.
    await page.goto(MENU);
    const cb2 = firstVegCheckbox(page);
    await cb2.check();
    await page.click('#menu-add-cart');
    await page.waitForURL(/cart\.php/);
    // One entry, quantity 2 — not a duplicate.
    const food = await page.evaluate(() => JSON.parse(localStorage.getItem('hotelCart')).food);
    const entries = food.filter((f) => String(f.id) === String(id));
    expect(entries.length).toBe(1);
    expect(entries[0].quantity).toBe(2);
  });

  test('TCOV-07-006 — Verify invalid quantity is rejected', async ({ page }) => {
    await seedCart(page, [{ id: 99999, name: 'TestFood', price: 100, quantity: 1, type: 'food' }]);
    const qty = page.locator('.cart-qty-input').first();
    await expect(qty).toHaveValue('1');
    // Clicking "-" at quantity 1 would make it 0 — the app must reject/clamp it to 1.
    await page.locator('.cart-qty-btn').first().click();
    await expect(qty).toHaveValue('1');
  });

  test('TCOV-07-007 — Verify cart total is recalculated after item is added', async ({ page }) => {
    await seedCart(page, [{ id: 99999, name: 'TestFood', price: 100, quantity: 1, type: 'food' }]);
    await expect(page.locator('#subtotalValue')).toHaveText('Rs. 100.00');
    // Increasing quantity adds another unit — total recalculates.
    await page.locator('.cart-qty-btn').nth(1).click(); // "+"
    await expect(page.locator('#subtotalValue')).toHaveText('Rs. 200.00');
  });

  test('TCOV-07-008 — Verify database or server error displays error message and cart remains unchanged', async ({ page }) => {
    const uid = sql(`SELECT id FROM users WHERE email='yangenna20@gmail.com'`);
    // Log in so page.request carries the session cookie to the authenticated cart API.
    await page.goto(`${BASE}/login.php`);
    await page.fill('#email', 'yangenna20@gmail.com');
    await page.fill('#password', 'ennayang');
    await page.click('button.login-button');
    await expect(page).toHaveURL(/\/index\.php/);

    const before = parseInt(sql(`SELECT COUNT(*) FROM cart_items WHERE user_id=${uid}`), 10);
    // Malformed add (missing item_data) → server returns an error and persists nothing.
    const resp = await page.request.post(`${API}?action=add`, {
      form: { item_type: 'food', item_id: '1', quantity: '1' },
    });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Missing required fields');
    const after = parseInt(sql(`SELECT COUNT(*) FROM cart_items WHERE user_id=${uid}`), 10);
    expect(after).toBe(before); // cart unchanged
  });

});
