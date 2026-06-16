const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F029 Blog Management — TCOV-29-001 … 009 for api/admin-blogs.php (admin add/update/delete).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). The add action validates required fields but does
// NO image type/size validation (it moves any uploaded file), so the invalid-image case (004) fails
// by design. Run isolated/serial (writes blogs).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ADMIN_BLOGS = `${BASE}/api/admin-blogs.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const title = () => `F029TEST_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

const post = (page, form) => page.request.post(ADMIN_BLOGS, { form }).then((r) => r.json());
async function addBlog(page, t, { status = 'published', content = 'Some blog content body.' } = {}) {
  const body = await post(page, { action: 'add', title: t, category: 'Test', content, status, tags: 'a,b' });
  expect(body.success).toBe(true);
  return body.id;
}
const statusOf = (id) => sql(`SELECT status FROM blogs WHERE id=${id}`);
const cleanupTitle = (t) => sql(`DELETE FROM blogs WHERE title='${t}'`);

test.describe('F029 Blog Management', () => {

  test('TCOV-29-001 — Blog post is created successfully', async ({ page }) => {
    const t = title();
    try {
      const id = await addBlog(page, t);
      expect(sql(`SELECT title FROM blogs WHERE id=${id}`)).toBe(t);
    } finally { cleanupTitle(t); }
  });

  test('TCOV-29-002 — Reject unauthorized user access', async ({ page }) => {
    await page.context().clearCookies(); // drop the admin session
    const body = await post(page, { action: 'add', title: 'x', category: 'Test', content: 'y' });
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Unauthorized');
  });

  test('TCOV-29-003 — Reject incomplete blog submission', async ({ page }) => {
    // Missing content → rejected.
    const body = await post(page, { action: 'add', title: title(), category: 'Test', content: '' });
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Content is required');
  });

  test('TCOV-29-004 — Reject invalid image upload', async ({ page }) => {
    // SHOULD: a non-image upload is rejected. ACTUAL: admin-blogs does no image type/size check — it
    // moves any file and creates the blog. Fails by design.
    const t = title();
    let id = 0;
    try {
      const resp = await page.request.post(ADMIN_BLOGS, {
        multipart: {
          action: 'add', title: t, category: 'Test', content: 'body', status: 'published',
          featured_image: { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') },
        },
      });
      const body = await resp.json();
      id = body.id || 0;
      expect(body.success).toBe(false);
    } finally {
      if (id) await post(page, { action: 'delete', id: String(id) }); // removes blog + uploaded file
      cleanupTitle(t);
    }
  });

  test('TCOV-29-005 — Blog post is updated successfully', async ({ page }) => {
    const t = title();
    const t2 = `${t}_upd`;
    try {
      const id = await addBlog(page, t);
      const body = await post(page, { action: 'update', id: String(id), title: t2, category: 'Test', content: 'updated content', status: 'published' });
      expect(body.success).toBe(true);
      expect(sql(`SELECT title FROM blogs WHERE id=${id}`)).toBe(t2);
    } finally { cleanupTitle(t); cleanupTitle(t2); }
  });

  test('TCOV-29-006 — Blog status changes to published', async ({ page }) => {
    const t = title();
    try {
      const id = await addBlog(page, t, { status: 'draft' });
      const body = await post(page, { action: 'update', id: String(id), title: t, category: 'Test', content: 'c', status: 'published' });
      expect(body.success).toBe(true);
      expect(statusOf(id)).toBe('published');
    } finally { cleanupTitle(t); }
  });

  test('TCOV-29-007 — Blog status changes to unpublished', async ({ page }) => {
    const t = title();
    try {
      const id = await addBlog(page, t, { status: 'published' });
      const body = await post(page, { action: 'update', id: String(id), title: t, category: 'Test', content: 'c', status: 'draft' });
      expect(body.success).toBe(true);
      expect(statusOf(id)).toBe('draft'); // 'draft' = unpublished
    } finally { cleanupTitle(t); }
  });

  test('TCOV-29-008 — Blog post is deleted successfully', async ({ page }) => {
    const t = title();
    try {
      const id = await addBlog(page, t);
      const body = await post(page, { action: 'delete', id: String(id) });
      expect(body.success).toBe(true);
      expect(sql(`SELECT COUNT(*) FROM blogs WHERE id=${id}`)).toBe('0');
    } finally { cleanupTitle(t); }
  });

  test('TCOV-29-009 — Display error and keep blog data unchanged', async ({ page }) => {
    const t = title();
    try {
      const id = await addBlog(page, t);
      // Update with an empty title (required) → rejected, blog unchanged.
      const body = await post(page, { action: 'update', id: String(id), title: '', category: 'Test', content: 'changed' });
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('Missing required fields');
      expect(sql(`SELECT title FROM blogs WHERE id=${id}`)).toBe(t); // unchanged
    } finally { cleanupTitle(t); }
  });

});
