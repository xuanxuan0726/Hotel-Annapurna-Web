// Shared helpers for the Selenium (selenium-webdriver + Mocha) suites covering
// F008 Room Availability, F009 Room Booking, F010 Table Availability, F011 Table Reservation.
//
// These mirror the Playwright specs but drive a real Chrome browser. The booking/availability
// logic lives in api/create-booking.php (form-encoded POST, login required). Selenium is a
// browser driver, so API calls are issued INSIDE the page via fetch() (driver.executeAsyncScript)
// — that way each request automatically carries the browser's real PHPSESSID session cookie,
// exactly as a logged-in user's request would. DB setup/assertion/cleanup reuses mysql.exe.

const { execSync } = require('child_process');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE = 'http://localhost/Hotel-Annapurna-Web';
const ROOMS = `${BASE}/rooms.php`;
const TABLES = `${BASE}/tables.php`;
const API = `${BASE}/api/create-booking.php`;
const MYSQL = 'C:\\xampp\\mysql\\bin\\mysql.exe';

const CUSTOMER = { email: 'yangenna20@gmail.com', password: 'ennayang' };
// bcrypt hash of 'Test1234' — for the throwaway rollback users.
const PW_HASH = '$2y$10$KfZvIUFfBfOOPO3.e1wUkuvYeBC1xljDlkMlJstagQNih3mcYvi5S';

function sql(query) {
  return execSync(`"${MYSQL}" -uroot hotel_annapurna -N -B -e "${query}"`, { encoding: 'utf8' }).trim();
}
const userId = (email) => sql(`SELECT id FROM users WHERE email='${email}'`);

async function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--headless=new', '--no-sandbox', '--disable-gpu', '--window-size=1280,900');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().setTimeouts({ script: 30000, pageLoad: 30000, implicit: 0 });
  return driver;
}

// Log in through the real login form; clears any prior session first so the form always renders.
async function loginAs(driver, email, password) {
  await driver.get(`${BASE}/login.php`);
  await driver.manage().deleteAllCookies();
  await driver.get(`${BASE}/login.php`);
  await driver.findElement(By.css('#email')).sendKeys(email);
  await driver.findElement(By.css('#password')).sendKeys(password);
  await driver.findElement(By.css('button.login-button')).click();
  await driver.wait(until.urlContains('index.php'), 15000);
}

// Drop the session and land on a public page (so in-page fetch is same-origin but unauthenticated).
async function logout(driver) {
  await driver.get(ROOMS);
  await driver.manage().deleteAllCookies();
  await driver.get(ROOMS);
}

const POST_SCRIPT = `
var url = arguments[0]; var form = arguments[1]; var done = arguments[arguments.length - 1];
var pairs = [];
for (var k in form) { if (Object.prototype.hasOwnProperty.call(form, k)) pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(form[k])); }
fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: pairs.join('&') })
  .then(function (r) { return r.text().then(function (t) { var j = null; try { j = JSON.parse(t); } catch (e) {} done({ status: r.status, json: j, text: t }); }); })
  .catch(function (e) { done({ status: 0, json: null, text: '' + e }); });
`;
const GET_SCRIPT = `
var url = arguments[0]; var done = arguments[arguments.length - 1];
fetch(url, { method: 'GET', credentials: 'same-origin' })
  .then(function (r) { return r.text().then(function (t) { var j = null; try { j = JSON.parse(t); } catch (e) {} done({ status: r.status, json: j, text: t }); }); })
  .catch(function (e) { done({ status: 0, json: null, text: '' + e }); });
`;

// POST a form-encoded body to create-booking.php from inside the current page; returns {status, json, text}.
const apiPost = (driver, form) => driver.executeAsyncScript(POST_SCRIPT, API, form);
const apiGet = (driver, url) => driver.executeAsyncScript(GET_SCRIPT, url);

// Throwaway available room / table (returns id + number); callers must clean up.
function createRoom() {
  const room_no = `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO rooms (room_no, room_type, total_beds, status, price) VALUES ('${room_no}','single',1,'available',1000.00)`);
  return { id: sql(`SELECT id FROM rooms WHERE room_no='${room_no}'`), room_no };
}
function cleanupRoom(id) {
  sql(`DELETE FROM orders WHERE order_type='room' AND item_id=${id}`);
  sql(`DELETE FROM rooms WHERE id=${id}`);
}
function createTable() {
  const table_no = `TST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sql(`INSERT INTO tables (table_no, total_chairs, booking_status, price_main, location) VALUES ('${table_no}',4,'available',500.00,'ground floor')`);
  return { id: sql(`SELECT id FROM tables WHERE table_no='${table_no}'`), table_no };
}
function cleanupTable(id) {
  sql(`DELETE FROM orders WHERE order_type='table' AND item_id=${id}`);
  sql(`DELETE FROM tables WHERE id=${id}`);
}

// Form builders matching api/create-booking.php's expected fields.
const roomForm = (id, room_no, check_in, check_out, price = '1000') => ({
  item_type: 'room', item_id: String(id),
  item_data: JSON.stringify({ room_no, room_type: 'single' }), price, check_in, check_out,
});
const tableForm = (id, table_no, check_in, check_out, price = '500') => ({
  item_type: 'table', item_id: String(id),
  item_data: JSON.stringify({ table_no, location: 'ground floor' }), price, check_in, check_out,
});

module.exports = {
  BASE, ROOMS, TABLES, API, CUSTOMER, PW_HASH,
  sql, userId, buildDriver, loginAs, logout, apiPost, apiGet,
  createRoom, cleanupRoom, createTable, cleanupTable, roomForm, tableForm,
  By, until,
};
