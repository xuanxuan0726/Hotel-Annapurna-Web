// F009 Room Booking — TCOV-09-001 … 013 (Selenium / selenium-webdriver + Mocha).
//
// Mirrors tests/room-booking.spec.ts against api/create-booking.php (item_type='room'). This
// endpoint is properly implemented, so these assert its real behavior. Booking-creating tests use
// a throwaway room and clean it up. The rollback test (013) forces the INSERT to fail via a
// foreign-key violation: it logs in as a throwaway user, deletes that user (leaving the session's
// orders.user_id dangling), then books — the FK rejects the INSERT and the transaction rolls back.

const assert = require('assert');
const {
  CUSTOMER, PW_HASH, sql, buildDriver, loginAs, logout, apiPost, apiGet,
  createRoom, cleanupRoom, roomForm, API,
} = require('./helpers');

describe('F009 Room Booking', function () {
  let driver;
  before(async function () { driver = await buildDriver(); });
  after(async function () { if (driver) await driver.quit(); });

  it('TCOV-09-001 — Room booking is created successfully', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-01-01', '2099-01-03'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.ok(res.json.booking_id, 'expected booking_id');
      assert.ok(res.json.booking_reference, 'expected booking_reference');
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-09-002 — Reject booking and require login', async function () {
    await logout(driver);
    const res = await apiPost(driver, roomForm(1, 'x', '2099-01-01', '2099-01-03'));
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.json.success, false);
    assert.strictEqual(res.json.require_login, true);
  });

  it('TCOV-09-003 — Reject invalid request method', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiGet(driver, API);
    assert.strictEqual(res.status, 405);
    assert.ok(String(res.json.message).includes('Invalid request method'), res.json.message);
  });

  it('TCOV-09-004 — Reject incomplete booking details', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const form = roomForm(1, 'x', '2099-01-01', '2099-01-03');
    delete form.price; // price defaults to 0 → rejected
    const res = await apiPost(driver, form);
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Missing required booking information'), res.json.message);
  });

  it('TCOV-09-005 — Reject invalid booking type', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const form = roomForm(1, 'x', '2099-01-01', '2099-01-03');
    form.item_type = 'spaceship';
    const res = await apiPost(driver, form);
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Invalid booking type'), res.json.message);
  });

  it('TCOV-09-006 — Reject invalid room data format', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const form = roomForm(1, 'x', '2099-01-01', '2099-01-03');
    form.item_data = 'this-is-not-json';
    const res = await apiPost(driver, form);
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Invalid item data format'), res.json.message);
  });

  it('TCOV-09-007 — Reject booking when room does not exist', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, roomForm(999999, 'x', '2099-01-01', '2099-01-03'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Room not found'), res.json.message);
  });

  it('TCOV-09-008 — Reject booking when room status is not available', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const bookedId = sql(`SELECT id FROM rooms WHERE status='booked' LIMIT 1`);
    const res = await apiPost(driver, roomForm(bookedId, 'x', '2099-01-01', '2099-01-03'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('not available'), res.json.message);
  });

  it('TCOV-09-009 — Calculate booking duration correctly', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-01-01', '2099-01-04')); // 3 nights
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.strictEqual(sql(`SELECT quantity FROM orders WHERE id=${res.json.booking_id}`), '3');
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-09-010 — Calculate total price correctly', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-02-01', '2099-02-03', '1000')); // ×2 nights
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.strictEqual(res.json.total_amount, 2000);
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-09-011 — Generate booking reference successfully', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-03-01', '2099-03-02'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.ok(/^R\d{12,}$/.test(String(res.json.booking_reference)), res.json.booking_reference);
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-09-012 — Update room status to reserved after successful booking', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-04-01', '2099-04-02'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.strictEqual(sql(`SELECT status FROM rooms WHERE id=${room.id}`), 'reserved');
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-09-013 — Verify transaction rollback when booking creation fails', async function () {
    const email = `bookrb_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Book','Rollback','${email}','9800000000','${PW_HASH}','verified')`);
    const uid = sql(`SELECT id FROM users WHERE email='${email}'`);
    const room = createRoom();
    try {
      await loginAs(driver, email, 'Test1234');
      sql(`DELETE FROM users WHERE id=${uid}`); // dangling session user_id → FK violation on insert
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-05-01', '2099-05-03'));
      assert.strictEqual(res.json.success, false);
      assert.strictEqual(sql(`SELECT COUNT(*) FROM orders WHERE order_type='room' AND item_id=${room.id}`), '0');
      assert.strictEqual(sql(`SELECT status FROM rooms WHERE id=${room.id}`), 'available');
    } finally {
      cleanupRoom(room.id);
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });
});
