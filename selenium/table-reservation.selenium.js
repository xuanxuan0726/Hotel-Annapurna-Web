// F011 Table Reservation — TCOV-11-001 … 012 (Selenium / selenium-webdriver + Mocha).
//
// Mirrors tests/table-reservation.spec.ts against api/create-booking.php (item_type='table'). This
// endpoint is properly implemented, so these assert its real behavior. Reservation-creating tests
// use a throwaway table and clean it up. The rollback test (012) forces the INSERT to fail via a
// foreign-key violation (the session's user is deleted, leaving orders.user_id dangling).

const assert = require('assert');
const {
  CUSTOMER, PW_HASH, sql, buildDriver, loginAs, logout, apiPost, apiGet,
  createTable, cleanupTable, tableForm, API,
} = require('./helpers');

describe('F011 Table Reservation', function () {
  let driver;
  before(async function () { driver = await buildDriver(); });
  after(async function () { if (driver) await driver.quit(); });

  it('TCOV-11-001 — Table reservation is created successfully', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-01-01', '2099-01-02'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.ok(res.json.booking_id, 'expected booking_id');
      assert.ok(res.json.booking_reference, 'expected booking_reference');
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-11-002 — Reject reservation and require login', async function () {
    await logout(driver);
    const res = await apiPost(driver, tableForm(1, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.json.success, false);
    assert.strictEqual(res.json.require_login, true);
  });

  it('TCOV-11-003 — Reject invalid request method', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiGet(driver, API);
    assert.strictEqual(res.status, 405);
    assert.ok(String(res.json.message).includes('Invalid request method'), res.json.message);
  });

  it('TCOV-11-004 — Reject incomplete reservation details', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const form = tableForm(1, 'x', '2099-01-01', '2099-01-02');
    delete form.price;
    const res = await apiPost(driver, form);
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Missing required booking information'), res.json.message);
  });

  it('TCOV-11-005 — Reject invalid booking type', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const form = tableForm(1, 'x', '2099-01-01', '2099-01-02');
    form.item_type = 'spaceship';
    const res = await apiPost(driver, form);
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Invalid booking type'), res.json.message);
  });

  it('TCOV-11-006 — Reject invalid table data format', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const form = tableForm(1, 'x', '2099-01-01', '2099-01-02');
    form.item_data = 'this-is-not-json';
    const res = await apiPost(driver, form);
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Invalid item data format'), res.json.message);
  });

  it('TCOV-11-007 — Reject reservation when table does not exist', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const res = await apiPost(driver, tableForm(999999, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('Table not found'), res.json.message);
  });

  it('TCOV-11-008 — Reject reservation when table status is not available', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const bookedId = sql(`SELECT id FROM tables WHERE booking_status='booked' LIMIT 1`);
    const res = await apiPost(driver, tableForm(bookedId, 'x', '2099-01-01', '2099-01-02'));
    assert.strictEqual(res.json.success, false);
    assert.ok(String(res.json.message).includes('not available'), res.json.message);
  });

  it('TCOV-11-009 — Calculate reservation price correctly', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-02-01', '2099-02-01', '500')); // min 1 day
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.strictEqual(res.json.total_amount, 500);
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-11-010 — Generate reservation reference successfully', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-03-01', '2099-03-02'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.ok(/^T\d{12,}$/.test(String(res.json.booking_reference)), res.json.booking_reference);
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-11-011 — Update table status to reserved after successful reservation', async function () {
    await loginAs(driver, CUSTOMER.email, CUSTOMER.password);
    const table = createTable();
    try {
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-04-01', '2099-04-02'));
      assert.strictEqual(res.json.success, true, res.json.message);
      assert.strictEqual(sql(`SELECT booking_status FROM tables WHERE id=${table.id}`), 'reserved');
    } finally { cleanupTable(table.id); }
  });

  it('TCOV-11-012 — Roll back transaction and keep table status unchanged', async function () {
    const email = `tblrb_${Date.now()}@example.com`;
    sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Tbl','Rollback','${email}','9800000000','${PW_HASH}','verified')`);
    const uid = sql(`SELECT id FROM users WHERE email='${email}'`);
    const table = createTable();
    try {
      await loginAs(driver, email, 'Test1234');
      sql(`DELETE FROM users WHERE id=${uid}`); // dangling session user_id → FK violation on insert
      const res = await apiPost(driver, tableForm(table.id, table.table_no, '2099-05-01', '2099-05-02'));
      assert.strictEqual(res.json.success, false);
      assert.strictEqual(sql(`SELECT COUNT(*) FROM orders WHERE order_type='table' AND item_id=${table.id}`), '0');
      assert.strictEqual(sql(`SELECT booking_status FROM tables WHERE id=${table.id}`), 'available');
    } finally {
      cleanupTable(table.id);
      sql(`DELETE FROM users WHERE email='${email}'`);
    }
  });
});
