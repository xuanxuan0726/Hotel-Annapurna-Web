const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F005 Password Reset — TCOV-05-001 … 012 for forget-password.php (OTP step) and
// reset-password.php (new-password step).
//
// Notable app facts:
//   - The reset OTP is NEVER emailed: generateAndStoreOTP() only writes the password_resets
//     table. So this whole suite sends zero emails.
//   - assets/js/forgotpwd.js is a 404, so the six .pwd-otp-input boxes have no JS — they do not
//     populate the hidden #pwd-otpFinal (name "otp"). The submitted OTP is whatever we set on
//     #pwd-otpFinal; the server only matches it against the stored 6-digit OTP.
//   - A successful reset overwrites users.password, so every test uses its own throwaway
//     verified user (created via SQL) — real accounts are never touched.

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

const uniq = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

// Create a throwaway verified user; the password column is a placeholder (reset never checks it).
function createUser() {
  const email = `pwreset_${uniq()}@example.com`;
  sql(`INSERT INTO users (first_name,last_name,email,contact,password,status) VALUES ('Pwd','Reset','${email}','9800000000','x','verified')`);
  return email;
}
// Latest active reset OTP for an email.
const getResetOtp = (email) =>
  sql(`SELECT otp FROM password_resets WHERE email='${email}' AND used=0 AND is_expired=0 ORDER BY created_at DESC LIMIT 1`);
// Insert a verified (used=1) reset row so reset-password.php?token=... lands directly on the form.
function insertUsedResetRow(email) {
  const token = `tok_${uniq()}`;
  sql(`INSERT INTO password_resets (email,otp,token,expiry,used,is_expired) VALUES ('${email}','000000','${token}','2099-12-31 23:59:59',1,0)`);
  return token;
}
const getUserPasswordHash = (email) =>
  sql(`SELECT password FROM users WHERE email='${email}'`);

// --- Page helpers ---
// Submit the email form for a verified user → page renders the step-2 OTP form (no email sent).
async function startOtpStep(page, email) {
  await page.goto(`${BASE}/forget-password.php`);
  await page.fill('#pwd-email', email);
  await page.click('#pwd-emailForm button[type="submit"]');
  await expect(page.locator('#pwd-step2Form')).toBeVisible();
}
// Set the hidden OTP field directly (no client JS to concatenate the boxes) and submit.
async function submitOtp(page, code) {
  await page.locator('#pwd-otpFinal').evaluate((el, v) => { el.value = v; }, code);
  await page.click('#pwd-otpForm button[type="submit"]');
}

const errorAlert = (page) => page.locator('.pwd-alert-error');

test.describe('F005 Password Reset', () => {

  // ---- OTP step (forget-password.php) -------------------------------------------------------
  // The server has no OTP length check; it just matches the stored 6-digit OTP, so empty/short/
  // long all fail with "Invalid OTP!" and only the correct 6-digit value succeeds.

  test('TCOV-05-001 — OTP field is empty', async ({ page }) => {
    const email = createUser();
    await startOtpStep(page, email);
    await submitOtp(page, '');
    await expect(errorAlert(page)).toContainText('Invalid OTP! Please check and try again.');
  });

  test('TCOV-05-002 — OTP length is below valid boundary', async ({ page }) => {
    const email = createUser();
    await startOtpStep(page, email);
    await submitOtp(page, '12345'); // 5 digits
    await expect(errorAlert(page)).toContainText('Invalid OTP! Please check and try again.');
  });

  test('TCOV-05-003 — OTP length is valid', async ({ page }) => {
    const email = createUser();
    await startOtpStep(page, email);
    const otp = getResetOtp(email); // the real 6-digit OTP just generated
    await submitOtp(page, otp);
    // A valid OTP marks the row used and redirects to the new-password page.
    await expect(page).toHaveURL(/reset-password\.php/);
  });

  test('TCOV-05-004 — OTP length is above valid boundary', async ({ page }) => {
    const email = createUser();
    await startOtpStep(page, email);
    await submitOtp(page, '1234567'); // 7 digits
    await expect(errorAlert(page)).toContainText('Invalid OTP! Please check and try again.');
  });

  // ---- New-password step (reset-password.php via an inserted used=1 token row) ---------------

  test('TCOV-05-005 — New password field is empty', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    // Leave #pwd-password empty (required) → browser blocks submission.
    await page.click('#pwd-reset-password-form button[type="submit"]');
    const valid = await page.locator('#pwd-password').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/reset-password\.php/);
  });

  test('TCOV-05-006 — New password is below minimum length', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    await page.fill('#pwd-password', 'Passw1'); // 6 chars, below minlength=8
    await page.fill('#pwd-confirm-password', 'Passw1');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    // minlength=8 makes the field invalid → browser blocks submission.
    const valid = await page.locator('#pwd-password').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/reset-password\.php/);
  });

  test('TCOV-05-007 — New password is at valid minimum boundary', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    await page.fill('#pwd-password', 'Passwd12'); // exactly 8
    await page.fill('#pwd-confirm-password', 'Passwd12');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    await expect(page).toHaveURL(/\/index\.php/);
  });

  test('TCOV-05-008 — New password is above minimum boundary', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    await page.fill('#pwd-password', 'Passwd123'); // 9 chars
    await page.fill('#pwd-confirm-password', 'Passwd123');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    await expect(page).toHaveURL(/\/index\.php/);
  });

  test('TCOV-05-009 — Password reset input is valid', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    await page.fill('#pwd-password', 'ValidPass1');
    await page.fill('#pwd-confirm-password', 'ValidPass1');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    await expect(page).toHaveURL(/\/index\.php/);
  });

  test('TCOV-05-010 — Password reset input is invalid', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    // Mismatched passwords: the page's JS sets a custom validity error on the confirm field,
    // so the browser blocks submission (the form never submits).
    await page.fill('#pwd-password', 'ValidPass1');
    await page.fill('#pwd-confirm-password', 'OtherPass2');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    const valid = await page.locator('#pwd-confirm-password').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/reset-password\.php/);
  });

  test('TCOV-05-011 — Password is reset successfully', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    const before = getUserPasswordHash(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    await page.fill('#pwd-password', 'BrandNew99');
    await page.fill('#pwd-confirm-password', 'BrandNew99');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    await expect(page).toHaveURL(/\/index\.php/);
    // The stored password hash actually changed.
    expect(getUserPasswordHash(email)).not.toBe(before);
  });

  test('TCOV-05-012 — Password reset is rejected and error message is displayed', async ({ page }) => {
    const email = createUser();
    const token = insertUsedResetRow(email);
    await page.goto(`${BASE}/reset-password.php?token=${token}`);
    await page.fill('#pwd-password', 'ValidPass1');
    await page.fill('#pwd-confirm-password', 'Mismatch22');
    await page.click('#pwd-reset-password-form button[type="submit"]');
    // The browser surfaces the "Passwords do not match" validity error and blocks the reset.
    const message = await page.locator('#pwd-confirm-password').evaluate((el) => el.validationMessage);
    expect(message).toContain('Passwords do not match');
    await expect(page).toHaveURL(/reset-password\.php/);
  });

});
