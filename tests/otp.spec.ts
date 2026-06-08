const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F004 OTP Account Verification — decision-table coverage (TCON-04-010 … 019) for
// verify-register.php.
//
// The OTP is generated server-side, stored in MySQL (registration_otps) and emailed
// (Mailtrap sink), so the browser never sees it. We read the OTP value and mutate its
// state (expired/used) directly via MySQL — the only way to exercise those conditions.
// Reaching verify-register.php requires a prior registration (which also creates the OTP
// row and starts the 60s resend cooldown), so every test registers a fresh unique user.

const REGISTER_URL = 'http://localhost/Hotel-Annapurna-Web/register.php';
const VERIFY_URL = 'http://localhost/Hotel-Annapurna-Web/verify-register.php';
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

const uniqueEmail = () => `pwtest_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;

// --- MySQL helpers (db hotel_annapurna, creds from config/db.php: root / no password) ---
function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}
// Latest active OTP for an email.
const getOtp = (email) =>
  sql(`SELECT otp FROM registration_otps WHERE email='${email}' AND is_expired=0 ORDER BY created_at DESC LIMIT 1`);
// Force the active OTP into the past so the server treats it as expired.
const expireOtp = (email) =>
  sql(`UPDATE registration_otps SET expiry='2000-01-01 00:00:00' WHERE email='${email}' AND is_expired=0`);
// Mark the active OTP as already used.
const markUsed = (email) =>
  sql(`UPDATE registration_otps SET used=1 WHERE email='${email}' AND is_expired=0`);
const countUsers = (email) =>
  parseInt(sql(`SELECT COUNT(*) FROM users WHERE email='${email}'`), 10);
const countOtps = (email) =>
  parseInt(sql(`SELECT COUNT(*) FROM registration_otps WHERE email='${email}'`), 10);

// --- Page helpers ---
// Register a fresh user and land on the OTP verification page; returns the email used.
// The registration only redirects to verify-register.php once the OTP email is sent — the
// Mailtrap sandbox occasionally rate-limits sends (leaving the page on register.php), so
// retry with backoff using a new email each attempt.
async function registerFresh(page) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const email = uniqueEmail();
    await page.goto(REGISTER_URL);
    await page.fill('#firstName', 'Otp');
    await page.fill('#lastName', 'Tester');
    await page.fill('#email', email);
    await page.fill('#contact', '9812345678');
    await page.fill('#password', 'Password1!');
    await page.fill('#confirmPassword', 'Password1!');
    await page.check('#terms');
    await page.click('button.register-btn');
    if (/verify-register\.php/.test(page.url()) ||
        await page.waitForURL(/verify-register\.php/, { timeout: 12000 }).then(() => true).catch(() => false)) {
      return email;
    }
    await page.waitForTimeout(2000 * attempt); // back off before retrying the OTP send
  }
  throw new Error('Registration never reached verify-register.php (OTP email send kept failing).');
}

// Type a 6-digit code into the per-digit boxes (fires the JS that fills hidden #otpFinal),
// then submit the verify form.
async function enterOtp(page, code) {
  const boxes = page.locator('.otp-input');
  for (let i = 0; i < 6; i++) {
    await boxes.nth(i).fill(code[i]);
  }
  await page.click('button[name="verify_otp"]');
}

// Trigger a resend: the button starts disabled (JS enables it when the cooldown ends), so
// force-enable it before clicking to exercise the server-side cooldown logic directly.
async function clickResend(page) {
  await page.locator('#resendBtn').evaluate((el) => { el.disabled = false; });
  await page.click('button[name="resend_otp"]');
}

const errorAlert = (page) => page.locator('.alert-error');
const successAlert = (page) => page.locator('.alert-success');

test.describe('F004 OTP Account Verification', () => {
  // Each test sends a real OTP email via the Mailtrap sandbox; retry once to absorb the
  // occasional transient send failure. Run this spec with --workers=1 to avoid concurrent
  // sends tripping Mailtrap's rate limit.
  test.describe.configure({ retries: 1 });


  test('TCON-04-010 — OTP Entered', async ({ page }) => {
    await registerFresh(page);
    const code = '123456';
    const boxes = page.locator('.otp-input');
    for (let i = 0; i < 6; i++) await boxes.nth(i).fill(code[i]);
    // The per-digit boxes feed the hidden field that is actually submitted.
    await expect(page.locator('#otpFinal')).toHaveValue(code);
    await page.click('button[name="verify_otp"]');
    // An OTP was entered and processed by the server (some alert is shown back).
    await expect(page.locator('.alert')).toBeVisible();
  });

  test('TCON-04-011 — OTP Matches Email', async ({ page }) => {
    const email = await registerFresh(page);
    const otp = getOtp(email);
    await enterOtp(page, otp);
    await expect(successAlert(page)).toContainText('Registration successful');
  });

  test('TCON-04-012 — OTP Not Expired', async ({ page }) => {
    const email = await registerFresh(page);
    // A freshly issued OTP is unexpired, so the verify query (which requires expiry > now)
    // matches and the account is verified. Success here proves the not-expired condition.
    const otp = getOtp(email);
    await enterOtp(page, otp);
    await expect(successAlert(page)).toContainText('Registration successful');
  });

  test('TCON-04-013 — OTP Not Used', async ({ page }) => {
    const email = await registerFresh(page);
    const otp = getOtp(email);
    // Mark it used; the verify query requires used=0, so the (now-used) OTP is rejected.
    markUsed(email);
    await enterOtp(page, otp);
    await expect(errorAlert(page)).toContainText('Invalid OTP! Please check and try again.');
  });

  test('TCON-04-014 — Resend Cooldown Passed', async ({ page }) => {
    // Budget for a possible registration send-retry plus the full 61s cooldown wait.
    test.setTimeout(150000);
    await registerFresh(page);
    // Wait out the real 60s resend cooldown, then resend is permitted.
    await page.waitForTimeout(61000);
    await clickResend(page);
    await expect(successAlert(page)).toContainText('New OTP has been sent to your email!');
  });

  test('TCON-04-015 — Verify Account', async ({ page }) => {
    const email = await registerFresh(page);
    expect(countUsers(email)).toBe(0); // no account yet
    const otp = getOtp(email);
    await enterOtp(page, otp);
    await expect(successAlert(page)).toContainText('Registration successful');
    // The account is created (verified) and the page redirects to the homepage.
    expect(countUsers(email)).toBe(1);
    await expect(page).toHaveURL(/\/index\.php/, { timeout: 10000 });
  });

  test('TCON-04-016 — Display Invalid OTP Message', async ({ page }) => {
    const email = await registerFresh(page);
    const real = getOtp(email);
    // A code that is guaranteed not to match the real OTP.
    const wrong = real === '000000' ? '111111' : '000000';
    await enterOtp(page, wrong);
    await expect(errorAlert(page)).toContainText('Invalid OTP! Please check and try again.');
  });

  test('TCON-04-017 — Display Expired OTP Message', async ({ page }) => {
    const email = await registerFresh(page);
    const otp = getOtp(email);
    // Push the OTP's expiry into the past, then submit the (correct but expired) code.
    expireOtp(email);
    await enterOtp(page, otp);
    await expect(errorAlert(page)).toContainText('OTP has expired! Please request a new OTP.');
  });

  test('TCON-04-018 — Display Resend Cooldown Message', async ({ page }) => {
    await registerFresh(page);
    // Resend immediately, while the 60s cooldown is still active.
    await clickResend(page);
    await expect(errorAlert(page)).toContainText('before requesting a new OTP');
  });

  test('TCON-04-019 — Send New OTP Email', async ({ page }) => {
    // Budget for a possible registration send-retry plus the full 61s cooldown wait.
    test.setTimeout(150000);
    const email = await registerFresh(page);
    const before = countOtps(email);
    await page.waitForTimeout(61000);
    await clickResend(page);
    await expect(successAlert(page)).toContainText('New OTP has been sent to your email!');
    // A new OTP row was generated (and emailed) for this email.
    expect(countOtps(email)).toBeGreaterThan(before);
  });

});
