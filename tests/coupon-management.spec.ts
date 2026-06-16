const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F028 Coupon Management — TCOV-28-001 … 017 for api/admin-coupons.php (admin create, boundary tests).
//
// Per the user's directive, each test asserts the behavior that SHOULD exist; where the app doesn't
// implement it, the test is left to FAIL (red). admin-coupons.php `create` validates: code non-empty
// (NO min length), discount_value > 0 (and <=100% for percentage), and duplicate code. It does NOT
// validate code length, negative min_purchase, usage-limit validity, or past expiry dates — so those
// boundary cases (001, 004, 010, 013) fail by design. Run isolated/serial (writes coupons).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ADMIN_COUPONS = `${BASE}/api/admin-coupons.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const uniqueCode = () => `TST${Date.now()}${Math.floor(Math.random() * 1000)}`;
const PAST = '2000-01-01 00:00:00';
const FUTURE = '2099-12-31 23:59:59';

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

function couponForm(o = {}) {
  return {
    action: 'create',
    code: o.code,
    discount_type: o.discount_type ?? 'fixed',
    discount_value: o.discount_value ?? '50',
    min_purchase: o.min_purchase ?? '0',
    valid_from: PAST,
    valid_until: o.valid_until ?? FUTURE,
    usage_limit: o.usage_limit ?? '10',
    status: 'active',
  };
}
const create = (page, o) => page.request.post(ADMIN_COUPONS, { form: couponForm(o) }).then((r) => r.json());
const cleanup = (code) => sql(`DELETE FROM coupons WHERE code='${code}'`);

test.describe('F028 Coupon Management', () => {

  // ---- Code length boundary (assumed minimum = 3) ----
  test('TCOV-28-001 — Coupon code is below minimum length', async ({ page }) => {
    // SHOULD: a too-short code is rejected. ACTUAL: only non-empty is checked. Fails by design.
    const code = 'AB';
    cleanup(code);
    try {
      const body = await create(page, { code });
      expect(body.success).toBe(false);
    } finally { cleanup(code); }
  });

  test('TCOV-28-002 — Coupon code is at minimum valid boundary', async ({ page }) => {
    const code = 'ABC';
    cleanup(code);
    try { expect((await create(page, { code })).success).toBe(true); } finally { cleanup(code); }
  });

  test('TCOV-28-003 — Coupon code is above minimum valid boundary', async ({ page }) => {
    const code = 'ABCDE';
    cleanup(code);
    try { expect((await create(page, { code })).success).toBe(true); } finally { cleanup(code); }
  });

  // ---- Minimum purchase boundary (lower boundary = 0) ----
  test('TCOV-28-004 — Minimum purchase amount is below valid boundary', async ({ page }) => {
    // SHOULD: a negative minimum purchase is rejected. ACTUAL: no validation. Fails by design.
    const code = uniqueCode();
    try {
      const body = await create(page, { code, min_purchase: '-100' });
      expect(body.success).toBe(false);
    } finally { cleanup(code); }
  });

  test('TCOV-28-005 — Minimum purchase amount is at valid lower boundary', async ({ page }) => {
    const code = uniqueCode();
    try { expect((await create(page, { code, min_purchase: '0' })).success).toBe(true); } finally { cleanup(code); }
  });

  test('TCOV-28-006 — Minimum purchase amount is above valid lower boundary', async ({ page }) => {
    const code = uniqueCode();
    try { expect((await create(page, { code, min_purchase: '500' })).success).toBe(true); } finally { cleanup(code); }
  });

  // ---- Discount amount ----
  test('TCOV-28-007 — Discount amount is invalid', async ({ page }) => {
    const code = uniqueCode();
    try {
      const body = await create(page, { code, discount_value: '0' });
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('Discount value must be greater than 0');
    } finally { cleanup(code); }
  });

  test('TCOV-28-008 — Discount amount is at minimum valid value', async ({ page }) => {
    const code = uniqueCode();
    try { expect((await create(page, { code, discount_value: '1' })).success).toBe(true); } finally { cleanup(code); }
  });

  test('TCOV-28-009 — Discount amount exceeds payable amount', async ({ page }) => {
    // A percentage discount above 100% is rejected.
    const code = uniqueCode();
    try {
      const body = await create(page, { code, discount_type: 'percentage', discount_value: '150' });
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('cannot exceed 100');
    } finally { cleanup(code); }
  });

  // ---- Usage limit boundary (minimum valid = 1) ----
  test('TCOV-28-010 — Usage limit is invalid', async ({ page }) => {
    // SHOULD: a negative usage limit is rejected. ACTUAL: no validation. Fails by design.
    const code = uniqueCode();
    try {
      const body = await create(page, { code, usage_limit: '-5' });
      expect(body.success).toBe(false);
    } finally { cleanup(code); }
  });

  test('TCOV-28-011 — Usage limit is at minimum valid boundary', async ({ page }) => {
    const code = uniqueCode();
    try { expect((await create(page, { code, usage_limit: '1' })).success).toBe(true); } finally { cleanup(code); }
  });

  test('TCOV-28-012 — Usage limit is above minimum valid boundary', async ({ page }) => {
    const code = uniqueCode();
    try { expect((await create(page, { code, usage_limit: '10' })).success).toBe(true); } finally { cleanup(code); }
  });

  // ---- Expiry date ----
  test('TCOV-28-013 — Expired coupon date is rejected', async ({ page }) => {
    // SHOULD: a valid_until in the past is rejected. ACTUAL: no date validation. Fails by design.
    const code = uniqueCode();
    try {
      const body = await create(page, { code, valid_until: '2000-01-02 00:00:00' });
      expect(body.success).toBe(false);
    } finally { cleanup(code); }
  });

  test('TCOV-28-014 — Expiry date is accepted for same-day coupon', async ({ page }) => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 23:59:59`;
    const code = uniqueCode();
    try { expect((await create(page, { code, valid_until: today })).success).toBe(true); } finally { cleanup(code); }
  });

  test('TCOV-28-015 — Future expiry date is accepted', async ({ page }) => {
    const code = uniqueCode();
    try { expect((await create(page, { code, valid_until: FUTURE })).success).toBe(true); } finally { cleanup(code); }
  });

  // ---- Overall outcomes ----
  test('TCOV-28-016 — Coupon is created or updated successfully', async ({ page }) => {
    const code = uniqueCode();
    try {
      const body = await create(page, { code });
      expect(body.success).toBe(true);
      expect(String(body.message)).toContain('created successfully');
    } finally { cleanup(code); }
  });

  test('TCOV-28-017 — Coupon creation or update is rejected and error message is displayed', async ({ page }) => {
    // Empty code → rejected with an error message.
    const body = await create(page, { code: '' });
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Coupon code is required');
  });

});
