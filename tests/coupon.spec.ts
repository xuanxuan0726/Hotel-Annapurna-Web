const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F013 Coupon Validation — TCOV-13-001 … 014 for api/validate-coupon.php.
//
// Boundary-value tests of the (well-implemented) coupon rules: minimum-purchase, usage-limit,
// expiry window, discount calculation/capping. Each test seeds a controlled coupon via SQL and
// removes it afterward. No login is required for coupon validation.

const API = 'http://localhost/Hotel-Annapurna-Web/api/validate-coupon.php';
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const PAST = '2000-01-01 00:00:00';
const FUTURE = '2099-12-31 23:59:59';
function fmt(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

let counter = 0;
function createCoupon(opts = {}) {
  const code = `TST${Date.now()}${counter++}`;
  const {
    type = 'fixed', value = 50, min = 0, max = null, limit = null, used = 0,
    from = PAST, until = FUTURE, status = 'active',
  } = opts;
  const maxv = max === null ? 'NULL' : max;
  const limv = limit === null ? 'NULL' : limit;
  sql(`INSERT INTO coupons (code,discount_type,discount_value,min_purchase,max_discount,usage_limit,used_count,valid_from,valid_until,status) VALUES ('${code}','${type}',${value},${min},${maxv},${limv},${used},'${from}','${until}','${status}')`);
  return code;
}
const deleteCoupon = (code) => sql(`DELETE FROM coupons WHERE code='${code}'`);

const validate = (page, code, subtotal) => page.request.post(API, { data: { code, subtotal } });

test.describe('F013 Coupon Validation', () => {

  // ---- Minimum purchase boundary (min_purchase = 1000) ----
  test('TCOV-13-001 — Purchase amount is below minimum purchase amount', async ({ page }) => {
    const code = createCoupon({ min: 1000 });
    try {
      const body = await (await validate(page, code, 999)).json();
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('Minimum purchase');
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-002 — Purchase amount is equal to minimum purchase amount', async ({ page }) => {
    const code = createCoupon({ min: 1000 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-003 — Purchase amount is above minimum purchase amount', async ({ page }) => {
    const code = createCoupon({ min: 1000 });
    try {
      const body = await (await validate(page, code, 1001)).json();
      expect(body.success).toBe(true);
    } finally { deleteCoupon(code); }
  });

  // ---- Usage-limit boundary (usage_limit = 5) ----
  test('TCOV-13-004 — Coupon usage is below usage limit', async ({ page }) => {
    const code = createCoupon({ limit: 5, used: 4 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-005 — Coupon usage reaches usage limit', async ({ page }) => {
    const code = createCoupon({ limit: 5, used: 5 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('usage limit reached');
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-006 — Coupon usage exceeds usage limit', async ({ page }) => {
    const code = createCoupon({ limit: 5, used: 6 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('usage limit reached');
    } finally { deleteCoupon(code); }
  });

  // ---- Expiry boundary (valid_until) ----
  test('TCOV-13-007 — Coupon is not expired', async ({ page }) => {
    const code = createCoupon({ until: FUTURE });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-008 — Coupon is still valid on expiry date', async ({ page }) => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 0);
    const code = createCoupon({ until: fmt(endOfToday) });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-009 — Coupon is expired', async ({ page }) => {
    const code = createCoupon({ from: PAST, until: '2000-01-02 00:00:00' });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(false);
      expect(String(body.message)).toContain('expired');
    } finally { deleteCoupon(code); }
  });

  // ---- Discount value / amount ----
  test('TCOV-13-010 — Discount value is invalid or no discount applied', async ({ page }) => {
    // A zero discount value yields no discount applied.
    const code = createCoupon({ type: 'fixed', value: 0 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
      expect(body.coupon.discount_amount).toBe(0);
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-011 — Discount value is at minimum valid value', async ({ page }) => {
    const code = createCoupon({ type: 'fixed', value: 1 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
      expect(body.coupon.discount_amount).toBe(1);
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-012 — Discount amount exceeds payable amount', async ({ page }) => {
    // Fixed discount larger than the cart total is capped at the subtotal.
    const code = createCoupon({ type: 'fixed', value: 5000 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
      expect(body.coupon.discount_amount).toBe(1000);
    } finally { deleteCoupon(code); }
  });

  // ---- Overall outcomes ----
  test('TCOV-13-013 — Coupon is accepted and discount is applied', async ({ page }) => {
    const code = createCoupon({ type: 'percentage', value: 10, min: 500 });
    try {
      const body = await (await validate(page, code, 1000)).json();
      expect(body.success).toBe(true);
      expect(body.coupon.discount_amount).toBe(100); // 10% of 1000
    } finally { deleteCoupon(code); }
  });

  test('TCOV-13-014 — Coupon is rejected and error message is displayed', async ({ page }) => {
    const body = await (await validate(page, 'NOSUCHCODE_XYZ', 1000)).json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toContain('Invalid coupon code');
  });

});
