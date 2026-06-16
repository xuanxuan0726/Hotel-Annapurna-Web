const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F030 Contact Request Management — TCOV-30-001 … 013 for api/admin-contacts.php (admin status flow).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). contact_requests.status is only
// pending/in-progress/resolved, and admin-contacts validates against exactly those — there is NO
// 'viewed' state, so the cases that require it (001, 003, 004, 005) fail by design.
// (responded/closed both map to 'resolved'.) "Replied/responded" is exercised via update_status
// rather than send_reply to avoid sending real emails. Run isolated/serial (writes contact_requests).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ADMIN_CONTACTS = `${BASE}/api/admin-contacts.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

function createRequest(status = 'pending') {
  const subject = `CRTEST_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO contact_requests (name,email,subject,message,status) VALUES ('CR Test','crtest@example.com','${subject}','This is a test message body.','${status}')`);
  return { id: sql(`SELECT id FROM contact_requests WHERE subject='${subject}'`), subject };
}
const statusOf = (id) => sql(`SELECT status FROM contact_requests WHERE id=${id}`);
const countOf = (id) => sql(`SELECT COUNT(*) FROM contact_requests WHERE id=${id}`);
const cleanup = (subject) => sql(`DELETE FROM contact_requests WHERE subject='${subject}'`);
const updateStatus = (page, id, status) => page.request.post(ADMIN_CONTACTS, { form: { action: 'update_status', id: String(id), status } }).then((r) => r.json());
const del = (page, id) => page.request.post(ADMIN_CONTACTS, { form: { action: 'delete', id: String(id) } }).then((r) => r.json());

test.describe('F030 Contact Request Management', () => {

  test('TCOV-30-001 — New contact request is viewed and marked as viewed', async ({ page }) => {
    // SHOULD: marking a request as 'viewed'. ACTUAL: there is no 'viewed' status. Fails by design.
    const r = createRequest('pending');
    try { expect((await updateStatus(page, r.id, 'viewed')).success).toBe(true); } finally { cleanup(r.subject); }
  });

  test('TCOV-30-002 — New contact request is deleted/removed directly', async ({ page }) => {
    const r = createRequest('pending');
    try {
      expect((await del(page, r.id)).success).toBe(true);
      expect(countOf(r.id)).toBe('0');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-003 — Viewed contact request is deleted/removed', async ({ page }) => {
    // SHOULD: reach the 'viewed' state, then delete. ACTUAL: 'viewed' is unreachable. Fails by design.
    const r = createRequest('pending');
    try { expect((await updateStatus(page, r.id, 'viewed')).success).toBe(true); } finally { cleanup(r.subject); }
  });

  test('TCOV-30-004 — Viewed contact request is started and marked as in progress', async ({ page }) => {
    // SHOULD: from 'viewed' move to in-progress. ACTUAL: 'viewed' is unreachable. Fails by design.
    const r = createRequest('pending');
    try { expect((await updateStatus(page, r.id, 'viewed')).success).toBe(true); } finally { cleanup(r.subject); }
  });

  test('TCOV-30-005 — Viewed contact request is replied to and becomes responded', async ({ page }) => {
    // SHOULD: from 'viewed' reply → responded. ACTUAL: 'viewed' is unreachable. Fails by design.
    const r = createRequest('pending');
    try { expect((await updateStatus(page, r.id, 'viewed')).success).toBe(true); } finally { cleanup(r.subject); }
  });

  test('TCOV-30-006 — In-progress contact request is deleted/removed', async ({ page }) => {
    const r = createRequest('in-progress');
    try {
      expect((await del(page, r.id)).success).toBe(true);
      expect(countOf(r.id)).toBe('0');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-007 — In-progress contact request is replied to and becomes responded', async ({ page }) => {
    const r = createRequest('in-progress');
    try {
      expect((await updateStatus(page, r.id, 'resolved')).success).toBe(true); // responded = resolved
      expect(statusOf(r.id)).toBe('resolved');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-008 — In-progress contact request is closed without replying', async ({ page }) => {
    const r = createRequest('in-progress');
    try {
      expect((await updateStatus(page, r.id, 'resolved')).success).toBe(true); // closed = resolved
      expect(statusOf(r.id)).toBe('resolved');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-009 — Responded contact request is deleted/removed', async ({ page }) => {
    const r = createRequest('resolved'); // responded
    try {
      expect((await del(page, r.id)).success).toBe(true);
      expect(countOf(r.id)).toBe('0');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-010 — Responded contact request is closed', async ({ page }) => {
    const r = createRequest('resolved'); // responded
    try {
      expect((await updateStatus(page, r.id, 'resolved')).success).toBe(true); // closed = resolved
      expect(statusOf(r.id)).toBe('resolved');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-011 — Responded contact request is reopened and becomes in progress', async ({ page }) => {
    const r = createRequest('resolved');
    try {
      expect((await updateStatus(page, r.id, 'in-progress')).success).toBe(true);
      expect(statusOf(r.id)).toBe('in-progress');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-012 — Closed contact request is deleted/removed', async ({ page }) => {
    const r = createRequest('resolved'); // closed
    try {
      expect((await del(page, r.id)).success).toBe(true);
      expect(countOf(r.id)).toBe('0');
    } finally { cleanup(r.subject); }
  });

  test('TCOV-30-013 — Closed contact request is reopened and becomes in progress', async ({ page }) => {
    const r = createRequest('resolved'); // closed
    try {
      expect((await updateStatus(page, r.id, 'in-progress')).success).toBe(true);
      expect(statusOf(r.id)).toBe('in-progress');
    } finally { cleanup(r.subject); }
  });

});
