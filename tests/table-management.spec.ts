const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F024 Table Management — TCOV-24-001 … 018 for api/table-handler.php (admin-only).
//
// Tables have a booking_status column (available/booked/reserved/maintenance/occupied) and the
// admin API's add/update both accept booking_status, so the full lifecycle is implementable: set
// status on add, transition via update, and delete. Each test uses a throwaway table and cleans up.
// Run isolated/serial (writes to tables).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const TABLE_API = `${BASE}/api/table-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const tableNo = () => `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

async function addTable(page, booking_status = 'available') {
  const table_no = tableNo();
  const resp = await page.request.post(TABLE_API, {
    form: { action: 'add', table_no, price_main: '500', booking_status, total_chairs: '4', location: 'ground floor' },
  });
  const body = await resp.json();
  expect(body.success).toBe(true);
  return { id: body.id, table_no };
}
async function updateTable(page, t, { status, price = '500' }) {
  const resp = await page.request.post(TABLE_API, {
    form: { action: 'update', id: String(t.id), table_no: t.table_no, price_main: price, booking_status: status, total_chairs: '4', location: 'ground floor' },
  });
  expect((await resp.json()).success).toBe(true);
}
async function deleteTable(page, id) {
  const resp = await page.request.post(TABLE_API, { form: { action: 'delete', id: String(id) } });
  expect((await resp.json()).success).toBe(true);
}
const statusOf = (id) => sql(`SELECT booking_status FROM tables WHERE id=${id}`);
const priceOf = (id) => sql(`SELECT price_main FROM tables WHERE id=${id}`);
const countOf = (id) => sql(`SELECT COUNT(*) FROM tables WHERE id=${id}`);
const cleanup = (id) => sql(`DELETE FROM tables WHERE id=${id}`);

test.describe('F024 Table Management', () => {

  test('TCOV-24-001 — Admin adds a new table and sets it as available', async ({ page }) => {
    const t = await addTable(page, 'available');
    try { expect(statusOf(t.id)).toBe('available'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-002 — Available table is reserved', async ({ page }) => {
    const t = await addTable(page, 'available');
    try { await updateTable(page, t, { status: 'reserved' }); expect(statusOf(t.id)).toBe('reserved'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-003 — Available table is marked as under maintenance', async ({ page }) => {
    const t = await addTable(page, 'available');
    try { await updateTable(page, t, { status: 'maintenance' }); expect(statusOf(t.id)).toBe('maintenance'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-004 — Available table details are updated', async ({ page }) => {
    const t = await addTable(page, 'available');
    try {
      await updateTable(page, t, { status: 'available', price: '750' });
      expect(priceOf(t.id)).toBe('750.00');
      expect(statusOf(t.id)).toBe('available');
    } finally { cleanup(t.id); }
  });

  test('TCOV-24-005 — Available table is deleted/removed', async ({ page }) => {
    const t = await addTable(page, 'available');
    try { await deleteTable(page, t.id); expect(countOf(t.id)).toBe('0'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-006 — Reserved table becomes occupied when customer arrives', async ({ page }) => {
    const t = await addTable(page, 'reserved');
    try { await updateTable(page, t, { status: 'occupied' }); expect(statusOf(t.id)).toBe('occupied'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-007 — Reserved table becomes available again when reservation is cancelled', async ({ page }) => {
    const t = await addTable(page, 'reserved');
    try { await updateTable(page, t, { status: 'available' }); expect(statusOf(t.id)).toBe('available'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-008 — Reserved table details are updated', async ({ page }) => {
    const t = await addTable(page, 'reserved');
    try {
      await updateTable(page, t, { status: 'reserved', price: '850' });
      expect(priceOf(t.id)).toBe('850.00');
      expect(statusOf(t.id)).toBe('reserved');
    } finally { cleanup(t.id); }
  });

  test('TCOV-24-009 — Occupied table becomes available when dining is completed', async ({ page }) => {
    const t = await addTable(page, 'occupied');
    try { await updateTable(page, t, { status: 'available' }); expect(statusOf(t.id)).toBe('available'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-010 — Occupied table is marked as under maintenance when an issue is reported', async ({ page }) => {
    const t = await addTable(page, 'occupied');
    try { await updateTable(page, t, { status: 'maintenance' }); expect(statusOf(t.id)).toBe('maintenance'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-011 — Occupied table details are updated', async ({ page }) => {
    const t = await addTable(page, 'occupied');
    try {
      await updateTable(page, t, { status: 'occupied', price: '950' });
      expect(priceOf(t.id)).toBe('950.00');
      expect(statusOf(t.id)).toBe('occupied');
    } finally { cleanup(t.id); }
  });

  test('TCOV-24-012 — Table under maintenance has its details updated', async ({ page }) => {
    const t = await addTable(page, 'maintenance');
    try {
      await updateTable(page, t, { status: 'maintenance', price: '450' });
      expect(priceOf(t.id)).toBe('450.00');
      expect(statusOf(t.id)).toBe('maintenance');
    } finally { cleanup(t.id); }
  });

  test('TCOV-24-013 — Table under maintenance becomes available after maintenance is completed', async ({ page }) => {
    const t = await addTable(page, 'maintenance');
    try { await updateTable(page, t, { status: 'available' }); expect(statusOf(t.id)).toBe('available'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-014 — Table under maintenance is deleted/removed', async ({ page }) => {
    const t = await addTable(page, 'maintenance');
    try { await deleteTable(page, t.id); expect(countOf(t.id)).toBe('0'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-015 — Updated table is saved as available', async ({ page }) => {
    const t = await addTable(page, 'reserved');
    try { await updateTable(page, t, { status: 'available' }); expect(statusOf(t.id)).toBe('available'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-016 — Updated table is saved as reserved', async ({ page }) => {
    const t = await addTable(page, 'available');
    try { await updateTable(page, t, { status: 'reserved' }); expect(statusOf(t.id)).toBe('reserved'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-017 — Updated table is saved as under maintenance', async ({ page }) => {
    const t = await addTable(page, 'available');
    try { await updateTable(page, t, { status: 'maintenance' }); expect(statusOf(t.id)).toBe('maintenance'); } finally { cleanup(t.id); }
  });

  test('TCOV-24-018 — Updated table is deleted/removed', async ({ page }) => {
    const t = await addTable(page, 'available');
    try {
      await updateTable(page, t, { status: 'available', price: '650' });
      await deleteTable(page, t.id);
      expect(countOf(t.id)).toBe('0');
    } finally { cleanup(t.id); }
  });

});
