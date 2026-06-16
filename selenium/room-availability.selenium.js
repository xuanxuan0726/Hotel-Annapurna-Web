// F008 Room Availability Checking — TCOV-08-001 … 009 (Selenium / selenium-webdriver + Mocha).
//
// Mirrors tests/room-availability.spec.ts. Availability is enforced only by api/create-booking.php
// (login required): it checks room existence + status==='available'. There is NO date validation
// and NO date-range overlap detection, so TCOV-08-003/004/005 assert the behavior that SHOULD
// exist and FAIL by design — surfacing the gaps (consistent with the IV&V "fail-if-missing" rule).

const assert = require('assert');
const {
  ROOMS, CUSTOMER, sql, userId, buildDriver, loginAs, apiPost,
  createRoom, cleanupRoom, roomForm, By,
} = require('./helpers');

const USER_ID = userId(CUSTOMER.email);

describe('F008 Room Availability Checking', function () {
  let driver;
  before(async function () { driver = await buildDriver(); });
  after(async function () { if (driver) await driver.quit(); });

  it('TCOV-08-001 — Verify room does not exist', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, roomForm(999999, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Room not found'), res.json.message);
  });

  it('TCOV-08-002 — Verify room exists but is not available', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const bookedId = sql(`SELECT id FROM rooms WHERE status='booked' LIMIT 1`);
    const res = await apiPost(driver, roomForm(bookedId, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('not available'), res.json.message);
  });

  it('TCOV-08-003 — Verify invalid check-in date [gap: no date validation]', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2020-01-01', '2020-01-03'));
      assert.strictEqual(res.json.success, false); // SHOULD reject a past check-in date
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-08-004 — Verify invalid check-out date [gap: no date validation]', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-05-10', '2099-05-01'));
      assert.strictEqual(res.json.success, false); // SHOULD reject check-out before check-in
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-08-005 — Verify room already booked [gap: no overlap detection]', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const notes = JSON.stringify({ check_in: '2099-06-01', check_out: '2099-06-03' }).replace(/"/g, '\\"');
      sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, booking_reference, status, notes) VALUES (${USER_ID},'room',${room.id},'Test Room',2,2000,'TESTREF${Date.now()}','pending','${notes}')`);
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-06-01', '2099-06-03'));
      assert.strictEqual(res.json.success, false); // SHOULD reject as already booked for those dates
    } finally { cleanupRoom(room.id); }
  });

  it('TCOV-08-006 — Verify available room is displayed', async function () {
    await driver.get(ROOMS);
    const badges = await driver.findElements(By.css('.rooms-status-badge'));
    let found = false;
    for (const b of badges) { if (/Available/i.test(await b.getText())) { found = true; break; } }
    assert.ok(found, 'expected at least one "Available" room badge on rooms.php');
  });

  it('TCOV-08-007 — Verify invalid room selection is rejected', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, roomForm(0, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
  });

  it('TCOV-08-008 — Verify error message is displayed for invalid availability checking', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, roomForm(999999, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message || '').length > 0, 'expected a non-empty error message');
  });

  it('TCOV-08-009 — Verify user can proceed to room booking when room is available', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const room = createRoom();
    try {
      const res = await apiPost(driver, roomForm(room.id, room.room_no, '2099-07-01', '2099-07-03'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.ok(res.json.booking_id, 'expected a booking_id to proceed to payment');
    } finally { cleanupRoom(room.id); }
  });
});
