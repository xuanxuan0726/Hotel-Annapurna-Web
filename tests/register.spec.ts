const { test, expect } = require('@playwright/test');

// F001 User Registration — Playwright coverage for TCOV-01-001 … 019.
//
// Validation in this app is HTML5 attributes + server-side PHP only (createAccount.js
// 404s and the inline validateForm() is never bound). Server errors redirect back to
// register.php and render in the error box; success redirects to verify-register.php.

const BASE = 'http://localhost/Hotel-Annapurna-Web/register.php';

// Unique fresh email per run so "success" cases never collide with an existing user.
const uniqueEmail = () => `pwtest_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;

// A known, already-registered user — used for the duplicate-email case.
const EXISTING_EMAIL = 'yangenna20@gmail.com';

// Fill the registration form. Only fields present in `f` are filled, so callers can
// deliberately leave a field empty. Terms is checked unless acceptTerms:false.
async function fillForm(page, f) {
  await page.goto(BASE);
  if (f.firstName !== undefined) await page.fill('#firstName', f.firstName);
  if (f.lastName !== undefined) await page.fill('#lastName', f.lastName);
  if (f.email !== undefined) await page.fill('#email', f.email);
  if (f.contact !== undefined) await page.fill('#contact', f.contact);
  if (f.password !== undefined) await page.fill('#password', f.password);
  if (f.confirmPassword !== undefined) await page.fill('#confirmPassword', f.confirmPassword);
  if (f.acceptTerms !== false) await page.check('#terms');
}

// The server-side error box (same locator the login spec asserts on).
const errorBox = (page) => page.locator('div[style*="background: var(--color-cancelled-bg)"]');

// Valid baseline for success / boundary tests. Spread and override per test.
function validBaseline() {
  return {
    firstName: 'Test',
    lastName: 'User',
    email: uniqueEmail(),
    contact: '9812345678', // exactly 10 digits
    password: 'Password1!',
    confirmPassword: 'Password1!',
  };
}

test.describe('F001 User Registration', () => {

  // ---------------------------------------------------------------------------
  // Success cases → server accepts and redirects to verify-register.php
  // (reaching the OTP page means the account passed validation and an OTP was issued).
  // ---------------------------------------------------------------------------

  test('TCOV-01-001 — All required registration inputs are valid', async ({ page }) => {
    await fillForm(page, validBaseline());
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  test('TCOV-01-008 — Valid account registration is accepted and OTP is sent to email', async ({ page }) => {
    // The email contents are not asserted here; reaching verify-register.php confirms
    // register-handler.php generated an OTP and dispatched the verification email.
    await fillForm(page, validBaseline());
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  test('TCOV-01-018 — Valid registration details are accepted', async ({ page }) => {
    await fillForm(page, validBaseline());
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  test('TCOV-01-012 — Password length is at valid minimum boundary', async ({ page }) => {
    // Exactly 8 characters — the minimum the server accepts (strlen >= 8).
    await fillForm(page, { ...validBaseline(), password: 'Passwd1!', confirmPassword: 'Passwd1!' });
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  test('TCOV-01-013 — Password length is above minimum boundary', async ({ page }) => {
    // 9 characters — above the minimum.
    await fillForm(page, { ...validBaseline(), password: 'Passwd12!', confirmPassword: 'Passwd12!' });
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  test('TCOV-01-015 — Contact number is at valid lower boundary', async ({ page }) => {
    // The rule is exactly 10 digits (/^\d{10}$/), so the lower valid boundary is 10.
    await fillForm(page, { ...validBaseline(), contact: '9800000000' });
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  test('TCOV-01-016 — Contact number is at valid upper boundary', async ({ page }) => {
    // Exactly 10 digits is both the lower and upper valid boundary (fixed-length field).
    await fillForm(page, { ...validBaseline(), contact: '9899999999' });
    await page.click('button.register-btn');
    // Allow extra time: the server sends the OTP email synchronously before redirecting,
    // which can be slow under parallel load.
    await expect(page).toHaveURL(/verify-register\.php/, { timeout: 20000 });
  });

  // ---------------------------------------------------------------------------
  // Server-side rejection cases → input passes HTML5 but fails PHP validation,
  // so register-handler.php redirects back with the error box populated.
  // ---------------------------------------------------------------------------

  test('TCOV-01-004 — Email already exists in the system', async ({ page }) => {
    await fillForm(page, { ...validBaseline(), email: EXISTING_EMAIL });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Email already registered');
  });

  test('TCOV-01-005 — Contact number contains invalid format', async ({ page }) => {
    await fillForm(page, { ...validBaseline(), contact: '12ab56' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Contact number must be 10 digits');
  });

  test('TCOV-01-006 — Password does not meet minimum requirement', async ({ page }) => {
    await fillForm(page, { ...validBaseline(), password: 'pass1', confirmPassword: 'pass1' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Password must be at least 8 characters');
  });

  test('TCOV-01-007 — Password and confirm password are different', async ({ page }) => {
    await fillForm(page, { ...validBaseline(), password: 'Password1!', confirmPassword: 'Different1!' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Passwords do not match');
  });

  test('TCOV-01-009 — Invalid registration input is rejected and error', async ({ page }) => {
    // General negative: malformed contact → registration rejected with an error shown.
    await fillForm(page, { ...validBaseline(), contact: '123' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
  });

  test('TCOV-01-011 — Password length is below minimum boundary', async ({ page }) => {
    // 7 characters — one below the 8-character minimum.
    await fillForm(page, { ...validBaseline(), password: 'Pass12!', confirmPassword: 'Pass12!' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Password must be at least 8 characters');
  });

  test('TCOV-01-014 — Contact number is below valid boundary', async ({ page }) => {
    // 9 digits — one below the required 10.
    await fillForm(page, { ...validBaseline(), contact: '981234567' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Contact number must be 10 digits');
  });

  test('TCOV-01-017 — Contact number is above valid boundary', async ({ page }) => {
    // 11 digits — one above the required 10.
    await fillForm(page, { ...validBaseline(), contact: '98123456789' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
    await expect(errorBox(page)).toContainText('Contact number must be 10 digits');
  });

  test('TCOV-01-019 — Invalid registration details are rejected', async ({ page }) => {
    // General negative: mismatched passwords → registration rejected with an error shown.
    await fillForm(page, { ...validBaseline(), password: 'Password1!', confirmPassword: 'Mismatch9!' });
    await page.click('button.register-btn');
    await expect(errorBox(page)).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Native browser blocking → HTML5 stops submission before the server is hit.
  // Assert the target field is invalid and the page stays on register.php.
  // ---------------------------------------------------------------------------

  test('TCOV-01-002 — Required field is empty', async ({ page }) => {
    // First name left empty; everything else valid + terms checked.
    const f = validBaseline();
    delete f.firstName;
    await fillForm(page, f);
    await page.click('button.register-btn');
    const valid = await page.locator('#firstName').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/register\.php/);
  });

  test('TCOV-01-003 — Email does not follow valid format', async ({ page }) => {
    // Truly malformed value — blocked by the type="email" input.
    await fillForm(page, { ...validBaseline(), email: 'invalidemail' });
    await page.click('button.register-btn');
    const valid = await page.locator('#email').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/register\.php/);
  });

  test('TCOV-01-010 — Password is empty', async ({ page }) => {
    const f = validBaseline();
    delete f.password;
    await fillForm(page, f);
    await page.click('button.register-btn');
    const valid = await page.locator('#password').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
    await expect(page).toHaveURL(/register\.php/);
  });

});
