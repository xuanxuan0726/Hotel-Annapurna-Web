# Test Case Specification

**for**

## Hotel Annapurna Web — Hotel Management System

Independent Verification and Validation

| | |
|---|---|
| **Version** | 1.0.0 |
| **Date** | 10/06/2026 |
| **Section** | TT1L |
| **Group** | 7 |

| NAME | STUDENT ID |
|---|---|
| Yang Jia En | 242UC2451Q |
| Teoh Xuan Xuan | 242UC2451P |
| Tey Jun Cheng | 242UC2452Z |
| Cheong Xin Chen | 251UC250T4 |

---

## Document Control

| | |
|---|---|
| **Document Name** | Hotel Annapurna Web Management System Test Case Specification (Iteration 1) |
| **Reference Number** | HAWS_TCS_1 |
| **Version** | 1.0.0 |
| **Project Code** | CSE6324_HAWS |
| **Status** | In-use |
| **Date Released** | 10/06/2026 |

| Name | Position | Signature |
|---|---|---|
| Prepared By: Yang Jia En | Group Leader | Jia En |

## Version History

| Version | Release Date | Section | Amendments |
|---|---|---|---|
| 1.0.0 | 10/06/2026 | All | Original Document |

---

## 1.0 Introduction

### 1.1 Purpose

This Test Case Specification details the executable test cases derived from the test coverage items
defined in the Hotel Annapurna Web (HAWS) Test Design Specification (HAWS_TDS_1_1.0.0). Each case
specifies its inputs, expected result, special procedural (precondition) requirements, and intercase
dependency.

### 1.2 References

i. IEEE 829-2008 Standard for Software and System Test Documentation
ii. Hotel Annapurna Web Software Requirement Specifications
iii. Hotel Annapurna Web System Design Specifications
iv. Hotel Annapurna Web Source Code and Database Structure
v. Hotel Annapurna Web Test Design Specification (HAWS_TDS_1_1.0.0)

---

## 2.0 Test Cases

### 2.1 Environment

Tests are automated with **Playwright Test (`@playwright/test` ^1.60.0)** and executed against a live
local deployment. Database-grounded assertions and test-data setup/cleanup use the MySQL CLI.

| Item | Value |
|---|---|
| Automation tool | Playwright Test, project `chromium`, `--workers=1` |
| Application URL | `http://localhost/Hotel-Annapurna-Web` |
| Web/App server | XAMPP Apache (PHP 8.1+) |
| Database | MariaDB (XAMPP), schema `hotel_annapurna`, accessed via `C:\xampp\mysql\bin\mysql.exe -uroot` |
| Report | `npx playwright show-report` |

**Standing test accounts**

| Role | Email | Password | Notes |
|---|---|---|---|
| Administrator | `lucavalentines80@gmail.com` | `adminadmin` | `role=admin`, `status=verified` |
| Registered customer | `yangenna20@gmail.com` | `ennayang` | `role=customer`, `status=verified` |

**Conventions**

- *Special Procedural Requirements* lists the preconditions a case needs (logged-in role, seeded rows, backup/restore of shared tables, etc.).
- *Intercase Dependency* is **None** unless stated; each case sets up and cleans up its own data in a `finally` block.
- Cases marked **(documents gap — currently FAILS)** assert the behavior the design requires; the application does not implement it, so the case is intentionally red to surface the gap (per the IV&V "fail-if-missing" directive). The other cases pass.
- Throwaway data uses recognizable prefixes (`pwtest_`, `cmtest_`, `CRTEST_`, `F029TEST_`, etc.) and is deleted after each run; standing accounts and shared catalogue rows are restored.

### 2.2 Test Cases

This section details all test cases, grouped by feature. Each case maps to one or more Test Coverage
(TCOV) and Test Condition (TCON) items from the Test Design Specification.

---

### 2.2.1 F001 User Registration

> Page under test: `register.php` + `register-handler.php`. Validation is HTML5 attribute + server-side
> PHP only (no client JS). Server errors render in the cancelled-style error box; success redirects to
> `verify-register.php` and issues an OTP. Contact rule is exactly 10 digits (`/^\d{10}$/`).

#### TC-01-001 — Verify registration with all valid details
- **Related Feature ID:** F001 · **Covered:** TCOV-01-001, TCOV-01-008, TCOV-01-018 · **Precond:** Fresh unique email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Name=Test User, Email=`pwtest_<unique>@example.com`, Contact=9812345678, Password=Password1!, Confirm=Password1!, Terms=checked | System accepts registration and redirects to `verify-register.php`; OTP row created and email sent |

#### TC-01-002 — Verify registration with empty required field
- **Related Feature ID:** F001 · **Covered:** TCOV-01-002, TCOV-01-009 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Leave `#firstName` empty, fill all other fields validly, Terms=checked, submit | Native HTML5 validation blocks submit; `#firstName.checkValidity()===false`; page stays on `register.php` |

#### TC-01-003 — Verify registration with invalid email format
- **Related Feature ID:** F001 · **Covered:** TCOV-01-003, TCOV-01-009 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`invalidemail` (no `@`), other fields valid, submit | HTML5 `type=email` blocks submit; `#email.checkValidity()===false`; stays on `register.php` |

#### TC-01-004 — Verify registration with duplicate email
- **Related Feature ID:** F001 · **Covered:** TCOV-01-004, TCOV-01-009 · **Precond:** `yangenna20@gmail.com` already registered · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`yangenna20@gmail.com`, other fields valid, submit | Error box visible containing **"Email already registered"**; stays on `register.php` |

#### TC-01-005 — Verify registration with invalid contact number format
- **Related Feature ID:** F001 · **Covered:** TCOV-01-005, TCOV-01-009 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Contact=`12ab56`, other fields valid, submit | Error box containing **"Contact number must be 10 digits"**; stays on `register.php` |

#### TC-01-006 — Verify registration with invalid password
- **Related Feature ID:** F001 · **Covered:** TCOV-01-006, TCOV-01-009 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Password=Confirm=`pass1`, other fields valid, submit | Error box containing **"Password must be at least 8 characters"**; stays on `register.php` |

#### TC-01-007 — Verify registration with confirm password mismatch
- **Related Feature ID:** F001 · **Covered:** TCOV-01-007, TCOV-01-009 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Password=`Password1!`, Confirm=`Different1!`, other fields valid, submit | Error box containing **"Passwords do not match"**; stays on `register.php` |

#### TC-01-008 — Verify password boundary with 0 characters
- **Related Feature ID:** F001 · **Covered:** TCOV-01-010 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Password empty, other fields valid, submit | HTML5 `required` blocks submit; `#password.checkValidity()===false`; stays on `register.php` |

#### TC-01-009 — Verify password boundary with 7 characters
- **Related Feature ID:** F001 · **Covered:** TCOV-01-011 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Password=Confirm=`abc1234` (7), other fields valid, submit | Error box containing **"Password must be at least 8 characters"** |

#### TC-01-010 — Verify password boundary with 8 characters
- **Related Feature ID:** F001 · **Covered:** TCOV-01-012 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Password=Confirm=`abc12345` (8), other fields valid, submit | Registration accepted; redirect to `verify-register.php` |

#### TC-01-011 — Verify password boundary with 9 characters
- **Related Feature ID:** F001 · **Covered:** TCOV-01-013 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Password=Confirm=`abc123456` (9), other fields valid, submit | Registration accepted; redirect to `verify-register.php` |

#### TC-01-012 — Verify contact number boundary with 9 digits
- **Related Feature ID:** F001 · **Covered:** TCOV-01-014 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Contact=`012345678` (9), other fields valid, submit | Error box containing **"Contact number must be 10 digits"** |

#### TC-01-013 — Verify contact number boundary with 10 digits
- **Related Feature ID:** F001 · **Covered:** TCOV-01-015 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Contact=`0123456789` (10), other fields valid, submit | Registration accepted; redirect to `verify-register.php` |

#### TC-01-014 — Verify contact number boundary with 11 digits
- **Related Feature ID:** F001 · **Covered:** TCOV-01-016 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Contact=`01234567890` (11), other fields valid, submit | Design treats 11 as upper-valid boundary → **should be accepted**. App requires exactly 10 digits, so it is rejected with "Contact number must be 10 digits" **(documents gap — currently FAILS)** |

#### TC-01-015 — Verify contact number boundary with 12 digits
- **Related Feature ID:** F001 · **Covered:** TCOV-01-017 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Contact=`012345678901` (12), other fields valid, submit | Error box containing **"Contact number must be 10 digits"** |

#### TC-01-016 — User Registration Main Flow
- **Related Feature ID:** F001 · **Covered:** TCOV-01-001, 008, 012, 015, 018 · **Precond:** Fresh email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid name, fresh email, 10-digit contact, 8-char password, matching confirm, Terms=checked, submit | Registration accepted; redirect to `verify-register.php`; OTP issued |

#### TC-01-017 — User Registration Alternate Flow – Invalid Input
- **Related Feature ID:** F001 · **Covered:** TCOV-01-002, 003, 005, 006, 009 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit with an invalid field (empty / malformed email / bad contact / short password) | Submission rejected — native block for HTML5-invalid fields, otherwise server error box shown; stays on `register.php` |

#### TC-01-018 — User Registration Alternate Flow – Duplicate Email
- **Related Feature ID:** F001 · **Covered:** TCOV-01-004, 009 · **Precond:** `yangenna20@gmail.com` exists · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`yangenna20@gmail.com`, other fields valid, submit | Error box containing **"Email already registered"** |

---

### 2.2.2 F002 User Login

> Page under test: `login.php` + `login-handler.php`. HTML5 `required` on both fields; server errors in
> the cancelled-style box. Success redirects admins to `admin/index.php`, all others to `index.php`.

#### TC-02-001 — Verify email field is empty
- **Related Feature ID:** F002 · **Covered:** TCOV-02-001 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email empty, Password filled, submit | HTML5 `required` blocks submit; `#email.checkValidity()===false`; stays on `login.php` |

#### TC-02-002 — Verify password field is empty
- **Related Feature ID:** F002 · **Covered:** TCOV-02-002 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email filled, Password empty, submit | HTML5 `required` blocks submit; `#password.checkValidity()===false`; stays on `login.php` |

#### TC-02-003 — Verify account does not exist
- **Related Feature ID:** F002 · **Covered:** TCOV-02-003 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`nonexistent_<unique>@example.com`, Password=any | Error box containing **"Invalid email or password"** |

#### TC-02-004 — Verify incorrect password
- **Related Feature ID:** F002 · **Covered:** TCOV-02-004 · **Precond:** `yangenna20@gmail.com` exists · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`yangenna20@gmail.com`, Password=`wrongpassword` | Error box containing **"Invalid email or password"** |

#### TC-02-005 — Verify unverified account cannot login
- **Related Feature ID:** F002 · **Covered:** TCOV-02-005 · **Precond:** A user with `status='pending'` · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Login with a `pending` (unverified) account | Error box containing **"Please verify your email address before logging in"**. *(Skipped in the automated run — normal registration only creates verified users; requires a seeded pending account.)* |

#### TC-02-006 — Verify admin login redirects to admin dashboard
- **Related Feature ID:** F002 · **Covered:** TCOV-02-006 · **Precond:** Admin account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`lucavalentines80@gmail.com`, Password=`adminadmin` | Redirect to `admin/index.php` |

#### TC-02-007 — Verify customer login redirects to customer homepage
- **Related Feature ID:** F002 · **Covered:** TCOV-02-007 · **Precond:** Customer account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`yangenna20@gmail.com`, Password=`ennayang` | Redirect to `index.php` (not `/admin/`) |

#### TC-02-008 — User Login Main Flow – Admin
- **Related Feature ID:** F002 · **Covered:** TCOV-02-006 · **Precond:** Admin account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid admin credentials | Session created; redirect to `admin/index.php` |

#### TC-02-009 — User Login Main Flow – Customer
- **Related Feature ID:** F002 · **Covered:** TCOV-02-007 · **Precond:** Customer account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid customer credentials | Session created; redirect to `index.php` |

#### TC-02-010 — User Login Alternate Flow – Empty Login Details
- **Related Feature ID:** F002 · **Covered:** TCOV-02-001, 002 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit with email and/or password empty | HTML5 blocks submit; target field invalid; stays on `login.php` |

#### TC-02-011 — User Login Alternate Flow – Invalid Account
- **Related Feature ID:** F002 · **Covered:** TCOV-02-003 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Unregistered email + any password | Error box **"Invalid email or password"** |

#### TC-02-012 — User Login Alternate Flow – Incorrect Password
- **Related Feature ID:** F002 · **Covered:** TCOV-02-004 · **Precond:** Customer account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid email + wrong password | Error box **"Invalid email or password"** |

#### TC-02-013 — User Login Alternate Flow – Account Not Verified
- **Related Feature ID:** F002 · **Covered:** TCOV-02-005 · **Precond:** Pending account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Login with unverified account | Error box **"Please verify your email address before logging in"** *(requires seeded pending account)* |

---

### 2.2.3 F003 Session Verification

> Verifies the active-session gate on protected pages (profile, cart, booking history, admin dashboard).
> Logout/expiry simulated by clearing cookies; protected access without a session redirects to login.

#### TC-03-001 — Access protected page and check session
- **Related Feature ID:** F003 · **Covered:** TCOV-03-001 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Request a protected page (e.g. `profile.php`) | System checks the session before serving the page |

#### TC-03-002 — Valid session allows user to view protected page
- **Related Feature ID:** F003 · **Covered:** TCOV-03-002 · **Precond:** Logged-in customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Logged-in user requests a protected page | Protected page is displayed |

#### TC-03-003 — Invalid session redirects user to login page
- **Related Feature ID:** F003 · **Covered:** TCOV-03-003 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Request a protected page with no/invalid session | Redirect to `login.php` |

#### TC-03-004 — Expired session redirects user to login page
- **Related Feature ID:** F003 · **Covered:** TCOV-03-004 · **Precond:** Cookies cleared after login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Clear session cookies, then request a protected page | Session destroyed; redirect to `login.php` |

#### TC-03-005 — User logs out from protected page
- **Related Feature ID:** F003 · **Covered:** TCOV-03-005 · **Precond:** Logged-in user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Click Logout while viewing a protected page | Session destroyed; redirected away from the protected page |

#### TC-03-006 — Session timeout redirects user to login page
- **Related Feature ID:** F003 · **Covered:** TCOV-03-006 · **Precond:** Logged-in user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Session times out, request protected page | Timeout handled; redirect to `login.php` |

#### TC-03-007 — Login success creates session and opens protected page
- **Related Feature ID:** F003 · **Covered:** TCOV-03-007 · **Precond:** Valid account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Successful login, then request protected page | Session created; protected page displayed |

#### TC-03-008 — Login failure remains on login page and shows error
- **Related Feature ID:** F003 · **Covered:** TCOV-03-008 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit invalid credentials | Stays on `login.php`; error message displayed |

#### TC-03-009 — Session Verification Main Flow
- **Related Feature ID:** F003 · **Covered:** TCOV-03-001, 002 · **Precond:** Logged-in user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Logged-in user accesses a protected page | Session checked → valid → protected page shown |

#### TC-03-010 — Session Verification Alternate Flow – Invalid Session
- **Related Feature ID:** F003 · **Covered:** TCOV-03-001, 003 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access protected page without a session | Redirect to login |

#### TC-03-011 — Session Verification Alternate Flow – Expired Session
- **Related Feature ID:** F003 · **Covered:** TCOV-03-001, 004 · **Precond:** Cleared cookies · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access protected page with expired session | Session destroyed; redirect to login |

#### TC-03-012 — Session Verification Alternate Flow – Logout
- **Related Feature ID:** F003 · **Covered:** TCOV-03-001, 002, 005 · **Precond:** Logged-in user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View protected page, then logout | Session destroyed; access no longer permitted |

#### TC-03-013 — Session Verification Alternate Flow – Session Timeout
- **Related Feature ID:** F003 · **Covered:** TCOV-03-001, 002, 006 · **Precond:** Logged-in user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View protected page, simulate timeout, re-request | Redirect to login |

---

### 2.2.4 F004 OTP Account Verification

> Page under test: `verify-register.php`. OTP is generated server-side, stored in `registration_otps`,
> and emailed (Mailtrap sink). The OTP **value** is read from the DB for deterministic assertions.
> Resend has a real 60-second cooldown.

#### TC-04-001 — Verify OTP field is empty
- **Related Feature ID:** F004 · **Covered:** TCOV-04-001 · **Precond:** Freshly registered (session OTP) · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Register, type a 6-digit code, submit | Hidden `#otpFinal` equals typed code; server processes submission and shows an alert |

#### TC-04-002 — Verify OTP does not match the registered email
- **Related Feature ID:** F004 · **Covered:** TCOV-04-002 · **Precond:** Freshly registered · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit a code different from the stored OTP | `.alert-error` **"Invalid OTP! Please check and try again."** |

#### TC-04-003 — Verify OTP is expired
- **Related Feature ID:** F004 · **Covered:** TCOV-04-003 · **Precond:** Registered; OTP expiry set to past · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Expire the OTP in DB, submit the real OTP | `.alert-error` **"OTP has expired! Please request a new OTP."** |

#### TC-04-004 — Verify OTP has already been used
- **Related Feature ID:** F004 · **Covered:** TCOV-04-004 · **Precond:** Registered; OTP `used=1` · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark OTP used in DB, submit the real OTP | Rejected with **"Invalid OTP!"** (the `used=0` guard) |

#### TC-04-005 — Verify valid OTP successfully verifies account
- **Related Feature ID:** F004 · **Covered:** TCOV-04-005 · **Precond:** Freshly registered · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Read OTP from DB, submit it | `.alert-success` **"Registration successful! Redirecting..."**; `users` row created |

#### TC-04-006 — Verify resend OTP after cooldown passed
- **Related Feature ID:** F004 · **Covered:** TCOV-04-006 · **Precond:** Registered; wait ≥60s · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | After cooldown, enable + click Resend | `.alert-success` **"New OTP has been sent to your email!"** |

#### TC-04-007 — Verify resend OTP before cooldown passed
- **Related Feature ID:** F004 · **Covered:** TCOV-04-007 · **Precond:** Freshly registered (cooldown active) · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Immediately enable + click Resend | `.alert-error` **"Please wait N seconds before requesting a new OTP."** |

#### TC-04-008 — Verify resend OTP invalidates previous OTP and stores new OTP
- **Related Feature ID:** F004 · **Covered:** TCOV-04-008 · **Precond:** Registered; wait ≥60s · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Resend after cooldown; compare OTP rows | A new OTP row is generated/stored (`registration_otps` count increases) |

#### TC-04-009 — OTP Account Verification Main Flow
- **Related Feature ID:** F004 · **Covered:** TCOV-04-005 · **Precond:** Freshly registered · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Register → read OTP → submit | Account verified; success alert; redirect to `index.php` |

#### TC-04-010 — OTP Account Verification Alternate Flow – Empty OTP
- **Related Feature ID:** F004 · **Covered:** TCOV-04-001 · **Precond:** Freshly registered · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit with empty OTP | `.alert-error` invalid OTP message |

#### TC-04-011 — OTP Account Verification Alternate Flow – Invalid OTP
- **Related Feature ID:** F004 · **Covered:** TCOV-04-002 · **Precond:** Freshly registered · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit a wrong 6-digit code | `.alert-error` **"Invalid OTP!"** |

#### TC-04-012 — OTP Account Verification Alternate Flow – Expired OTP
- **Related Feature ID:** F004 · **Covered:** TCOV-04-003 · **Precond:** OTP expired in DB · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit real OTP after expiring it | `.alert-error` **"OTP has expired!"** |

#### TC-04-013 — OTP Account Verification Alternate Flow – Used OTP
- **Related Feature ID:** F004 · **Covered:** TCOV-04-004 · **Precond:** OTP `used=1` · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit real OTP after marking used | Rejected **"Invalid OTP!"** |

#### TC-04-014 — OTP Account Verification Alternate Flow – Resend Cooldown Not Passed
- **Related Feature ID:** F004 · **Covered:** TCOV-04-007 · **Precond:** Cooldown active · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Resend during cooldown | `.alert-error` "…before requesting a new OTP" |

#### TC-04-015 — OTP Account Verification Alternate Flow – Resend New OTP Email
- **Related Feature ID:** F004 · **Covered:** TCOV-04-008 · **Precond:** Wait ≥60s · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Resend after cooldown | `.alert-success` "New OTP has been sent…"; new OTP row stored |

---

### 2.2.5 F005 Password Reset

> Pages under test: `forget-password.php` (OTP step) + `reset-password.php` (new-password step).
> The reset OTP is **not emailed** (DB-only). Each case creates a throwaway verified user; the reset
> page is reached via an inserted `used=1` `password_resets` token row. Real accounts are never modified.

#### TC-05-001 — Verify password reset with empty OTP field
- **Related Feature ID:** F005 · **Covered:** TCOV-05-001 · **Precond:** Throwaway user; OTP step reached · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit OTP step with empty OTP | `.pwd-alert-error` **"Invalid OTP! Please check and try again."** |

#### TC-05-002 — Verify password reset with 5-digit OTP
- **Related Feature ID:** F005 · **Covered:** TCOV-05-002 · **Precond:** Throwaway user; OTP step · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit OTP=`12345` (5 digits) | `.pwd-alert-error` **"Invalid OTP!"** |

#### TC-05-003 — Verify password reset with 6-digit OTP
- **Related Feature ID:** F005 · **Covered:** TCOV-05-003 · **Precond:** Throwaway user; OTP read from DB · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit the real 6-digit OTP | Redirect to `reset-password.php?token=…` |

#### TC-05-004 — Verify password reset with 7-digit OTP
- **Related Feature ID:** F005 · **Covered:** TCOV-05-004 · **Precond:** Throwaway user; OTP step · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit OTP=`1234567` (7 digits) | `.pwd-alert-error` **"Invalid OTP!"** |

#### TC-05-005 — Verify password reset with empty new password field
- **Related Feature ID:** F005 · **Covered:** TCOV-05-005 · **Precond:** Reset page reached via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Leave new password empty, submit | HTML5 block; `#pwd-password.checkValidity()===false`; stays on `reset-password.php` |

#### TC-05-006 — Verify password reset with 7-character new password
- **Related Feature ID:** F005 · **Covered:** TCOV-05-006 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | New password=`Passw1` (7), submit | HTML5 `minlength` block; `checkValidity()===false`; stays |

#### TC-05-007 — Verify password reset with 8-character new password
- **Related Feature ID:** F005 · **Covered:** TCOV-05-007 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | New=`Passwd12` (8), Confirm matching, submit | Password updated; redirect to `index.php` |

#### TC-05-008 — Verify password reset with 9-character new password
- **Related Feature ID:** F005 · **Covered:** TCOV-05-008 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | New=`Passwd123` (9), Confirm matching, submit | Password updated; redirect to `index.php` |

#### TC-05-009 — Verify password reset when confirm matches new password
- **Related Feature ID:** F005 · **Covered:** TCOV-05-009 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid 8+ password, matching confirm, submit | Success; redirect to `index.php` |

#### TC-05-010 — Verify password reset when confirm does not match new password
- **Related Feature ID:** F005 · **Covered:** TCOV-05-010 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | New=`abc12345`, Confirm=`abc12346` (both ≥8) | `.pwd-alert-error` **"Passwords do not match!"** |

#### TC-05-011 — Verify password reset is successful with valid OTP and valid password
- **Related Feature ID:** F005 · **Covered:** TCOV-05-011 · **Precond:** Reset page via token; capture old hash · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid new password + matching confirm, submit | Redirect to `index.php`; stored password hash changed |

#### TC-05-012 — Verify password reset is rejected with invalid input
- **Related Feature ID:** F005 · **Covered:** TCOV-05-012 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mismatched passwords (≥8) | `.pwd-alert-error` **"Passwords do not match!"**; stays on `reset-password.php` |

#### TC-05-013 — Password Reset Main Flow
- **Related Feature ID:** F005 · **Covered:** TCOV-05-003, 007, 009, 011 · **Precond:** Throwaway user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Real OTP → reset page → valid password | Success; redirect to `index.php`; hash updated |

#### TC-05-014 — Password Reset Alternate Flow – Invalid OTP Length
- **Related Feature ID:** F005 · **Covered:** TCOV-05-001, 002, 004, 012 · **Precond:** OTP step · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Submit OTP of length 0 / 5 / 7 | `.pwd-alert-error` **"Invalid OTP!"** |

#### TC-05-015 — Password Reset Alternate Flow – Invalid Password Length
- **Related Feature ID:** F005 · **Covered:** TCOV-05-005, 006, 012 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | New password empty / 7 chars | HTML5 block; stays on `reset-password.php` |

#### TC-05-016 — Password Reset Alternate Flow – Password Mismatch
- **Related Feature ID:** F005 · **Covered:** TCOV-05-010, 012 · **Precond:** Reset page via token · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mismatched passwords | `.pwd-alert-error` **"Passwords do not match!"** |

---

### 2.2.6 F006 Browse Food Menu

> Public page `menu.php` (no login). Three server-rendered category sections (Vegetarian, Non-Vegetarian,
> Chef's Special), cumulative pagination (`?<cat>_page=`), and a client-side selection panel. The
> empty-state case backs up and restores `food_items`. Run serially (`--workers=1`).

#### TC-06-001 — Browse Food Menu Main Flow
- **Related Feature ID:** F006 · **Covered:** TCOV-06-001, 008 · **Precond:** `food_items` seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open `menu.php` | `.menu-container` visible; 3 `.menu-section`; ≥1 `.menu-checkbox`; selection panel present |

#### TC-06-002 — Browse Food Menu Alternate Flow – No Food Item Available
- **Related Feature ID:** F006 · **Covered:** TCOV-06-002 · **Precond:** Backup+empty `food_items`, restore after · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty `food_items`, open `menu.php` | `.menu-checkbox` count = 0; no See-More button. *(Table restored in finally.)* |

#### TC-06-003 — Browse Vegetarian Category
- **Related Feature ID:** F006 · **Covered:** TCOV-06-003, 008 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open `menu.php` | "Vegetarian Delights" section table has ≥1 row |

#### TC-06-004 — Browse Non-Vegetarian Category
- **Related Feature ID:** F006 · **Covered:** TCOV-06-004, 008 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open `menu.php` | "Non-Vegetarian Specialties" section has ≥1 row |

#### TC-06-005 — Browse Chef's Special Category
- **Related Feature ID:** F006 · **Covered:** TCOV-06-005, 008 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open `menu.php` | "Chef's Special" section has ≥1 row and an extra "Available On" column |

#### TC-06-006 — See More Food Items
- **Related Feature ID:** F006 · **Covered:** TCOV-06-006 · **Precond:** ≥6 veg items · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Count veg rows (5), click "See More Vegetarian Items" | Veg row count increases (→10) |

#### TC-06-007 — See Less Food Items
- **Related Feature ID:** F006 · **Covered:** TCOV-06-007 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open `menu.php?veg_page=2` (10 rows), click "See Less" | Veg row count decreases (→5) |

#### TC-06-008 — Verify Food Details Display
- **Related Feature ID:** F006 · **Covered:** TCOV-06-008 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Read first veg row name+price; look up DB price | Displayed price equals `RS <price>` (data-grounded) |

#### TC-06-009 — Verify Selected Item Display
- **Related Feature ID:** F006 · **Covered:** TCOV-06-009 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Check first `.menu-checkbox` | A row with that item's name appears in `#menu-selected-table` |

#### TC-06-010 — Verify Total Price Calculation
- **Related Feature ID:** F006 · **Covered:** TCOV-06-010 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | `#menu-total-price` starts `RS 0.00`; check first item | Total becomes `RS <that item's price>` |

---

### 2.2.7 F007 Add Food to Cart

> Food add-to-cart is **client-side localStorage only** (no login gate, no food availability gate); the
> server cart API (`api/cart-handler.php`) requires login. Cases 025/026/027 assert the gates that
> *should* exist and are intentionally red. The add path triggers an `alert()` (auto-accepted).

#### TC-07-001 — Verify available food item can be added to cart successfully
- **Related Feature ID:** F007 · **Covered:** TCOV-07-001 · **Precond:** Logged out; seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add first veg item from `menu.php` | Redirect to `cart.php`; `.cart-item-title` shows the item name |

#### TC-07-002 — Verify user is redirected to login or shown login required message when not logged in
- **Related Feature ID:** F007 · **Covered:** TCOV-07-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add a food item while logged out | **Should** route to `login.php` / show login-required. App adds anyway and goes to `cart.php` **(documents gap — currently FAILS)** |

#### TC-07-003 — Verify invalid food item ID is rejected
- **Related Feature ID:** F007 · **Covered:** TCOV-07-003 · **Precond:** Item with `available_days` excluding today · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Attempt to add an item unavailable today | **Should** be blocked with a not-available message. App adds it **(documents gap — currently FAILS)**. Inserted row cleaned up |

#### TC-07-004 — Verify unavailable food item cannot be added to cart
- **Related Feature ID:** F007 · **Covered:** TCOV-07-004 · **Precond:** Unavailable item · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add attempt, then inspect `hotelCart.food` | **Should** be absent. App stores it **(documents gap — currently FAILS)**. Cleaned up |

#### TC-07-005 — Verify existing food item increases quantity instead of duplicate
- **Related Feature ID:** F007 · **Covered:** TCOV-07-005 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add the same item twice | `hotelCart.food` has one entry with `quantity===2` |

#### TC-07-006 — Verify invalid quantity is rejected
- **Related Feature ID:** F007 · **Covered:** TCOV-07-006 · **Precond:** Cart seeded (qty 1) · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | On `cart.php` click `−` at qty 1 | `.cart-qty-input` stays `1` (clamped, 0 rejected) |

#### TC-07-007 — Verify cart total is recalculated after item is added
- **Related Feature ID:** F007 · **Covered:** TCOV-07-007 · **Precond:** Cart seeded `{price:100, qty:1}` · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | `#subtotalValue` = `Rs. 100.00`; click `+` | Becomes `Rs. 200.00` |

#### TC-07-008 — Verify database or server error displays error message and cart remains unchanged
- **Related Feature ID:** F007 · **Covered:** TCOV-07-008 · **Precond:** Logged-in customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | POST cart API `action=add` with missing `item_data` | `{success:false,'Missing required fields'}`; `cart_items` count unchanged |

#### TC-07-009 — Add Food to Cart Main Flow
- **Related Feature ID:** F007 · **Covered:** TCOV-07-001, 007 · **Precond:** Seeded · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add item → cart total recalculates | Item in cart; subtotal reflects price |

#### TC-07-010 — Add Food to Cart Alternate Flow – User Not Logged In
- **Related Feature ID:** F007 · **Covered:** TCOV-07-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add while logged out | **Should** prompt login **(documents gap — currently FAILS)** |

#### TC-07-011 — Add Food to Cart Alternate Flow – Food Item Not Available
- **Related Feature ID:** F007 · **Covered:** TCOV-07-004 · **Precond:** Unavailable item · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add an unavailable item | **Should** be prevented **(documents gap — currently FAILS)** |

---

### 2.2.8 F008 Room Availability Checking

> Server checks a room's existence, status and date validity before booking. Cases exercise the
> decision-table conditions via the rooms page / booking handler with seeded room rows.

#### TC-08-001 — Verify room does not exist
- **Related Feature ID:** F008 · **Covered:** TCOV-08-001 · **Precond:** Invalid room id · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Check availability for a non-existent room | Selection rejected; error message; booking not allowed |

#### TC-08-002 — Verify room exists but is not available
- **Related Feature ID:** F008 · **Covered:** TCOV-08-002 · **Precond:** Room status≠available · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Check a reserved/occupied room | Rejected with error message |

#### TC-08-003 — Verify invalid check-in date
- **Related Feature ID:** F008 · **Covered:** TCOV-08-003 · **Precond:** Available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid check-in date | Rejected; error message |

#### TC-08-004 — Verify invalid check-out date
- **Related Feature ID:** F008 · **Covered:** TCOV-08-004 · **Precond:** Available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid check-out date | Rejected; error message |

#### TC-08-005 — Verify room already booked
- **Related Feature ID:** F008 · **Covered:** TCOV-08-005 · **Precond:** Room already booked · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Select an already-booked room | Rejected; error message |

#### TC-08-006 — Verify available room is displayed
- **Related Feature ID:** F008 · **Covered:** TCOV-08-006 · **Precond:** Available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open rooms page | Available room shown |

#### TC-08-007 — Verify invalid room selection is rejected
- **Related Feature ID:** F008 · **Covered:** TCOV-08-007 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Select an invalid room | Selection rejected |

#### TC-08-008 — Verify error message is displayed for invalid availability checking
- **Related Feature ID:** F008 · **Covered:** TCOV-08-008 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid availability request | Error message displayed |

#### TC-08-009 — Verify user can proceed to room booking when room is available
- **Related Feature ID:** F008 · **Covered:** TCOV-08-009 · **Precond:** Available room; logged-in customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid room + valid dates | Proceeds to room booking |

#### TC-08-010 — Room Availability Checking Main Flow
- **Related Feature ID:** F008 · **Covered:** TCOV-08-001…006, 009 · **Precond:** Seeded rooms · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Existing, available room with valid dates, not booked | Available room displayed; proceed to booking |

---

### 2.2.9 F009 Room Booking

> Booking handler creates an order with pending payment/booking status, computes duration and total,
> generates a reference, and sets the room to reserved. MySQL is not in strict mode, so the rollback
> case (013/022) forces an INSERT failure via FK violation.

#### TC-09-001 — Verify room booking can be created successfully
- **Related Feature ID:** F009 · **Covered:** TCOV-09-001 · **Precond:** Logged-in customer; available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=room, valid item_id, valid price/data, valid dates | Booking created; success message with reference + total |

#### TC-09-002 — Verify user must log in before booking a room
- **Related Feature ID:** F009 · **Covered:** TCOV-09-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Booking request without session | Rejected; authentication required |

#### TC-09-003 — Verify invalid request method is rejected
- **Related Feature ID:** F009 · **Covered:** TCOV-09-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Request method = GET | Rejected; invalid request method message |

#### TC-09-004 — Verify missing required booking information is rejected
- **Related Feature ID:** F009 · **Covered:** TCOV-09-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type empty / item_id=0 / price=0 | Rejected; missing information message |

#### TC-09-005 — Verify invalid booking type is rejected
- **Related Feature ID:** F009 · **Covered:** TCOV-09-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=`car` | Rejected; invalid booking type |

#### TC-09-006 — Verify invalid item data format is rejected
- **Related Feature ID:** F009 · **Covered:** TCOV-09-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_data = invalid JSON | Rejected; invalid data format |

#### TC-09-007 — Verify room not found error is displayed
- **Related Feature ID:** F009 · **Covered:** TCOV-09-007 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_id = invalid room id | Rejected; room not found |

#### TC-09-008 — Verify unavailable room cannot be booked
- **Related Feature ID:** F009 · **Covered:** TCOV-09-008 · **Precond:** Room status reserved/occupied · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Book a non-available room | Rejected |

#### TC-09-009 — Verify booking duration is calculated correctly
- **Related Feature ID:** F009 · **Covered:** TCOV-09-009 · **Precond:** Logged-in; available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | check_in=2026-05-01, check_out=2026-05-03 | Duration = 2 days |

#### TC-09-010 — Verify total price is calculated correctly
- **Related Feature ID:** F009 · **Covered:** TCOV-09-010 · **Precond:** Logged-in; available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | price=1000, duration=2 | Total = 2000 |

#### TC-09-011 — Verify booking reference is generated successfully
- **Related Feature ID:** F009 · **Covered:** TCOV-09-011 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=room, valid user | Booking reference generated |

#### TC-09-012 — Verify room status is updated to reserved after successful booking
- **Related Feature ID:** F009 · **Covered:** TCOV-09-012 · **Precond:** Available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Successful booking | Room status changes available → reserved |

#### TC-09-013 — Verify transaction rollback when booking creation fails
- **Related Feature ID:** F009 · **Covered:** TCOV-09-013 · **Precond:** Forced INSERT failure (FK violation) · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Trigger DB insert failure during booking | Transaction rolled back; room status unchanged |

#### TC-09-014 — Room Booking Main Flow
- **Related Feature ID:** F009 · **Covered:** TCOV-09-001, 009, 010, 011, 012 · **Precond:** Logged-in; available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid room booking | Booking created; duration/total/reference correct; room reserved |

#### TC-09-015 — Room Booking Alternate Flow – User Not Logged In
- **Related Feature ID:** F009 · **Covered:** TCOV-09-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result | 
|---|---|---|
| 1 | Booking without session | Rejected; login required |

#### TC-09-016 — Room Booking Alternate Flow – Invalid Request Method
- **Related Feature ID:** F009 · **Covered:** TCOV-09-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | GET request | Rejected |

#### TC-09-017 — Room Booking Alternate Flow – Missing Booking Information
- **Related Feature ID:** F009 · **Covered:** TCOV-09-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Incomplete booking data | Rejected |

#### TC-09-018 — Room Booking Alternate Flow – Invalid Booking Type
- **Related Feature ID:** F009 · **Covered:** TCOV-09-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=car | Rejected |

#### TC-09-019 — Room Booking Alternate Flow – Invalid Item Data
- **Related Feature ID:** F009 · **Covered:** TCOV-09-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid JSON item_data | Rejected |

#### TC-09-020 — Room Booking Alternate Flow – Room Not Found
- **Related Feature ID:** F009 · **Covered:** TCOV-09-007 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid room id | Rejected; room not found |

#### TC-09-021 — Room Booking Alternate Flow – Room Not Available
- **Related Feature ID:** F009 · **Covered:** TCOV-09-008 · **Precond:** Non-available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Book a reserved/occupied room | Rejected |

#### TC-09-022 — Room Booking Alternate Flow – Booking Creation Failed
- **Related Feature ID:** F009 · **Covered:** TCOV-09-013 · **Precond:** Forced DB failure · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure during creation | Rolled back; room unchanged |

---

### 2.2.10 F010 Table Availability Checking

> Mirror of F008 for dining tables: checks existence, status, and reservation date/time validity.

#### TC-10-001 — Verify table does not exist
- **Related Feature ID:** F010 · **Covered:** TCOV-10-001 · **Precond:** Invalid table id · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Check a non-existent table | Rejected; error message |

#### TC-10-002 — Verify table exists but is not available
- **Related Feature ID:** F010 · **Covered:** TCOV-10-002 · **Precond:** Table status≠available · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Check a reserved/occupied table | Rejected; error message |

#### TC-10-003 — Verify invalid reservation date
- **Related Feature ID:** F010 · **Covered:** TCOV-10-003 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid reservation date | Rejected; error message |

#### TC-10-004 — Verify invalid reservation time
- **Related Feature ID:** F010 · **Covered:** TCOV-10-004 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid reservation time | Rejected; error message |

#### TC-10-005 — Verify table already reserved
- **Related Feature ID:** F010 · **Covered:** TCOV-10-005 · **Precond:** Reserved table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Select an already-reserved table | Rejected; error message |

#### TC-10-006 — Verify available table is displayed
- **Related Feature ID:** F010 · **Covered:** TCOV-10-006 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open tables page | Available table shown |

#### TC-10-007 — Verify invalid table selection is rejected
- **Related Feature ID:** F010 · **Covered:** TCOV-10-007 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Select an invalid table | Selection rejected |

#### TC-10-008 — Verify error message is displayed for invalid table availability checking
- **Related Feature ID:** F010 · **Covered:** TCOV-10-008 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid availability request | Error message displayed |

#### TC-10-009 — Verify user can proceed to table reservation when table is available
- **Related Feature ID:** F010 · **Covered:** TCOV-10-009 · **Precond:** Available table; logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid table + valid date/time | Proceeds to table reservation |

#### TC-10-010 — Table Availability Checking Main Flow
- **Related Feature ID:** F010 · **Covered:** TCOV-10-001…006, 009 · **Precond:** Seeded tables · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Existing, available table with valid date/time, not reserved | Available table displayed; proceed to reservation |

#### TC-10-011 — Table Availability Checking Alternate Flow – Table Not Found
- **Related Feature ID:** F010 · **Covered:** TCOV-10-001, 007, 008 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Non-existent table | Rejected; error message |

#### TC-10-012 — Table Availability Checking Alternate Flow – Table Not Available
- **Related Feature ID:** F010 · **Covered:** TCOV-10-002, 007, 008 · **Precond:** Non-available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserved/occupied table | Rejected; error message |

#### TC-10-013 — Table Availability Checking Alternate Flow – Invalid Date or Time
- **Related Feature ID:** F010 · **Covered:** TCOV-10-003, 004, 007, 008 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid date or time | Rejected; error message |

#### TC-10-014 — Table Availability Checking Alternate Flow – Table Already Reserved
- **Related Feature ID:** F010 · **Covered:** TCOV-10-005, 007, 008 · **Precond:** Reserved table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Already-reserved table | Rejected; error message |

---

### 2.2.11 F011 Table Reservation

> Mirror of F009 for tables: creates an order with pending status, computes price, generates a
> reference, sets table to reserved. Rollback case (012/021) forces an INSERT failure.

#### TC-11-001 — Verify table reservation can be created successfully
- **Related Feature ID:** F011 · **Covered:** TCOV-11-001 · **Precond:** Logged-in; available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=table, valid item_id, price/data, valid date/time | Reservation created; success message with reference + total |

#### TC-11-002 — Verify user must log in before reserving a table
- **Related Feature ID:** F011 · **Covered:** TCOV-11-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reservation without session | Rejected; login required |

#### TC-11-003 — Verify invalid request method is rejected
- **Related Feature ID:** F011 · **Covered:** TCOV-11-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Request method = GET | Rejected |

#### TC-11-004 — Verify missing required reservation information is rejected
- **Related Feature ID:** F011 · **Covered:** TCOV-11-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type empty / item_id=0 / price=0 | Rejected |

#### TC-11-005 — Verify invalid booking type is rejected
- **Related Feature ID:** F011 · **Covered:** TCOV-11-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=room/food | Rejected |

#### TC-11-006 — Verify invalid item data format is rejected
- **Related Feature ID:** F011 · **Covered:** TCOV-11-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid JSON item_data | Rejected |

#### TC-11-007 — Verify table not found error is displayed
- **Related Feature ID:** F011 · **Covered:** TCOV-11-007 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid table id | Rejected; table not found |

#### TC-11-008 — Verify unavailable table cannot be reserved
- **Related Feature ID:** F011 · **Covered:** TCOV-11-008 · **Precond:** Non-available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve a reserved/occupied table | Rejected |

#### TC-11-009 — Verify reservation price is calculated correctly
- **Related Feature ID:** F011 · **Covered:** TCOV-11-009 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | table price=200 | Total = 200 |

#### TC-11-010 — Verify reservation reference is generated successfully
- **Related Feature ID:** F011 · **Covered:** TCOV-11-010 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=table, valid user | Reservation reference generated |

#### TC-11-011 — Verify table status is updated to reserved after successful reservation
- **Related Feature ID:** F011 · **Covered:** TCOV-11-011 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Successful reservation | Table status available → reserved |

#### TC-11-012 — Verify transaction rollback when reservation creation fails
- **Related Feature ID:** F011 · **Covered:** TCOV-11-012 · **Precond:** Forced DB failure · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB insert/update failure | Rolled back; table status unchanged |

#### TC-11-013 — Table Reservation Main Flow
- **Related Feature ID:** F011 · **Covered:** TCOV-11-001, 009, 010, 011 · **Precond:** Logged-in; available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid reservation | Created; price/reference correct; table reserved |

#### TC-11-014 — Table Reservation Alternate Flow – User Not Logged In
- **Related Feature ID:** F011 · **Covered:** TCOV-11-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reservation without session | Rejected; login required |

#### TC-11-015 — Table Reservation Alternate Flow – Invalid Request Method
- **Related Feature ID:** F011 · **Covered:** TCOV-11-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | GET request | Rejected |

#### TC-11-016 — Table Reservation Alternate Flow – Missing Reservation Information
- **Related Feature ID:** F011 · **Covered:** TCOV-11-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Incomplete reservation data | Rejected |

#### TC-11-017 — Table Reservation Alternate Flow – Invalid Booking Type
- **Related Feature ID:** F011 · **Covered:** TCOV-11-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | item_type=room/food | Rejected |

#### TC-11-018 — Table Reservation Alternate Flow – Invalid Item Data
- **Related Feature ID:** F011 · **Covered:** TCOV-11-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid JSON item_data | Rejected |

#### TC-11-019 — Table Reservation Alternate Flow – Table Not Found
- **Related Feature ID:** F011 · **Covered:** TCOV-11-007 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid table id | Rejected; table not found |

#### TC-11-020 — Table Reservation Alternate Flow – Table Not Available
- **Related Feature ID:** F011 · **Covered:** TCOV-11-008 · **Precond:** Non-available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve non-available table | Rejected |

#### TC-11-021 — Table Reservation Alternate Flow – Reservation Creation Failed
- **Related Feature ID:** F011 · **Covered:** TCOV-11-012 · **Precond:** Forced DB failure · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure during creation | Rolled back; table unchanged |

---

### 2.2.12 F012 Cart Checkout

> Checkout (`api/cart-handler.php` / checkout flow) requires login, a non-empty cart with valid and
> available items, a selected payment method, valid total, and optional coupon; on success it creates
> the order, applies discount, proceeds to payment and clears the cart.

#### TC-12-001 — Verify checkout is rejected when user is not logged in
- **Related Feature ID:** F012 · **Covered:** TCOV-12-001 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Checkout without session | `{success:false,'User not logged in'}`; checkout error shown |

#### TC-12-002 — Verify checkout is rejected when cart is empty
- **Related Feature ID:** F012 · **Covered:** TCOV-12-002 · **Precond:** Logged-in; empty cart · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Checkout with empty cart | Rejected; checkout error |

#### TC-12-003 — Verify checkout is rejected when cart contains invalid item data
- **Related Feature ID:** F012 · **Covered:** TCOV-12-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cart with invalid item data | Rejected; checkout error |

#### TC-12-004 — Verify checkout is rejected when selected item is unavailable
- **Related Feature ID:** F012 · **Covered:** TCOV-12-004 · **Precond:** Logged-in; unavailable item · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Checkout with unavailable item | Rejected; checkout error |

#### TC-12-005 — Verify invalid coupon is rejected during checkout
- **Related Feature ID:** F012 · **Covered:** TCOV-12-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Checkout with an invalid coupon | Coupon rejected; checkout error |

#### TC-12-006 — Verify checkout is rejected when payment method is not selected
- **Related Feature ID:** F012 · **Covered:** TCOV-12-006 · **Precond:** Logged-in; valid cart · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No payment method selected | Rejected; checkout error |

#### TC-12-007 — Verify checkout is successful when all conditions are valid
- **Related Feature ID:** F012 · **Covered:** TCOV-12-007 · **Precond:** Logged-in; valid cart + payment · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | All conditions valid | Order created; proceed to payment; cart cleared |

#### TC-12-008 — Verify discount is applied when coupon is valid
- **Related Feature ID:** F012 · **Covered:** TCOV-12-007 · **Precond:** Logged-in; valid coupon · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid coupon at checkout | Discount applied to total |

#### TC-12-009 — Verify order is created successfully after checkout
- **Related Feature ID:** F012 · **Covered:** TCOV-12-007 · **Precond:** Logged-in; valid cart · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid checkout | Order row created |

#### TC-12-010 — Verify cart is cleared after successful checkout
- **Related Feature ID:** F012 · **Covered:** TCOV-12-007 · **Precond:** Logged-in; valid cart · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid checkout | Cart emptied |

#### TC-12-011 — Cart Checkout Main Flow
- **Related Feature ID:** F012 · **Covered:** TCOV-12-007 · **Precond:** Logged-in; valid cart + payment + coupon · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | All conditions valid | Order created, discount applied, payment, cart cleared |

#### TC-12-012 — Cart Checkout Alternate Flow – User Not Logged In
- **Related Feature ID:** F012 · **Covered:** TCOV-12-001 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Checkout without session | Rejected; checkout error |

#### TC-12-013 — Cart Checkout Alternate Flow – Empty Cart
- **Related Feature ID:** F012 · **Covered:** TCOV-12-002 · **Precond:** Logged-in; empty cart · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty-cart checkout | Rejected |

#### TC-12-014 — Cart Checkout Alternate Flow – Invalid Cart Item
- **Related Feature ID:** F012 · **Covered:** TCOV-12-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid item data | Rejected |

#### TC-12-015 — Cart Checkout Alternate Flow – Item Not Available
- **Related Feature ID:** F012 · **Covered:** TCOV-12-004 · **Precond:** Logged-in; unavailable item · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Unavailable item | Rejected |

#### TC-12-016 — Cart Checkout Alternate Flow – Invalid Coupon
- **Related Feature ID:** F012 · **Covered:** TCOV-12-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid coupon | Rejected |

#### TC-12-017 — Cart Checkout Alternate Flow – No Payment Method Selected
- **Related Feature ID:** F012 · **Covered:** TCOV-12-006 · **Precond:** Logged-in; valid cart · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No payment method | Rejected |

---

### 2.2.13 F013 Coupon Validation

> Customer-side coupon validation: valid only when purchase ≥ minimum, coupon not expired, and usage
> below limit. Boundary cases on minimum-purchase, usage count, expiry date and discount amount.

#### TC-13-001 — Verify coupon is rejected when purchase amount is below minimum purchase amount
- **Related Feature ID:** F013 · **Covered:** TCOV-13-001 · **Precond:** Coupon min=RM50 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cart total=RM49.99 | Coupon rejected (below minimum) |

#### TC-13-002 — Verify coupon is accepted when purchase amount equals minimum purchase amount
- **Related Feature ID:** F013 · **Covered:** TCOV-13-002 · **Precond:** Coupon min=RM50 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cart total=RM50.00 | Coupon accepted |

#### TC-13-003 — Verify coupon is accepted when purchase amount is above minimum purchase amount
- **Related Feature ID:** F013 · **Covered:** TCOV-13-003 · **Precond:** Coupon min=RM50 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cart total=RM50.01 | Coupon accepted |

#### TC-13-004 — Verify coupon is accepted when usage count is below usage limit
- **Related Feature ID:** F013 · **Covered:** TCOV-13-004 · **Precond:** limit=10, used=9 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | usage=9 of 10 | Coupon accepted |

#### TC-13-005 — Verify coupon is rejected when usage count reaches usage limit
- **Related Feature ID:** F013 · **Covered:** TCOV-13-005 · **Precond:** limit=10, used=10 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | usage=10 of 10 | Coupon rejected |

#### TC-13-006 — Verify coupon is rejected when usage count exceeds usage limit
- **Related Feature ID:** F013 · **Covered:** TCOV-13-006 · **Precond:** limit=10, used=11 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | usage=11 of 10 | Coupon rejected |

#### TC-13-007 — Verify coupon is accepted before expiry date
- **Related Feature ID:** F013 · **Covered:** TCOV-13-007 · **Precond:** expiry future · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | current < expiry | Coupon accepted |

#### TC-13-008 — Verify coupon is accepted on expiry date
- **Related Feature ID:** F013 · **Covered:** TCOV-13-008 · **Precond:** expiry today · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | current = expiry | Coupon accepted |

#### TC-13-009 — Verify coupon is rejected after expiry date
- **Related Feature ID:** F013 · **Covered:** TCOV-13-009 · **Precond:** expiry past · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | current > expiry | Coupon rejected (expired) |

#### TC-13-010 — Verify coupon is rejected when discount amount is zero
- **Related Feature ID:** F013 · **Covered:** TCOV-13-010 · **Precond:** discount=0 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | discount=RM0 | Rejected / no discount |

#### TC-13-011 — Verify coupon is accepted when discount amount is at minimum valid value
- **Related Feature ID:** F013 · **Covered:** TCOV-13-011 · **Precond:** discount=1 · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | discount=RM1 | Accepted |

#### TC-13-012 — Verify coupon discount does not exceed payable cart amount
- **Related Feature ID:** F013 · **Covered:** TCOV-13-012 · **Precond:** discount>total · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | total=RM50, discount=RM60 | Discount capped at payable amount |

#### TC-13-013 — Coupon Validation Main Flow
- **Related Feature ID:** F013 · **Covered:** TCOV-13-002, 004, 007, 011, 013 · **Precond:** Active valid coupon · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Active coupon, total≥min, usage<limit, not expired | Coupon accepted; discount applied |

#### TC-13-014 — Coupon Validation Alternate Flow – Minimum Purchase Not Met
- **Related Feature ID:** F013 · **Covered:** TCOV-13-001, 014 · **Precond:** Below min · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Total below minimum | Rejected; error message |

#### TC-13-015 — Coupon Validation Alternate Flow – Usage Limit Reached
- **Related Feature ID:** F013 · **Covered:** TCOV-13-005, 014 · **Precond:** usage=limit · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Usage at limit | Rejected; error message |

#### TC-13-016 — Coupon Validation Alternate Flow – Usage Limit Exceeded
- **Related Feature ID:** F013 · **Covered:** TCOV-13-006, 014 · **Precond:** usage>limit · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Usage above limit | Rejected; error message |

#### TC-13-017 — Coupon Validation Alternate Flow – Coupon Expired
- **Related Feature ID:** F013 · **Covered:** TCOV-13-009, 014 · **Precond:** Expired coupon · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Expired coupon | Rejected; error message |

#### TC-13-018 — Coupon Validation Alternate Flow – Invalid Discount Amount
- **Related Feature ID:** F013 · **Covered:** TCOV-13-010, 012, 014 · **Precond:** Invalid discount · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Zero or excessive discount | Rejected / capped; error message |

---

### 2.2.14 F014 Payment Processing

> Decision-table over login, order existence, valid amount, selected method (Cash / eSewa / Stripe) and
> gateway result. Cash keeps status pending; gateways update on success, show error on failure. The
> eSewa/Stripe gateways were **not configured** in this environment, so those cases fail by design (per
> the IV&V directive), except where the truthful outcome is a pass.

#### TC-14-001 — Verify payment is rejected when user is not logged in
- **Related Feature ID:** F014 · **Covered:** TCOV-14-001 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Payment without session | Rejected; payment error; status stays pending |

#### TC-14-002 — Verify payment is rejected when order does not exist
- **Related Feature ID:** F014 · **Covered:** TCOV-14-002 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Pay for a non-existent order | Rejected; payment error |

#### TC-14-003 — Verify payment is rejected when payment amount is invalid
- **Related Feature ID:** F014 · **Covered:** TCOV-14-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid payment amount | Rejected; payment error |

#### TC-14-004 — Verify payment is rejected when payment method is not selected
- **Related Feature ID:** F014 · **Covered:** TCOV-14-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No payment method | Rejected; payment error |

#### TC-14-005 — Verify cash payment keeps payment status as pending
- **Related Feature ID:** F014 · **Covered:** TCOV-14-005 · **Precond:** Logged-in; valid order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Payment method = Cash | Payment recorded; status remains pending |

#### TC-14-006 — Verify eSewa payment redirects user to payment gateway
- **Related Feature ID:** F014 · **Covered:** TCOV-14-006 · **Precond:** Logged-in; valid order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Payment method = eSewa | **Should** redirect to eSewa gateway. Gateway not configured **(documents gap — currently FAILS)** |

#### TC-14-007 — Verify successful eSewa payment updates payment status
- **Related Feature ID:** F014 · **Covered:** TCOV-14-007 · **Precond:** eSewa configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Successful eSewa payment | **Should** update status to paid **(documents gap — currently FAILS)** |

#### TC-14-008 — Verify failed eSewa payment displays payment error message
- **Related Feature ID:** F014 · **Covered:** TCOV-14-006 · **Precond:** eSewa configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Failed eSewa payment | **Should** show error, keep pending **(documents gap — currently FAILS)** |

#### TC-14-009 — Verify successful Stripe payment updates payment status
- **Related Feature ID:** F014 · **Covered:** TCOV-14-008 · **Precond:** Stripe configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Successful Stripe payment | Status updated to paid |

#### TC-14-010 — Verify failed Stripe payment displays payment error message
- **Related Feature ID:** F014 · **Covered:** TCOV-14-008 · **Precond:** Stripe configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Failed Stripe payment | Error shown; status stays pending |

#### TC-14-011 — Payment Processing Main Flow – Cash Payment
- **Related Feature ID:** F014 · **Covered:** TCOV-14-005 · **Precond:** Logged-in; valid order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid order, method=Cash | Payment recorded; status pending; success message |

#### TC-14-012 — Payment Processing Main Flow – eSewa Payment Success
- **Related Feature ID:** F014 · **Covered:** TCOV-14-006, 007 · **Precond:** eSewa configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid order, method=eSewa, gateway success | **(documents gap — currently FAILS)** |

#### TC-14-013 — Payment Processing Main Flow – Stripe Payment Success
- **Related Feature ID:** F014 · **Covered:** TCOV-14-008 · **Precond:** Stripe configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid order, method=Stripe, gateway success | Status updated to paid; success message |

#### TC-14-014 — Payment Processing Alternate Flow – User Not Logged In
- **Related Feature ID:** F014 · **Covered:** TCOV-14-001 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Payment without session | Rejected; payment error |

#### TC-14-015 — Payment Processing Alternate Flow – Order Not Found
- **Related Feature ID:** F014 · **Covered:** TCOV-14-002 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Non-existent order | Rejected; payment error |

#### TC-14-016 — Payment Processing Alternate Flow – Invalid Amount
- **Related Feature ID:** F014 · **Covered:** TCOV-14-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid amount | Rejected; payment error |

#### TC-14-017 — Payment Processing Alternate Flow – No Payment Method Selected
- **Related Feature ID:** F014 · **Covered:** TCOV-14-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No method selected | Rejected; payment error |

#### TC-14-018 — Payment Processing Alternate Flow – eSewa Payment Failed
- **Related Feature ID:** F014 · **Covered:** TCOV-14-006 · **Precond:** eSewa configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Failed eSewa payment | **(documents gap — currently FAILS)** |

#### TC-14-019 — Payment Processing Alternate Flow – Stripe Payment Failed
- **Related Feature ID:** F014 · **Covered:** TCOV-14-008 · **Precond:** Stripe configured · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Failed Stripe payment | Error shown; status stays pending |

---

### 2.2.15 F015 Order History Viewing

> Logged-in customers view their own food orders and order details; alternate flows cover login gate,
> empty history, missing/unauthorized order, and DB error.

#### TC-15-001 — Verify logged-in user can view order history successfully
- **Related Feature ID:** F015 · **Covered:** TCOV-15-001 · **Precond:** Logged-in with orders · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Order History | Order list displayed |

#### TC-15-002 — Verify user is redirected to login when accessing order history without logging in
- **Related Feature ID:** F015 · **Covered:** TCOV-15-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Order History logged out | Redirect to login / login required |

#### TC-15-003 — Verify no order history message is displayed when user has no previous orders
- **Related Feature ID:** F015 · **Covered:** TCOV-15-003 · **Precond:** Logged-in with no orders · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Order History | "No order history" message |

#### TC-15-004 — Verify selected order details are displayed correctly
- **Related Feature ID:** F015 · **Covered:** TCOV-15-004 · **Precond:** Logged-in; valid order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Select a valid own order | Order details shown |

#### TC-15-005 — Verify invalid or unauthorized order details cannot be viewed
- **Related Feature ID:** F015 · **Covered:** TCOV-15-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid order id / other user's order | "Order details not found" |

#### TC-15-006 — Verify database or server error displays an error message
- **Related Feature ID:** F015 · **Covered:** TCOV-15-006 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure on retrieval | Error message displayed |

#### TC-15-007 — Order History Viewing Main Flow
- **Related Feature ID:** F015 · **Covered:** TCOV-15-001, 004 · **Precond:** Logged-in with orders · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View history → open order | List + details shown |

#### TC-15-008 — Order History Viewing Alternate Flow – User Not Logged In
- **Related Feature ID:** F015 · **Covered:** TCOV-15-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access logged out | Redirect to login |

#### TC-15-009 — Order History Viewing Alternate Flow – No Order History Found
- **Related Feature ID:** F015 · **Covered:** TCOV-15-003 · **Precond:** No orders · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View history | "No order history" |

#### TC-15-010 — Order History Viewing Alternate Flow – Order Details Not Found
- **Related Feature ID:** F015 · **Covered:** TCOV-15-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid order id | "Order details not found" |

#### TC-15-011 — Order History Viewing Alternate Flow – Database or Server Error
- **Related Feature ID:** F015 · **Covered:** TCOV-15-006 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message |

---

### 2.2.16 F016 Booking History Viewing

> Logged-in customers view their room bookings and table reservations; covers login gate, empty
> history, missing/unauthorized booking, and DB error.

#### TC-16-001 — Verify logged-in user can view booking history successfully
- **Related Feature ID:** F016 · **Covered:** TCOV-16-001 · **Precond:** Logged-in with bookings · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Booking History | Booking list displayed |

#### TC-16-002 — Verify user is redirected to login when accessing booking history without logging in
- **Related Feature ID:** F016 · **Covered:** TCOV-16-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open logged out | Redirect to login |

#### TC-16-003 — Verify no booking history message is displayed when user has no previous bookings
- **Related Feature ID:** F016 · **Covered:** TCOV-16-003 · **Precond:** No bookings · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Booking History | "No booking history" message |

#### TC-16-004 — Verify selected booking details are displayed correctly
- **Related Feature ID:** F016 · **Covered:** TCOV-16-004 · **Precond:** Valid own booking · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open a valid booking | Booking details shown |

#### TC-16-005 — Verify invalid booking details cannot be viewed
- **Related Feature ID:** F016 · **Covered:** TCOV-16-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid booking id | "Booking details not found" |

#### TC-16-006 — Verify user cannot view another user's booking record
- **Related Feature ID:** F016 · **Covered:** TCOV-16-006 · **Precond:** Booking owned by another user · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access another user's booking | Access rejected |

#### TC-16-007 — Verify database or server error displays an error message
- **Related Feature ID:** F016 · **Covered:** TCOV-16-007 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message |

#### TC-16-008 — Booking History Viewing Main Flow
- **Related Feature ID:** F016 · **Covered:** TCOV-16-001, 004 · **Precond:** Logged-in with bookings · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View history → open booking | List + details shown |

#### TC-16-009 — Booking History Viewing Alternate Flow – User Not Logged In
- **Related Feature ID:** F016 · **Covered:** TCOV-16-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access logged out | Redirect to login |

#### TC-16-010 — Booking History Viewing Alternate Flow – No Booking History Found
- **Related Feature ID:** F016 · **Covered:** TCOV-16-003 · **Precond:** No bookings · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View history | "No booking history" |

#### TC-16-011 — Booking History Viewing Alternate Flow – Booking Details Not Found
- **Related Feature ID:** F016 · **Covered:** TCOV-16-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid booking id | "Booking details not found" |

#### TC-16-012 — Booking History Viewing Alternate Flow – Unauthorized Booking Record
- **Related Feature ID:** F016 · **Covered:** TCOV-16-006 · **Precond:** Another user's booking · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access another user's booking | Rejected |

#### TC-16-013 — Booking History Viewing Alternate Flow – Database or Server Error
- **Related Feature ID:** F016 · **Covered:** TCOV-16-007 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message |

---

### 2.2.17 F017 Profile Management

> Logged-in customers view/update name, email, contact and profile image. Covers login gate, empty
> required field, invalid email/contact, duplicate email, invalid image, and DB error. The throwaway
> user / yangenna20 profile is restored after mutation.

#### TC-17-001 — Verify logged-in user can view and update profile successfully
- **Related Feature ID:** F017 · **Covered:** TCOV-17-001 · **Precond:** Logged-in customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Edit allowed fields, submit | Profile updated; success message |

#### TC-17-002 — Verify user is redirected to login when accessing profile without logging in
- **Related Feature ID:** F017 · **Covered:** TCOV-17-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Profile logged out | Redirect to login |

#### TC-17-003 — Verify profile update is rejected when required fields are empty
- **Related Feature ID:** F017 · **Covered:** TCOV-17-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty name / contact | Rejected; error message |

#### TC-17-004 — Verify profile update is rejected when email format is invalid
- **Related Feature ID:** F017 · **Covered:** TCOV-17-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`usergmail.com` / `user@` | Rejected; invalid email |

#### TC-17-005 — Verify profile update is rejected when contact number is invalid
- **Related Feature ID:** F017 · **Covered:** TCOV-17-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Contact=`abc123` / `12345` | Rejected; invalid contact |

#### TC-17-006 — Verify profile update is rejected when email already belongs to another user
- **Related Feature ID:** F017 · **Covered:** TCOV-17-006 · **Precond:** Logged-in; another email exists · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email of an existing user | Rejected; duplicate email |

#### TC-17-007 — Verify invalid profile image upload is rejected
- **Related Feature ID:** F017 · **Covered:** TCOV-17-007 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | File type = .pdf / .exe | Rejected; invalid image |

#### TC-17-008 — Verify database or server error displays error message and keeps profile unchanged
- **Related Feature ID:** F017 · **Covered:** TCOV-17-008 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB update failure | Error message; profile unchanged |

#### TC-17-009 — Verify current profile information is displayed correctly
- **Related Feature ID:** F017 · **Covered:** TCOV-17-009 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open Profile | Current details shown |

#### TC-17-010 — Verify updated profile information is displayed after successful update
- **Related Feature ID:** F017 · **Covered:** TCOV-17-010 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update + reload | Refreshed details shown |

#### TC-17-011 — Profile Management Main Flow
- **Related Feature ID:** F017 · **Covered:** TCOV-17-009, 001, 010 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View → edit → save | Updated profile displayed |

#### TC-17-012 — Profile Management Alternate Flow – User Not Logged In
- **Related Feature ID:** F017 · **Covered:** TCOV-17-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access logged out | Redirect to login |

#### TC-17-013 — Profile Management Alternate Flow – Empty Required Field
- **Related Feature ID:** F017 · **Covered:** TCOV-17-003 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty required field | Rejected |

#### TC-17-014 — Profile Management Alternate Flow – Invalid Email Format
- **Related Feature ID:** F017 · **Covered:** TCOV-17-004 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid email | Rejected |

#### TC-17-015 — Profile Management Alternate Flow – Invalid Contact Number
- **Related Feature ID:** F017 · **Covered:** TCOV-17-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid contact | Rejected |

#### TC-17-016 — Profile Management Alternate Flow – Duplicate Email
- **Related Feature ID:** F017 · **Covered:** TCOV-17-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Existing email | Rejected |

#### TC-17-017 — Profile Management Alternate Flow – Invalid Profile Image
- **Related Feature ID:** F017 · **Covered:** TCOV-17-007 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Non-image file | Rejected |

#### TC-17-018 — Profile Management Alternate Flow – Database or Server Error
- **Related Feature ID:** F017 · **Covered:** TCOV-17-008 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message; profile unchanged |

---

### 2.2.18 F018 Contact Form Submission

> Public contact form (`contact.php`) stores a `contact_requests` row. Covers valid submission, empty
> fields, invalid email/phone, short message, and DB error. Inserted rows are cleaned up.

#### TC-18-001 — Verify user can submit contact form successfully with valid details
- **Related Feature ID:** F018 · **Covered:** TCOV-18-001 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Name, valid email, 10-digit phone, subject, meaningful message | Stored; success message |

#### TC-18-002 — Verify contact form submission is rejected when required fields are empty
- **Related Feature ID:** F018 · **Covered:** TCOV-18-002 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty name/email/subject/message | Rejected; required-field error |

#### TC-18-003 — Verify contact form submission is rejected when email format is invalid
- **Related Feature ID:** F018 · **Covered:** TCOV-18-003 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Email=`aligmail.com` / `ali@` | Rejected; invalid email |

#### TC-18-004 — Verify contact form submission is rejected when phone number is invalid
- **Related Feature ID:** F018 · **Covered:** TCOV-18-004 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Phone=`abc123` / `12345` | Rejected; invalid phone |

#### TC-18-005 — Verify contact form submission is rejected when message is too short
- **Related Feature ID:** F018 · **Covered:** TCOV-18-005 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Message=`Hi` | Rejected; message-too-short |

#### TC-18-006 — Verify database or server error displays submission failed message and contact request is not saved
- **Related Feature ID:** F018 · **Covered:** TCOV-18-006 · **Precond:** Forced INSERT failure · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Force DB insert failure | **Should** show "Failed to send message" gracefully; the handler throws an uncaught exception instead **(documents gap — currently FAILS)** |

#### TC-18-007 — Contact Form Submission Main Flow
- **Related Feature ID:** F018 · **Covered:** TCOV-18-001 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid contact form | Stored; success message |

#### TC-18-008 — Contact Form Submission Alternate Flow – Empty Required Field
- **Related Feature ID:** F018 · **Covered:** TCOV-18-002 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty required field | Rejected |

#### TC-18-009 — Contact Form Submission Alternate Flow – Invalid Email Format
- **Related Feature ID:** F018 · **Covered:** TCOV-18-003 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid email | Rejected |

#### TC-18-010 — Contact Form Submission Alternate Flow – Invalid Phone Number
- **Related Feature ID:** F018 · **Covered:** TCOV-18-004 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid phone | Rejected |

#### TC-18-011 — Contact Form Submission Alternate Flow – Message Too Short
- **Related Feature ID:** F018 · **Covered:** TCOV-18-005 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Too-short message | Rejected |

#### TC-18-012 — Contact Form Submission Alternate Flow – Database or Server Error
- **Related Feature ID:** F018 · **Covered:** TCOV-18-006 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | **Should** show graceful failure message **(documents gap — currently FAILS)** |

---

### 2.2.19 F019 Blog Viewing

> Public blog list/detail; only published posts are shown. Covers list+detail, empty state, missing
> post, unpublished post, and DB error.

#### TC-19-001 — Verify user can view blog list and selected blog details successfully
- **Related Feature ID:** F019 · **Covered:** TCOV-19-001 · **Precond:** Published posts exist · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open blog page, open a post | List and full content displayed |

#### TC-19-002 — Verify no blog post available message is displayed when no published blogs exist
- **Related Feature ID:** F019 · **Covered:** TCOV-19-002 · **Precond:** No published posts · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open blog page | "No blog post available" message |

#### TC-19-003 — Verify selected blog post details are displayed correctly
- **Related Feature ID:** F019 · **Covered:** TCOV-19-003 · **Precond:** Valid published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open a published post | Details displayed |

#### TC-19-004 — Verify invalid blog post ID displays blog post not found message
- **Related Feature ID:** F019 · **Covered:** TCOV-19-004 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid blog id | "Blog post not found" |

#### TC-19-005 — Verify unpublished blog post cannot be viewed by user
- **Related Feature ID:** F019 · **Covered:** TCOV-19-005 · **Precond:** Unpublished post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open an unpublished post | Access rejected |

#### TC-19-006 — Verify database or server error displays an error message
- **Related Feature ID:** F019 · **Covered:** TCOV-19-006 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message |

#### TC-19-007 — Blog Viewing Main Flow
- **Related Feature ID:** F019 · **Covered:** TCOV-19-001, 003 · **Precond:** Published posts · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View list → open post | List + details shown |

#### TC-19-008 — Blog Viewing Alternate Flow – No Blog Post Available
- **Related Feature ID:** F019 · **Covered:** TCOV-19-002 · **Precond:** No published posts · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open blog page | "No blog post available" |

#### TC-19-009 — Blog Viewing Alternate Flow – Blog Post Not Found
- **Related Feature ID:** F019 · **Covered:** TCOV-19-004 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid blog id | "Blog post not found" |

#### TC-19-010 — Blog Viewing Alternate Flow – Unpublished Blog Post
- **Related Feature ID:** F019 · **Covered:** TCOV-19-005 · **Precond:** Unpublished post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Open unpublished post | Rejected |

#### TC-19-011 — Blog Viewing Alternate Flow – Database or Server Error
- **Related Feature ID:** F019 · **Covered:** TCOV-19-006 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message |

---

### 2.2.20 F020 Blog Interaction

> Like / comment / share on published posts. Like and comment require login; comment must be non-empty;
> a user may not duplicate a like. Where the app lacks a like/comment/share endpoint or guard, the
> corresponding case fails by design.

#### TC-20-001 — Verify logged-in user can like, comment, and share a published blog post successfully
- **Related Feature ID:** F020 · **Covered:** TCOV-20-001 · **Precond:** Logged-in; published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Like + comment + share | All interactions recorded; counts updated |

#### TC-20-002 — Verify like action is rejected when user is not logged in
- **Related Feature ID:** F020 · **Covered:** TCOV-20-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Like while logged out | Rejected; login required |

#### TC-20-003 — Verify duplicate like is removed or prevented when user already liked the blog
- **Related Feature ID:** F020 · **Covered:** TCOV-20-003 · **Precond:** Logged-in; already liked · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Like an already-liked post | Like toggled off / duplicate prevented; count corrected |

#### TC-20-004 — Verify comment action is rejected when user is not logged in
- **Related Feature ID:** F020 · **Covered:** TCOV-20-004 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Comment while logged out | Rejected; login required |

#### TC-20-005 — Verify empty comment submission is rejected
- **Related Feature ID:** F020 · **Covered:** TCOV-20-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty/whitespace comment | Rejected; comment required |

#### TC-20-006 — Verify interaction is rejected when blog post is not found
- **Related Feature ID:** F020 · **Covered:** TCOV-20-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Interact with invalid blog id | Rejected |

#### TC-20-007 — Verify interaction is rejected when blog post is unpublished
- **Related Feature ID:** F020 · **Covered:** TCOV-20-007 · **Precond:** Unpublished post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Interact with unpublished post | Rejected |

#### TC-20-008 — Verify user can share a blog post successfully
- **Related Feature ID:** F020 · **Covered:** TCOV-20-008 · **Precond:** Published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Share a post | Share option/link generated |

#### TC-20-009 — Verify database or server error displays error message and keeps interaction data unchanged
- **Related Feature ID:** F020 · **Covered:** TCOV-20-009 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure during interaction | Error message; data unchanged |

#### TC-20-010 — Blog Interaction Main Flow
- **Related Feature ID:** F020 · **Covered:** TCOV-20-001, 008 · **Precond:** Logged-in; published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Like + comment + share | Recorded; share link generated |

#### TC-20-011 — Blog Interaction Alternate Flow – User Not Logged In for Like
- **Related Feature ID:** F020 · **Covered:** TCOV-20-002 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Like logged out | Rejected; login required |

#### TC-20-012 — Blog Interaction Alternate Flow – User Already Liked Blog
- **Related Feature ID:** F020 · **Covered:** TCOV-20-003 · **Precond:** Already liked · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Like again | Duplicate prevented / toggled |

#### TC-20-013 — Blog Interaction Alternate Flow – User Not Logged In for Comment
- **Related Feature ID:** F020 · **Covered:** TCOV-20-004 · **Precond:** Logged out · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Comment logged out | Rejected; login required |

#### TC-20-014 — Blog Interaction Alternate Flow – Empty Comment
- **Related Feature ID:** F020 · **Covered:** TCOV-20-005 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty comment | Rejected |

#### TC-20-015 — Blog Interaction Alternate Flow – Blog Post Not Found
- **Related Feature ID:** F020 · **Covered:** TCOV-20-006 · **Precond:** Logged-in · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid blog id | Rejected |

#### TC-20-016 — Blog Interaction Alternate Flow – Unpublished Blog Post
- **Related Feature ID:** F020 · **Covered:** TCOV-20-007 · **Precond:** Unpublished post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Interact with unpublished post | Rejected |

#### TC-20-017 — Blog Interaction Alternate Flow – Share Blog Post
- **Related Feature ID:** F020 · **Covered:** TCOV-20-008 · **Precond:** Published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Share post | Share option/link generated |

#### TC-20-018 — Blog Interaction Alternate Flow – Database or Server Error
- **Related Feature ID:** F020 · **Covered:** TCOV-20-009 · **Precond:** Forced DB error · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | DB failure | Error message; data unchanged |

---

### 2.2.21 F021 Admin Dashboard Access

> State-machine over session + role. Admin/staff reach the dashboard; no/expired session or
> customer/invalid role is redirected/denied. Admin: `lucavalentines80@gmail.com`.

#### TC-21-001 — Verify admin dashboard request triggers session checking
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001 · **Precond:** None · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Request `admin/index.php` | Session is checked |

#### TC-21-002 — Verify valid session proceeds to role checking
- **Related Feature ID:** F021 · **Covered:** TCOV-21-002 · **Precond:** Logged-in admin · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid session | Proceeds to role check |

#### TC-21-003 — Verify no session redirects user to login page
- **Related Feature ID:** F021 · **Covered:** TCOV-21-003 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access dashboard with no session | Redirect to admin login |

#### TC-21-004 — Verify expired session destroys session and redirects to login page
- **Related Feature ID:** F021 · **Covered:** TCOV-21-004 · **Precond:** Expired session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access with expired session | Session destroyed; redirect to login |

#### TC-21-005 — Verify admin role can access admin dashboard
- **Related Feature ID:** F021 · **Covered:** TCOV-21-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Logged-in admin | Dashboard displayed |

#### TC-21-006 — Verify staff role can access admin dashboard
- **Related Feature ID:** F021 · **Covered:** TCOV-21-006 · **Precond:** Staff login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Logged-in staff | Dashboard displayed |

#### TC-21-007 — Verify customer role is denied admin dashboard access
- **Related Feature ID:** F021 · **Covered:** TCOV-21-007 · **Precond:** Customer login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Logged-in customer accesses dashboard | Access denied |

#### TC-21-008 — Verify invalid role is denied admin dashboard access
- **Related Feature ID:** F021 · **Covered:** TCOV-21-008 · **Precond:** Invalid role · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid-role session | Access denied |

#### TC-21-009 — Verify user can log out from admin dashboard
- **Related Feature ID:** F021 · **Covered:** TCOV-21-009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Logout from dashboard | Session destroyed; logged out |

#### TC-21-010 — Verify session timeout redirects admin/staff to login page
- **Related Feature ID:** F021 · **Covered:** TCOV-21-010 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Session timeout | Redirect to login |

#### TC-21-011 — Verify successful login allows user to request admin dashboard again
- **Related Feature ID:** F021 · **Covered:** TCOV-21-011 · **Precond:** Admin account · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Login again | Dashboard request succeeds |

#### TC-21-012 — Verify access denied page redirects user to login page
- **Related Feature ID:** F021 · **Covered:** TCOV-21-012 · **Precond:** Denied access · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | From access-denied page | Redirect to login |

#### TC-21-013 — Admin Dashboard Access Main Flow – Admin User
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 002, 005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Admin requests dashboard | Session+role valid → dashboard displayed |

#### TC-21-014 — Admin Dashboard Access Main Flow – Staff User
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 002, 006 · **Precond:** Staff login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Staff requests dashboard | Dashboard displayed |

#### TC-21-015 — Admin Dashboard Access Alternate Flow – No Session
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 003 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No session | Redirect to login |

#### TC-21-016 — Admin Dashboard Access Alternate Flow – Expired Session
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 004 · **Precond:** Expired session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Expired session | Destroyed; redirect to login |

#### TC-21-017 — Admin Dashboard Access Alternate Flow – Customer Role
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 002, 007 · **Precond:** Customer login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Customer accesses dashboard | Access denied |

#### TC-21-018 — Admin Dashboard Access Alternate Flow – Invalid Role
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 002, 008 · **Precond:** Invalid role · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid role | Access denied |

#### TC-21-019 — Admin Dashboard Access Alternate Flow – Logout
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 002, 005, 009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access dashboard, then logout | Session destroyed |

#### TC-21-020 — Admin Dashboard Access Alternate Flow – Session Timeout
- **Related Feature ID:** F021 · **Covered:** TCOV-21-001, 002, 005, 010 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Access dashboard, simulate timeout | Redirect to login |

---

### 2.2.22 F022 Food/Menu Management

> Admin CRUD on `food_items` via `api/menu-handler.php` (admin-only). **`food_items` has no status
> column** — there is no available/unavailable/archived state — so the availability/archive transition
> cases are **not implemented** in the app; only the create / update / delete CRUD is tested (per the
> "only test implemented CRUD" decision). Items created with an `F022TEST_` marker and cleaned up.

#### TC-22-001 — Verify new food item can be added and set as available
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add food item | Item created. *(No status column — "available" state is not modeled; create CRUD only.)* |

#### TC-22-002 — Verify new food item can be added and set as unavailable
- **Related Feature ID:** F022 · **Covered:** TCOV-22-002 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add food item as unavailable | No `status` column — *unavailable* state unsupported. **Not implemented — skipped.** |

#### TC-22-003 — Verify available food item can be marked as unavailable
- **Related Feature ID:** F022 · **Covered:** TCOV-22-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark item unavailable | No status column. **Not implemented — skipped.** |

#### TC-22-004 — Verify available food item details can be updated
- **Related Feature ID:** F022 · **Covered:** TCOV-22-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update item fields | Item updated successfully |

#### TC-22-005 — Verify available food item can be archived
- **Related Feature ID:** F022 · **Covered:** TCOV-22-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Archive item | No archive state. **Not implemented — skipped.** |

#### TC-22-006 — Verify available food item can be deleted
- **Related Feature ID:** F022 · **Covered:** TCOV-22-006 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete item | Item removed |

#### TC-22-007 — Verify unavailable food item can be marked as available
- **Related Feature ID:** F022 · **Covered:** TCOV-22-007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark item available | No status column. **Not implemented — skipped.** |

#### TC-22-008 — Verify unavailable food item details can be updated
- **Related Feature ID:** F022 · **Covered:** TCOV-22-008 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update item fields | Item updated (status not modeled) |

#### TC-22-009 — Verify unavailable food item can be archived
- **Related Feature ID:** F022 · **Covered:** TCOV-22-009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Archive item | No archive state. **Not implemented — skipped.** |

#### TC-22-010 — Verify unavailable food item can be deleted
- **Related Feature ID:** F022 · **Covered:** TCOV-22-010 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete item | Item removed |

#### TC-22-011 — Verify updated food item can be saved as available
- **Related Feature ID:** F022 · **Covered:** TCOV-22-011 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save as available | No status column. **Not implemented — skipped.** |

#### TC-22-012 — Verify updated food item can be saved as unavailable
- **Related Feature ID:** F022 · **Covered:** TCOV-22-012 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save as unavailable | No status column. **Not implemented — skipped.** |

#### TC-22-013 — Verify updated food item can be saved as archived
- **Related Feature ID:** F022 · **Covered:** TCOV-22-013 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save as archived | No archive state. **Not implemented — skipped.** |

#### TC-22-014 — Verify updated food item can be deleted
- **Related Feature ID:** F022 · **Covered:** TCOV-22-014 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update then delete | Item removed |

#### TC-22-015 — Verify archived food item can be restored as available
- **Related Feature ID:** F022 · **Covered:** TCOV-22-015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Restore archived item | No archive state. **Not implemented — skipped.** |

#### TC-22-016 — Verify archived food item can be restored as unavailable
- **Related Feature ID:** F022 · **Covered:** TCOV-22-016 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Restore as unavailable | No archive/status state. **Not implemented — skipped.** |

#### TC-22-017 — Verify archived food item can be deleted
- **Related Feature ID:** F022 · **Covered:** TCOV-22-017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete archived item | No archive state. **Not implemented — skipped.** |

#### TC-22-018 — Food/Menu Management Main Flow – Add Available Food Item
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add food item | Item created and listed |

#### TC-22-019 — Food/Menu Management Main Flow – Update Available Food Item
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001, 004, 011 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add then update item | Item updated |

#### TC-22-020 — Food/Menu Management Alternate Flow – Add Unavailable Food Item
- **Related Feature ID:** F022 · **Covered:** TCOV-22-002 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add as unavailable | No status column. **Not implemented — skipped.** |

#### TC-22-021 — Food/Menu Management Alternate Flow – Change Available to Unavailable
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001, 003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Toggle availability | No status column. **Not implemented — skipped.** |

#### TC-22-022 — Food/Menu Management Alternate Flow – Change Unavailable to Available
- **Related Feature ID:** F022 · **Covered:** TCOV-22-002, 007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Toggle availability | No status column. **Not implemented — skipped.** |

#### TC-22-023 — Food/Menu Management Alternate Flow – Archive Food Item
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001, 005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Archive item | No archive state. **Not implemented — skipped.** |

#### TC-22-024 — Food/Menu Management Alternate Flow – Restore Archived Food Item
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001, 005, 015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Restore archived item | No archive state. **Not implemented — skipped.** |

#### TC-22-025 — Food/Menu Management Alternate Flow – Delete Food Item
- **Related Feature ID:** F022 · **Covered:** TCOV-22-001, 006 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add then delete item | Item removed |

---

### 2.2.23 F023 Room Management

> Admin CRUD + status transitions on `rooms` (status column: available / reserved / occupied /
> maintenance) via `api/room-handler.php`. Rooms have a full status column, so **all 18 transition
> cases are supported**. Rooms created with a test marker and cleaned up.

#### TC-23-001 — Verify new room record can be added and set as available
- **Related Feature ID:** F023 · **Covered:** TCOV-23-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add room | Room created with status available |

#### TC-23-002 — Verify available room can be reserved
- **Related Feature ID:** F023 · **Covered:** TCOV-23-002 · **Precond:** Admin login; available room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve room | Status available → reserved |

#### TC-23-003 — Verify available room can be marked as under maintenance
- **Related Feature ID:** F023 · **Covered:** TCOV-23-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark maintenance | Status → maintenance |

#### TC-23-004 — Verify available room details can be updated
- **Related Feature ID:** F023 · **Covered:** TCOV-23-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update room fields | Room updated |

#### TC-23-005 — Verify available room can be deleted
- **Related Feature ID:** F023 · **Covered:** TCOV-23-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete room | Room removed |

#### TC-23-006 — Verify reserved room can be changed to occupied when guest checks in
- **Related Feature ID:** F023 · **Covered:** TCOV-23-006 · **Precond:** Reserved room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Guest check-in | Status reserved → occupied |

#### TC-23-007 — Verify reserved room can return to available when reservation is cancelled
- **Related Feature ID:** F023 · **Covered:** TCOV-23-007 · **Precond:** Reserved room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel reservation | Status reserved → available |

#### TC-23-008 — Verify reserved room details can be updated
- **Related Feature ID:** F023 · **Covered:** TCOV-23-008 · **Precond:** Reserved room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update room fields | Room updated |

#### TC-23-009 — Verify occupied room becomes available after guest checks out
- **Related Feature ID:** F023 · **Covered:** TCOV-23-009 · **Precond:** Occupied room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Guest check-out | Status occupied → available |

#### TC-23-010 — Verify occupied room can be marked as under maintenance when issue is reported
- **Related Feature ID:** F023 · **Covered:** TCOV-23-010 · **Precond:** Occupied room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Report issue | Status → maintenance |

#### TC-23-011 — Verify occupied room details can be updated
- **Related Feature ID:** F023 · **Covered:** TCOV-23-011 · **Precond:** Occupied room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update room fields | Room updated |

#### TC-23-012 — Verify maintenance room details can be updated
- **Related Feature ID:** F023 · **Covered:** TCOV-23-012 · **Precond:** Maintenance room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update room fields | Room updated |

#### TC-23-013 — Verify room returns to available after maintenance is completed
- **Related Feature ID:** F023 · **Covered:** TCOV-23-013 · **Precond:** Maintenance room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Complete maintenance | Status maintenance → available |

#### TC-23-014 — Verify maintenance room can be deleted
- **Related Feature ID:** F023 · **Covered:** TCOV-23-014 · **Precond:** Maintenance room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete room | Room removed |

#### TC-23-015 — Verify updated room can be saved as available
- **Related Feature ID:** F023 · **Covered:** TCOV-23-015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save status=available | Status → available |

#### TC-23-016 — Verify updated room can be saved as reserved
- **Related Feature ID:** F023 · **Covered:** TCOV-23-016 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save status=reserved | Status → reserved |

#### TC-23-017 — Verify updated room can be saved as under maintenance
- **Related Feature ID:** F023 · **Covered:** TCOV-23-017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save status=maintenance | Status → maintenance |

#### TC-23-018 — Verify updated room can be deleted
- **Related Feature ID:** F023 · **Covered:** TCOV-23-018 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update then delete | Room removed |

#### TC-23-019 — Room Management Main Flow – Add and Reserve Room
- **Related Feature ID:** F023 · **Covered:** TCOV-23-001, 002 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add room, then reserve | Created available → reserved |

#### TC-23-020 — Room Management Main Flow – Reservation to Occupied to Available
- **Related Feature ID:** F023 · **Covered:** TCOV-23-002, 006, 009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve → check-in → check-out | reserved → occupied → available |

#### TC-23-021 — Room Management Alternate Flow – Cancel Reservation
- **Related Feature ID:** F023 · **Covered:** TCOV-23-002, 007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve → cancel | reserved → available |

#### TC-23-022 — Room Management Alternate Flow – Maintenance Flow
- **Related Feature ID:** F023 · **Covered:** TCOV-23-003, 013 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark maintenance → complete | maintenance → available |

#### TC-23-023 — Room Management Alternate Flow – Update Room Details
- **Related Feature ID:** F023 · **Covered:** TCOV-23-004, 015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update details, save available | Updated |

#### TC-23-024 — Room Management Alternate Flow – Delete Room
- **Related Feature ID:** F023 · **Covered:** TCOV-23-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete room | Removed |

#### TC-23-025 — Room Management Alternate Flow – Occupied Room Issue Reported
- **Related Feature ID:** F023 · **Covered:** TCOV-23-010, 013 · **Precond:** Occupied room · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Report issue → complete maintenance | occupied → maintenance → available |

---

### 2.2.24 F024 Table Management

> Admin CRUD + status transitions on `tables` (booking_status: available / reserved / occupied /
> maintenance) via `api/table-handler.php`. Tables have a full status column, so **all 18 transition
> cases are supported**. Tables created with a test marker and cleaned up.

#### TC-24-001 — Verify new table record can be added and set as available
- **Related Feature ID:** F024 · **Covered:** TCOV-24-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add table | Table created, status available |

#### TC-24-002 — Verify available table can be reserved
- **Related Feature ID:** F024 · **Covered:** TCOV-24-002 · **Precond:** Available table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve table | available → reserved |

#### TC-24-003 — Verify available table can be marked as under maintenance
- **Related Feature ID:** F024 · **Covered:** TCOV-24-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark maintenance | → maintenance |

#### TC-24-004 — Verify available table details can be updated
- **Related Feature ID:** F024 · **Covered:** TCOV-24-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update fields | Table updated |

#### TC-24-005 — Verify available table can be deleted
- **Related Feature ID:** F024 · **Covered:** TCOV-24-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete table | Removed |

#### TC-24-006 — Verify reserved table can be changed to occupied when customer arrives
- **Related Feature ID:** F024 · **Covered:** TCOV-24-006 · **Precond:** Reserved table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Customer arrives | reserved → occupied |

#### TC-24-007 — Verify reserved table can return to available when reservation is cancelled
- **Related Feature ID:** F024 · **Covered:** TCOV-24-007 · **Precond:** Reserved table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel reservation | reserved → available |

#### TC-24-008 — Verify reserved table details can be updated
- **Related Feature ID:** F024 · **Covered:** TCOV-24-008 · **Precond:** Reserved table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update fields | Updated |

#### TC-24-009 — Verify occupied table becomes available after dining is completed
- **Related Feature ID:** F024 · **Covered:** TCOV-24-009 · **Precond:** Occupied table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Complete dining | occupied → available |

#### TC-24-010 — Verify occupied table can be marked as under maintenance when issue is reported
- **Related Feature ID:** F024 · **Covered:** TCOV-24-010 · **Precond:** Occupied table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Report issue | → maintenance |

#### TC-24-011 — Verify occupied table details can be updated
- **Related Feature ID:** F024 · **Covered:** TCOV-24-011 · **Precond:** Occupied table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update fields | Updated |

#### TC-24-012 — Verify maintenance table details can be updated
- **Related Feature ID:** F024 · **Covered:** TCOV-24-012 · **Precond:** Maintenance table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update fields | Updated |

#### TC-24-013 — Verify table returns to available after maintenance is completed
- **Related Feature ID:** F024 · **Covered:** TCOV-24-013 · **Precond:** Maintenance table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Complete maintenance | maintenance → available |

#### TC-24-014 — Verify maintenance table can be deleted
- **Related Feature ID:** F024 · **Covered:** TCOV-24-014 · **Precond:** Maintenance table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete table | Removed |

#### TC-24-015 — Verify updated table can be saved as available
- **Related Feature ID:** F024 · **Covered:** TCOV-24-015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save status=available | → available |

#### TC-24-016 — Verify updated table can be saved as reserved
- **Related Feature ID:** F024 · **Covered:** TCOV-24-016 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save status=reserved | → reserved |

#### TC-24-017 — Verify updated table can be saved as under maintenance
- **Related Feature ID:** F024 · **Covered:** TCOV-24-017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Save status=maintenance | → maintenance |

#### TC-24-018 — Verify updated table can be deleted
- **Related Feature ID:** F024 · **Covered:** TCOV-24-018 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update then delete | Removed |

#### TC-24-019 — Table Management Main Flow – Add and Reserve Table
- **Related Feature ID:** F024 · **Covered:** TCOV-24-001, 002 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Add table, then reserve | available → reserved |

#### TC-24-020 — Table Management Main Flow – Reservation to Occupied to Available
- **Related Feature ID:** F024 · **Covered:** TCOV-24-002, 006, 009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve → arrive → complete dining | reserved → occupied → available |

#### TC-24-021 — Table Management Alternate Flow – Cancel Reservation
- **Related Feature ID:** F024 · **Covered:** TCOV-24-002, 007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reserve → cancel | reserved → available |

#### TC-24-022 — Table Management Alternate Flow – Maintenance Flow
- **Related Feature ID:** F024 · **Covered:** TCOV-24-003, 013 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark maintenance → complete | maintenance → available |

#### TC-24-023 — Table Management Alternate Flow – Update Table Details
- **Related Feature ID:** F024 · **Covered:** TCOV-24-004, 015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update details, save available | Updated |

#### TC-24-024 — Table Management Alternate Flow – Delete Table
- **Related Feature ID:** F024 · **Covered:** TCOV-24-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete table | Removed |

#### TC-24-025 — Table Management Alternate Flow – Occupied Table Issue Reported
- **Related Feature ID:** F024 · **Covered:** TCOV-24-010, 013 · **Precond:** Occupied table · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Report issue → complete maintenance | occupied → maintenance → available |

---

### 2.2.25 F025 Order Management

> Admin order-status transitions via `api/admin-orders.php`. The handler's valid statuses are only
> **pending / confirmed / completed / cancelled** — there is **no `preparing`, `ready` or `refunded`**
> state. Cases requiring those states fail by design.

#### TC-25-001 — Verify newly placed order is set to pending confirmation
- **Related Feature ID:** F025 · **Covered:** TCOV-25-001 · **Precond:** Admin login; seeded order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | New order | Status = pending |

#### TC-25-002 — Verify pending order can be confirmed by admin/staff
- **Related Feature ID:** F025 · **Covered:** TCOV-25-002 · **Precond:** Pending order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Confirm order | pending → confirmed |

#### TC-25-003 — Verify pending order can be cancelled by admin/staff
- **Related Feature ID:** F025 · **Covered:** TCOV-25-003 · **Precond:** Pending order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel order | pending → cancelled |

#### TC-25-004 — Verify confirmed order can be moved to preparing status
- **Related Feature ID:** F025 · **Covered:** TCOV-25-004 · **Precond:** Confirmed order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Start preparing | No `preparing` status in the app **(documents gap — currently FAILS)** |

#### TC-25-005 — Verify confirmed order can be cancelled
- **Related Feature ID:** F025 · **Covered:** TCOV-25-005 · **Precond:** Confirmed order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel order | confirmed → cancelled |

#### TC-25-006 — Verify preparing order can be marked as ready
- **Related Feature ID:** F025 · **Covered:** TCOV-25-006 · **Precond:** — · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark ready | No `preparing`/`ready` status **(documents gap — currently FAILS)** |

#### TC-25-007 — Verify preparing order can be cancelled
- **Related Feature ID:** F025 · **Covered:** TCOV-25-007 · **Precond:** — · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel preparing order | No `preparing` status **(documents gap — currently FAILS)** |

#### TC-25-008 — Verify ready order can be completed
- **Related Feature ID:** F025 · **Covered:** TCOV-25-008 · **Precond:** — · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Complete order | No `ready` status; completion from confirmed is supported but the `ready` precondition is unreachable **(documents gap — currently FAILS)** |

#### TC-25-009 — Verify cancelled order can be refunded
- **Related Feature ID:** F025 · **Covered:** TCOV-25-009 · **Precond:** Cancelled order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Process refund | No `refunded` status **(documents gap — currently FAILS)** |

#### TC-25-010 — Order Management Main Flow
- **Related Feature ID:** F025 · **Covered:** TCOV-25-001, 002, 004, 006, 008 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | placed → confirmed → (preparing → ready →) completed | Supported up to confirmed→completed; the preparing/ready steps are unsupported **(documents gap — currently FAILS)** |

#### TC-25-011 — Order Management Alternate Flow – Cancel Pending Order
- **Related Feature ID:** F025 · **Covered:** TCOV-25-001, 003 · **Precond:** Pending order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel pending order | pending → cancelled |

#### TC-25-012 — Order Management Alternate Flow – Cancel Confirmed Order
- **Related Feature ID:** F025 · **Covered:** TCOV-25-001, 002, 005 · **Precond:** Confirmed order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel confirmed order | confirmed → cancelled |

#### TC-25-013 — Order Management Alternate Flow – Cancel Preparing Order
- **Related Feature ID:** F025 · **Covered:** TCOV-25-001, 002, 004, 007 · **Precond:** — · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Cancel preparing order | No `preparing` status **(documents gap — currently FAILS)** |

#### TC-25-014 — Order Management Alternate Flow – Refund Cancelled Order
- **Related Feature ID:** F025 · **Covered:** TCOV-25-001, 003, 009 · **Precond:** Cancelled order · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Refund cancelled order | No `refunded` status **(documents gap — currently FAILS)** |

---

### 2.2.26 F026 Customer Management

> Admin views/updates/deletes customer accounts via `api/admin-users.php` and `admin/sections/customers.php`.
> The list/get/update/delete operations with admin auth are implemented, but there is **no customer
> search** feature — the search-based cases fail by design. Customers created with `cmtest_` and cleaned up.

#### TC-26-001 — Verify admin/staff can view and update customer records successfully
- **Related Feature ID:** F026 · **Covered:** TCOV-26-001 · **Precond:** Admin login; seeded customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View customers table, then update a record | List shown; customer updated (`first_name` changes) |

#### TC-26-002 — Verify unauthorized user cannot access customer management
- **Related Feature ID:** F026 · **Covered:** TCOV-26-002 · **Precond:** No admin session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | API request with no session | `{success:false,'Unauthorized'}` |

#### TC-26-003 — Verify no customer record found message is displayed when no customer exists
- **Related Feature ID:** F026 · **Covered:** TCOV-26-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Search with no match | **Should** show "no customer record found". No search feature exists **(documents gap — currently FAILS)** |

#### TC-26-004 — Verify admin/staff can search or filter customer records
- **Related Feature ID:** F026 · **Covered:** TCOV-26-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Search by name/email | **Should** return matching records. No search feature exists **(documents gap — currently FAILS)** |

#### TC-26-005 — Verify customer record not found message is displayed for invalid customer ID
- **Related Feature ID:** F026 · **Covered:** TCOV-26-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | `get` with id=999999 | `{success:false}` with "not found" |

#### TC-26-006 — Verify invalid customer update data is rejected
- **Related Feature ID:** F026 · **Covered:** TCOV-26-006 · **Precond:** Admin login; seeded customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update with empty email | `{success:false,'Missing required fields'}` |

#### TC-26-007 — Verify admin/staff can delete or deactivate customer account successfully
- **Related Feature ID:** F026 · **Covered:** TCOV-26-007 · **Precond:** Admin login; seeded customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete customer | `{success:true}`; row removed |

#### TC-26-008 — Verify database or server error displays error message and keeps customer data unchanged
- **Related Feature ID:** F026 · **Covered:** TCOV-26-008 · **Precond:** Admin login; seeded customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update to an email used by another user | `{success:false,'Email already exists'}`; customer email/name unchanged |

#### TC-26-009 — Customer Management Main Flow
- **Related Feature ID:** F026 · **Covered:** TCOV-26-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | View + update a customer | List shown; record updated |

#### TC-26-010 — Customer Management Alternate Flow – Unauthorized Access
- **Related Feature ID:** F026 · **Covered:** TCOV-26-002 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No-session API call | Unauthorized |

#### TC-26-011 — Customer Management Alternate Flow – No Customer Record Found
- **Related Feature ID:** F026 · **Covered:** TCOV-26-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Search with no match | **(documents gap — currently FAILS, no search)** |

#### TC-26-012 — Customer Management Alternate Flow – Search or Filter Customer
- **Related Feature ID:** F026 · **Covered:** TCOV-26-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Search by keyword | **(documents gap — currently FAILS, no search)** |

#### TC-26-013 — Customer Management Alternate Flow – Customer Record Not Found
- **Related Feature ID:** F026 · **Covered:** TCOV-26-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid customer id | "not found" |

#### TC-26-014 — Customer Management Alternate Flow – Invalid Customer Update Data
- **Related Feature ID:** F026 · **Covered:** TCOV-26-006 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty required field | Rejected |

#### TC-26-015 — Customer Management Alternate Flow – Delete or Deactivate Customer
- **Related Feature ID:** F026 · **Covered:** TCOV-26-007 · **Precond:** Admin login; seeded customer · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete customer | Removed |

#### TC-26-016 — Customer Management Alternate Flow – Database or Server Error
- **Related Feature ID:** F026 · **Covered:** TCOV-26-008 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Duplicate email update | Rejected; data unchanged |

---

### 2.2.27 F027 Staff Management

> Admin manages staff accounts via `api/admin-users.php` (create/update/delete, admin-only). `create`
> validates required fields and duplicate email but does **not** validate email format — the
> invalid-email case fails by design. Staff created with `stafftest_` and cleaned up.

#### TC-27-001 — Verify unauthenticated user cannot access staff management
- **Related Feature ID:** F027 · **Covered:** TCOV-27-001 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Staff API call with no session | Unauthorized; error message |

#### TC-27-002 — Verify user without staff management permission cannot access staff management
- **Related Feature ID:** F027 · **Covered:** TCOV-27-002 · **Precond:** Non-admin session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Non-admin attempts staff management | Rejected; error message |

#### TC-27-003 — Verify missing staff details are rejected
- **Related Feature ID:** F027 · **Covered:** TCOV-27-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Create staff with no password | `{success:false,'Missing required fields'}` |

#### TC-27-004 — Verify invalid staff email format is rejected
- **Related Feature ID:** F027 · **Covered:** TCOV-27-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | email=`notanemail`, other fields valid | **Should** be rejected. The create action does no email-format check, so the staff account is created **(documents gap — currently FAILS)** |

#### TC-27-005 — Verify duplicate staff account cannot be created
- **Related Feature ID:** F027 · **Covered:** TCOV-27-005 · **Precond:** Admin login; existing email · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | email=`yangenna20@gmail.com` | `{success:false,'Email already exists'}` |

#### TC-27-006 — Verify new staff account can be created successfully
- **Related Feature ID:** F027 · **Covered:** TCOV-27-006 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid staff details, role=staff | `{success:true}`; user `role='staff'` |

#### TC-27-007 — Verify update/delete is rejected when staff record does not exist
- **Related Feature ID:** F027 · **Covered:** TCOV-27-007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | `update`/`delete` id=999999 | `{success:false,'User not found'}` for both |

#### TC-27-008 — Verify existing staff account can be updated successfully
- **Related Feature ID:** F027 · **Covered:** TCOV-27-008 · **Precond:** Admin login; seeded staff · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update staff first_name | `{success:true}`; `first_name` changes |

#### TC-27-009 — Verify existing staff account can be deleted or deactivated successfully
- **Related Feature ID:** F027 · **Covered:** TCOV-27-008 · **Precond:** Admin login; seeded staff · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete staff | `{success:true}`; row removed |

#### TC-27-010 — Staff Management Main Flow – Create Staff Account
- **Related Feature ID:** F027 · **Covered:** TCOV-27-006 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Create valid staff | Created |

#### TC-27-011 — Staff Management Main Flow – Update Staff Account
- **Related Feature ID:** F027 · **Covered:** TCOV-27-008 · **Precond:** Admin login; seeded staff · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update staff | Updated |

#### TC-27-012 — Staff Management Main Flow – Delete or Deactivate Staff Account
- **Related Feature ID:** F027 · **Covered:** TCOV-27-008 · **Precond:** Admin login; seeded staff · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete staff | Removed |

#### TC-27-013 — Staff Management Alternate Flow – Admin Not Logged In
- **Related Feature ID:** F027 · **Covered:** TCOV-27-001 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No-session call | Unauthorized |

#### TC-27-014 — Staff Management Alternate Flow – No Permission
- **Related Feature ID:** F027 · **Covered:** TCOV-27-002 · **Precond:** Non-admin · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Non-admin call | Rejected |

#### TC-27-015 — Staff Management Alternate Flow – Missing Staff Details
- **Related Feature ID:** F027 · **Covered:** TCOV-27-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Missing required field | Rejected |

#### TC-27-016 — Staff Management Alternate Flow – Invalid Staff Email
- **Related Feature ID:** F027 · **Covered:** TCOV-27-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Malformed email | **(documents gap — currently FAILS, no format check)** |

#### TC-27-017 — Staff Management Alternate Flow – Duplicate Staff Account
- **Related Feature ID:** F027 · **Covered:** TCOV-27-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Existing email | Rejected; "Email already exists" |

#### TC-27-018 — Staff Management Alternate Flow – Staff Record Not Found
- **Related Feature ID:** F027 · **Covered:** TCOV-27-007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update/delete non-existent id | "User not found" |

---

### 2.2.28 F028 Coupon Management

> Admin coupon create/update via `api/admin-coupons.php`. The `create` action validates: code non-empty
> (**no minimum length**), discount_value > 0 (≤100% for percentage), and duplicate code. It does **not**
> validate code length, negative min_purchase, usage-limit validity, or past expiry — so cases 001, 004,
> 010, 013 fail by design. Coupons created with a `TST…` prefix and cleaned up.

#### TC-28-001 — Verify coupon code with 2 characters is rejected
- **Related Feature ID:** F028 · **Covered:** TCOV-28-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | code=`AB` | **Should** be rejected (below min length). Only non-empty is checked **(documents gap — currently FAILS)** |

#### TC-28-002 — Verify coupon code with 3 characters is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-002 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | code=`ABC` | Created successfully |

#### TC-28-003 — Verify coupon code with 4 characters is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | code=`ABCDE` | Created successfully |

#### TC-28-004 — Verify minimum purchase amount below RM0 is rejected
- **Related Feature ID:** F028 · **Covered:** TCOV-28-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | min_purchase=`-100` | **Should** be rejected. No negative-value check **(documents gap — currently FAILS)** |

#### TC-28-005 — Verify minimum purchase amount of RM0 is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | min_purchase=`0` | Created successfully |

#### TC-28-006 — Verify minimum purchase amount above RM0 is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-006 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | min_purchase=`500` | Created successfully |

#### TC-28-007 — Verify discount amount of RM0 is rejected
- **Related Feature ID:** F028 · **Covered:** TCOV-28-007 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | discount_value=`0` | Rejected; "Discount value must be greater than 0" |

#### TC-28-008 — Verify discount amount of RM1 is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-008 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | discount_value=`1` | Created successfully |

#### TC-28-009 — Verify discount amount greater than order total is handled correctly
- **Related Feature ID:** F028 · **Covered:** TCOV-28-009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | discount_type=percentage, value=`150` | Rejected; "cannot exceed 100" |

#### TC-28-010 — Verify usage limit of 0 is rejected
- **Related Feature ID:** F028 · **Covered:** TCOV-28-010 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | usage_limit=`-5` (invalid) | **Should** be rejected. No usage-limit validation **(documents gap — currently FAILS)** |

#### TC-28-011 — Verify usage limit of 1 is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-011 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | usage_limit=`1` | Created successfully |

#### TC-28-012 — Verify usage limit greater than 1 is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-012 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | usage_limit=`10` | Created successfully |

#### TC-28-013 — Verify expiry date before current date is rejected
- **Related Feature ID:** F028 · **Covered:** TCOV-28-013 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | valid_until=past date | **Should** be rejected. No date validation **(documents gap — currently FAILS)** |

#### TC-28-014 — Verify expiry date same as current date is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-014 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | valid_until=today 23:59:59 | Created successfully |

#### TC-28-015 — Verify expiry date after current date is accepted
- **Related Feature ID:** F028 · **Covered:** TCOV-28-015 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | valid_until=future date | Created successfully |

#### TC-28-016 — Verify coupon can be created or updated successfully with valid data
- **Related Feature ID:** F028 · **Covered:** TCOV-28-016 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid coupon data | `{success:true}`; "created successfully" |

#### TC-28-017 — Verify coupon creation/update is rejected when invalid data is entered
- **Related Feature ID:** F028 · **Covered:** TCOV-28-017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | code empty | Rejected; "Coupon code is required" |

#### TC-28-018 — Coupon Management Main Flow
- **Related Feature ID:** F028 · **Covered:** TCOV-28-002, 006, 008, 011, 015, 016 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Valid code/min/discount/usage/expiry | Created successfully |

#### TC-28-019 — Coupon Management Alternate Flow – Invalid Coupon Code Length
- **Related Feature ID:** F028 · **Covered:** TCOV-28-001, 017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Too-short code | **(documents gap — currently FAILS, no length check)** |

#### TC-28-020 — Coupon Management Alternate Flow – Invalid Minimum Purchase Amount
- **Related Feature ID:** F028 · **Covered:** TCOV-28-004, 017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Negative min_purchase | **(documents gap — currently FAILS, no check)** |

#### TC-28-021 — Coupon Management Alternate Flow – Invalid Discount Amount
- **Related Feature ID:** F028 · **Covered:** TCOV-28-007, 009, 017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | discount=0 / >100% | Rejected with the corresponding message |

#### TC-28-022 — Coupon Management Alternate Flow – Invalid Usage Limit
- **Related Feature ID:** F028 · **Covered:** TCOV-28-010, 017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Invalid usage limit | **(documents gap — currently FAILS, no check)** |

#### TC-28-023 — Coupon Management Alternate Flow – Expired Date
- **Related Feature ID:** F028 · **Covered:** TCOV-28-013, 017 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Past expiry date | **(documents gap — currently FAILS, no date check)** |

---

### 2.2.29 F029 Blog Management

> Admin manages blog posts via `api/admin-blogs.php` (admin-only). `add` requires title/category/content
> and supports draft/published/archived status; update/delete/status changes work. It does **no image
> type/size validation** (moves any file) — the invalid-image case fails by design. Posts created with
> `F029TEST_` and cleaned up.

#### TC-29-001 — Verify admin/staff can create a new blog post successfully
- **Related Feature ID:** F029 · **Covered:** TCOV-29-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | add: title/category/content/status | `{success:true}`; blog title stored |

#### TC-29-002 — Verify unauthorized user cannot access blog management
- **Related Feature ID:** F029 · **Covered:** TCOV-29-002 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | add with no session | `{success:false,'Unauthorized'}` |

#### TC-29-003 — Verify blog submission is rejected when required fields are missing
- **Related Feature ID:** F029 · **Covered:** TCOV-29-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | add with empty content | `{success:false,'Content is required'}` |

#### TC-29-004 — Verify invalid blog image upload is rejected
- **Related Feature ID:** F029 · **Covered:** TCOV-29-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | featured_image=`bad.txt` (text/plain) | **Should** be rejected. No image type/size check — the file is moved and the blog created **(documents gap — currently FAILS)**. Blog+file cleaned up |

#### TC-29-005 — Verify admin/staff can edit an existing blog post successfully
- **Related Feature ID:** F029 · **Covered:** TCOV-29-005 · **Precond:** Admin login; existing post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | update title | `{success:true}`; title changes |

#### TC-29-006 — Verify admin/staff can publish a blog post successfully
- **Related Feature ID:** F029 · **Covered:** TCOV-29-006 · **Precond:** Admin login; draft post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | update status=published | status → published |

#### TC-29-007 — Verify admin/staff can unpublish a blog post successfully
- **Related Feature ID:** F029 · **Covered:** TCOV-29-007 · **Precond:** Admin login; published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | update status=draft | status → draft (unpublished) |

#### TC-29-008 — Verify admin/staff can delete a blog post successfully
- **Related Feature ID:** F029 · **Covered:** TCOV-29-008 · **Precond:** Admin login; existing post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | delete post | `{success:true}`; row removed |

#### TC-29-009 — Verify database or server error displays error message and keeps blog data unchanged
- **Related Feature ID:** F029 · **Covered:** TCOV-29-009 · **Precond:** Admin login; existing post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | update with empty title | `{success:false,'Missing required fields'}`; title unchanged |

#### TC-29-010 — Blog Management Main Flow
- **Related Feature ID:** F029 · **Covered:** TCOV-29-001 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Create a blog | Created |

#### TC-29-011 — Blog Management Alternate Flow – Unauthorized Access
- **Related Feature ID:** F029 · **Covered:** TCOV-29-002 · **Precond:** No session · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | No-session add | Unauthorized |

#### TC-29-012 — Blog Management Alternate Flow – Missing Required Blog Details
- **Related Feature ID:** F029 · **Covered:** TCOV-29-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Empty title/content | Rejected |

#### TC-29-013 — Blog Management Alternate Flow – Invalid Blog Image
- **Related Feature ID:** F029 · **Covered:** TCOV-29-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Non-image upload | **(documents gap — currently FAILS, no image check)** |

#### TC-29-014 — Blog Management Alternate Flow – Edit Blog Post
- **Related Feature ID:** F029 · **Covered:** TCOV-29-005 · **Precond:** Admin login; existing post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update post | Updated |

#### TC-29-015 — Blog Management Alternate Flow – Publish Blog Post
- **Related Feature ID:** F029 · **Covered:** TCOV-29-006 · **Precond:** Admin login; draft post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Publish | status → published |

#### TC-29-016 — Blog Management Alternate Flow – Unpublish Blog Post
- **Related Feature ID:** F029 · **Covered:** TCOV-29-007 · **Precond:** Admin login; published post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Unpublish | status → draft |

#### TC-29-017 — Blog Management Alternate Flow – Delete Blog Post
- **Related Feature ID:** F029 · **Covered:** TCOV-29-008 · **Precond:** Admin login; existing post · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete post | Removed |

#### TC-29-018 — Blog Management Alternate Flow – Database or Server Error
- **Related Feature ID:** F029 · **Covered:** TCOV-29-009 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Update with empty required field | Rejected; data unchanged |

---

### 2.2.30 F030 Contact Request Management

> Admin manages contact requests via `api/admin-contacts.php`. The `contact_requests.status` enum is
> only **pending / in-progress / resolved** — there is **no `viewed` state**, and `responded`/`closed`
> both map to `resolved`. Cases requiring the `viewed` state fail by design. Requests created with a
> `CRTEST_` subject and cleaned up.

#### TC-30-001 — Verify admin/staff can view a new contact request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001 · **Precond:** Admin login; pending request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark request as `viewed` | No `viewed` status — `update_status` returns "Invalid status" **(documents gap — currently FAILS)** |

#### TC-30-002 — Verify new contact request can be deleted
- **Related Feature ID:** F030 · **Covered:** TCOV-30-002 · **Precond:** Admin login; pending request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete pending request | `{success:true}`; row removed |

#### TC-30-003 — Verify viewed contact request can be deleted
- **Related Feature ID:** F030 · **Covered:** TCOV-30-003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reach `viewed` state, then delete | `viewed` state unreachable **(documents gap — currently FAILS)** |

#### TC-30-004 — Verify viewed contact request can be marked as in progress
- **Related Feature ID:** F030 · **Covered:** TCOV-30-004 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | From `viewed` → in-progress | `viewed` state unreachable **(documents gap — currently FAILS)** |

#### TC-30-005 — Verify viewed contact request can be replied directly
- **Related Feature ID:** F030 · **Covered:** TCOV-30-005 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | From `viewed` → reply/responded | `viewed` state unreachable **(documents gap — currently FAILS)** |

#### TC-30-006 — Verify in-progress contact request can be deleted
- **Related Feature ID:** F030 · **Covered:** TCOV-30-006 · **Precond:** Admin login; in-progress request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete in-progress request | `{success:true}`; removed |

#### TC-30-007 — Verify in-progress contact request can be responded to
- **Related Feature ID:** F030 · **Covered:** TCOV-30-007 · **Precond:** Admin login; in-progress request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Mark responded (status=resolved) | status → resolved |

#### TC-30-008 — Verify in-progress contact request can be closed without replying
- **Related Feature ID:** F030 · **Covered:** TCOV-30-008 · **Precond:** Admin login; in-progress request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Close (status=resolved) | status → resolved (closed = resolved) |

#### TC-30-009 — Verify responded contact request can be deleted
- **Related Feature ID:** F030 · **Covered:** TCOV-30-009 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete responded (resolved) request | `{success:true}`; removed |

#### TC-30-010 — Verify responded contact request can be closed
- **Related Feature ID:** F030 · **Covered:** TCOV-30-010 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Close responded request (resolved → resolved) | Succeeds (closed and responded both = resolved) |

#### TC-30-011 — Verify responded contact request can be reopened
- **Related Feature ID:** F030 · **Covered:** TCOV-30-011 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reopen (status=in-progress) | status → in-progress |

#### TC-30-012 — Verify closed contact request can be deleted
- **Related Feature ID:** F030 · **Covered:** TCOV-30-012 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete closed (resolved) request | `{success:true}`; removed |

#### TC-30-013 — Verify closed contact request can be reopened
- **Related Feature ID:** F030 · **Covered:** TCOV-30-013 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reopen (status=in-progress) | status → in-progress |

#### TC-30-014 — Contact Request Management Main Flow
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 007, 010 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | view → in-progress → responded → closed | The `viewed` step is unsupported **(documents gap — currently FAILS)** |

#### TC-30-015 — Contact Request Management Alternate Flow – Reply Directly After Viewing
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 005, 010 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | view → reply → closed | `viewed` unsupported **(documents gap — currently FAILS)** |

#### TC-30-016 — Contact Request Management Alternate Flow – Close Without Reply
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 008 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | view → in-progress → close | `viewed` unsupported **(documents gap — currently FAILS)** |

#### TC-30-017 — Contact Request Management Alternate Flow – Reopen Responded Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 007, 011 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | … → responded → reopen | `viewed` step unsupported **(documents gap — currently FAILS)** |

#### TC-30-018 — Contact Request Management Alternate Flow – Reopen Closed Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 007, 010, 013 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | … → closed → reopen | `viewed` step unsupported **(documents gap — currently FAILS)** |

#### TC-30-019 — Contact Request Management Alternate Flow – Delete New Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-002 · **Precond:** Admin login; pending request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete pending request | Removed |

#### TC-30-020 — Contact Request Management Alternate Flow – Delete Viewed Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 003 · **Precond:** Admin login · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Reach `viewed`, then delete | `viewed` unreachable **(documents gap — currently FAILS)** |

#### TC-30-021 — Contact Request Management Alternate Flow – Delete In-Progress Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 006 · **Precond:** Admin login; in-progress request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete in-progress request | Removed |

#### TC-30-022 — Contact Request Management Alternate Flow – Delete Responded Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 007, 009 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete responded request | Removed |

#### TC-30-023 — Contact Request Management Alternate Flow – Delete Closed Request
- **Related Feature ID:** F030 · **Covered:** TCOV-30-001, 004, 007, 010, 012 · **Precond:** Admin login; resolved request · **Dependency:** None

| # | Input | Expected Result |
|---|---|---|
| 1 | Delete closed request | Removed |

---

## 2.3 Feature Pass/Fail Criteria

Each feature passes when:
i. All its **implementable** test cases pass.
ii. 0% calculation error on monetary transactions (room/table totals, coupon discounts, cart totals).
iii. No deadlock.
iv. The feature fulfils its requirement.

Cases explicitly marked **(documents gap — currently FAILS)** or **Not implemented — skipped** are
expected red/omitted; they are IV&V findings recording where the implementation diverges from the
design (missing states, missing validation, or missing gates), not test defects.

## 2.4 Test Deliverables

i. Test Automation Suite — Playwright specs under `tests/` (30 `.spec.ts` files, F001–F030).
ii. Test Case Specification (this document).
iii. Test Log / Playwright HTML report.
iv. Test Summary Report.
v. Test Incident Report (the documented gaps above).

