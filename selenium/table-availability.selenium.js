// F010 Table Availability Checking — TCOV-10-001 … 009 (Selenium / selenium-webdriver + Mocha).
//
// Mirrors tests/table-availability.spec.ts. Availability is enforced only by api/create-booking.php
// (login required): table existence + booking_status==='available'. There is NO reservation-date
// validation, NO reservation-time concept, and NO overlap detection, so TCOV-10-003/004/005 assert
// the behavior that SHOULD exist and FAIL by design.

const assert = require('assert');
const {
  TABLES, CUSTOMER, sql, userId, buildDriver, loginAs, apiPost,
  createTable, cleanupTable, tableForm, By,
} = require('./helpers');

const USER_ID = userId(CUSTOMER.email);

describe('F010 Table Availability Checking', function () {
  let driver;
  before(async function () { driver = await buildDriver(); });
  after(async function () { if (driver) await driver.quit(); });

  it('TCOV-10-001 — Verify table does not exist', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, tableForm(999999, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Table not found'), res.json.message);
  });

  it('TCOV-10-002 — Verify table exists but is not available', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const bookedId = sql(`SELECT id FROM tables WHERE booking_status='booked' LIMIT 1`);
    const res = await apiPost(driver, tableForm(bookedId, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('not available'), res.json.message);
  });

  it('TCOV-10-003 — Verify invalid reservation date [gap: no date validation]', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2020-01-01', '2020-01-02'));
      assert.strictEqual(res.json.success, false); // SHOULD reject a past reservation date
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-10-004 — Verify invalid reservation time [gap: no time concept]', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const form = tableForm(table.id, table.table_no, '2099-01-01', '2099-01-02');
      form.reservation_time = '99:99';
      const res = await apiPost(driver, form);
      assert.strictEqual(res.json.success, false); // SHOULD reject an invalid reservation time
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-10-005 — Verify table already reserved [gap: no overlap detection]', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const notes = JSON.stringify({ check_in: '2099-06-01', check_out: '2099-06-01' }).replace(/"/g, '\\"');
      sql(`INSERT INTO orders (user_id, order_type, item_id, item_name, quantity, price, booking_reference, status, notes) VALUES (${USER_ID},'table',${table.id},'Test Table',1,500,'TESTREF${Date.now()}','pending','${notes}')`);
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-06-01', '2099-06-01'));
      assert.strictEqual(res.json.success, false); // SHOULD reject as already reserved
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-10-006 — Verify available table is displayed', async function () {
    await driver.get(TABLES);
    const badges = await driver.findElements(By.css('.tables-status-badge'));
    let found = false;
    for (const b of badges) { if (/Available/i.test(await b.getText())) { found = true; break; } }
    assert.ok(found, 'expected at least one "Available" table badge on tables.php');
  });

  it('TCOV-10-007 — Verify invalid table selection is rejected', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, tableForm(0, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
  });

  it('TCOV-10-008 — Verify error message is displayed for invalid table availability checking', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, tableForm(999999, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message || '').length > 0, 'expected a non-empty error message');
  });

  it('TCOV-10-009 — Verify user can proceed to table reservation when table is available', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-07-01', '2099-07-02'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.ok(res.json.booking_id, 'expected a booking_id');
    } finally { cleanupTable(table.id); }
  });
});
