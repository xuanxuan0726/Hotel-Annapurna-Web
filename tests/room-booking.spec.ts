const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F009 Room Booking — TCOV-09-001 … 013 for api/create-booking.php.
//
// This endpoint is properly implemented, so these tests assert its real behavior. Each test that
// creates a booking uses a throwaway room and cleans it up (the booking reserves the room and
// inserts an orders row). The rollback test (013) forces the INSERT to fail via a foreign-key
// violation (the session's user is deleted, leaving orders.user_id dangling).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const API = `${BASE}/api/create-booking.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';
// bcrypt hash of 'Test1234' (for the throwaway rollback user).
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };

function createRoom() {
  const room_no = `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO rooms (room_no, room_type, total_beds, status, price) VALUES ('${room_no}','single',1,'available',1000.00)`);
  return { id: sql(`SELECT id FROM rooms WHERE room_no='${room_no}'`), room_no };
}
function cleanupRoom(id) {
  sql(`DELETE FROM orders WHERE order_type='room' AND item_id=${id}`);
  sql(`DELETE FROM rooms WHERE id=${id}`);
}

async function loginAs(page, email, password) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

const validForm = (id, room_no, check_in, check_out, price = '1000') => ({
  item_type: 'room',
  item_id: String(id),
  item_data: JSON.stringify({ room_no, room_type: 'single' }),
  price,
  check_in,
  check_out,
});

test.describe('F009 Room Booking', () => {

  test('TCOV-09-001 — Room booking is created successfully', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const resp = await page.request.post(API, { form: validForm(room.id, room.room_no, '2099-01-01', '2099-01-03') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(body.booking_id).toBeTruthy();
      expect(body.booking_reference).toBeTruthy();
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-09-002 — Reject booking and require login', async ({ page }) => {
    // No login → the API rejects with 401 and require_login.
    const resp = await page.request.post(API, { form: validForm(1, 'x', '2099-01-01', '2099-01-03') });
    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(body.require_login).toBe(true);
  });

  test('TCOV-09-003 — Reject invalid request method', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const resp = await page.request.get(API);
    expect(resp.status()).toBe(405);
    const body = await resp.json();
    expect(String(body.message)).toContain('Invalid request method');
  });

  test('TCOV-09-004 — Reject incomplete booking details', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const form = validForm(1, 'x', '2099-01-01', '2099-01-03');
    delete form.price; // price defaults to 0 → rejected
    const resp = await page.request.post(API, { form });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Missing required booking information');
  });

  test('TCOV-09-005 — Reject invalid booking type', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const form = validForm(1, 'x', '2099-01-01', '2099-01-03');
    form.item_type = 'spaceship';
    const resp = await page.request.post(API, { form });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid booking type');
  });

  test('TCOV-09-006 — Reject invalid room data format', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const form = validForm(1, 'x', '2099-01-01', '2099-01-03');
    form.item_data = 'this-is-not-json';
    const resp = await page.request.post(API, { form });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid item data format');
  });

  test('TCOV-09-007 — Reject booking when room does not exist', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const resp = await page.request.post(API, { form: validForm(999999, 'x', '2099-01-01', '2099-01-03') });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Room not found');
  });

  test('TCOV-09-008 — Reject booking when room status is not available', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const bookedId = sql(`SELECT id FROM rooms WHERE status='booked' LIMIT 1`);
    const resp = await page.request.post(API, { form: validForm(bookedId, 'x', '2099-01-01', '2099-01-03') });
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('not available');
  });

  test('TCOV-09-009 — Calculate booking duration correctly', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      // 2099-01-01 → 2099-01-04 = 3 nights.
      const resp = await page.request.post(API, { form: validForm(room.id, room.room_no, '2099-01-01', '2099-01-04') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      const quantity = sql(`SELECT quantity FROM orders WHERE id=${body.booking_id}`);
      expect(quantity).toBe('3');
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-09-010 — Calculate total price correctly', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      // price 1000 × 2 nights = 2000.
      const resp = await page.request.post(API, { form: validForm(room.id, room.room_no, '2099-02-01', '2099-02-03', '1000') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(body.total_amount).toBe(2000);
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-09-011 — Generate booking reference successfully', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const resp = await page.request.post(API, { form: validForm(room.id, room.room_no, '2099-03-01', '2099-03-02') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      // R + Ymd(8) + zero-padded user id + rand(4).
      expect(String(body.booking_reference)).toMatch(/^R\d{12,}$/);
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-09-012 — Update room status to reserved after successful booking', async ({ page }) => {
    await loginAs(page, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const resp = await page.request.post(API, { form: validForm(room.id, room.room_no, '2099-04-01', '2099-04-02') });
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(sql(`SELECT status FROM rooms WHERE id=${room.id}`)).toBe('reserved');
    } finally {
      cleanupRoom(room.id);
    }
  });

  test('TCOV-09-013 — Verify transaction rollback when booking creation fails', async ({ page }) => {
    // Force the INSERT to fail via a foreign-key violation: log in as a throwaway user, delete
    // that user (so the session's user_id no longer references a users row), then book. The
    // orders.user_id FK rejects the INSERT → the transaction rolls back: no order, room unchanged.
    const email = `bookrb_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Book','Rollback','${email}','9800000000','${PW_HASH}','verified')`);
    const uid = sql(`SELECT id FROM users WHERE email='${email}'`);
    const room = createRoom();
    try {
      await loginAs(page, email, 'Test1234');
      sql(`DELETE FROM users WHERE id=${uid}`); // dangling session user_id
      const resp = await page.request.post(API, { form: validForm(room.id, room.room_no, '2099-05-01', '2099-05-03') });
      const body = await resp.json();
      expect(body.success).toBe(false);
      // Rollback verified: no order row, and the room was not flipped to 'reserved'.
      expect(sql(`SELECT COUNT(*) FROM orders WHERE order_type='room' AND item_id=${room.id}`)).toBe('0');
      expect(sql(`SELECT status FROM rooms WHERE id=${room.id}`)).toBe('available');
    } finally {
      cleanupRoom(room.id);
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });

});
