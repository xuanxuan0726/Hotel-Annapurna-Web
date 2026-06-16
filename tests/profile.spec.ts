const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F017 Profile Management — TCOV-17-002 … 010 for profile.php (inline form-POST update).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app
// doesn't implement it, the test is left to FAIL (red). Reality: profile.php validates ONLY the
// image upload (MIME + 5MB). It has no email field and no server-side validation of required
// fields / contact / email, so those tests fail by design. Mutating tests snapshot & restore the
// user's profile, so this spec must run isolated (--workers=1, one project).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const PROFILE = `${BASE}/profile.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
const USER_ID = sql(`SELECT id FROM users WHERE email='${CUSTOMER.email}'`);
const OTHER_EMAIL = sql(`SELECT email FROM users WHERE email!='${CUSTOMER.email}' AND status='verified' LIMIT 1`);

// Snapshot the original profile so mutating tests can restore it.
const ORIG = {
  first_name: sql(`SELECT first_name FROM users WHERE id=${USER_ID}`),
  last_name: sql(`SELECT last_name FROM users WHERE id=${USER_ID}`),
  contact: sql(`SELECT contact FROM users WHERE id=${USER_ID}`),
  profile_pic: sql(`SELECT profile_pic FROM users WHERE id=${USER_ID}`),
};
function restoreProfile() {
  sql(`UPDATE users SET first_name='${ORIG.first_name}', last_name='${ORIG.last_name}', contact='${ORIG.contact}', address=NULL, profile_pic='${ORIG.profile_pic}' WHERE id=${USER_ID}`);
}
const getField = (f) => sql(`SELECT ${f} FROM users WHERE id=${USER_ID}`);

async function login(page) {
  await page.goto(`${BASE}/login.php`);
  await page.fill('#email', CUSTOMER.email);
  await page.fill('#password', CUSTOMER.password);
  await page.click('button.login-button');
  await expect(page).toHaveURL(/\/index\.php/);
}

const postUpdate = (page, fields) => page.request.post(PROFILE, { form: { update_profile: '1', ...fields } });

test.describe('F017 Profile Management', () => {

  test('TCOV-17-002 — Redirect user to login or display login required message', async ({ page }) => {
    await page.goto(PROFILE); // not logged in
    await expect(page).toHaveURL(/login\.php/);
  });

  test('TCOV-17-003 — Reject profile update with empty required field', async ({ page }) => {
    // SHOULD: an empty required field (first_name) is rejected and the profile is unchanged.
    // ACTUAL: profile.php has no server-side required-field validation, so it saves the empty
    // value. Fails by design.
    await login(page);
    try {
      await postUpdate(page, { first_name: '', last_name: ORIG.last_name, contact: ORIG.contact });
      expect(getField('first_name')).toBe(ORIG.first_name); // should be unchanged
    } finally {
      restoreProfile();
    }
  });

  test('TCOV-17-004 — Reject invalid email format', async ({ page }) => {
    // SHOULD: an invalid email is rejected with an error. ACTUAL: profile update doesn't accept or
    // validate email at all, so no error is shown. Fails by design.
    await login(page);
    try {
      const resp = await postUpdate(page, { first_name: ORIG.first_name, last_name: ORIG.last_name, contact: ORIG.contact, email: 'notanemail' });
      const text = await resp.text();
      expect(text).toMatch(/invalid email/i);
    } finally {
      restoreProfile();
    }
  });

  test('TCOV-17-005 — Reject invalid contact number', async ({ page }) => {
    // SHOULD: a non-numeric / wrong-length contact is rejected and the profile is unchanged.
    // ACTUAL: no contact validation — it saves as-is. Fails by design.
    await login(page);
    try {
      await postUpdate(page, { first_name: ORIG.first_name, last_name: ORIG.last_name, contact: 'abc123' });
      expect(getField('contact')).toBe(ORIG.contact); // should be unchanged
    } finally {
      restoreProfile();
    }
  });

  test('TCOV-17-006 — Reject email already used by another user', async ({ page }) => {
    // SHOULD: updating to an email already used by another user is rejected. ACTUAL: email isn't
    // part of the profile update and there is no duplicate check, so no error. Fails by design.
    await login(page);
    try {
      const resp = await postUpdate(page, { first_name: ORIG.first_name, last_name: ORIG.last_name, contact: ORIG.contact, email: OTHER_EMAIL });
      const text = await resp.text();
      expect(text).toMatch(/already (in use|registered|used|exists)/i);
    } finally {
      restoreProfile();
    }
  });

  test('TCOV-17-007 — Reject invalid image upload', async ({ page }) => {
    await login(page);
    await page.goto(PROFILE);
    // A non-image file is rejected by the upload validator (MIME + size).
    await page.locator('#profile_pic_input').setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
    await expect(page.getByText(/Invalid file type or size/i)).toBeVisible();
  });

  test('TCOV-17-008 — Display error and keep profile unchanged', async ({ page }) => {
    await login(page);
    await page.goto(PROFILE);
    const before = getField('profile_pic');
    await page.locator('#profile_pic_input').setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
    await expect(page.getByText(/Invalid file type or size/i)).toBeVisible();
    // The rejected upload must not change the stored profile picture.
    expect(getField('profile_pic')).toBe(before);
  });

  test('TCOV-17-009 — Display current user profile details', async ({ page }) => {
    await login(page);
    await page.goto(PROFILE);
    await expect(page.locator('#first_name')).toHaveValue(ORIG.first_name);
    // Email is shown read-only in the profile info card (which may sit in a non-active tab).
    await expect(page.locator('.info-value', { hasText: CUSTOMER.email })).toBeAttached();
  });

  test('TCOV-17-010 — Display refreshed profile after successful update', async ({ page }) => {
    await login(page);
    await page.goto(PROFILE);
    try {
      await page.fill('#first_name', 'RefreshTest');
      await page.fill('#last_name', ORIG.last_name);
      await page.fill('#contact', ORIG.contact);
      await page.click('button[name="update_profile"]');
      await expect(page.locator('.success-message')).toBeVisible();
      await expect(page.locator('#first_name')).toHaveValue('RefreshTest'); // refreshed from DB
    } finally {
      restoreProfile();
    }
  });

});
