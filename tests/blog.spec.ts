const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F019 Blog Viewing — TCOV-19-001 … 006 for blogs.php (list) + blog-read.php (single).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). Several tests manipulate the shared `blogs` table
// (toggle status / insert draft / rename), so this spec must run isolated (--workers=1, one project).
//
// Reality: blogs.php lists only status='published' (good), but there is NO empty-state message, NO
// "not found" message (it redirects to blogs.php), blog-read.php does NOT filter by status (drafts
// are viewable by id — a real gap), and there is NO error handling on retrieval failure.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const BLOGS = `${BASE}/blogs.php`;
const READ = (id) => `${BASE}/blog-read.php?id=${id}`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const publishedId = () => sql(`SELECT id FROM blogs WHERE status='published' ORDER BY id LIMIT 1`);

test.describe('F019 Blog Viewing', () => {

  test('TCOV-19-001 — Blog list and selected blog details are displayed successfully', async ({ page }) => {
    await page.goto(BLOGS);
    await expect(page.locator('.blogs-grid')).toBeVisible();
    expect(await page.locator('.blogs-card').count()).toBeGreaterThan(0);
    // Selected blog details.
    await page.goto(READ(publishedId()));
    await expect(page.locator('.blog-hero-title')).toBeVisible();
  });

  test('TCOV-19-002 — Display no blog post available message', async ({ page }) => {
    // SHOULD: with no published posts, an empty-state message is shown. ACTUAL: blogs.php renders an
    // empty grid with no message. Fails by design. (Statuses are toggled then restored.)
    const ids = sql(`SELECT GROUP_CONCAT(id) FROM blogs WHERE status='published'`);
    try {
      sql(`UPDATE blogs SET status='draft' WHERE status='published'`);
      await page.goto(BLOGS);
      await expect(
        page.getByText(/no blog posts? available|no blogs|no posts available|check back/i)
      ).toBeVisible({ timeout: 5000 });
    } finally {
      if (ids) sql(`UPDATE blogs SET status='published' WHERE id IN (${ids})`);
    }
  });

  test('TCOV-19-003 — Display selected blog post details', async ({ page }) => {
    await page.goto(READ(publishedId()));
    await expect(page.locator('.blog-hero-title')).toBeVisible();
    await expect(page.locator('.blog-body')).toBeVisible();
  });

  test('TCOV-19-004 — Display blog post not found message', async ({ page }) => {
    // SHOULD: a non-existent post shows a "not found" message. ACTUAL: blog-read.php redirects to
    // blogs.php with no message. Fails by design.
    await page.goto(READ(999999));
    await expect(page.getByText(/blog post not found|not found|doesn't exist|does not exist/i)).toBeVisible({ timeout: 5000 });
  });

  test('TCOV-19-005 — Reject access to unpublished blog post', async ({ page }) => {
    // SHOULD: a draft/unpublished post cannot be viewed by id. ACTUAL: blog-read.php has no status
    // filter, so the draft is shown in full. Fails by design.
    sql(`INSERT INTO blogs (title, category, content, status) VALUES ('Draft Test Blog F019', 'Test', 'This is unpublished draft content.', 'draft')`);
    const id = sql(`SELECT id FROM blogs WHERE title='Draft Test Blog F019' ORDER BY id DESC LIMIT 1`);
    try {
      await page.goto(READ(id));
      // Access should be rejected (redirected away / not shown). Actual: the draft renders here.
      await expect(page).toHaveURL(/blogs\.php/, { timeout: 5000 });
    } finally {
      sql(`DELETE FROM blogs WHERE id=${id}`);
    }
  });

  test('TCOV-19-006 — Display error message when blog retrieval fails', async ({ page }) => {
    // SHOULD: a retrieval failure shows a user-facing error message. ACTUAL: no error handling — the
    // page crashes/blanks with no message. Simulated by briefly renaming the blogs table.
    let renamed = false;
    try {
      sql('RENAME TABLE blogs TO blogs_b019bak');
      renamed = true;
      await page.goto(BLOGS);
      await expect(
        page.getByText(/unable to load|failed to load|error loading|something went wrong|could not load/i)
      ).toBeVisible({ timeout: 5000 });
    } finally {
      if (renamed) sql('RENAME TABLE blogs_b019bak TO blogs');
    }
  });

});
