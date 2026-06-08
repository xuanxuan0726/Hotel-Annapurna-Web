const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F006 Browse Food Menu — TCOV-06-024 … 033 for the public menu.php page.
//
// menu.php server-renders three category tables (Vegetarian Delights / Non-Vegetarian
// Specialties / Chef's Special) from food_items, with cumulative pagination (see-more/see-less
// links, 5 per page) and an inline-JS selection panel (#menu-selected-table + #menu-total-price).
// There are no category filter controls — the categories are three always-rendered sections.
// No emails are involved. The mysql.exe helper grounds a few assertions in the real data and
// powers the empty-state backup/restore.

const MENU = 'http://localhost/Hotel-Annapurna-Web/menu.php';
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

// Locate one of the three category sections by its visible title.
const section = (page, title) => page.locator('.menu-section', { hasText: title });
const rowsOf = (sectionLoc) => sectionLoc.locator('.menu-table tbody tr');

test.describe('F006 Browse Food Menu', () => {

  test('TCOV-06-024 — Browse Food Menu Main Flow', async ({ page }) => {
    await page.goto(MENU);
    await expect(page.locator('.menu-container')).toBeVisible();
    await expect(page.locator('.menu-section')).toHaveCount(3);
    expect(await page.locator('.menu-checkbox').count()).toBeGreaterThan(0);
    await expect(page.locator('.selected-items-container')).toBeVisible();
  });

  test('TCOV-06-025 — No food item available', async ({ page }) => {
    // The page has no empty-state UI, so simulate "no food" by briefly emptying the shared
    // food_items table — backed up and restored so no data is lost.
    sql('CREATE TABLE food_items_bak AS SELECT * FROM food_items');
    try {
      sql('DELETE FROM food_items');
      await page.goto(MENU);
      // No food rows render and no pagination button appears.
      await expect(page.locator('.menu-checkbox')).toHaveCount(0);
      await expect(page.locator('.see-more-btn')).toHaveCount(0);
    } finally {
      sql('INSERT INTO food_items SELECT * FROM food_items_bak');
      sql('DROP TABLE food_items_bak');
    }
  });

  test('TCOV-06-026 — Browse vegetarian food items', async ({ page }) => {
    await page.goto(MENU);
    const veg = section(page, 'Vegetarian Delights');
    await expect(veg).toBeVisible();
    expect(await rowsOf(veg).count()).toBeGreaterThan(0);
  });

  test('TCOV-06-027 — Browse non-vegetarian food items', async ({ page }) => {
    await page.goto(MENU);
    const nonveg = section(page, 'Non-Vegetarian Specialties');
    await expect(nonveg).toBeVisible();
    expect(await rowsOf(nonveg).count()).toBeGreaterThan(0);
  });

  test('TCOV-06-028 — Browse chef’s special food items', async ({ page }) => {
    await page.goto(MENU);
    const special = section(page, "Chef's Special");
    await expect(special).toBeVisible();
    expect(await rowsOf(special).count()).toBeGreaterThan(0);
    // Special section has the extra "Available On" column.
    await expect(special.locator('th', { hasText: 'Available On' })).toBeVisible();
  });

  test('TCOV-06-029 — Display more food items', async ({ page }) => {
    await page.goto(MENU);
    const veg = section(page, 'Vegetarian Delights');
    const before = await rowsOf(veg).count(); // 5 on page 1
    await veg.locator('.see-more-btn').click();
    const after = await rowsOf(section(page, 'Vegetarian Delights')).count();
    expect(after).toBeGreaterThan(before);
  });

  test('TCOV-06-030 — Display fewer food items', async ({ page }) => {
    await page.goto(`${MENU}?veg_page=2`); // 10 veg rows shown
    const veg = section(page, 'Vegetarian Delights');
    const before = await rowsOf(veg).count();
    await veg.locator('.see-less-btn').click();
    const after = await rowsOf(section(page, 'Vegetarian Delights')).count();
    expect(after).toBeLessThan(before);
  });

  test('TCOV-06-031 — Verify food details are displayed correctly', async ({ page }) => {
    await page.goto(MENU);
    const firstRow = rowsOf(section(page, 'Vegetarian Delights')).first();
    const name = (await firstRow.locator('.menu-item-name').innerText()).trim();
    const displayedPrice = (await firstRow.locator('.price-column').innerText()).trim();
    // Cross-check the displayed price against the database value for that item.
    const dbPrice = sql(`SELECT price FROM food_items WHERE food_name='${name.replace(/'/g, "''")}' LIMIT 1`);
    const expected = `RS ${Number(dbPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    expect(displayedPrice).toBe(expected);
  });

  test('TCOV-06-032 — Verify selected item appears in selected items section', async ({ page }) => {
    await page.goto(MENU);
    const firstRow = rowsOf(section(page, 'Vegetarian Delights')).first();
    const name = (await firstRow.locator('.menu-item-name').innerText()).trim();
    await firstRow.locator('.menu-checkbox').check();
    const selected = page.locator('#menu-selected-table tbody tr');
    await expect(selected).toHaveCount(1);
    await expect(selected.locator('.menu-item-name')).toHaveText(name);
  });

  test('TCOV-06-033 — Verify total price updates after item selection', async ({ page }) => {
    await page.goto(MENU);
    await expect(page.locator('#menu-total-price')).toHaveText('RS 0.00');
    const firstRow = rowsOf(section(page, 'Vegetarian Delights')).first();
    const price = Number(await firstRow.locator('.menu-checkbox').getAttribute('data-price'));
    await firstRow.locator('.menu-checkbox').check();
    await expect(page.locator('#menu-total-price')).toHaveText(`RS ${price.toFixed(2)}`);
  });

});
