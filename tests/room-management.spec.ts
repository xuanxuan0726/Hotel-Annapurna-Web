const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// F023 Room Management — TCOV-23-001 … 018 for api/room-handler.php (admin-only).
//
// Rooms have a real status column (available/booked/reserved/maintenance/occupied) and the admin
// API's add/update both accept `status`, so the full lifecycle is implementable: set status on
// add, transition via update, and delete. Each test uses a throwaway room and cleans it up.
// Run isolated/serial (writes to rooms).

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ROOM_API = `${BASE}/api/room-handler.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}

const ADMIN = { email: 'lucavalentines80@gmail.com', password: 'adminadmin' };
const roomNo = () => `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/admin/login.php`);
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.click('button.btn-login');
  await expect(page).toHaveURL(/\/admin\/index\.php/);
});

async function addRoom(page, status = 'available') {
  const room_no = roomNo();
  const resp = await page.request.post(ROOM_API, { form: { action: 'add', room_no, price: '1000', status } });
  const body = await resp.json();
  expect(body.success).toBe(true);
  return { id: body.id, room_no };
}
// Update a room, setting its status (and optionally a new price to represent "details updated").
async function updateRoom(page, room, { status, price = '1000' }) {
  const resp = await page.request.post(ROOM_API, {
    form: { action: 'update', id: String(room.id), room_no: room.room_no, price, status },
  });
  expect((await resp.json()).success).toBe(true);
}
async function deleteRoom(page, id) {
  const resp = await page.request.post(ROOM_API, { form: { action: 'delete', id: String(id) } });
  expect((await resp.json()).success).toBe(true);
}
const statusOf = (id) => sql(`SELECT status FROM rooms WHERE id=${id}`);
const priceOf = (id) => sql(`SELECT price FROM rooms WHERE id=${id}`);
const countOf = (id) => sql(`SELECT COUNT(*) FROM rooms WHERE id=${id}`);
const cleanup = (id) => sql(`DELETE FROM rooms WHERE id=${id}`);

test.describe('F023 Room Management', () => {

  test('TCOV-23-001 — Admin adds a new room and sets it as available', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      expect(statusOf(room.id)).toBe('available');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-002 — Available room is reserved', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await updateRoom(page, room, { status: 'reserved' });
      expect(statusOf(room.id)).toBe('reserved');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-003 — Available room is marked as under maintenance', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await updateRoom(page, room, { status: 'maintenance' });
      expect(statusOf(room.id)).toBe('maintenance');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-004 — Available room details are updated', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await updateRoom(page, room, { status: 'available', price: '1500' });
      expect(priceOf(room.id)).toBe('1500.00');
      expect(statusOf(room.id)).toBe('available');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-005 — Available room is deleted/removed', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await deleteRoom(page, room.id);
      expect(countOf(room.id)).toBe('0');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-006 — Reserved room becomes occupied when guest checks in', async ({ page }) => {
    const room = await addRoom(page, 'reserved');
    try {
      await updateRoom(page, room, { status: 'occupied' });
      expect(statusOf(room.id)).toBe('occupied');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-007 — Reserved room becomes available again when reservation is cancelled', async ({ page }) => {
    const room = await addRoom(page, 'reserved');
    try {
      await updateRoom(page, room, { status: 'available' });
      expect(statusOf(room.id)).toBe('available');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-008 — Reserved room details are updated', async ({ page }) => {
    const room = await addRoom(page, 'reserved');
    try {
      await updateRoom(page, room, { status: 'reserved', price: '1800' });
      expect(priceOf(room.id)).toBe('1800.00');
      expect(statusOf(room.id)).toBe('reserved');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-009 — Occupied room becomes available when guest checks out', async ({ page }) => {
    const room = await addRoom(page, 'occupied');
    try {
      await updateRoom(page, room, { status: 'available' });
      expect(statusOf(room.id)).toBe('available');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-010 — Occupied room is marked as under maintenance when an issue is reported', async ({ page }) => {
    const room = await addRoom(page, 'occupied');
    try {
      await updateRoom(page, room, { status: 'maintenance' });
      expect(statusOf(room.id)).toBe('maintenance');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-011 — Occupied room details are updated', async ({ page }) => {
    const room = await addRoom(page, 'occupied');
    try {
      await updateRoom(page, room, { status: 'occupied', price: '2200' });
      expect(priceOf(room.id)).toBe('2200.00');
      expect(statusOf(room.id)).toBe('occupied');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-012 — Room under maintenance has its details updated', async ({ page }) => {
    const room = await addRoom(page, 'maintenance');
    try {
      await updateRoom(page, room, { status: 'maintenance', price: '900' });
      expect(priceOf(room.id)).toBe('900.00');
      expect(statusOf(room.id)).toBe('maintenance');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-013 — Room under maintenance becomes available after maintenance is completed', async ({ page }) => {
    const room = await addRoom(page, 'maintenance');
    try {
      await updateRoom(page, room, { status: 'available' });
      expect(statusOf(room.id)).toBe('available');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-014 — Room under maintenance is deleted/removed', async ({ page }) => {
    const room = await addRoom(page, 'maintenance');
    try {
      await deleteRoom(page, room.id);
      expect(countOf(room.id)).toBe('0');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-015 — Updated room is saved as available', async ({ page }) => {
    const room = await addRoom(page, 'reserved');
    try {
      await updateRoom(page, room, { status: 'available' });
      expect(statusOf(room.id)).toBe('available');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-016 — Updated room is saved as reserved', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await updateRoom(page, room, { status: 'reserved' });
      expect(statusOf(room.id)).toBe('reserved');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-017 — Updated room is saved as under maintenance', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await updateRoom(page, room, { status: 'maintenance' });
      expect(statusOf(room.id)).toBe('maintenance');
    } finally { cleanup(room.id); }
  });

  test('TCOV-23-018 — Updated room is deleted/removed', async ({ page }) => {
    const room = await addRoom(page, 'available');
    try {
      await updateRoom(page, room, { status: 'available', price: '1300' });
      await deleteRoom(page, room.id);
      expect(countOf(room.id)).toBe('0');
    } finally { cleanup(room.id); }
  });

});
