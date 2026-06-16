const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F016 Booking History Viewing — TCOV-16-001 … 007 for my-bookings.php (+ order-details API).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red). TCOV-16-007 briefly renames the `orders`
// table to simulate a server error, so this spec must run isolated (--workers=1, one project).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const MYBOOKINGS = `${BASE}/my-bookings.php`;
const ORDER_API = `${BASE}/api/order-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S'; // bcrypt('Test1234')

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);

// Seed a room booking for a given user; returns { ref, id }.
function seedRoomBooking(userId = USER_ID) {
  const ref = `BKTEST${Date.now()}${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, payment_method, payment_status, booking_reference, status) VALUES (${userId},'room',1,'Room Booking',1,5000,'cash','paid','${ref}','confirmed')`);
  return { ref, id: sql(`SELECT id FROM orders WHERE booking_reference='${ref}'`) };
}
const cleanupOrder = (ref) => sql(`DELETE FROM orders WHERE booking_reference='${ref}'`);

async function loginAs(page, email, password) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

test.describe('F016 Booking History Viewing', () => {

  test('TCOV-16-001 — Booking history is displayed successfully', async ({ page }) => {
    const booking = seedRoomBooking();
    try {
      await loginAs(page, CUSTOMER.email, CUSTOMER.password);
      await page.goto(MYBOOKINGS);
      await expect(page.locator('.bookings-grid')).toBeVisible();
      expect(await page.locator('.booking-card').count()).toBeGreaterThan(0);
    } finally {
      cleanupOrder(booking.ref);
    }
  });

  test('TCOV-16-002 — Redirect user to login or display login required message', async ({ page }) => {
    await page.goto(MYBOOKINGS); // not logged in
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-16-003 — Display no booking history message', async ({ page }) => {
    const email = `bkuser_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Bk','User','${email}','9800000000','${PW_HASH}','verified')`);
    try {
      await loginAs(page, email, 'Test1234');
      await page.goto(MYBOOKINGS);
      await expect(page.locator('.empty-state')).toBeVisible();
      await expect(page.locator('.empty-state h3')).toHaveText('No Bookings Yet');
    } finally {
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });

  test('TCOV-16-004 — Display selected booking details', async ({ page }) => {
    const booking = seedRoomBooking();
    try {
      await loginAs(page, CUSTOMER.email, CUSTOMER.password);
      await page.goto(MYBOOKINGS);
      await page.locator('.booking-card').first().locator('.btn-action.btn-primary').click();
      await expect(page.locator('#bookingModal')).toBeVisible();
      await expect(page.locator('#modalItemName')).toContainText('Room');
    } finally {
      cleanupOrder(booking.ref);
    }
  });

  test('TCOV-16-005 — Display booking details not found message', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const resp = await page.request.get(`${ORDER_API}?action=get_order_details&order_id=999999`);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Order not found');
  });

  test('TCOV-16-006 — Reject access to booking record not belonging to user', async ({ page }) => {
    // Seed a booking owned by a DIFFERENT user, then try to read it as the customer.
    const email = `bkother_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Bk','Other','${email}','9800000000','${PW_HASH}','verified')`);
    const otherId = sql(`SELECT id FROM users WHERE email='${email}'`);
    const booking = seedRoomBooking(otherId);
    try {
      await loginAs(page, CUSTOMER.email, CUSTOMER.password);
      const resp = await page.request.get(`${ORDER_API}?action=get_order_details&order_id=${booking.id}`);
      const body = await resp.json();
      // The API scopes by user_id, so another user's booking is not returned.
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('Order not found');
    } finally {
      cleanupOrder(booking.ref);
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });

  test('TCOV-16-007 — Verify database or server error displays an error message', async ({ page }) => {
    // SHOULD: a DB/server error shows a user-facing error message. ACTUAL: my-bookings.php silently
    // falls back to an empty list (no error message). We simulate the failure by briefly renaming
    // the orders table; the page shows no error message → fails by design.
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    let renamed = false;
    try {
      sql('RENAME TABLE orders TO orders_f016bak');
      renamed = true;
      await page.goto(MYBOOKINGS);
      await expect(
        page.getByText(/unable to load|failed to load|error loading|something went wrong|could not load/i)
      ).toBeVisible({ timeout: 5000 });
    } finally {
      if (renamed) sql('RENAME TABLE orders_f016bak TO orders');
    }
  });

});
