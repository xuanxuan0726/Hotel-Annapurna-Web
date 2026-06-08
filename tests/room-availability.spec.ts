const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F008 Room Availability Checking — TCOV-08-010 … 018.
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red) to surface the gap.
//
// Reality: room "availability" is only checked by api/create-booking.php (login required),
// which validates room existence + status==='available'. There is NO date validation (past
// dates / check-out before check-in are accepted) and NO date-range overlap detection.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ROOMS = `${BASE}/rooms.php`;
const API = `${BASE}/api/create-booking.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);

// Create a throwaway available room; returns its id and room_no. Caller must cleanup().
function createRoom() {
  const room_no = `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO rooms (room_no, room_type, total_beds, status, price) VALUES ('${room_no}','single',1,'available',1000.00)`);
  const id = sql(`SELECT id FROM rooms WHERE room_no='${room_no}'`);
  return { id, room_no };
}
function cleanupRoom(id) {
  sql(`DELETE FROM orders WHERE order_type='room' AND item_id=${id}`);
  sql(`DELETE FROM rooms WHERE id=${id}`);
}

async function login(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

// POST a room booking through the availability/booking API (shares the page's session cookie).
function bookRoom(page, { id, room_no = 'TST', check_in, check_out }) {
  const form = {
    item_type: 'room',
    item_id: String(id),
    item_data: JSON.stringify({ room_no, room_type: 'single' }),
    price: '1000',
  };
  if (check_in !== undefined) form.check_in = check_in;
  if (check_out !== undefined) form.check_out = check_out;
  return page.request.post(API, { form });
}

test.describe('F008 Room Availability Checking', () => {

  test('TCOV-08-010 — Verify room does not exist', async ({ page }) => {
    await login(page);
    const resp = await bookRoom(page, { id: 999999, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Room not found');
  });

  test('TCOV-08-011 — Verify room exists but is not available', async ({ page }) => {
    await login(page);
    const bookedId = sql(`SELECT id FROM rooms WHERE status='booked' LIMIT 1`);
    const resp = await bookRoom(page, { id: bookedId, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('not available');
  });

  test('TCOV-08-012 — Verify invalid check-in date', async ({ page }) => {
    // SHOULD: a check-in date in the past is rejected. ACTUAL: no date validation — the booking
    // is created. Fails by design, exposing the missing check-in validation.
    await login(page);
    const room = createRoom();
    try {
      const resp = await bookRoom(page, { id: room.id, room_no: room.room_no, check_in: '2020-01-01', check_out: '2020-01-03' });
      const body = await resp.json();
      expect(body.success).toBe(false);
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-08-013 — Verify invalid check-out date', async ({ page }) => {
    // SHOULD: a check-out date before the check-in date is rejected. ACTUAL: duration is taken
    // as an absolute diff (min 1) and the booking is created. Fails by design.
    await login(page);
    const room = createRoom();
    try {
      const resp = await bookRoom(page, { id: room.id, room_no: room.room_no, check_in: '2099-05-10', check_out: '2099-05-01' });
      const body = await resp.json();
      expect(body.success).toBe(false);
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-08-014 — Verify room already booked', async ({ page }) => {
    // SHOULD: a room already booked for the requested dates cannot be booked again. ACTUAL: there
    // is no date-range overlap detection, so a second booking for the same room+dates succeeds.
    // Fails by design. (The room is kept 'available' so the status flag doesn't mask the gap.)
    await login(page);
    const room = createRoom();
    try {
      // Existing booking for these exact dates.
      const notes = JSON.stringify({ check_in: '2099-06-01', check_out: '2099-06-03' }).replace(/"/g, '\\"');
      sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, booking_reference, status, notes) VALUES (${USER_ID},'room',${room.id},'Test Room',2,2000,'TESTREF${Date.now()}','pending','${notes}')`);
      const resp = await bookRoom(page, { id: room.id, room_no: room.room_no, check_in: '2099-06-01', check_out: '2099-06-03' });
      const body = await resp.json();
      expect(body.success).toBe(false); // should be rejected as already booked
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-08-015 — Verify available room is displayed', async ({ page }) => {
    await page.goto(ROOMS);
    await expect(page.locator('.rooms-status-badge', { hasText: 'Available' }).first()).toBeVisible();
  });

  test('TCOV-08-016 — Verify invalid room selection is rejected', async ({ page }) => {
    await login(page);
    // An invalid room id (0) is rejected before any booking is created.
    const resp = await bookRoom(page, { id: 0, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
  });

  test('TCOV-08-017 — Verify error message is displayed for invalid availability checking', async ({ page }) => {
    await login(page);
    const resp = await bookRoom(page, { id: 999999, check_in: '2099-01-01', check_out: '2099-01-02' });
    const body = await resp.json();
    expect(body.success).toBe(false);
    // A non-empty, human-readable error message is returned for the failed availability check.
    expect(String(body.message || '').length).toBeGreaterThan(0);
  });

  test('TCOV-08-018 — Verify user can proceed to room booking when room is available', async ({ page }) => {
    await login(page);
    const room = createRoom();
    try {
      const resp = await bookRoom(page, { id: room.id, room_no: room.room_no, check_in: '2099-07-01', check_out: '2099-07-03' });
      const body = await resp.json();
      expect(body.success).toBe(true);
      // booking_id is what the UI uses to proceed to payment.php.
      expect(body.booking_id).toBeTruthy();
    } finally {
      cleanupRoom(room.id);
    }
  });

});
