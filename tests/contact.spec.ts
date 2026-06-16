const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F018 Contact Form Submission — TCOV-18-001 … 006 for api/contact-handler.php (public, no login).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). The handler validates name/email/subject/message
// server-side but has NO phone field, so the phone test fails by design. The DB-failure path is
// forced with a temporary BEFORE INSERT trigger so execute() fails while prepare() succeeds.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const CONTACT_API = `${BASE}/api/contact-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const uniqueEmail = () => `contacttest_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
const validForm = (email) => ({
  name: 'Test User',
  email,
  subject: 'Test Subject',
  message: 'This is a sufficiently long test message.',
});
const cleanupByEmail = (email) => sql(`DELETE FROM contact_requests WHERE email='${email}'`);
const post = (page, form) => page.request.post(CONTACT_API, { form });

test.describe('F018 Contact Form Submission', () => {

  test('TCOV-18-001 — Contact form is submitted successfully', async ({ page }) => {
    const email = uniqueEmail();
    try {
      const resp = await post(page, validForm(email));
      const body = await resp.json();
      expect(body.success).toBe(true);
      expect(String(body.message)).toContain('Thank you for contacting us');
      // The request is persisted.
      expect(sql(`SELECT COUNT(*) FROM contact_requests WHERE email='${email}'`)).toBe('1');
    } finally {
      cleanupByEmail(email);
    }
  });

  test('TCOV-18-002 — Reject contact form with missing required field', async ({ page }) => {
    const form = validForm(uniqueEmail());
    form.name = ''; // missing required name
    const resp = await post(page, form);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Name is required');
  });

  test('TCOV-18-003 — Reject invalid email format', async ({ page }) => {
    const form = validForm('notanemail');
    const resp = await post(page, form);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid email format');
  });

  test('TCOV-18-004 — Reject invalid phone number', async ({ page }) => {
    // SHOULD: an invalid phone number is rejected. ACTUAL: the contact form/handler has no phone
    // field at all, so a bogus phone is ignored and the form submits successfully. Fails by design.
    const email = uniqueEmail();
    try {
      const form = { ...validForm(email), phone: 'abc123' };
      const resp = await post(page, form);
      const body = await resp.json();
      expect(body.success).toBe(false);
    } finally {
      cleanupByEmail(email);
    }
  });

  test('TCOV-18-005 — Reject message that is too short', async ({ page }) => {
    const form = validForm(uniqueEmail());
    form.message = 'short'; // < 10 chars
    const resp = await post(page, form);
    const body = await resp.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Message must be at least 10 characters');
  });

  test('TCOV-18-006 — Display submission failed message and do not save contact request', async ({ page }) => {
    // Force the INSERT to fail via a trigger. SHOULD: the handler shows "Failed to send message…"
    // and saves nothing. ACTUAL: execute() throws (mysqli exceptions are on by default), which the
    // handler does not catch — it crashes with an HTML error instead of the graceful message.
    // Fails by design (the submission-failed message is never displayed). The request is not saved.
    const email = uniqueEmail();
    sql("CREATE TRIGGER contact_fail_test BEFORE INSERT ON contact_requests FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='forced failure'");
    try {
      const resp = await post(page, validForm(email));
      const text = await resp.text(); // not necessarily JSON when the handler crashes
      expect(text).toContain('Failed to send message');
      expect(sql(`SELECT COUNT(*) FROM contact_requests WHERE email='${email}'`)).toBe('0');
    } finally {
      sql('DROP TRIGGER IF EXISTS contact_fail_test');
      cleanupByEmail(email);
    }
  });

});
