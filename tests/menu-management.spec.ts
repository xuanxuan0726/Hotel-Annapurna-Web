const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F022 Food/Menu Management — TCOV-22-001 … 017 for api/menu-handler.php (admin-only).
//
// The admin menu API implements only add / update / delete. food_items has NO status/availability/
// archived column, so the available/unavailable/archived lifecycle does not exist. Per the user,
// this suite tests the implemented CRUD operations (passing) and SKIPS the availability/archive-
// specific cases with a reason. Run isolated/serial (it writes to food_items).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const MENU_API = `${BASE}/api/menu-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const uniqueName = () => `F022TEST_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

async function adminLogin(page) {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
}

const NOT_IMPLEMENTED =
  'Availability/archive lifecycle not implemented: food_items has no status column and ' +
  'api/menu-handler.php has no availability-toggle / archive / restore action.';

// Add a food item via the admin API; returns its id.
async function addItem(page, { category = 'veg', name, price = '100' }) {
  const resp = await page.request.post(MENU_API, {
    form: { action: 'add', category, food_name: name, price, short_description: 'F022 test item' },
  });
  const body = await resp.json();
  expect(body.success).toBe(true);
  return body.id;
}
const cleanup = (name) => sql(`DELETE FROM food_items WHERE food_name LIKE '${name}%'`);

test.describe('F022 Food/Menu Management', () => {

  // ---------- Implemented CRUD (passing) ----------

  test('TCOV-22-001 — Admin adds a new food item (availability state n/a)', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    try {
      const id = await addItem(page, { category: 'veg', name });
      expect(sql(`SELECT food_name FROM food_items WHERE id=${id}`)).toBe(name);
    } finally {
      cleanup(name);
    }
  });

  test('TCOV-22-002 — Admin adds another new food item (unavailable state n/a)', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    try {
      const id = await addItem(page, { category: 'non-veg', name });
      expect(sql(`SELECT category FROM food_items WHERE id=${id}`)).toBe('non-veg');
    } finally {
      cleanup(name);
    }
  });

  test('TCOV-22-004 — Food item details are updated', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    try {
      const id = await addItem(page, { category: 'veg', name });
      const resp = await page.request.post(MENU_API, {
        form: { action: 'update', id: String(id), category: 'veg', food_name: name, price: '250', short_description: 'updated' },
      });
      expect((await resp.json()).success).toBe(true);
      expect(sql(`SELECT price FROM food_items WHERE id=${id}`)).toBe('250.00');
    } finally {
      cleanup(name);
    }
  });

  test('TCOV-22-006 — Food item is deleted/removed', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    try {
      const id = await addItem(page, { category: 'veg', name });
      const resp = await page.request.post(MENU_API, { form: { action: 'delete', id: String(id) } });
      expect((await resp.json()).success).toBe(true);
      expect(sql(`SELECT COUNT(*) FROM food_items WHERE id=${id}`)).toBe('0');
    } finally {
      cleanup(name);
    }
  });

  test('TCOV-22-008 — Food item details are updated (variant)', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    const newName = `${name}_renamed`;
    try {
      const id = await addItem(page, { category: 'non-veg', name });
      const resp = await page.request.post(MENU_API, {
        form: { action: 'update', id: String(id), category: 'non-veg', food_name: newName, price: '300' },
      });
      expect((await resp.json()).success).toBe(true);
      expect(sql(`SELECT food_name FROM food_items WHERE id=${id}`)).toBe(newName);
    } finally {
      cleanup(name);
    }
  });

  test('TCOV-22-010 — Food item is deleted/removed (variant)', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    try {
      const id = await addItem(page, { category: 'special', name });
      await page.request.post(MENU_API, { form: { action: 'delete', id: String(id) } });
      expect(sql(`SELECT COUNT(*) FROM food_items WHERE id=${id}`)).toBe('0');
    } finally {
      cleanup(name);
    }
  });

  test('TCOV-22-014 — Updated food item is deleted/removed', async ({ page }) => {
    await adminLogin(page);
    const name = uniqueName();
    try {
      const id = await addItem(page, { category: 'veg', name });
      await page.request.post(MENU_API, { form: { action: 'update', id: String(id), category: 'veg', food_name: name, price: '199' } });
      await page.request.post(MENU_API, { form: { action: 'delete', id: String(id) } });
      expect(sql(`SELECT COUNT(*) FROM food_items WHERE id=${id}`)).toBe('0');
    } finally {
      cleanup(name);
    }
  });

  // ---------- Availability / archive lifecycle — NOT IMPLEMENTED (skipped) ----------

  test('TCOV-22-003 — Available food item is marked as unavailable', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-005 — Available food item is archived', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-007 — Unavailable food item is marked as available', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-009 — Unavailable food item is archived', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-011 — Updated food item is saved as available', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-012 — Updated food item is saved as unavailable', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-013 — Updated food item is saved as archived', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-015 — Archived food item is restored as available', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-016 — Archived food item is restored as unavailable', async () => { test.skip(true, NOT_IMPLEMENTED); });
  test('TCOV-22-017 — Archived food item is deleted/removed', async () => { test.skip(true, NOT_IMPLEMENTED); });

});
