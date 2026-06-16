const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F020 Blog Interaction — TCOV-20-001 … 009 for api/blog-interactions.php (JSON POST).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). The API is well-built (login gate, like toggle,
// comment validation, FK-protected blog_id, try/catch) EXCEPT it never checks the blog's published
// status, so interacting with a draft post succeeds (007 fails by design). Run isolated/serial
// (it inserts a draft blog and writes interactions).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const API = `${BASE}/api/blog-interactions.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);
const PUBLISHED_ID = sql(`SELECT id FROM blogs WHERE status='published' ORDER BY id LIMIT 1`);

const clearInteractions = (blogId) => sql(`DELETE FROM blog_interactions WHERE blog_id=${blogId} AND user_id=${USER_ID}`);

async function login(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

const interact = (page, payload) => page.request.post(API, { data: payload });

test.describe('F020 Blog Interaction', () => {

  test('TCOV-20-001 — User successfully likes, comments, and shares a blog post', async ({ page }) => {
    await login(page);
    clearInteractions(PUBLISHED_ID);
    try {
      const like = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'like' })).json();
      expect(like.success).toBe(true);
      const comment = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'comment', comment_text: 'Great post!', rating: 5 })).json();
      expect(comment.success).toBe(true);
      const share = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'share' })).json();
      expect(share.success).toBe(true);
    } finally {
      clearInteractions(PUBLISHED_ID);
    }
  });

  test('TCOV-20-002 — Reject like action and require login', async ({ page }) => {
    const body = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'like' })).json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('login');
  });

  test('TCOV-20-003 — Remove existing like or prevent duplicate like', async ({ page }) => {
    await login(page);
    clearInteractions(PUBLISHED_ID);
    try {
      const first = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'like' })).json();
      expect(first.action).toBe('liked');
      // A second like must not create a duplicate — it removes the existing like.
      const second = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'like' })).json();
      expect(second.action).toBe('unliked');
      expect(sql(`SELECT COUNT(*) FROM blog_interactions WHERE blog_id=${PUBLISHED_ID} AND user_id=${USER_ID} AND interaction_type='like'`)).toBe('0');
    } finally {
      clearInteractions(PUBLISHED_ID);
    }
  });

  test('TCOV-20-004 — Reject comment action and require login', async ({ page }) => {
    const body = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'comment', comment_text: 'hi there' })).json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('login');
  });

  test('TCOV-20-005 — Reject empty comment submission', async ({ page }) => {
    await login(page);
    clearInteractions(PUBLISHED_ID); // ensure no prior comment (which would short-circuit)
    const body = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'comment', comment_text: '' })).json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Comment text is required');
  });

  test('TCOV-20-006 — Reject interaction when blog post does not exist', async ({ page }) => {
    await login(page);
    // blog_id 999999 doesn't exist → the blog_id FK rejects the insert → interaction rejected.
    const body = await (await interact(page, { blog_id: 999999, interaction_type: 'like' })).json();
    expect(body.success).toBe(false);
  });

  test('TCOV-20-007 — Reject interaction with unpublished blog post', async ({ page }) => {
    // SHOULD: interacting with a draft/unpublished blog is rejected. ACTUAL: the API never checks
    // the blog's status, so liking a draft succeeds. Fails by design.
    sql(`INSERT INTO blogs (title, category, content, status) VALUES ('Draft Interact F020', 'Test', 'draft content', 'draft')`);
    const draftId = sql(`SELECT id FROM blogs WHERE title='Draft Interact F020' ORDER BY id DESC LIMIT 1`);
    await login(page);
    try {
      const body = await (await interact(page, { blog_id: draftId, interaction_type: 'like' })).json();
      expect(body.success).toBe(false); // should be rejected for an unpublished post
    } finally {
      sql(`DELETE FROM blog_interactions WHERE blog_id=${draftId}`);
      sql(`DELETE FROM blogs WHERE id=${draftId}`);
    }
  });

  test('TCOV-20-008 — Generate or open blog share option/link', async ({ page }) => {
    await login(page);
    clearInteractions(PUBLISHED_ID);
    try {
      const body = await (await interact(page, { blog_id: PUBLISHED_ID, interaction_type: 'share' })).json();
      expect(body.success).toBe(true);
      expect(String(body.message)).toContain('Share logged');
    } finally {
      clearInteractions(PUBLISHED_ID);
    }
  });

  test('TCOV-20-009 — Display error and keep interaction data unchanged', async ({ page }) => {
    await login(page);
    const before = sql(`SELECT COUNT(*) FROM blog_interactions WHERE blog_id=999999`);
    // A failing interaction (non-existent blog → FK error, caught) returns an error and writes nothing.
    const body = await (await interact(page, { blog_id: 999999, interaction_type: 'like' })).json();
    expect(body.success).toBe(false);
    expect(sql(`SELECT COUNT(*) FROM blog_interactions WHERE blog_id=999999`)).toBe(before);
  });

});
