# Test Incident Report

Project Title: **Hotel Annapurna Web — Hotel Management System** · Independent Verification and Validation
Test Incident Report ID: **HAWS_TIR_1_2.0.0** · Date: **10/06/2026** · Hotel Annapurna IV&V

## Cover Page — Group Members

| Member | Student ID | Role | Primary Responsibility |
|---|---|---|---|
| Yang Jia En | 242UC2451Q | Test Manager | Verified By — scope & sign-off; Configuration testing |
| Teoh Xuan Xuan | 242UC2451P | Test Lead | Reviewed By & Approval — test procedure / traceability; API-Debug testing |
| Cheong Xin Chen | 251UC250T4 | Test Analyst | Prepared By — Authentication, Booking & Registration testing |
| Tey Jun Cheng | 242UC2452Z | Test Analyst | Tester — Payment, Cart & Admin testing; evidence capture |

---

## Document Control

| | |
|---|---|
| **Document Name** | Hotel Annapurna Web Test Incident Report (Iteration 1) |
| **Reference Number** | HAWS_TIR_1 |
| **Version** | 2.0.0 |
| **Project Code** | HAWS_WEB |
| **Status** | In-use |
| **Date Released** | 10/06/2026 |

| Name | Position | Signature |
|---|---|---|
| Prepared By: Cheong Xin Chen | Test Analyst, Hotel Annapurna IV&V | |
| Reviewed By: Teoh Xuan Xuan | Test Lead, Hotel Annapurna IV&V | |
| Verified By: Yang Jia En | Test Manager, Hotel Annapurna IV&V | |

## Version History

| Version | Release Date | Section | Amendments |
|---|---|---|---|
| 1.0.0 | 02/06/2026 | All | Original document — 8 exploratory security incidents (TIR-AUTH-001 … TIR-REG-001). |
| 2.0.0 | 10/06/2026 | Summary; Incidents | **Added 13 incidents (TIR-REG-002, TIR-CART-002/003, TIR-PAY-002, TIR-CONTACT-001/002, TIR-MENU-001, TIR-ORDER-001/002, TIR-CUST-001, TIR-STAFF-001, TIR-COUPON-001, TIR-BLOG-001) for every failed / skipped test case from the automated Playwright suite (F001–F030), traced to their TCS/TPS IDs. The original 8 incidents are retained unchanged.** |

## Distribution List

| Version | Release Date | Controlled Copy No | Department | Issue Date |
|---|---|---|---|---|
| 2.0.0 | 10/06/2026 | 01 | Hotel Annapurna IV&V – QA | 10/06/2026 |
| 2.0.0 | 10/06/2026 | 02 | Hotel Annapurna IV&V – Test Team | 10/06/2026 |
| 2.0.0 | 10/06/2026 | 03 | Hotel Annapurna – Development Team | 10/06/2026 |

## Roles & Responsibilities (Group Contribution)

| Member | Role | Incidents Tested | Incidents Observed |
|---|---|---|---|
| Yang Jia En | Test Manager (Verified By) | TIR-CONF-001, TIR-CART-001, TIR-MENU-001 | TIR-CART-003, TIR-CONTACT-001 |
| Teoh Xuan Xuan | Test Lead (Reviewed By, Approval) | TIR-DBG-001, TIR-COUPON-001, TIR-BLOG-001, TIR-CONTACT-001, TIR-CONTACT-002 | TIR-BOOK-001, TIR-CONF-001, TIR-PAY-002 |
| Cheong Xin Chen | Test Analyst (Prepared By) | TIR-AUTH-001, TIR-BOOK-001, TIR-REG-001, TIR-REG-002, TIR-CART-002, TIR-CART-003, TIR-CUST-001 | TIR-PAY-001, TIR-ADMIN-001, TIR-ORDER-001 |
| Tey Jun Cheng | Test Analyst (Tester) | TIR-PAY-001, TIR-CART-001, TIR-ADMIN-001, TIR-PAY-002, TIR-CONTACT-001, TIR-ORDER-001, TIR-ORDER-002, TIR-STAFF-001 | TIR-AUTH-001, TIR-DBG-001, TIR-REG-001/002, TIR-COUPON-001, TIR-BLOG-001 |

---

## Test Incident Report

### Incident report identifier (Table 1)

| | |
|---|---|
| **Scope** | This Test Incident Report covers incidents discovered on the Hotel Annapurna Web application (HAWS_WEB v1.0). **Incidents 1–8** are the exploratory security findings raised during manual Test Procedure execution (Authentication/Session, Payment, Booking, Cart/Checkout, Configuration, Admin, Registration). **Incidents 9–21** are every test case that **failed by design** or was **skipped as not implemented** during execution of the automated Playwright suite (F001–F030) — IV&V findings where the implementation diverges from the Test Design Specification (missing validation, missing states, or missing gates). The original 8 incidents are retained unchanged. |
| **References** | HAWS_TPS_1_1.0.0 (Test Procedure Specification); HAWS_TCS_1_1.0.0 (Test Case Specification); HAWS_TDS_1_1.0.0 (Test Design Specification); HAWS_TL_1_1.0.0 (Test Log); Playwright HTML report (`tests/`, 30 specs, F001–F030) |

### Summary of incidents

| No. | Incident | Module | Impact |
|---|---|---|---|
| 1 | TIR-AUTH-001 — "Remember Me" can be changed to sign in as anyone, including the Administrator | Login | Mission Critical |
| 2 | TIR-PAY-001 — Payment confirmed without a real payment being made | Payment | Mission Critical |
| 3 | TIR-BOOK-001 — Booking price can be changed by the customer | Booking | Major |
| 4 | TIR-CART-001 — Cart prices can be changed and unreal items ordered | Cart | Major |
| 5 | TIR-CONF-001 — Email login and password written in plain text in the files | Email settings | Major |
| 6 | TIR-DBG-001 — Leftover test pages reveal internal information to anyone | Test pages | Major |
| 7 | TIR-ADMIN-001 — Administrator can delete their own account by mistake | Admin | Minor |
| 8 | TIR-REG-001 — Weak passwords are accepted when creating an account | Registration | Minor |
| 9 | TIR-REG-002 — 11-digit contact number rejected (design treats it as valid) | Registration | Minor |
| 10 | TIR-CART-002 — Food can be added to the cart without logging in | Cart | Minor |
| 11 | TIR-CART-003 — Unavailable food items can be added to the cart | Cart / Menu | Major |
| 12 | TIR-PAY-002 — eSewa payment gateway is not integrated | Payment | Major |
| 13 | TIR-CONTACT-001 — Contact form DB failure throws an uncaught exception | Contact Form | Major |
| 14 | TIR-MENU-001 — Food items have no status; cannot mark unavailable/archive | Food/Menu Mgmt | Major |
| 15 | TIR-ORDER-001 — Order "preparing"/"ready" states not implemented | Order Mgmt | Major |
| 16 | TIR-ORDER-002 — Order "refunded" state not implemented | Order Mgmt | Major |
| 17 | TIR-CUST-001 — No customer search / filter feature | Customer Mgmt | Minor |
| 18 | TIR-STAFF-001 — No email-format validation on staff create | Staff Mgmt | Minor |
| 19 | TIR-COUPON-001 — Missing coupon boundary validations | Coupon Mgmt | Major |
| 20 | TIR-BLOG-001 — No image type/size validation on blog upload | Blog Mgmt | Major |
| 21 | TIR-CONTACT-002 — Contact-request "viewed" state not implemented | Contact Request Mgmt | Minor |

> **Counts:** 21 incidents — **2 Mission Critical, 12 Major, 7 Minor.** Incidents 1–8 are manual exploratory security findings; incidents 9–21 are automated-suite cases that failed by design (9–13, 18–20) or were skipped as not-implemented (14–17, 21).

---

## Incidents 1–8 — Manual Exploratory Security Findings (original report, retained unchanged)

### TIR-AUTH-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-AUTH-001 |
| **Summary** | A person can sign in as any other user including the Administrator without knowing the password, by changing the "Remember Me" information the website stores in the browser. This is a serious security problem because it lets someone get past the login. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Login and "Remember Me" feature (version 1.0) |
| **Test Procedure** | This problem affects every page that a logged-in user can see. |
| **Test Data** | The email address of the account to break into, and that account's user number (a small number such as 1). |
| **Expected Result** | The "Remember Me" feature should keep a person signed in using a secret value that cannot be guessed or copied. Simply knowing someone's email and user number should not be enough to sign in as them. |
| **Actual Result** | To remember a signed-in person, the website stores that person's user number and email together in the browser in a form that is easy to read and easy to recreate. There is no secret or protection on this stored value, so anyone can make their own and the website will accept it. |
| **Unexpected Outcome** | By making this "Remember Me" value for the Administrator's account, an ordinary visitor becomes signed in as the Administrator and gets full control, including the admin dashboard. No error or warning appears. This does not meet the security requirements. |
| **Procedure to reproduce** | 1. Open the website's stored sign-in information in the browser (using the browser's built-in tools). 2. Replace it with a value made from the target account's user number and email. 3. Without signing in, refresh the website. 4. The website now shows you as that user. |
| **Test Environment** | HAWS_WEB v1.0 on the team's local test website; web browser (Chrome or Firefox); area: Login / "Remember Me". |
| **Attempt to repeat** | Repeated three times with three different accounts — worked every time. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☒ Mission Critical ☐ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Change the "Remember Me" feature so it uses a long, random, secret value that the website keeps track of, instead of the user number and email. The stored value should be impossible to guess, and it should stop working when the person signs out or changes their password. |

---

### TIR-PAY-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-PAY-001 |
| **Summary** | A booking or order can be marked as "paid" and "confirmed" without any real payment being made, because the website does not properly check the payment confirmation that comes back from the eSewa payment service. This is a serious security problem. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Online payment (eSewa) (version 1.0) |
| **Test Procedure** | (This problem affects every booking or order paid through eSewa.) |
| **Test Data** | An unpaid order belonging to the tester, and a made-up payment confirmation that says "completed". |
| **Expected Result** | When the payment service reports back, the website should confirm that the message genuinely came from eSewa and that the amount paid matches the order price, before marking the order as paid. |
| **Actual Result** | The website accepts the payment confirmation without checking whether it really came from eSewa and without checking the amount. It only looks at whether the message says "completed". The whole confirmation can be supplied by the user. |
| **Unexpected Outcome** | By sending a made-up "completed" confirmation for their own booking, a user can have the order marked as paid and confirmed, and the room marked as booked — all without paying anything. |
| **Procedure to reproduce** | 1. As a signed-in customer, create a booking and note its order number. 2. Make a fake payment confirmation that says the payment is "completed" for that order. 3. Send this fake confirmation to the website's payment-return page. 4. The order is marked as paid and confirmed even though no payment was made. |
| **Test Environment** | HAWS_WEB v1.0 on the team's local test website; no real payment was made; area: Online payment (eSewa). |
| **Attempt to repeat** | Repeated three times with different fake amounts — the order was confirmed each time. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Cheong Xin Chen |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☒ Mission Critical ☐ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Before marking an order as paid, the website must check that the confirmation genuinely came from eSewa and that the amount paid matches the order's real price. Ideally it should also confirm the payment directly with eSewa. |

---

### TIR-BOOK-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-BOOK-001 |
| **Summary** | When booking a single room or table, the price is taken from the customer's browser instead of from the hotel's own records, so a customer can book for any amount they choose, such as Rs 1. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Room and table booking (version 1.0) |
| **Test Procedure** | (This problem affects single room and table bookings.) |
| **Test Data** | Any available room (real price, for example Rs 5,000) and a changed request with the price set to 1. |
| **Expected Result** | The website should use the real price stored in the hotel's records for the chosen room or table, and ignore any price sent by the customer's browser. |
| **Actual Result** | The website uses the price that the browser sends and multiplies it by the number of nights. It checks that the room or table exists and is available, but it never looks up the real price. |
| **Unexpected Outcome** | The booking is saved with the price the customer chose, so the amount to pay can be as little as Rs 1. Because the price is sent openly by the page, it is easy to change. |
| **Procedure to reproduce** | 1. Sign in as a normal customer and open the booking page. 2. Change the price being sent from the real value to 1 before confirming. 3. Submit the booking. 4. The booking is created with a total of Rs 1. |
| **Test Environment** | HAWS_WEB v1.0 on the team's local test website; web browser (Chrome or Firefox); area: Room and table booking. |
| **Attempt to repeat** | Repeated three times for a room and a table with prices 1, 0.01 and 100 — accepted each time. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Teoh Xuan Xuan |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | The website should always take the price from the hotel's own records, based on the room or table selected, and ignore any price sent by the browser. |

---

### TIR-CART-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CART-001 |
| **Summary** | When ordering several items in the cart, the website trusts the prices and totals sent by the customer's browser and does not check that the food items actually exist, so an order of any amount can be placed, even for items that do not exist. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Cart and checkout (version 1.0) |
| **Test Procedure** | (This problem affects cart checkout.) |
| **Test Data** | A cart where a food price is set to 1 (or a food item that does not exist) and the totals are changed. |
| **Expected Result** | The website should look up every item, use the real price from its records, check the item exists and is available, and work out the totals itself. |
| **Actual Result** | The website takes the subtotal, discount and total straight from the browser. For food items it uses the price sent by the browser without checking its records at all. Room and table prices are also taken from the browser. The coupon's usage count is increased without checking the discount again. |
| **Unexpected Outcome** | Orders are saved with whatever prices the customer chose, and a food item that does not exist is still accepted. The order total is whatever the browser sent. |
| **Procedure to reproduce** | 1. Sign in, add items to the cart, and go to checkout. 2. Change each food price (and the totals) to 1, or use a food item that does not exist. 3. The order is created with the changed amount or the non-existent item. |
| **Test Environment** | HAWS_WEB v1.0 on the team's local test website; web browser (Chrome or Firefox); area: Cart and checkout. |
| **Attempt to repeat** | Repeated three times (food price 1, a non-existent food item, an inflated discount) — the order was created each time. |
| **Tester's Name** | Yang Jia En |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | The website should ignore all prices and totals sent by the browser. For each item it should look it up, confirm it exists and is available, use the stored price, and work out the totals itself. The coupon and discount should be checked again before the usage count is increased. |

---

### TIR-CONF-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CONF-001 |
| **Summary** | The email account login and password used by the website are written directly inside the website's files in plain, readable text, so anyone who can see those files can use the hotel's email account. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Email settings (version 1.0) |
| **Test Procedure** | (Found while reviewing the website's settings.) |
| **Test Data** | None. |
| **Expected Result** | Passwords and account details should be kept separately and securely, not written inside the website's files where they can be read. |
| **Actual Result** | The email account name and password are written in plain text inside one of the website's settings files, and they appear there more than once. |
| **Unexpected Outcome** | Anyone who can read the website's files gets a working email login, and could send emails as the hotel or read its mailbox. |
| **Procedure to reproduce** | 1. Open the email settings file. 2. Read the account name and password written there. 3. These details can be used to sign in to the email account. |
| **Test Environment** | Reviewing the website's files. Area: Email settings. |
| **Attempt to repeat** | The login and password appear in two places in the same file, so the finding is consistent. |
| **Tester's Name** | Yang Jia En |
| **Observer's Name** | Teoh Xuan Xuan |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Change the exposed email password immediately. Keep such passwords in a separate, secure place rather than inside the website's files, and never share them in the project files. |

---

### TIR-DBG-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-DBG-001 |
| **Summary** | Several leftover test pages were left on the website. Anyone can open them without signing in, and they reveal internal information about the system, such as sign-in status and database details. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Leftover test pages (version 1.0) |
| **Test Procedure** | (This problem affects the leftover test and check pages left on the website.) |
| **Test Data** | None. |
| **Expected Result** | Test and check pages should be removed before the website goes live, and no page should reveal internal information to visitors. |
| **Actual Result** | Some leftover test pages turn on detailed error messages and display sign-in and database information to any visitor, with no sign-in required. Several similar leftover pages exist. |
| **Unexpected Outcome** | A visitor who opens these pages can learn internal details about the system that could help them attack it further. |
| **Procedure to reproduce** | 1. Without signing in, open one of the leftover test pages in a browser. 2. Notice the sign-in and database information shown on the page. 3. The same happens for the other leftover test pages. |
| **Test Environment** | Web browser, no sign-in needed. Area: Leftover test pages. |
| **Attempt to repeat** | Several leftover pages were found, and a representative one was confirmed to work without signing in. |
| **Tester's Name** | Teoh Xuan Xuan |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Remove all test, check and setup pages from the live website. Turn off detailed error messages on the live site. Any pages that must stay should require an administrator sign-in. |

---

### TIR-ADMIN-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-ADMIN-001 |
| **Summary** | The safeguard meant to stop an administrator from deleting their own account never works, because it checks the wrong piece of information. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Administrator user management (version 1.0) |
| **Test Procedure** | (This problem affects deleting a user from the admin panel.) |
| **Test Data** | The signed-in administrator's own account. |
| **Expected Result** | Trying to delete your own administrator account should be blocked, with a message such as "Cannot delete your own account". |
| **Actual Result** | The check that should recognise the administrator's own account looks at the wrong piece of stored information, which is empty for administrators. Because of this the check never matches, and the deletion goes ahead. |
| **Unexpected Outcome** | An administrator can delete their own account; the protection that should prevent this never runs. (Only administrators can reach this page, so this is a logic mistake rather than an access problem.) |
| **Procedure to reproduce** | 1. Sign in to the admin panel. 2. Try to delete your own administrator account. 3. The account is deleted instead of being blocked. |
| **Test Environment** | HAWS_WEB v1.0 on the team's local test website; signed in as an administrator; area: Administrator user management. |
| **Attempt to repeat** | Confirmed during review: the piece of information the check relies on is never set for administrators. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Cheong Xin Chen |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Correct the safeguard so it compares against the administrator's actual account. It would also be wise to prevent deleting the last remaining administrator. |

---

### TIR-REG-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-REG-001 |
| **Summary** | When creating an account, the website only checks that the password is long enough. The stronger password rules shown on the sign-up page can be skipped, so weak passwords are accepted. |
| **Date and Time Incident** | 02/06/2026 |
| **Context** | Hotel Annapurna Web — Account registration (version 1.0) |
| **Test Procedure** | (This problem affects creating a new account.) |
| **Test Data** | The password "abcdefgh" (eight small letters) sent directly. |
| **Expected Result** | The website should apply the same password rules everywhere — a minimum length plus a mix of capital letters, small letters, numbers and special characters. |
| **Actual Result** | On the website's side, the only password rule is that the password must be at least eight characters long. The stronger rules exist only on the sign-up page in the browser, which can be skipped. |
| **Unexpected Outcome** | By sending the sign-up details directly, a weak password such as "abcdefgh" is accepted and an account is created with it. |
| **Procedure to reproduce** | 1. Send the sign-up details directly with a weak password such as "abcdefgh" (no capital letters, numbers or special characters). 2. The account is created with the weak password. |
| **Test Environment** | Web browser (or a tool for sending requests). Area: Account registration. |
| **Attempt to repeat** | Repeated with several weak passwords — accepted each time. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Apply the same password rules on the website's side as on the sign-up page (a minimum length plus capital letters, small letters, numbers and special characters) before creating the account. |

---

## Incidents 9–21 — Automated Playwright Suite: Failed / Skipped Test Cases

> Each incident below cites the test case(s) it was raised from (HAWS_TCS_1) and the procedure that executes them (HAWS_TPS_1). **Failed** = a guard/validation the design requires is absent; **Skipped** = a state/feature the design defines does not exist.

### TIR-REG-002

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-REG-002 |
| **Summary** | An 11-digit contact number is rejected at registration, but the Test Design treats 10–11 digits as the valid range (upper boundary). The application enforces exactly 10 digits (`/^\d{10}$/`), so a valid-by-design 11-digit number is refused. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — User Registration (`register.php` / `register-handler.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-01-014 · TP-01-008 (Contact Number Length Boundary) · Type: **Failed** |
| **Test Procedure** | Register with a valid name/email/password and an 11-digit contact number. |
| **Test Data** | Contact = `01234567890` (11 digits); all other fields valid; fresh email. |
| **Expected Result** | Per the boundary design, 11 digits is the upper valid boundary → registration accepted. |
| **Actual Result** | The server regex requires exactly 10 digits, so the error box shows "Contact number must be 10 digits" and registration is refused. |
| **Unexpected Outcome** | A contact number the design considers valid cannot be used; the implemented rule and the design boundary disagree. |
| **Procedure to reproduce** | 1. Open `register.php`. 2. Fill all fields validly with contact=`01234567890`. 3. Submit. 4. Observe the rejection. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium (Playwright); module Registration. |
| **Attempt to repeat** | Repeated 3× with different 11-digit numbers — rejected each time. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☐ Delayed ☒ Deferred |
| **Corrective action** | Reconcile the rule and the design: either accept 10–11 digits server-side, or amend the TDS so the contact rule is exactly 10 digits. Apply the same rule consistently on client and server. |

---

### TIR-CART-002

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CART-002 |
| **Summary** | Food items can be added to the cart without logging in. The design requires a login gate (redirect to login / "login required") on add-to-cart, but add-to-cart is purely client-side (localStorage) with no gate. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Add Food to Cart (`menu.php` client-side cart), version 1.0 |
| **Related Test Cases / Procedure** | TC-07-002, TC-07-010 · TP-07-006 (Login Gate Finding) · Type: **Failed** |
| **Test Procedure** | While logged out, add a food item and observe whether a login gate is triggered. |
| **Test Data** | Logged-out session; any available food item. |
| **Expected Result** | The user is routed to `login.php` or shown a login-required message before the item is added. |
| **Actual Result** | The item is added to the localStorage cart and the user is taken to `cart.php`; no login is required. |
| **Unexpected Outcome** | The add-to-cart action proceeds for anonymous users; the login gate the design specifies is absent (login is only enforced later at checkout / the server cart API). |
| **Procedure to reproduce** | 1. Log out / clear cookies. 2. Open `menu.php`; add the first item. 3. Observe redirect to `cart.php` with the item present. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Cart. |
| **Attempt to repeat** | Repeated 3× — added without login each time. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Add a login check on the add-to-cart action (or confirm by design that anonymous carts are acceptable and update the TDS). Checkout already enforces login, so impact is limited. |

---

### TIR-CART-003

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CART-003 |
| **Summary** | Food items that are not available today (per `available_days`) can still be added to the cart. The design requires an availability gate; none exists for food items. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Add Food to Cart / availability, version 1.0 |
| **Related Test Cases / Procedure** | TC-07-003, TC-07-004, TC-07-011 · TP-07-007 (Availability Gate Finding) · Type: **Failed** |
| **Test Procedure** | Add a food item whose `available_days` excludes today and check whether it is blocked. |
| **Test Data** | A food item seeded with `available_days` excluding the current weekday. |
| **Expected Result** | The item is blocked from being added, with an "item not available" message; it is absent from `hotelCart.food`. |
| **Actual Result** | The item is added normally and appears in `hotelCart.food`; availability gates exist only for rooms/tables, not food. |
| **Unexpected Outcome** | A customer can add (and proceed to order) food not offered that day. |
| **Procedure to reproduce** | 1. Seed a food item unavailable today. 2. Open the menu; add it. 3. Inspect `hotelCart.food` — the item is present. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Cart / Menu. |
| **Attempt to repeat** | Repeated 3× — added each time. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Yang Jia En |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Validate food availability (against `available_days` and any stock/availability flag) server-side before the item is added to the cart and again at checkout. |

---

### TIR-PAY-002

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-PAY-002 |
| **Summary** | The eSewa payment method is not integrated in this build: selecting eSewa does not redirect to the gateway, and the success/failure return handling cannot be exercised. The design requires a working eSewa redirect and status update. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Payment Processing (eSewa), version 1.0 |
| **Related Test Cases / Procedure** | TC-14-006, TC-14-007, TC-14-008, TC-14-012, TC-14-018 · TP-14-003 (eSewa Payment Finding) · Type: **Failed** |
| **Test Procedure** | With a valid order, select eSewa and observe the gateway redirect and the success/failure return handling. |
| **Test Data** | A valid unpaid order; payment method = eSewa. |
| **Expected Result** | The user is redirected to the eSewa gateway; on success the payment status updates to paid, on failure an error is shown and the status stays pending. |
| **Actual Result** | The eSewa gateway is not configured/integrated, so the redirect does not occur and the gateway return paths cannot be reached. |
| **Unexpected Outcome** | The eSewa payment option is non-functional; the corresponding decision-table paths cannot be verified. (Distinct from TIR-PAY-001, which concerns trusting an unverified eSewa confirmation.) |
| **Procedure to reproduce** | 1. Create a valid order. 2. Choose eSewa at payment. 3. Observe that no gateway redirect occurs. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Payment. (Cash and Stripe paths were tested separately.) |
| **Attempt to repeat** | Confirmed across repeated attempts — eSewa never redirects. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Teoh Xuan Xuan |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Complete the eSewa integration (configure merchant credentials, implement the redirect and the signed return verification) and re-run TC-14-006/007/008/012/018. Until then the eSewa decision-table paths remain unverified. |

---

### TIR-CONTACT-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CONTACT-001 |
| **Summary** | When the contact-form insert fails, the handler throws an uncaught `mysqli` exception and returns a raw error/HTML page instead of a graceful "Failed to send message" response. The design requires a friendly error and that the request is not saved. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Contact Form Submission (`contact.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-18-006, TC-18-012 · TP-18-006 (Database / Server Error Finding) · Type: **Failed** |
| **Test Procedure** | Force a DB insert failure on `contact_requests`, submit a valid form, and observe the response. |
| **Test Data** | A valid contact form; a forced INSERT failure (e.g. BEFORE INSERT trigger / FK violation). |
| **Expected Result** | A graceful "Failed to send message" message is shown and no contact request is stored. |
| **Actual Result** | The handler does not catch the `mysqli_sql_exception`; an uncaught exception / raw error output is produced rather than the JSON error message. |
| **Unexpected Outcome** | On a DB error the user sees a raw failure (potential internal-detail leak) instead of a handled message. |
| **Procedure to reproduce** | 1. Add a trigger that makes the `contact_requests` insert fail. 2. Submit a valid contact form. 3. Observe the uncaught error instead of a graceful message. 4. Remove the trigger. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP (PHP 8.1, mysqli throws by default); Chromium; module Contact Form. |
| **Attempt to repeat** | Reproduced consistently while the failure trigger was active. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Teoh Xuan Xuan |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Wrap the insert in try/catch, return a JSON "Failed to send message" on failure, and disable detailed error output on the live site. |

---

### TIR-MENU-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-MENU-001 |
| **Summary** | The `food_items` table has no status column, so a food item cannot be marked unavailable, archived, or restored. The state-transition design (available / unavailable / archived) cannot be implemented; only create / update / delete CRUD exists. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Food/Menu Management (`api/menu-handler.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-22-002, 003, 005, 007, 009, 011, 012, 013, 015, 016, 017, 020, 021, 022, 023, 024 · TP-22-004 · Type: **Skipped** |
| **Test Procedure** | Attempt the availability/archive state transitions on a food item. |
| **Test Data** | A food item created with the `F022TEST_` marker. |
| **Expected Result** | The item can move between available / unavailable / archived and be restored, per the state diagram. |
| **Actual Result** | `food_items` has no `status` column; the handler exposes only add / update / delete, so the availability and archive transitions do not exist. |
| **Unexpected Outcome** | 16 state-transition test cases are not implementable; the menu cannot represent unavailable or archived items. |
| **Procedure to reproduce** | 1. As admin, add a food item. 2. Attempt to mark it unavailable / archive it. 3. Observe there is no such operation or column. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Food/Menu Management. |
| **Attempt to repeat** | Confirmed by schema review — no `status` column on `food_items`. |
| **Tester's Name** | Yang Jia En |
| **Observer's Name** | Teoh Xuan Xuan |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Add a `status` column (available / unavailable / archived) to `food_items` and implement the transitions in `menu-handler.php`, or amend the TDS to limit F022 to CRUD only. |

---

### TIR-ORDER-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-ORDER-001 |
| **Summary** | The order lifecycle has no "preparing" or "ready" status. `admin-orders.php` accepts only pending / confirmed / completed / cancelled, so the preparing and ready transitions in the design cannot occur. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Order Management (`api/admin-orders.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-25-004, TC-25-006, TC-25-007, TC-25-008, TC-25-010, TC-25-013 · TP-25-004 · Type: **Skipped** |
| **Test Procedure** | Attempt confirmed → preparing, preparing → ready, and ready → completed. |
| **Test Data** | A seeded order moved to `confirmed`. |
| **Expected Result** | The order can be set to preparing, then ready, then completed, per the order state diagram. |
| **Actual Result** | `update_order_status` validates against pending/confirmed/completed/cancelled only; setting `preparing`/`ready` returns an invalid-status error. |
| **Unexpected Outcome** | The preparing and ready stages cannot be represented; the fulfilment workflow defined in the design is missing. |
| **Procedure to reproduce** | 1. Seed and confirm an order. 2. Call `update_order_status` with status=`preparing`. 3. Observe rejection. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Order Management. |
| **Attempt to repeat** | Confirmed across repeated attempts — preparing/ready always rejected. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Cheong Xin Chen |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Extend the order status set and `update_order_status` validation to include `preparing` and `ready`, or amend the TDS to the implemented four-state model. |

---

### TIR-ORDER-002

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-ORDER-002 |
| **Summary** | There is no "refunded" order status, so a cancelled order cannot be progressed to refunded. The refund transition in the design cannot occur. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Order Management (`api/admin-orders.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-25-009, TC-25-014 · TP-25-005 · Type: **Skipped** |
| **Test Procedure** | Attempt cancelled → refunded. |
| **Test Data** | A seeded order moved to `cancelled`. |
| **Expected Result** | The cancelled order can be set to refunded, per the design. |
| **Actual Result** | `refunded` is not a valid status; the update is rejected. |
| **Unexpected Outcome** | Refunds cannot be tracked in the order status; the refund stage is missing. |
| **Procedure to reproduce** | 1. Seed and cancel an order. 2. Call `update_order_status` with status=`refunded`. 3. Observe rejection. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Order Management. |
| **Attempt to repeat** | Confirmed — refunded always rejected. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Cheong Xin Chen |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Add a `refunded` status (and link it to the payment-refund flow), or amend the TDS to drop the refund state. |

---

### TIR-CUST-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CUST-001 |
| **Summary** | Customer Management has no search/filter feature, so the "search returns matching records" and "no customer record found" flows cannot be exercised. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Customer Management (`admin/sections/customers.php`, `api/admin-users.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-26-003, TC-26-004, TC-26-011, TC-26-012 · TP-26-007 · Type: **Skipped** |
| **Test Procedure** | Search/filter the customer list by name or email. |
| **Test Data** | A search keyword (matching and non-matching). |
| **Expected Result** | Matching records are shown; a "no customer record found" message appears when there is no match. |
| **Actual Result** | The customer-management page has no search/filter control; the search-based flows are not implementable. |
| **Unexpected Outcome** | Admins cannot search customers; the search test cases cannot run. |
| **Procedure to reproduce** | 1. As admin, open the Customer Management page. 2. Look for a search/filter control — none exists. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Customer Management. |
| **Attempt to repeat** | Confirmed by UI review — no search control. |
| **Tester's Name** | Cheong Xin Chen |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Add a customer search/filter control and a "no records found" message, or amend the TDS to drop the search cases. |

---

### TIR-STAFF-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-STAFF-001 |
| **Summary** | The staff-create action does not validate email format. A malformed email (e.g. `notanemail`) is accepted and a staff account is created. The design requires the email to be rejected. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Staff Management (`api/admin-users.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-27-004, TC-27-016 · TP-27-008 · Type: **Failed** |
| **Test Procedure** | As admin, create a staff account with a malformed email. |
| **Test Data** | first_name/last_name/password valid; email=`notanemail`; role=staff. |
| **Expected Result** | The create is rejected with an invalid-email message. |
| **Actual Result** | The create action checks required fields and duplicate email only — not the format — so the account is created with the malformed email. |
| **Unexpected Outcome** | Staff accounts can be created with invalid email addresses. |
| **Procedure to reproduce** | 1. As admin, POST `action=create` with email=`notanemail` and valid other fields. 2. Observe `{success:true}` and the new row. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Staff Management. |
| **Attempt to repeat** | Repeated with several malformed emails — accepted each time. |
| **Tester's Name** | Tey Jun Cheng |
| **Observer's Name** | Cheong Xin Chen |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Validate the email format server-side (e.g. `filter_var(..., FILTER_VALIDATE_EMAIL)`) in the staff create/update actions. |

---

### TIR-COUPON-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-COUPON-001 |
| **Summary** | Coupon creation lacks several boundary validations. The design requires rejecting a too-short code, a negative minimum-purchase, an invalid usage limit, and a past expiry date; the handler accepts all of them. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Coupon Management (`api/admin-coupons.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-28-001/019 (code length), TC-28-004/020 (negative min purchase), TC-28-010/022 (usage limit), TC-28-013/023 (past expiry) · TP-28-001/002/004/005 · Type: **Failed** |
| **Test Procedure** | Create coupons with each out-of-range value and observe whether they are rejected. |
| **Test Data** | code=`AB` (2 chars); min_purchase=`-100`; usage_limit=`-5`; valid_until = a past date. |
| **Expected Result** | Each is rejected with an appropriate message. |
| **Actual Result** | `create` validates only: non-empty code, discount_value>0 (≤100% for percentage), and duplicate code. It does **not** validate code length, negative min_purchase, usage-limit validity, or past expiry — so all four are accepted. |
| **Unexpected Outcome** | Invalid coupons (too-short codes, negative minimum purchase, negative/zero usage limit, already-expired) can be created, risking data-integrity and pricing issues. |
| **Procedure to reproduce** | 1. As admin, POST `action=create` with each invalid value above. 2. Observe `{success:true}` instead of a rejection. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Coupon Management. |
| **Attempt to repeat** | Each value repeated — accepted each time. |
| **Tester's Name** | Teoh Xuan Xuan |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Add server-side validation in `create`/`update`: minimum code length, `min_purchase >= 0`, `usage_limit >= 1`, and `valid_until >= today`, each with a clear error message. |

---

### TIR-BLOG-001

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-BLOG-001 |
| **Summary** | The blog-add action performs no image type/size validation: it moves any uploaded file (e.g. a `.txt`) and creates the post. The design requires rejecting non-image uploads. |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Blog Management (`api/admin-blogs.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-29-004, TC-29-013 · TP-29-008 · Type: **Failed** |
| **Test Procedure** | As admin, add a blog post with a non-image file as the featured image. |
| **Test Data** | `featured_image` = `bad.txt` (mime `text/plain`); valid title/category/content. |
| **Expected Result** | The upload is rejected with an invalid-image message. |
| **Actual Result** | No file-type/size check is performed; the file is moved into the uploads directory and the blog post is created successfully. |
| **Unexpected Outcome** | Arbitrary file types can be uploaded through the blog image field — a potential file-upload security risk. |
| **Procedure to reproduce** | 1. As admin, submit a multipart `action=add` with a `.txt` `featured_image`. 2. Observe the file is stored and the post created. |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Blog Management. |
| **Attempt to repeat** | Reproduced consistently with non-image files. |
| **Tester's Name** | Teoh Xuan Xuan |
| **Observer's Name** | Tey Jun Cheng |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☒ Major ☐ Minor |
| **Priority** | ☒ Immediate ☐ Delayed ☐ Deferred |
| **Corrective action** | Validate the upload MIME type/extension against an allow-list of image types and enforce a size limit before moving the file; reject anything else. |

---

### TIR-CONTACT-002

| Field | Detail |
|---|---|
| **Test Incident Number** | TIR-CONTACT-002 |
| **Summary** | Contact-request status has no "viewed" state. The enum is only pending / in-progress / resolved, so a request cannot be marked viewed, and every lifecycle flow that passes through "viewed" is unreachable. (Responded and closed both collapse to `resolved`.) |
| **Date and Time Incident** | 10/06/2026 |
| **Context** | Hotel Annapurna Web — Contact Request Management (`api/admin-contacts.php`), version 1.0 |
| **Related Test Cases / Procedure** | TC-30-001, 003, 004, 005, 020 (viewed state), TC-30-014, 015, 016, 017, 018 (flows requiring viewed) · TP-30-004 / TP-30-005 · Type: **Skipped** |
| **Test Procedure** | Attempt to set a request to `viewed`, and attempt the full lifecycle flows that pass through `viewed`. |
| **Test Data** | A `contact_requests` row with the `CRTEST_` subject marker. |
| **Expected Result** | The request can be marked viewed and progress new → viewed → in-progress → responded → closed, per the state diagram. |
| **Actual Result** | `update_status` validates only pending/in-progress/resolved; setting `viewed` returns "Invalid status", so the viewed state and any flow through it are unreachable. |
| **Unexpected Outcome** | The "viewed" lifecycle stage is missing and responded/closed are indistinguishable (both `resolved`); 10 state cases cannot pass as designed. |
| **Procedure to reproduce** | 1. Create a pending request. 2. Call `update_status` with status=`viewed`. 3. Observe "Invalid status". |
| **Test Environment** | HAWS_WEB v1.0 on local XAMPP; Chromium; module Contact Request Management. |
| **Attempt to repeat** | Confirmed — `viewed` always rejected. |
| **Tester's Name** | Teoh Xuan Xuan |
| **Observer's Name** | Cheong Xin Chen |
| **Status of Incident** | ☒ Open ☐ Assigned for Resolution ☐ Approved for Resolution ☐ Retested with fix confirmed ☐ Fixed |
| **Impact** | ☐ Mission Critical ☐ Major ☒ Minor |
| **Priority** | ☐ Immediate ☒ Delayed ☐ Deferred |
| **Corrective action** | Extend the `contact_requests.status` enum and `update_status` validation to include `viewed` (and distinguish responded vs closed if required), or amend the TDS to the implemented three-state model. |

---

## Conclusions and Recommendations (Table 3)

A total of **21 incidents** were recorded for HAWS_WEB v1.0: **8 manual exploratory security findings** (incidents 1–8) and **13 findings from the automated Playwright suite's failed/skipped test cases** (incidents 9–21). By impact: **2 Mission Critical, 12 Major, 7 Minor**.

**Mission Critical (2)** — TIR-AUTH-001 ("Remember Me" lets anyone sign in as the administrator) and TIR-PAY-001 (an order is confirmed as paid from an unverified eSewa confirmation) — must be fixed before any further testing or release.

**Major (12)** — the original money/data/exposure findings TIR-BOOK-001, TIR-CART-001, TIR-CONF-001, TIR-DBG-001, plus the automated findings TIR-CART-003 (no food availability gate), TIR-PAY-002 (eSewa not integrated), TIR-CONTACT-001 (uncaught DB exception), TIR-MENU-001 (no food status), TIR-ORDER-001 / TIR-ORDER-002 (missing order states), TIR-COUPON-001 (missing coupon validations) and TIR-BLOG-001 (no image-upload validation). The missing-validation/guard items (TIR-CART-003, TIR-CONTACT-001, TIR-COUPON-001, TIR-BLOG-001) should be fixed straight away; the missing-feature/state items (TIR-PAY-002, TIR-MENU-001, TIR-ORDER-001/002) need development before those design flows can be verified at the next test level.

**Minor (7)** — TIR-ADMIN-001, TIR-REG-001, plus TIR-REG-002, TIR-CART-002, TIR-CUST-001, TIR-STAFF-001, TIR-CONTACT-002 — are logic mistakes or design-vs-implementation mismatches; each should be implemented or the Test Design Specification amended to match the build so the traceability stays consistent.

We recommend that all 21 incidents be assigned for resolution, that the design/spec be reconciled where a feature is intentionally out of scope, and that the affected modules be **fully re-tested after the fixes** using the same Test Procedures (HAWS_TPS_1) — for the automated findings, by re-running the corresponding specs so the previously failing/skipped cases turn green.

## Approvals

| Name | Job Title | Signature |
|---|---|---|
| Teoh Xuan Xuan | Test Lead, Hotel Annapurna IV&V | |
| Yang Jia En | Test Manager, Hotel Annapurna IV&V | |
| | Product Manager, Hotel Annapurna | |

