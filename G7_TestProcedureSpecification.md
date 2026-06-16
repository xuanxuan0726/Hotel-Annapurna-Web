# Test Procedure Specification

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
| **Document Name** | Hotel Annapurna Web Management System Test Procedure Specification (Iteration 1) |
| **Reference Number** | HAWS_TPS_1 |
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

This procedure describes the steps necessary to execute the test cases specified in the Hotel Annapurna
Web (HAWS) Test Case Specification (HAWS_TCS_1_1.0.0). Each Test Procedure is presented as its own
table giving the procedure ID, objective, the test cases it executes, the operational set-up steps
(each citing the test case it covers), and the wrap-up/cleanup actions.

For test design and test cases, refer to:
i. HAWS Test Design Specification (HAWS_TDS_1_1.0.0)
ii. HAWS Test Case Specification (HAWS_TCS_1_1.0.0)

### 1.2 Scope

The following features are covered in this procedure:

| Feature ID | Feature | Description | Accessible Role |
|---|---|---|---|
| F001 | User Registration | Create a new account with personal details. | Visitor |
| F002 | User Login | Authenticate with email and password. | Visitor |
| F003 | Session Verification | Check active session before protected pages. | User |
| F004 | OTP Account Verification | Verify a new account via emailed OTP. | New user |
| F005 | Password Reset | Reset a forgotten password via OTP/token. | User |
| F006 | Browse Food Menu | View food items by category. | Visitor / User |
| F007 | Add Food to Cart | Add food items to the cart. | User |
| F008 | Room Availability Checking | Check room availability before booking. | User |
| F009 | Room Booking | Book an available room. | User |
| F010 | Table Availability Checking | Check table availability before reserving. | User |
| F011 | Table Reservation | Reserve an available dining table. | User |
| F012 | Cart Checkout | Confirm cart and proceed to payment. | User |
| F013 | Coupon Validation | Validate a coupon at checkout. | User |
| F014 | Payment Processing | Pay via Cash / eSewa / Stripe. | User |
| F015 | Order History Viewing | View previous food orders. | User |
| F016 | Booking History Viewing | View previous bookings/reservations. | User |
| F017 | Profile Management | View and update profile. | User |
| F018 | Contact Form Submission | Send an inquiry to the hotel. | Visitor / User |
| F019 | Blog Viewing | View published blog posts. | Visitor / User |
| F020 | Blog Interaction | Like / comment / share blog posts. | User |
| F021 | Admin Dashboard Access | Access the admin dashboard. | Admin / Staff |
| F022 | Food/Menu Management | Manage food items. | Admin |
| F023 | Room Management | Manage rooms and status. | Admin |
| F024 | Table Management | Manage tables and status. | Admin |
| F025 | Order Management | Manage order status. | Admin |
| F026 | Customer Management | Manage customer accounts. | Admin |
| F027 | Staff Management | Manage staff accounts. | Admin |
| F028 | Coupon Management | Manage coupon codes. | Admin |
| F029 | Blog Management | Manage blog posts. | Admin |
| F030 | Contact Request Management | Manage contact requests. | Admin |

### 1.3 References

i. IEEE 829-2008 Standard for Software and System Test Documentation
ii. HAWS Software Requirement Specifications
iii. HAWS Test Design Specification (HAWS_TDS_1_1.0.0)
iv. HAWS Test Case Specification (HAWS_TCS_1_1.0.0)

---

## 2.0 Test Procedure

Prior to executing any procedure below, the following **environment prerequisites** must be prepared:

i. XAMPP **Apache** and **MySQL/MariaDB** services are running; schema `hotel_annapurna` is loaded.
ii. Playwright (`@playwright/test` ^1.60.0) is installed; tests run with `--project=chromium --workers=1`.
iii. The MySQL CLI `C:\xampp\mysql\bin\mysql.exe -uroot` is reachable for data setup/assertion/cleanup.
iv. Standing accounts exist: **Admin** `lucavalentines80@gmail.com` / `adminadmin`; **Customer**
    `yangenna20@gmail.com` / `ennayang`.

> **Notation.** "Run TC-XX-NNN" means execute the corresponding Playwright test/assertion as detailed in
> the Test Case Specification. Steps marked **[gap]** exercise a case the design requires but the
> application does not implement; the case is expected to FAIL (an IV&V finding) and the result is still
> recorded. Each procedure cleans up the data it creates in its Wrap Up.

---

### 2.1 F001 User Registration Test Procedure

Prerequisites: no active session; `yangenna20@gmail.com` exists (for the duplicate-email cases).

| **Test Procedure ID** | TP-01-001 |
|---|---|
| **Objective** | Verify a valid registration is accepted and an OTP is issued (main flow). |
| **Test Cases To Be Executed** | TC-01-001, TC-01-016 |
| **Set Up** | 1. Open `register.php`.<br>2. Fill name, fresh unique email, 10-digit contact, 8+ char password, matching confirm; check Terms.<br>3. Click Submit; confirm redirect to `verify-register.php` and an OTP row is created. [TC-01-001, TC-01-016] |
| **Wrap Up** | Delete the `registration_otps` row for the fresh email. |

*Table 2.1.1 Valid Registration / Main Flow Test Procedure*

| **Test Procedure ID** | TP-01-002 |
|---|---|
| **Objective** | Verify an empty required field is blocked by native HTML5 validation. |
| **Test Cases To Be Executed** | TC-01-002 |
| **Set Up** | 1. Open `register.php`.<br>2. Leave `#firstName` empty; fill all other fields validly; check Terms.<br>3. Click Submit; confirm `#firstName.checkValidity()===false` and the page stays on `register.php`. [TC-01-002] |
| **Wrap Up** | None. |

*Table 2.1.2 Empty Required Field Test Procedure*

| **Test Procedure ID** | TP-01-003 |
|---|---|
| **Objective** | Verify a malformed email is blocked by the HTML5 `type=email` field. |
| **Test Cases To Be Executed** | TC-01-003 |
| **Set Up** | 1. Open `register.php`.<br>2. Enter email=`invalidemail`; fill other fields validly; check Terms.<br>3. Click Submit; confirm `#email.checkValidity()===false`, stays on `register.php`. [TC-01-003] |
| **Wrap Up** | None. |

*Table 2.1.3 Invalid Email Format Test Procedure*

| **Test Procedure ID** | TP-01-004 |
|---|---|
| **Objective** | Verify registration with an already-registered email is rejected server-side. |
| **Test Cases To Be Executed** | TC-01-004, TC-01-018 |
| **Set Up** | 1. Open `register.php`.<br>2. Enter email=`yangenna20@gmail.com`; fill other fields validly; check Terms.<br>3. Click Submit; confirm the error box shows "Email already registered". [TC-01-004, TC-01-018] |
| **Wrap Up** | None. |

*Table 2.1.4 Duplicate Email Test Procedure*

| **Test Procedure ID** | TP-01-005 |
|---|---|
| **Objective** | Verify an invalid contact-number format is rejected server-side. |
| **Test Cases To Be Executed** | TC-01-005 |
| **Set Up** | 1. Open `register.php`.<br>2. Enter contact=`12ab56`; fill other fields validly; check Terms.<br>3. Click Submit; confirm "Contact number must be 10 digits". [TC-01-005] |
| **Wrap Up** | None. |

*Table 2.1.5 Invalid Contact Number Format Test Procedure*

| **Test Procedure ID** | TP-01-006 |
|---|---|
| **Objective** | Verify a too-short password and a confirm-password mismatch are rejected. |
| **Test Cases To Be Executed** | TC-01-006, TC-01-007 |
| **Set Up** | 1. Open `register.php`; submit password=confirm=`pass1`; confirm "Password must be at least 8 characters". [TC-01-006]<br>2. Re-open; submit password=`Password1!`, confirm=`Different1!`; confirm "Passwords do not match". [TC-01-007] |
| **Wrap Up** | None. |

*Table 2.1.6 Invalid / Mismatched Password Test Procedure*

| **Test Procedure ID** | TP-01-007 |
|---|---|
| **Objective** | Verify the password-length boundary (0, 7, 8, 9 characters). |
| **Test Cases To Be Executed** | TC-01-008, TC-01-009, TC-01-010, TC-01-011 |
| **Set Up** | 1. Submit empty password; confirm HTML5 block, stays on page. [TC-01-008]<br>2. Submit `abc1234` (7); confirm "Password must be at least 8 characters". [TC-01-009]<br>3. Submit `abc12345` (8); confirm redirect to `verify-register.php`. [TC-01-010]<br>4. Submit `abc123456` (9); confirm redirect. [TC-01-011] |
| **Wrap Up** | Delete `registration_otps` rows from the success submissions (steps 3, 4). |

*Table 2.1.7 Password Length Boundary Test Procedure*

| **Test Procedure ID** | TP-01-008 |
|---|---|
| **Objective** | Verify the contact-number length boundary (9, 10, 11, 12 digits). |
| **Test Cases To Be Executed** | TC-01-012, TC-01-013, TC-01-014, TC-01-015 |
| **Set Up** | 1. Submit contact=`012345678` (9); confirm "Contact number must be 10 digits". [TC-01-012]<br>2. Submit `0123456789` (10); confirm redirect to `verify-register.php`. [TC-01-013]<br>3. Submit `01234567890` (11); design expects accept, app rejects. **[gap]** [TC-01-014]<br>4. Submit `012345678901` (12); confirm "Contact number must be 10 digits". [TC-01-015] |
| **Wrap Up** | Delete the `registration_otps` row from step 2. |

*Table 2.1.8 Contact Number Length Boundary Test Procedure*

| **Test Procedure ID** | TP-01-009 |
|---|---|
| **Objective** | Verify the invalid-input alternate flow rejects any single invalid field. |
| **Test Cases To Be Executed** | TC-01-017 |
| **Set Up** | 1. Open `register.php`.<br>2. Submit a form with one invalid field (empty / malformed email / bad contact / short password).<br>3. Confirm rejection — native block for HTML5-invalid fields, otherwise server error box; stays on `register.php`. [TC-01-017] |
| **Wrap Up** | None. |

*Table 2.1.9 Invalid Input Alternate Flow Test Procedure*

---

### 2.2 F002 User Login Test Procedure

Prerequisites: standing customer and admin accounts exist.

| **Test Procedure ID** | TP-02-001 |
|---|---|
| **Objective** | Verify empty email/password fields are blocked by HTML5 validation. |
| **Test Cases To Be Executed** | TC-02-001, TC-02-002, TC-02-010 |
| **Set Up** | 1. Open `login.php`; leave email empty, fill password, Submit; confirm `#email` invalid, stays. [TC-02-001, TC-02-010]<br>2. Fill email, leave password empty, Submit; confirm `#password` invalid, stays. [TC-02-002, TC-02-010] |
| **Wrap Up** | None. |

*Table 2.2.1 Empty Login Field Test Procedure*

| **Test Procedure ID** | TP-02-002 |
|---|---|
| **Objective** | Verify a login for a non-existent account is rejected. |
| **Test Cases To Be Executed** | TC-02-003, TC-02-011 |
| **Set Up** | 1. Open `login.php`; submit `nonexistent_<unique>@example.com` + any password.<br>2. Confirm error box "Invalid email or password". [TC-02-003, TC-02-011] |
| **Wrap Up** | None. |

*Table 2.2.2 Invalid Account Test Procedure*

| **Test Procedure ID** | TP-02-003 |
|---|---|
| **Objective** | Verify a wrong password is rejected. |
| **Test Cases To Be Executed** | TC-02-004, TC-02-012 |
| **Set Up** | 1. Submit `yangenna20@gmail.com` + `wrongpassword`.<br>2. Confirm "Invalid email or password". [TC-02-004, TC-02-012] |
| **Wrap Up** | None. |

*Table 2.2.3 Incorrect Password Test Procedure*

| **Test Procedure ID** | TP-02-004 |
|---|---|
| **Objective** | Verify an unverified (pending) account cannot log in. |
| **Test Cases To Be Executed** | TC-02-005, TC-02-013 |
| **Set Up** | 1. Seed a user with `status='pending'`.<br>2. Submit its credentials; confirm "Please verify your email address before logging in". [TC-02-005, TC-02-013] |
| **Wrap Up** | Delete the seeded pending account. |

*Table 2.2.4 Account Not Verified Test Procedure*

| **Test Procedure ID** | TP-02-005 |
|---|---|
| **Objective** | Verify a valid admin login redirects to the admin dashboard. |
| **Test Cases To Be Executed** | TC-02-006, TC-02-008 |
| **Set Up** | 1. Submit `lucavalentines80@gmail.com` / `adminadmin`.<br>2. Confirm session created and redirect to `admin/index.php`. [TC-02-006, TC-02-008] |
| **Wrap Up** | Log out / clear cookies. |

*Table 2.2.5 Admin Login Main Flow Test Procedure*

| **Test Procedure ID** | TP-02-006 |
|---|---|
| **Objective** | Verify a valid customer login redirects to the customer homepage. |
| **Test Cases To Be Executed** | TC-02-007, TC-02-009 |
| **Set Up** | 1. Submit `yangenna20@gmail.com` / `ennayang`.<br>2. Confirm redirect to `index.php` (not `/admin/`). [TC-02-007, TC-02-009] |
| **Wrap Up** | Log out / clear cookies. |

*Table 2.2.6 Customer Login Main Flow Test Procedure*

---

### 2.3 F003 Session Verification Test Procedure

Prerequisites: standing customer account; ability to clear cookies to simulate logout/expiry.

| **Test Procedure ID** | TP-03-001 |
|---|---|
| **Objective** | Verify a protected-page request triggers a session check and a valid session is served. |
| **Test Cases To Be Executed** | TC-03-001, TC-03-002, TC-03-009 |
| **Set Up** | 1. Request a protected page (e.g. `profile.php`); confirm a session check occurs. [TC-03-001, TC-03-009]<br>2. Log in; request the protected page; confirm it renders. [TC-03-002] |
| **Wrap Up** | Clear cookies. |

*Table 2.3.1 Valid Session Test Procedure*

| **Test Procedure ID** | TP-03-002 |
|---|---|
| **Objective** | Verify an invalid/absent session is redirected to login. |
| **Test Cases To Be Executed** | TC-03-003, TC-03-010 |
| **Set Up** | 1. Without a session, request a protected page.<br>2. Confirm redirect to `login.php`. [TC-03-003, TC-03-010] |
| **Wrap Up** | None. |

*Table 2.3.2 Invalid Session Test Procedure*

| **Test Procedure ID** | TP-03-003 |
|---|---|
| **Objective** | Verify an expired session is destroyed and redirected to login. |
| **Test Cases To Be Executed** | TC-03-004, TC-03-011 |
| **Set Up** | 1. Log in; clear session cookies.<br>2. Request a protected page; confirm session destroyed and redirect. [TC-03-004, TC-03-011] |
| **Wrap Up** | None. |

*Table 2.3.3 Expired Session Test Procedure*

| **Test Procedure ID** | TP-03-004 |
|---|---|
| **Objective** | Verify logout destroys the session and removes protected access. |
| **Test Cases To Be Executed** | TC-03-005, TC-03-012 |
| **Set Up** | 1. Log in; view a protected page; click Logout.<br>2. Confirm session destroyed and access no longer permitted. [TC-03-005, TC-03-012] |
| **Wrap Up** | None. |

*Table 2.3.4 Logout Test Procedure*

| **Test Procedure ID** | TP-03-005 |
|---|---|
| **Objective** | Verify session timeout redirects to login. |
| **Test Cases To Be Executed** | TC-03-006, TC-03-013 |
| **Set Up** | 1. Log in; view a protected page.<br>2. Simulate timeout; re-request the page; confirm redirect to login. [TC-03-006, TC-03-013] |
| **Wrap Up** | None. |

*Table 2.3.5 Session Timeout Test Procedure*

| **Test Procedure ID** | TP-03-006 |
|---|---|
| **Objective** | Verify login success creates a session, and login failure stays on the login page. |
| **Test Cases To Be Executed** | TC-03-007, TC-03-008 |
| **Set Up** | 1. Log in successfully; open a protected page; confirm session created. [TC-03-007]<br>2. Submit invalid credentials; confirm stays on `login.php` with an error. [TC-03-008] |
| **Wrap Up** | Clear cookies. |

*Table 2.3.6 Login Success / Failure Test Procedure*

---

### 2.4 F004 OTP Account Verification Test Procedure

Prerequisites: `verify-register.php` reached by registering first; OTP value read from `registration_otps`; Mailtrap SMTP configured. Cases TP-04-006/007 wait the real 60-second resend cooldown.

| **Test Procedure ID** | TP-04-001 |
|---|---|
| **Objective** | Verify the OTP entry mechanism feeds the hidden field and the server processes a submission. |
| **Test Cases To Be Executed** | TC-04-001, TC-04-010 |
| **Set Up** | 1. Register fresh; type a 6-digit code into the `.otp-input` boxes.<br>2. Confirm `#otpFinal` equals the typed code; submit; confirm an alert appears. [TC-04-001, TC-04-010] |
| **Wrap Up** | Delete the throwaway `registration_otps` row. |

*Table 2.4.1 OTP Entry Test Procedure*

| **Test Procedure ID** | TP-04-002 |
|---|---|
| **Objective** | Verify a non-matching OTP is rejected. |
| **Test Cases To Be Executed** | TC-04-002, TC-04-011 |
| **Set Up** | 1. Register fresh; submit a code different from the stored OTP.<br>2. Confirm `.alert-error` "Invalid OTP! Please check and try again." [TC-04-002, TC-04-011] |
| **Wrap Up** | Delete the throwaway OTP row. |

*Table 2.4.2 Invalid OTP Test Procedure*

| **Test Procedure ID** | TP-04-003 |
|---|---|
| **Objective** | Verify an expired OTP is rejected. |
| **Test Cases To Be Executed** | TC-04-003, TC-04-012 |
| **Set Up** | 1. Register fresh; set the OTP `expiry` to a past datetime in DB.<br>2. Submit the real OTP; confirm `.alert-error` "OTP has expired!" [TC-04-003, TC-04-012] |
| **Wrap Up** | Delete the throwaway OTP row. |

*Table 2.4.3 Expired OTP Test Procedure*

| **Test Procedure ID** | TP-04-004 |
|---|---|
| **Objective** | Verify a used OTP is rejected (the `used=0` guard). |
| **Test Cases To Be Executed** | TC-04-004, TC-04-013 |
| **Set Up** | 1. Register fresh; set the OTP `used=1` in DB.<br>2. Submit the real OTP; confirm rejected "Invalid OTP!". [TC-04-004, TC-04-013] |
| **Wrap Up** | Delete the throwaway OTP row. |

*Table 2.4.4 Used OTP Test Procedure*

| **Test Procedure ID** | TP-04-005 |
|---|---|
| **Objective** | Verify a valid OTP verifies the account (main flow). |
| **Test Cases To Be Executed** | TC-04-005, TC-04-009 |
| **Set Up** | 1. Register fresh; read the OTP from DB; submit it.<br>2. Confirm `.alert-success` "Registration successful!", a `users` row is created, and redirect to `index.php`. [TC-04-005, TC-04-009] |
| **Wrap Up** | Delete the throwaway `users` and `registration_otps` rows. |

*Table 2.4.5 Valid OTP / Verify Account Test Procedure*

| **Test Procedure ID** | TP-04-006 |
|---|---|
| **Objective** | Verify resend during the cooldown is blocked. |
| **Test Cases To Be Executed** | TC-04-007, TC-04-014 |
| **Set Up** | 1. Register fresh; immediately enable and click Resend.<br>2. Confirm `.alert-error` "Please wait N seconds before requesting a new OTP." [TC-04-007, TC-04-014] |
| **Wrap Up** | Delete the throwaway OTP row. |

*Table 2.4.6 Resend Before Cooldown Test Procedure*

| **Test Procedure ID** | TP-04-007 |
|---|---|
| **Objective** | Verify resend after the cooldown sends and stores a new OTP. |
| **Test Cases To Be Executed** | TC-04-006, TC-04-008, TC-04-015 |
| **Set Up** | 1. Register fresh; capture `registration_otps` count; wait ≥60s.<br>2. Enable and click Resend; confirm `.alert-success` "New OTP has been sent…" and the OTP count increased. [TC-04-006, TC-04-008, TC-04-015] |
| **Wrap Up** | Delete the throwaway OTP rows. |

*Table 2.4.7 Resend After Cooldown Test Procedure*

---

### 2.5 F005 Password Reset Test Procedure

Prerequisites: each procedure creates a throwaway verified user; the reset OTP is DB-only (no email). The reset page is reached via an inserted `used=1` `password_resets` token row. Real accounts are never modified.

| **Test Procedure ID** | TP-05-001 |
|---|---|
| **Objective** | Verify the OTP-step length boundary (0, 5, 7 digits) is rejected. |
| **Test Cases To Be Executed** | TC-05-001, TC-05-002, TC-05-004, TC-05-014 |
| **Set Up** | 1. Create throwaway user; start the OTP step; submit an empty OTP; confirm "Invalid OTP!". [TC-05-001, TC-05-014]<br>2. Submit `12345` (5); confirm "Invalid OTP!". [TC-05-002]<br>3. Submit `1234567` (7); confirm "Invalid OTP!". [TC-05-004] |
| **Wrap Up** | Delete the throwaway user and its `password_resets` rows. |

*Table 2.5.1 Reset OTP Length Boundary Test Procedure*

| **Test Procedure ID** | TP-05-002 |
|---|---|
| **Objective** | Verify a valid 6-digit OTP advances to the reset page. |
| **Test Cases To Be Executed** | TC-05-003 |
| **Set Up** | 1. Create throwaway user; read the real OTP from `password_resets`.<br>2. Submit it; confirm redirect to `reset-password.php?token=…`. [TC-05-003] |
| **Wrap Up** | Delete the throwaway user and its `password_resets` rows. |

*Table 2.5.2 Valid Reset OTP Test Procedure*

| **Test Procedure ID** | TP-05-003 |
|---|---|
| **Objective** | Verify an empty/short new password is blocked by HTML5 validation. |
| **Test Cases To Be Executed** | TC-05-005, TC-05-006, TC-05-015 |
| **Set Up** | 1. Insert a `used=1` token; open `reset-password.php?token=…`; submit empty new password; confirm HTML5 block, stays. [TC-05-005, TC-05-015]<br>2. Submit `Passw1` (7); confirm `minlength` block, stays. [TC-05-006] |
| **Wrap Up** | Delete the throwaway user and `password_resets` rows. |

*Table 2.5.3 New Password Empty / Short Test Procedure*

| **Test Procedure ID** | TP-05-004 |
|---|---|
| **Objective** | Verify a valid new-password length (8, 9) is accepted. |
| **Test Cases To Be Executed** | TC-05-007, TC-05-008 |
| **Set Up** | 1. Open the reset page via token; submit `Passwd12` (8) + matching confirm; confirm success + redirect to `index.php`. [TC-05-007]<br>2. Repeat with `Passwd123` (9); confirm success. [TC-05-008] |
| **Wrap Up** | Delete the throwaway users and `password_resets` rows. |

*Table 2.5.4 New Password Length Boundary Test Procedure*

| **Test Procedure ID** | TP-05-005 |
|---|---|
| **Objective** | Verify a matching confirm completes the reset and changes the stored hash (main flow). |
| **Test Cases To Be Executed** | TC-05-009, TC-05-011, TC-05-013 |
| **Set Up** | 1. Open the reset page via token; capture the old password hash.<br>2. Submit a valid 8+ password with matching confirm.<br>3. Confirm redirect to `index.php` and the stored hash changed. [TC-05-009, TC-05-011, TC-05-013] |
| **Wrap Up** | Delete the throwaway user and `password_resets` rows. |

*Table 2.5.5 Successful Password Reset Test Procedure*

| **Test Procedure ID** | TP-05-006 |
|---|---|
| **Objective** | Verify mismatched passwords are rejected server-side. |
| **Test Cases To Be Executed** | TC-05-010, TC-05-012, TC-05-016 |
| **Set Up** | 1. Open the reset page via token; submit `abc12345` / `abc12346` (both ≥8).<br>2. Confirm `.pwd-alert-error` "Passwords do not match!", stays on `reset-password.php`. [TC-05-010, TC-05-012, TC-05-016] |
| **Wrap Up** | Delete the throwaway user and `password_resets` rows. |

*Table 2.5.6 Password Mismatch Test Procedure*

---

### 2.6 F006 Browse Food Menu Test Procedure

Prerequisites: `food_items` seeded. TP-06-004 mutates the shared table, so run serially.

| **Test Procedure ID** | TP-06-001 |
|---|---|
| **Objective** | Verify the menu main flow renders the three category sections. |
| **Test Cases To Be Executed** | TC-06-001, TC-06-003, TC-06-004, TC-06-005 |
| **Set Up** | 1. Open `menu.php`; confirm container, 3 sections, ≥1 checkbox, selection panel. [TC-06-001]<br>2. Confirm "Vegetarian Delights" ≥1 row. [TC-06-003]<br>3. Confirm "Non-Vegetarian Specialties" ≥1 row. [TC-06-004]<br>4. Confirm "Chef's Special" ≥1 row + "Available On" column. [TC-06-005] |
| **Wrap Up** | None. |

*Table 2.6.1 Menu Main Flow & Categories Test Procedure*

| **Test Procedure ID** | TP-06-002 |
|---|---|
| **Objective** | Verify cumulative pagination (See More / See Less). |
| **Test Cases To Be Executed** | TC-06-006, TC-06-007 |
| **Set Up** | 1. Open `menu.php`; count veg rows (5); click "See More Vegetarian Items"; confirm →10. [TC-06-006]<br>2. Open `menu.php?veg_page=2` (10 rows); click "See Less"; confirm →5. [TC-06-007] |
| **Wrap Up** | None. |

*Table 2.6.2 Pagination Test Procedure*

| **Test Procedure ID** | TP-06-003 |
|---|---|
| **Objective** | Verify food details, selection panel, and total-price update. |
| **Test Cases To Be Executed** | TC-06-008, TC-06-009, TC-06-010 |
| **Set Up** | 1. Read first veg row name+price; compare to the DB price. [TC-06-008]<br>2. Check the first checkbox; confirm a matching row appears in `#menu-selected-table`. [TC-06-009]<br>3. Confirm `#menu-total-price` goes `RS 0.00` → item price. [TC-06-010] |
| **Wrap Up** | None. |

*Table 2.6.3 Details / Selection / Total Test Procedure*

| **Test Procedure ID** | TP-06-004 |
|---|---|
| **Objective** | Verify the empty-menu state. |
| **Test Cases To Be Executed** | TC-06-002 |
| **Set Up** | 1. Back up `food_items` (`CREATE TABLE food_items_bak AS SELECT *`); `DELETE FROM food_items`.<br>2. Open `menu.php`; confirm 0 checkboxes and no See-More button. [TC-06-002] |
| **Wrap Up** | Restore: `INSERT INTO food_items SELECT * FROM food_items_bak; DROP TABLE food_items_bak`. |

*Table 2.6.4 Empty Menu State Test Procedure*

---

### 2.7 F007 Add Food to Cart Test Procedure

Prerequisites: `food_items` seeded; register a dialog handler before any add click (the add path `alert()`s).

| **Test Procedure ID** | TP-07-001 |
|---|---|
| **Objective** | Verify an available item is added to the cart (main flow). |
| **Test Cases To Be Executed** | TC-07-001, TC-07-009 |
| **Set Up** | 1. Logged out, on `menu.php` select the first veg item and click Add.<br>2. Confirm redirect to `cart.php` and `.cart-item-title` shows the item name. [TC-07-001, TC-07-009] |
| **Wrap Up** | Clear the localStorage cart. |

*Table 2.7.1 Add to Cart Success Test Procedure*

| **Test Procedure ID** | TP-07-002 |
|---|---|
| **Objective** | Verify adding the same item twice increments quantity instead of duplicating. |
| **Test Cases To Be Executed** | TC-07-005 |
| **Set Up** | 1. Add the same item twice (two menu visits).<br>2. Confirm `hotelCart.food` has one entry with `quantity===2`. [TC-07-005] |
| **Wrap Up** | Clear the localStorage cart. |

*Table 2.7.2 Quantity Merge Test Procedure*

| **Test Procedure ID** | TP-07-003 |
|---|---|
| **Objective** | Verify the minus button clamps quantity at 1. |
| **Test Cases To Be Executed** | TC-07-006 |
| **Set Up** | 1. Seed the cart with one item at qty 1; open `cart.php`.<br>2. Click `−`; confirm `.cart-qty-input` stays `1`. [TC-07-006] |
| **Wrap Up** | Clear the localStorage cart. |

*Table 2.7.3 Quantity Clamp Test Procedure*

| **Test Procedure ID** | TP-07-004 |
|---|---|
| **Objective** | Verify the cart total recalculates after a quantity change. |
| **Test Cases To Be Executed** | TC-07-007 |
| **Set Up** | 1. Seed the cart with `{price:100, qty:1}`; confirm `#subtotalValue` `Rs. 100.00`.<br>2. Click `+`; confirm `Rs. 200.00`. [TC-07-007] |
| **Wrap Up** | Clear the localStorage cart. |

*Table 2.7.4 Total Recalculation Test Procedure*

| **Test Procedure ID** | TP-07-005 |
|---|---|
| **Objective** | Verify the server cart API rejects invalid input and leaves the cart unchanged. |
| **Test Cases To Be Executed** | TC-07-008 |
| **Set Up** | 1. Log in; capture `cart_items` count.<br>2. POST `api/cart-handler.php` `action=add` with missing `item_data`; confirm `{success:false,'Missing required fields'}` and unchanged count. [TC-07-008] |
| **Wrap Up** | Log out. |

*Table 2.7.5 Server Error Test Procedure*

| **Test Procedure ID** | TP-07-006 |
|---|---|
| **Objective** | Record the missing login gate on add-to-cart. |
| **Test Cases To Be Executed** | TC-07-002, TC-07-010 |
| **Set Up** | 1. Logged out, add a food item.<br>2. Confirm it **should** route to `login.php` / show a login-required message; the app adds anyway and goes to `cart.php`. **[gap]** [TC-07-002, TC-07-010] |
| **Wrap Up** | Clear the localStorage cart. |

*Table 2.7.6 Login Gate (Finding) Test Procedure*

| **Test Procedure ID** | TP-07-007 |
|---|---|
| **Objective** | Record the missing food-availability gate on add-to-cart. |
| **Test Cases To Be Executed** | TC-07-003, TC-07-004, TC-07-011 |
| **Set Up** | 1. Insert a food item whose `available_days` excludes today.<br>2. Select it and click Add; confirm it **should** be blocked. **[gap]** [TC-07-003, TC-07-011]<br>3. Inspect `hotelCart.food`; confirm the item **should** be absent. **[gap]** [TC-07-004] |
| **Wrap Up** | Delete the inserted `food_items` row; clear the localStorage cart. |

*Table 2.7.7 Availability Gate (Finding) Test Procedure*

---

### 2.8 F008 Room Availability Checking Test Procedure

Prerequisites: seeded room rows in various statuses; logged-in customer for the proceed case.

| **Test Procedure ID** | TP-08-001 |
|---|---|
| **Objective** | Verify a non-existent or unavailable room is rejected. |
| **Test Cases To Be Executed** | TC-08-001, TC-08-002 |
| **Set Up** | 1. Check availability for a non-existent room; confirm rejected with error. [TC-08-001]<br>2. Check a reserved/occupied room; confirm rejected. [TC-08-002] |
| **Wrap Up** | Restore any room statuses changed. |

*Table 2.8.1 Room Not Exist / Unavailable Test Procedure*

| **Test Procedure ID** | TP-08-002 |
|---|---|
| **Objective** | Verify invalid check-in/check-out dates are rejected. |
| **Test Cases To Be Executed** | TC-08-003, TC-08-004 |
| **Set Up** | 1. Submit an invalid check-in date; confirm rejected. [TC-08-003]<br>2. Submit an invalid check-out date; confirm rejected. [TC-08-004] |
| **Wrap Up** | None. |

*Table 2.8.2 Invalid Dates Test Procedure*

| **Test Procedure ID** | TP-08-003 |
|---|---|
| **Objective** | Verify an already-booked room is rejected. |
| **Test Cases To Be Executed** | TC-08-005 |
| **Set Up** | 1. Select an already-booked room; confirm rejected with error. [TC-08-005] |
| **Wrap Up** | Restore room status. |

*Table 2.8.3 Room Already Booked Test Procedure*

| **Test Procedure ID** | TP-08-004 |
|---|---|
| **Objective** | Verify available-room display, invalid-selection rejection, and error messaging. |
| **Test Cases To Be Executed** | TC-08-006, TC-08-007, TC-08-008 |
| **Set Up** | 1. Open the rooms page; confirm an available room is shown. [TC-08-006]<br>2. Select an invalid room; confirm rejected. [TC-08-007]<br>3. Trigger an invalid availability request; confirm an error message. [TC-08-008] |
| **Wrap Up** | None. |

*Table 2.8.4 Display / Reject / Error Test Procedure*

| **Test Procedure ID** | TP-08-005 |
|---|---|
| **Objective** | Verify a valid available room with valid dates proceeds to booking (main flow). |
| **Test Cases To Be Executed** | TC-08-009, TC-08-010 |
| **Set Up** | 1. With an existing, available room, valid dates, not booked, confirm proceed to booking. [TC-08-009]<br>2. Execute the consolidated availability main flow. [TC-08-010] |
| **Wrap Up** | Restore any room statuses changed. |

*Table 2.8.5 Proceed to Booking / Main Flow Test Procedure*

---

### 2.9 F009 Room Booking Test Procedure

Prerequisites: logged-in customer; seeded available room; throwaway user for the rollback case.

| **Test Procedure ID** | TP-09-001 |
|---|---|
| **Objective** | Verify a valid room booking is created (main flow). |
| **Test Cases To Be Executed** | TC-09-001, TC-09-014 |
| **Set Up** | 1. Submit a valid booking (item_type=room, valid item_id, price/data, valid dates).<br>2. Confirm success message with reference + total. [TC-09-001, TC-09-014] |
| **Wrap Up** | Delete the created order/booking; reset room status to available. |

*Table 2.9.1 Room Booking Success Test Procedure*

| **Test Procedure ID** | TP-09-002 |
|---|---|
| **Objective** | Verify booking duration and total are calculated correctly. |
| **Test Cases To Be Executed** | TC-09-009, TC-09-010 |
| **Set Up** | 1. check_in=2026-05-01, check_out=2026-05-03; confirm duration=2. [TC-09-009]<br>2. price=1000, duration=2; confirm total=2000. [TC-09-010] |
| **Wrap Up** | Delete the created order; reset room status. |

*Table 2.9.2 Duration / Total Calculation Test Procedure*

| **Test Procedure ID** | TP-09-003 |
|---|---|
| **Objective** | Verify a booking reference is generated and room status updates to reserved. |
| **Test Cases To Be Executed** | TC-09-011, TC-09-012 |
| **Set Up** | 1. Submit a valid booking; confirm a reference is generated. [TC-09-011]<br>2. Confirm room status available → reserved. [TC-09-012] |
| **Wrap Up** | Delete the created order; reset room status. |

*Table 2.9.3 Reference / Status Update Test Procedure*

| **Test Procedure ID** | TP-09-004 |
|---|---|
| **Objective** | Verify booking without a session is rejected. |
| **Test Cases To Be Executed** | TC-09-002, TC-09-015 |
| **Set Up** | 1. Send a booking request with no session; confirm authentication required. [TC-09-002, TC-09-015] |
| **Wrap Up** | None. |

*Table 2.9.4 User Not Logged In Test Procedure*

| **Test Procedure ID** | TP-09-005 |
|---|---|
| **Objective** | Verify an invalid request method is rejected. |
| **Test Cases To Be Executed** | TC-09-003, TC-09-016 |
| **Set Up** | 1. Send the booking request with method=GET; confirm rejected. [TC-09-003, TC-09-016] |
| **Wrap Up** | None. |

*Table 2.9.5 Invalid Request Method Test Procedure*

| **Test Procedure ID** | TP-09-006 |
|---|---|
| **Objective** | Verify missing required booking information is rejected. |
| **Test Cases To Be Executed** | TC-09-004, TC-09-017 |
| **Set Up** | 1. Submit with item_type empty / item_id=0 / price=0; confirm rejected. [TC-09-004, TC-09-017] |
| **Wrap Up** | None. |

*Table 2.9.6 Missing Booking Information Test Procedure*

| **Test Procedure ID** | TP-09-007 |
|---|---|
| **Objective** | Verify an invalid booking type is rejected. |
| **Test Cases To Be Executed** | TC-09-005, TC-09-018 |
| **Set Up** | 1. Submit with item_type=`car`; confirm rejected. [TC-09-005, TC-09-018] |
| **Wrap Up** | None. |

*Table 2.9.7 Invalid Booking Type Test Procedure*

| **Test Procedure ID** | TP-09-008 |
|---|---|
| **Objective** | Verify an invalid item-data format is rejected. |
| **Test Cases To Be Executed** | TC-09-006, TC-09-019 |
| **Set Up** | 1. Submit with item_data=invalid JSON; confirm rejected. [TC-09-006, TC-09-019] |
| **Wrap Up** | None. |

*Table 2.9.8 Invalid Item Data Test Procedure*

| **Test Procedure ID** | TP-09-009 |
|---|---|
| **Objective** | Verify a room-not-found error is returned. |
| **Test Cases To Be Executed** | TC-09-007, TC-09-020 |
| **Set Up** | 1. Submit with item_id=invalid room id; confirm room-not-found. [TC-09-007, TC-09-020] |
| **Wrap Up** | None. |

*Table 2.9.9 Room Not Found Test Procedure*

| **Test Procedure ID** | TP-09-010 |
|---|---|
| **Objective** | Verify an unavailable room cannot be booked. |
| **Test Cases To Be Executed** | TC-09-008, TC-09-021 |
| **Set Up** | 1. Book a room with status reserved/occupied; confirm rejected. [TC-09-008, TC-09-021] |
| **Wrap Up** | Restore room status. |

*Table 2.9.10 Room Not Available Test Procedure*

| **Test Procedure ID** | TP-09-011 |
|---|---|
| **Objective** | Verify the transaction rolls back when booking creation fails. |
| **Test Cases To Be Executed** | TC-09-013, TC-09-022 |
| **Set Up** | 1. Force an INSERT failure (delete the logged-in throwaway user → dangling `orders.user_id`).<br>2. Submit the booking; confirm rollback and room status unchanged. [TC-09-013, TC-09-022] |
| **Wrap Up** | Delete any partial order rows; reset room status; remove the throwaway user. |

*Table 2.9.11 Booking Rollback Test Procedure*

---

### 2.10 F010 Table Availability Checking Test Procedure

Prerequisites: seeded table rows in various statuses; logged-in customer for the proceed case.

| **Test Procedure ID** | TP-10-001 |
|---|---|
| **Objective** | Verify a non-existent or unavailable table is rejected. |
| **Test Cases To Be Executed** | TC-10-001, TC-10-002, TC-10-011, TC-10-012 |
| **Set Up** | 1. Check a non-existent table; confirm rejected. [TC-10-001, TC-10-011]<br>2. Check a reserved/occupied table; confirm rejected. [TC-10-002, TC-10-012] |
| **Wrap Up** | Restore any table statuses changed. |

*Table 2.10.1 Table Not Exist / Unavailable Test Procedure*

| **Test Procedure ID** | TP-10-002 |
|---|---|
| **Objective** | Verify invalid reservation date/time is rejected. |
| **Test Cases To Be Executed** | TC-10-003, TC-10-004, TC-10-013 |
| **Set Up** | 1. Submit an invalid reservation date; confirm rejected. [TC-10-003, TC-10-013]<br>2. Submit an invalid reservation time; confirm rejected. [TC-10-004] |
| **Wrap Up** | None. |

*Table 2.10.2 Invalid Date / Time Test Procedure*

| **Test Procedure ID** | TP-10-003 |
|---|---|
| **Objective** | Verify an already-reserved table is rejected. |
| **Test Cases To Be Executed** | TC-10-005, TC-10-014 |
| **Set Up** | 1. Select an already-reserved table; confirm rejected. [TC-10-005, TC-10-014] |
| **Wrap Up** | Restore table status. |

*Table 2.10.3 Table Already Reserved Test Procedure*

| **Test Procedure ID** | TP-10-004 |
|---|---|
| **Objective** | Verify available-table display, invalid-selection rejection, and error messaging. |
| **Test Cases To Be Executed** | TC-10-006, TC-10-007, TC-10-008 |
| **Set Up** | 1. Open the tables page; confirm an available table is shown. [TC-10-006]<br>2. Select an invalid table; confirm rejected. [TC-10-007]<br>3. Trigger an invalid availability request; confirm an error message. [TC-10-008] |
| **Wrap Up** | None. |

*Table 2.10.4 Display / Reject / Error Test Procedure*

| **Test Procedure ID** | TP-10-005 |
|---|---|
| **Objective** | Verify a valid available table proceeds to reservation (main flow). |
| **Test Cases To Be Executed** | TC-10-009, TC-10-010 |
| **Set Up** | 1. With a valid table + valid date/time, confirm proceed to reservation. [TC-10-009]<br>2. Execute the consolidated availability main flow. [TC-10-010] |
| **Wrap Up** | Restore any table statuses changed. |

*Table 2.10.5 Proceed to Reservation / Main Flow Test Procedure*

---

### 2.11 F011 Table Reservation Test Procedure

Prerequisites: logged-in customer; seeded available table; throwaway user for rollback.

| **Test Procedure ID** | TP-11-001 |
|---|---|
| **Objective** | Verify a valid table reservation is created (main flow). |
| **Test Cases To Be Executed** | TC-11-001, TC-11-013 |
| **Set Up** | 1. Submit a valid reservation (item_type=table, valid item_id, price/data, valid date/time).<br>2. Confirm success message with reference + total. [TC-11-001, TC-11-013] |
| **Wrap Up** | Delete the created reservation; reset table status. |

*Table 2.11.1 Table Reservation Success Test Procedure*

| **Test Procedure ID** | TP-11-002 |
|---|---|
| **Objective** | Verify reservation price, reference generation, and status update. |
| **Test Cases To Be Executed** | TC-11-009, TC-11-010, TC-11-011 |
| **Set Up** | 1. table price=200; confirm total=200. [TC-11-009]<br>2. Confirm a reservation reference is generated. [TC-11-010]<br>3. Confirm table status available → reserved. [TC-11-011] |
| **Wrap Up** | Delete the created reservation; reset table status. |

*Table 2.11.2 Price / Reference / Status Test Procedure*

| **Test Procedure ID** | TP-11-003 |
|---|---|
| **Objective** | Verify reservation without a session is rejected. |
| **Test Cases To Be Executed** | TC-11-002, TC-11-014 |
| **Set Up** | 1. Send a reservation request with no session; confirm login required. [TC-11-002, TC-11-014] |
| **Wrap Up** | None. |

*Table 2.11.3 User Not Logged In Test Procedure*

| **Test Procedure ID** | TP-11-004 |
|---|---|
| **Objective** | Verify an invalid request method is rejected. |
| **Test Cases To Be Executed** | TC-11-003, TC-11-015 |
| **Set Up** | 1. Send the request with method=GET; confirm rejected. [TC-11-003, TC-11-015] |
| **Wrap Up** | None. |

*Table 2.11.4 Invalid Request Method Test Procedure*

| **Test Procedure ID** | TP-11-005 |
|---|---|
| **Objective** | Verify missing required reservation information is rejected. |
| **Test Cases To Be Executed** | TC-11-004, TC-11-016 |
| **Set Up** | 1. Submit with item_type empty / item_id=0 / price=0; confirm rejected. [TC-11-004, TC-11-016] |
| **Wrap Up** | None. |

*Table 2.11.5 Missing Reservation Information Test Procedure*

| **Test Procedure ID** | TP-11-006 |
|---|---|
| **Objective** | Verify an invalid booking type is rejected. |
| **Test Cases To Be Executed** | TC-11-005, TC-11-017 |
| **Set Up** | 1. Submit with item_type=room/food; confirm rejected. [TC-11-005, TC-11-017] |
| **Wrap Up** | None. |

*Table 2.11.6 Invalid Booking Type Test Procedure*

| **Test Procedure ID** | TP-11-007 |
|---|---|
| **Objective** | Verify an invalid item-data format is rejected. |
| **Test Cases To Be Executed** | TC-11-006, TC-11-018 |
| **Set Up** | 1. Submit with item_data=invalid JSON; confirm rejected. [TC-11-006, TC-11-018] |
| **Wrap Up** | None. |

*Table 2.11.7 Invalid Item Data Test Procedure*

| **Test Procedure ID** | TP-11-008 |
|---|---|
| **Objective** | Verify a table-not-found error is returned. |
| **Test Cases To Be Executed** | TC-11-007, TC-11-019 |
| **Set Up** | 1. Submit with item_id=invalid table id; confirm table-not-found. [TC-11-007, TC-11-019] |
| **Wrap Up** | None. |

*Table 2.11.8 Table Not Found Test Procedure*

| **Test Procedure ID** | TP-11-009 |
|---|---|
| **Objective** | Verify an unavailable table cannot be reserved. |
| **Test Cases To Be Executed** | TC-11-008, TC-11-020 |
| **Set Up** | 1. Reserve a table with status reserved/occupied; confirm rejected. [TC-11-008, TC-11-020] |
| **Wrap Up** | Restore table status. |

*Table 2.11.9 Table Not Available Test Procedure*

| **Test Procedure ID** | TP-11-010 |
|---|---|
| **Objective** | Verify the transaction rolls back when reservation creation fails. |
| **Test Cases To Be Executed** | TC-11-012, TC-11-021 |
| **Set Up** | 1. Force a DB insert/update failure during reservation.<br>2. Confirm rollback and table status unchanged. [TC-11-012, TC-11-021] |
| **Wrap Up** | Delete partial rows; reset table status; remove the throwaway user. |

*Table 2.11.10 Reservation Rollback Test Procedure*

---

### 2.12 F012 Cart Checkout Test Procedure

Prerequisites: logged-in customer; seeded valid cart; valid coupon for the discount case.

| **Test Procedure ID** | TP-12-001 |
|---|---|
| **Objective** | Verify a fully valid checkout creates the order, proceeds to payment, and clears the cart (main flow). |
| **Test Cases To Be Executed** | TC-12-007, TC-12-009, TC-12-010, TC-12-011 |
| **Set Up** | 1. Submit a checkout with all conditions valid + payment method selected.<br>2. Confirm order created, an order row exists, and the cart is emptied. [TC-12-007, TC-12-009, TC-12-010, TC-12-011] |
| **Wrap Up** | Delete the created order; clear the cart. |

*Table 2.12.1 Checkout Success Test Procedure*

| **Test Procedure ID** | TP-12-002 |
|---|---|
| **Objective** | Verify a valid coupon applies a discount at checkout. |
| **Test Cases To Be Executed** | TC-12-008 |
| **Set Up** | 1. Apply a valid coupon at checkout; confirm the discount is applied to the total. [TC-12-008] |
| **Wrap Up** | Delete the created order; restore the coupon usage count; clear the cart. |

*Table 2.12.2 Discount Applied Test Procedure*

| **Test Procedure ID** | TP-12-003 |
|---|---|
| **Objective** | Verify checkout without a session is rejected. |
| **Test Cases To Be Executed** | TC-12-001, TC-12-012 |
| **Set Up** | 1. Submit a checkout with no session; confirm "User not logged in" / checkout error. [TC-12-001, TC-12-012] |
| **Wrap Up** | None. |

*Table 2.12.3 User Not Logged In Test Procedure*

| **Test Procedure ID** | TP-12-004 |
|---|---|
| **Objective** | Verify checkout with an empty cart is rejected. |
| **Test Cases To Be Executed** | TC-12-002, TC-12-013 |
| **Set Up** | 1. Submit a checkout with an empty cart; confirm rejected. [TC-12-002, TC-12-013] |
| **Wrap Up** | None. |

*Table 2.12.4 Empty Cart Test Procedure*

| **Test Procedure ID** | TP-12-005 |
|---|---|
| **Objective** | Verify checkout with invalid cart item data is rejected. |
| **Test Cases To Be Executed** | TC-12-003, TC-12-014 |
| **Set Up** | 1. Submit a checkout with invalid item data; confirm rejected. [TC-12-003, TC-12-014] |
| **Wrap Up** | None. |

*Table 2.12.5 Invalid Cart Item Test Procedure*

| **Test Procedure ID** | TP-12-006 |
|---|---|
| **Objective** | Verify checkout with an unavailable selected item is rejected. |
| **Test Cases To Be Executed** | TC-12-004, TC-12-015 |
| **Set Up** | 1. Submit a checkout with an unavailable item; confirm rejected. [TC-12-004, TC-12-015] |
| **Wrap Up** | None. |

*Table 2.12.6 Item Not Available Test Procedure*

| **Test Procedure ID** | TP-12-007 |
|---|---|
| **Objective** | Verify an invalid coupon is rejected at checkout. |
| **Test Cases To Be Executed** | TC-12-005, TC-12-016 |
| **Set Up** | 1. Submit a checkout with an invalid coupon; confirm rejected. [TC-12-005, TC-12-016] |
| **Wrap Up** | None. |

*Table 2.12.7 Invalid Coupon Test Procedure*

| **Test Procedure ID** | TP-12-008 |
|---|---|
| **Objective** | Verify checkout with no payment method is rejected. |
| **Test Cases To Be Executed** | TC-12-006, TC-12-017 |
| **Set Up** | 1. Submit a checkout with no payment method selected; confirm rejected. [TC-12-006, TC-12-017] |
| **Wrap Up** | None. |

*Table 2.12.8 No Payment Method Test Procedure*

---

### 2.13 F013 Coupon Validation Test Procedure

Prerequisites: seeded coupons with controlled minimum/usage/expiry/discount; controlled cart total.

| **Test Procedure ID** | TP-13-001 |
|---|---|
| **Objective** | Verify the minimum-purchase boundary (below / equal / above). |
| **Test Cases To Be Executed** | TC-13-001, TC-13-002, TC-13-003 |
| **Set Up** | 1. min=RM50, total=RM49.99; confirm rejected. [TC-13-001]<br>2. total=RM50.00; confirm accepted. [TC-13-002]<br>3. total=RM50.01; confirm accepted. [TC-13-003] |
| **Wrap Up** | Restore coupon usage counts. |

*Table 2.13.1 Minimum Purchase Boundary Test Procedure*

| **Test Procedure ID** | TP-13-002 |
|---|---|
| **Objective** | Verify the usage-limit boundary (below / at / above). |
| **Test Cases To Be Executed** | TC-13-004, TC-13-005, TC-13-006 |
| **Set Up** | 1. limit=10, used=9; confirm accepted. [TC-13-004]<br>2. used=10; confirm rejected. [TC-13-005]<br>3. used=11; confirm rejected. [TC-13-006] |
| **Wrap Up** | Restore coupon usage counts. |

*Table 2.13.2 Usage Limit Boundary Test Procedure*

| **Test Procedure ID** | TP-13-003 |
|---|---|
| **Objective** | Verify the expiry-date boundary (before / on / after). |
| **Test Cases To Be Executed** | TC-13-007, TC-13-008, TC-13-009 |
| **Set Up** | 1. current<expiry; confirm accepted. [TC-13-007]<br>2. current=expiry; confirm accepted. [TC-13-008]<br>3. current>expiry; confirm rejected. [TC-13-009] |
| **Wrap Up** | None. |

*Table 2.13.3 Expiry Date Boundary Test Procedure*

| **Test Procedure ID** | TP-13-004 |
|---|---|
| **Objective** | Verify the discount-amount boundary (zero / minimum / exceeds total). |
| **Test Cases To Be Executed** | TC-13-010, TC-13-011, TC-13-012 |
| **Set Up** | 1. discount=RM0; confirm rejected / no discount. [TC-13-010]<br>2. discount=RM1; confirm accepted. [TC-13-011]<br>3. total=RM50, discount=RM60; confirm capped at payable amount. [TC-13-012] |
| **Wrap Up** | None. |

*Table 2.13.4 Discount Amount Boundary Test Procedure*

| **Test Procedure ID** | TP-13-005 |
|---|---|
| **Objective** | Verify a valid coupon is accepted and the discount applied (main flow). |
| **Test Cases To Be Executed** | TC-13-013 |
| **Set Up** | 1. Apply an active coupon with total≥min, usage<limit, not expired; confirm accepted + discount. [TC-13-013] |
| **Wrap Up** | Restore coupon usage counts. |

*Table 2.13.5 Valid Coupon Main Flow Test Procedure*

| **Test Procedure ID** | TP-13-006 |
|---|---|
| **Objective** | Verify all coupon rejection alternate flows. |
| **Test Cases To Be Executed** | TC-13-014, TC-13-015, TC-13-016, TC-13-017, TC-13-018 |
| **Set Up** | 1. Total below minimum; confirm rejected. [TC-13-014]<br>2. Usage at limit; confirm rejected. [TC-13-015]<br>3. Usage above limit; confirm rejected. [TC-13-016]<br>4. Expired coupon; confirm rejected. [TC-13-017]<br>5. Zero/excessive discount; confirm rejected/capped. [TC-13-018] |
| **Wrap Up** | Restore coupon usage counts. |

*Table 2.13.6 Coupon Rejection Alternate Flows Test Procedure*

---

### 2.14 F014 Payment Processing Test Procedure

Prerequisites: logged-in customer; seeded order. eSewa/Stripe gateways are **not configured** in this environment.

| **Test Procedure ID** | TP-14-001 |
|---|---|
| **Objective** | Verify all payment rejection paths (no session / no order / invalid amount / no method). |
| **Test Cases To Be Executed** | TC-14-001, TC-14-002, TC-14-003, TC-14-004, TC-14-014, TC-14-015, TC-14-016, TC-14-017 |
| **Set Up** | 1. Payment without session; confirm rejected, status pending. [TC-14-001, TC-14-014]<br>2. Pay for a non-existent order; confirm rejected. [TC-14-002, TC-14-015]<br>3. Invalid payment amount; confirm rejected. [TC-14-003, TC-14-016]<br>4. No payment method; confirm rejected. [TC-14-004, TC-14-017] |
| **Wrap Up** | Reset the order's payment status. |

*Table 2.14.1 Payment Rejections Test Procedure*

| **Test Procedure ID** | TP-14-002 |
|---|---|
| **Objective** | Verify a Cash payment is recorded and keeps the status pending (main flow). |
| **Test Cases To Be Executed** | TC-14-005, TC-14-011 |
| **Set Up** | 1. With a valid order, select method=Cash; confirm recorded and status remains pending. [TC-14-005, TC-14-011] |
| **Wrap Up** | Reset the order's payment status. |

*Table 2.14.2 Cash Payment Test Procedure*

| **Test Procedure ID** | TP-14-003 |
|---|---|
| **Objective** | Record the eSewa gateway behavior (not configured). |
| **Test Cases To Be Executed** | TC-14-006, TC-14-007, TC-14-008, TC-14-012, TC-14-018 |
| **Set Up** | 1. Select eSewa; confirm it **should** redirect to the gateway. **[gap]** [TC-14-006, TC-14-012]<br>2. Simulate eSewa success; confirm status **should** update to paid. **[gap]** [TC-14-007]<br>3. Simulate eSewa failure; confirm error, status pending. **[gap]** [TC-14-008, TC-14-018] |
| **Wrap Up** | Reset the order's payment status. |

*Table 2.14.3 eSewa Payment (Finding) Test Procedure*

| **Test Procedure ID** | TP-14-004 |
|---|---|
| **Objective** | Verify the Stripe success and failure paths. |
| **Test Cases To Be Executed** | TC-14-009, TC-14-010, TC-14-013, TC-14-019 |
| **Set Up** | 1. Simulate Stripe success; confirm status updated to paid. [TC-14-009, TC-14-013]<br>2. Simulate Stripe failure; confirm error, status stays pending. [TC-14-010, TC-14-019] |
| **Wrap Up** | Reset the order's payment status. |

*Table 2.14.4 Stripe Payment Test Procedure*

---

### 2.15 F015 Order History Viewing Test Procedure

Prerequisites: customer with/without orders; forced DB error for the error case.

| **Test Procedure ID** | TP-15-001 |
|---|---|
| **Objective** | Verify the order history list and details display (main flow). |
| **Test Cases To Be Executed** | TC-15-001, TC-15-004, TC-15-007 |
| **Set Up** | 1. Logged-in with orders; open Order History; confirm the list. [TC-15-001, TC-15-007]<br>2. Open a valid own order; confirm details. [TC-15-004] |
| **Wrap Up** | Remove any seeded orders. |

*Table 2.15.1 Order History View Test Procedure*

| **Test Procedure ID** | TP-15-002 |
|---|---|
| **Objective** | Verify access without login is redirected. |
| **Test Cases To Be Executed** | TC-15-002, TC-15-008 |
| **Set Up** | 1. Logged out, open Order History; confirm redirect to login / login-required. [TC-15-002, TC-15-008] |
| **Wrap Up** | None. |

*Table 2.15.2 User Not Logged In Test Procedure*

| **Test Procedure ID** | TP-15-003 |
|---|---|
| **Objective** | Verify the empty-history message. |
| **Test Cases To Be Executed** | TC-15-003, TC-15-009 |
| **Set Up** | 1. Logged-in with no orders; open Order History; confirm "No order history". [TC-15-003, TC-15-009] |
| **Wrap Up** | None. |

*Table 2.15.3 No Order History Test Procedure*

| **Test Procedure ID** | TP-15-004 |
|---|---|
| **Objective** | Verify an invalid/unauthorized order detail is not shown. |
| **Test Cases To Be Executed** | TC-15-005, TC-15-010 |
| **Set Up** | 1. Open an invalid order id / another user's order; confirm "Order details not found". [TC-15-005, TC-15-010] |
| **Wrap Up** | None. |

*Table 2.15.4 Order Details Not Found Test Procedure*

| **Test Procedure ID** | TP-15-005 |
|---|---|
| **Objective** | Verify a DB/server error shows an error message. |
| **Test Cases To Be Executed** | TC-15-006, TC-15-011 |
| **Set Up** | 1. Force a DB error on retrieval; confirm an error message. [TC-15-006, TC-15-011] |
| **Wrap Up** | Remove the forced-failure condition. |

*Table 2.15.5 Database / Server Error Test Procedure*

---

### 2.16 F016 Booking History Viewing Test Procedure

Prerequisites: customer with/without bookings; a booking owned by another user; forced DB error.

| **Test Procedure ID** | TP-16-001 |
|---|---|
| **Objective** | Verify the booking history list and details display (main flow). |
| **Test Cases To Be Executed** | TC-16-001, TC-16-004, TC-16-008 |
| **Set Up** | 1. Logged-in with bookings; open Booking History; confirm the list. [TC-16-001, TC-16-008]<br>2. Open a valid own booking; confirm details. [TC-16-004] |
| **Wrap Up** | Remove any seeded bookings. |

*Table 2.16.1 Booking History View Test Procedure*

| **Test Procedure ID** | TP-16-002 |
|---|---|
| **Objective** | Verify access without login is redirected. |
| **Test Cases To Be Executed** | TC-16-002, TC-16-009 |
| **Set Up** | 1. Logged out, open Booking History; confirm redirect to login. [TC-16-002, TC-16-009] |
| **Wrap Up** | None. |

*Table 2.16.2 User Not Logged In Test Procedure*

| **Test Procedure ID** | TP-16-003 |
|---|---|
| **Objective** | Verify the empty-history message. |
| **Test Cases To Be Executed** | TC-16-003, TC-16-010 |
| **Set Up** | 1. Logged-in with no bookings; confirm "No booking history". [TC-16-003, TC-16-010] |
| **Wrap Up** | None. |

*Table 2.16.3 No Booking History Test Procedure*

| **Test Procedure ID** | TP-16-004 |
|---|---|
| **Objective** | Verify an invalid booking detail is not shown. |
| **Test Cases To Be Executed** | TC-16-005, TC-16-011 |
| **Set Up** | 1. Open an invalid booking id; confirm "Booking details not found". [TC-16-005, TC-16-011] |
| **Wrap Up** | None. |

*Table 2.16.4 Booking Details Not Found Test Procedure*

| **Test Procedure ID** | TP-16-005 |
|---|---|
| **Objective** | Verify a user cannot view another user's booking record. |
| **Test Cases To Be Executed** | TC-16-006, TC-16-012 |
| **Set Up** | 1. Access a booking owned by another user; confirm access rejected. [TC-16-006, TC-16-012] |
| **Wrap Up** | None. |

*Table 2.16.5 Unauthorized Booking Record Test Procedure*

| **Test Procedure ID** | TP-16-006 |
|---|---|
| **Objective** | Verify a DB/server error shows an error message. |
| **Test Cases To Be Executed** | TC-16-007, TC-16-013 |
| **Set Up** | 1. Force a DB error; confirm an error message. [TC-16-007, TC-16-013] |
| **Wrap Up** | Remove the forced-failure condition. |

*Table 2.16.6 Database / Server Error Test Procedure*

---

### 2.17 F017 Profile Management Test Procedure

Prerequisites: logged-in customer; restore the customer's profile after mutation; another user's email exists for the duplicate case.

| **Test Procedure ID** | TP-17-001 |
|---|---|
| **Objective** | Verify viewing and successfully updating the profile (main flow). |
| **Test Cases To Be Executed** | TC-17-001, TC-17-009, TC-17-010, TC-17-011 |
| **Set Up** | 1. Open Profile; confirm current details shown. [TC-17-009]<br>2. Edit allowed fields, submit; confirm success message. [TC-17-001]<br>3. Reload; confirm refreshed details. [TC-17-010, TC-17-011] |
| **Wrap Up** | Restore the customer's original profile fields. |

*Table 2.17.1 Profile View / Update Main Flow Test Procedure*

| **Test Procedure ID** | TP-17-002 |
|---|---|
| **Objective** | Verify access without login is redirected. |
| **Test Cases To Be Executed** | TC-17-002, TC-17-012 |
| **Set Up** | 1. Open the Profile page logged out; confirm redirect to login. [TC-17-002, TC-17-012] |
| **Wrap Up** | None. |

*Table 2.17.2 User Not Logged In Test Procedure*

| **Test Procedure ID** | TP-17-003 |
|---|---|
| **Objective** | Verify an empty required field is rejected. |
| **Test Cases To Be Executed** | TC-17-003, TC-17-013 |
| **Set Up** | 1. Submit with empty name/contact; confirm rejected. [TC-17-003, TC-17-013] |
| **Wrap Up** | Restore the customer's profile. |

*Table 2.17.3 Empty Required Field Test Procedure*

| **Test Procedure ID** | TP-17-004 |
|---|---|
| **Objective** | Verify an invalid email format is rejected. |
| **Test Cases To Be Executed** | TC-17-004, TC-17-014 |
| **Set Up** | 1. Submit email=`usergmail.com` / `user@`; confirm rejected. [TC-17-004, TC-17-014] |
| **Wrap Up** | Restore the customer's profile. |

*Table 2.17.4 Invalid Email Format Test Procedure*

| **Test Procedure ID** | TP-17-005 |
|---|---|
| **Objective** | Verify an invalid contact number is rejected. |
| **Test Cases To Be Executed** | TC-17-005, TC-17-015 |
| **Set Up** | 1. Submit contact=`abc123` / `12345`; confirm rejected. [TC-17-005, TC-17-015] |
| **Wrap Up** | Restore the customer's profile. |

*Table 2.17.5 Invalid Contact Number Test Procedure*

| **Test Procedure ID** | TP-17-006 |
|---|---|
| **Objective** | Verify an email already used by another user is rejected. |
| **Test Cases To Be Executed** | TC-17-006, TC-17-016 |
| **Set Up** | 1. Submit an existing user's email; confirm duplicate rejected. [TC-17-006, TC-17-016] |
| **Wrap Up** | Restore the customer's profile. |

*Table 2.17.6 Duplicate Email Test Procedure*

| **Test Procedure ID** | TP-17-007 |
|---|---|
| **Objective** | Verify an invalid profile-image upload is rejected. |
| **Test Cases To Be Executed** | TC-17-007, TC-17-017 |
| **Set Up** | 1. Upload a `.pdf` / `.exe` profile image; confirm rejected. [TC-17-007, TC-17-017] |
| **Wrap Up** | Restore the customer's profile. |

*Table 2.17.7 Invalid Profile Image Test Procedure*

| **Test Procedure ID** | TP-17-008 |
|---|---|
| **Objective** | Verify a DB/server error keeps the profile unchanged. |
| **Test Cases To Be Executed** | TC-17-008, TC-17-018 |
| **Set Up** | 1. Force a DB update failure; confirm an error message and the profile remains unchanged. [TC-17-008, TC-17-018] |
| **Wrap Up** | Restore the customer's profile; remove the forced-failure condition. |

*Table 2.17.8 Database / Server Error Test Procedure*

---

### 2.18 F018 Contact Form Submission Test Procedure

Prerequisites: public `contact.php`; inserted `contact_requests` rows cleaned up; forced INSERT failure for the error case.

| **Test Procedure ID** | TP-18-001 |
|---|---|
| **Objective** | Verify a valid contact form is stored (main flow). |
| **Test Cases To Be Executed** | TC-18-001, TC-18-007 |
| **Set Up** | 1. Submit a valid contact form (name, valid email, 10-digit phone, subject, meaningful message).<br>2. Confirm stored + success message. [TC-18-001, TC-18-007] |
| **Wrap Up** | Delete the inserted `contact_requests` row. |

*Table 2.18.1 Valid Submission Test Procedure*

| **Test Procedure ID** | TP-18-002 |
|---|---|
| **Objective** | Verify an empty required field is rejected. |
| **Test Cases To Be Executed** | TC-18-002, TC-18-008 |
| **Set Up** | 1. Submit with an empty name/email/subject/message; confirm rejected. [TC-18-002, TC-18-008] |
| **Wrap Up** | None. |

*Table 2.18.2 Empty Required Field Test Procedure*

| **Test Procedure ID** | TP-18-003 |
|---|---|
| **Objective** | Verify an invalid email format is rejected. |
| **Test Cases To Be Executed** | TC-18-003, TC-18-009 |
| **Set Up** | 1. Submit email=`aligmail.com` / `ali@`; confirm rejected. [TC-18-003, TC-18-009] |
| **Wrap Up** | None. |

*Table 2.18.3 Invalid Email Format Test Procedure*

| **Test Procedure ID** | TP-18-004 |
|---|---|
| **Objective** | Verify an invalid phone number is rejected. |
| **Test Cases To Be Executed** | TC-18-004, TC-18-010 |
| **Set Up** | 1. Submit phone=`abc123` / `12345`; confirm rejected. [TC-18-004, TC-18-010] |
| **Wrap Up** | None. |

*Table 2.18.4 Invalid Phone Number Test Procedure*

| **Test Procedure ID** | TP-18-005 |
|---|---|
| **Objective** | Verify a too-short message is rejected. |
| **Test Cases To Be Executed** | TC-18-005, TC-18-011 |
| **Set Up** | 1. Submit message=`Hi`; confirm rejected (too short). [TC-18-005, TC-18-011] |
| **Wrap Up** | None. |

*Table 2.18.5 Message Too Short Test Procedure*

| **Test Procedure ID** | TP-18-006 |
|---|---|
| **Objective** | Record the DB-error handling (uncaught exception instead of a graceful message). |
| **Test Cases To Be Executed** | TC-18-006, TC-18-012 |
| **Set Up** | 1. Force a DB insert failure.<br>2. Submit a valid form; confirm it **should** show "Failed to send message" gracefully. **[gap]** [TC-18-006, TC-18-012] |
| **Wrap Up** | Remove the forced-failure trigger; delete any inserted row. |

*Table 2.18.6 Database / Server Error (Finding) Test Procedure*

---

### 2.19 F019 Blog Viewing Test Procedure

Prerequisites: published and unpublished blog posts; forced DB error.

| **Test Procedure ID** | TP-19-001 |
|---|---|
| **Objective** | Verify the blog list and a published post detail display (main flow). |
| **Test Cases To Be Executed** | TC-19-001, TC-19-003, TC-19-007 |
| **Set Up** | 1. Open the blog page; confirm the list. [TC-19-001, TC-19-007]<br>2. Open a published post; confirm full content/details. [TC-19-003] |
| **Wrap Up** | None. |

*Table 2.19.1 Blog View Main Flow Test Procedure*

| **Test Procedure ID** | TP-19-002 |
|---|---|
| **Objective** | Verify the empty-state message when no published posts exist. |
| **Test Cases To Be Executed** | TC-19-002, TC-19-008 |
| **Set Up** | 1. With no published posts, open the blog page; confirm "No blog post available". [TC-19-002, TC-19-008] |
| **Wrap Up** | Restore any post statuses changed. |

*Table 2.19.2 No Blog Post Available Test Procedure*

| **Test Procedure ID** | TP-19-003 |
|---|---|
| **Objective** | Verify an invalid blog id shows a not-found message. |
| **Test Cases To Be Executed** | TC-19-004, TC-19-009 |
| **Set Up** | 1. Open an invalid blog id; confirm "Blog post not found". [TC-19-004, TC-19-009] |
| **Wrap Up** | None. |

*Table 2.19.3 Blog Post Not Found Test Procedure*

| **Test Procedure ID** | TP-19-004 |
|---|---|
| **Objective** | Verify an unpublished post cannot be viewed. |
| **Test Cases To Be Executed** | TC-19-005, TC-19-010 |
| **Set Up** | 1. Open an unpublished post; confirm access rejected. [TC-19-005, TC-19-010] |
| **Wrap Up** | Restore post status. |

*Table 2.19.4 Unpublished Blog Post Test Procedure*

| **Test Procedure ID** | TP-19-005 |
|---|---|
| **Objective** | Verify a DB/server error shows an error message. |
| **Test Cases To Be Executed** | TC-19-006, TC-19-011 |
| **Set Up** | 1. Force a DB error; confirm an error message. [TC-19-006, TC-19-011] |
| **Wrap Up** | Remove the forced-failure condition. |

*Table 2.19.5 Database / Server Error Test Procedure*

---

### 2.20 F020 Blog Interaction Test Procedure

Prerequisites: logged-in customer; published/unpublished posts. Where the like/comment/share endpoint or guard is missing, the case is a finding.

| **Test Procedure ID** | TP-20-001 |
|---|---|
| **Objective** | Verify like, comment and share on a published post (main flow). |
| **Test Cases To Be Executed** | TC-20-001, TC-20-010 |
| **Set Up** | 1. Logged-in, like + comment + share a published post.<br>2. Confirm all interactions are recorded and counts update. [TC-20-001, TC-20-010] |
| **Wrap Up** | Delete any like/comment rows created. |

*Table 2.20.1 Like / Comment / Share Main Flow Test Procedure*

| **Test Procedure ID** | TP-20-002 |
|---|---|
| **Objective** | Verify a share generates an option/link. |
| **Test Cases To Be Executed** | TC-20-008, TC-20-017 |
| **Set Up** | 1. Share a published post; confirm a share option/link is generated. [TC-20-008, TC-20-017] |
| **Wrap Up** | None. |

*Table 2.20.2 Share Blog Post Test Procedure*

| **Test Procedure ID** | TP-20-003 |
|---|---|
| **Objective** | Verify a like is rejected when not logged in. |
| **Test Cases To Be Executed** | TC-20-002, TC-20-011 |
| **Set Up** | 1. Like while logged out; confirm rejected / login required. [TC-20-002, TC-20-011] |
| **Wrap Up** | None. |

*Table 2.20.3 Like Not Logged In Test Procedure*

| **Test Procedure ID** | TP-20-004 |
|---|---|
| **Objective** | Verify a duplicate like is removed or prevented. |
| **Test Cases To Be Executed** | TC-20-003, TC-20-012 |
| **Set Up** | 1. Like a post already liked by the user; confirm the like is toggled off / duplicate prevented and the count corrected. [TC-20-003, TC-20-012] |
| **Wrap Up** | Delete any like rows created. |

*Table 2.20.4 Duplicate Like Test Procedure*

| **Test Procedure ID** | TP-20-005 |
|---|---|
| **Objective** | Verify a comment is rejected when not logged in. |
| **Test Cases To Be Executed** | TC-20-004, TC-20-013 |
| **Set Up** | 1. Submit a comment while logged out; confirm rejected / login required. [TC-20-004, TC-20-013] |
| **Wrap Up** | None. |

*Table 2.20.5 Comment Not Logged In Test Procedure*

| **Test Procedure ID** | TP-20-006 |
|---|---|
| **Objective** | Verify an empty comment is rejected. |
| **Test Cases To Be Executed** | TC-20-005, TC-20-014 |
| **Set Up** | 1. Submit an empty/whitespace comment; confirm rejected (comment required). [TC-20-005, TC-20-014] |
| **Wrap Up** | None. |

*Table 2.20.6 Empty Comment Test Procedure*

| **Test Procedure ID** | TP-20-007 |
|---|---|
| **Objective** | Verify interaction with a non-existent post is rejected. |
| **Test Cases To Be Executed** | TC-20-006, TC-20-015 |
| **Set Up** | 1. Interact with an invalid blog id; confirm rejected. [TC-20-006, TC-20-015] |
| **Wrap Up** | None. |

*Table 2.20.7 Blog Post Not Found Test Procedure*

| **Test Procedure ID** | TP-20-008 |
|---|---|
| **Objective** | Verify interaction with an unpublished post is rejected. |
| **Test Cases To Be Executed** | TC-20-007, TC-20-016 |
| **Set Up** | 1. Interact with an unpublished post; confirm rejected. [TC-20-007, TC-20-016] |
| **Wrap Up** | Restore post status. |

*Table 2.20.8 Unpublished Blog Post Test Procedure*

| **Test Procedure ID** | TP-20-009 |
|---|---|
| **Objective** | Verify a DB/server error keeps interaction data unchanged. |
| **Test Cases To Be Executed** | TC-20-009, TC-20-018 |
| **Set Up** | 1. Force a DB error during interaction; confirm an error message and unchanged data. [TC-20-009, TC-20-018] |
| **Wrap Up** | Remove the forced-failure condition. |

*Table 2.20.9 Database / Server Error Test Procedure*

---

### 2.21 F021 Admin Dashboard Access Test Procedure

Prerequisites: admin, staff, customer accounts; ability to clear cookies / simulate timeout.

| **Test Procedure ID** | TP-21-001 |
|---|---|
| **Objective** | Verify a dashboard request triggers a session check and a valid session proceeds to role check. |
| **Test Cases To Be Executed** | TC-21-001, TC-21-002 |
| **Set Up** | 1. Request `admin/index.php`; confirm a session check occurs. [TC-21-001]<br>2. With a valid session, confirm it proceeds to role checking. [TC-21-002] |
| **Wrap Up** | Clear cookies. |

*Table 2.21.1 Request / Check Session Test Procedure*

| **Test Procedure ID** | TP-21-002 |
|---|---|
| **Objective** | Verify no session is redirected to login. |
| **Test Cases To Be Executed** | TC-21-003, TC-21-015 |
| **Set Up** | 1. Access the dashboard with no session; confirm redirect to admin login. [TC-21-003, TC-21-015] |
| **Wrap Up** | None. |

*Table 2.21.2 No Session Test Procedure*

| **Test Procedure ID** | TP-21-003 |
|---|---|
| **Objective** | Verify an expired session is destroyed and redirected. |
| **Test Cases To Be Executed** | TC-21-004, TC-21-016 |
| **Set Up** | 1. Access the dashboard with an expired session (cookies cleared); confirm destroyed + redirect. [TC-21-004, TC-21-016] |
| **Wrap Up** | None. |

*Table 2.21.3 Expired Session Test Procedure*

| **Test Procedure ID** | TP-21-004 |
|---|---|
| **Objective** | Verify the admin role can access the dashboard (main flow). |
| **Test Cases To Be Executed** | TC-21-005, TC-21-013 |
| **Set Up** | 1. Logged-in as admin, request the dashboard; confirm it is displayed. [TC-21-005, TC-21-013] |
| **Wrap Up** | Clear cookies. |

*Table 2.21.4 Admin Access Main Flow Test Procedure*

| **Test Procedure ID** | TP-21-005 |
|---|---|
| **Objective** | Verify the staff role can access the dashboard. |
| **Test Cases To Be Executed** | TC-21-006, TC-21-014 |
| **Set Up** | 1. Logged-in as staff, request the dashboard; confirm it is displayed. [TC-21-006, TC-21-014] |
| **Wrap Up** | Clear cookies; remove the seeded staff account. |

*Table 2.21.5 Staff Access Main Flow Test Procedure*

| **Test Procedure ID** | TP-21-006 |
|---|---|
| **Objective** | Verify the customer role is denied dashboard access. |
| **Test Cases To Be Executed** | TC-21-007, TC-21-017 |
| **Set Up** | 1. Logged-in as customer, access the dashboard; confirm access denied. [TC-21-007, TC-21-017] |
| **Wrap Up** | Clear cookies. |

*Table 2.21.6 Customer Role Denied Test Procedure*

| **Test Procedure ID** | TP-21-007 |
|---|---|
| **Objective** | Verify an invalid role is denied dashboard access. |
| **Test Cases To Be Executed** | TC-21-008, TC-21-018 |
| **Set Up** | 1. With an invalid-role session, access the dashboard; confirm access denied. [TC-21-008, TC-21-018] |
| **Wrap Up** | Remove the seeded invalid-role account. |

*Table 2.21.7 Invalid Role Denied Test Procedure*

| **Test Procedure ID** | TP-21-008 |
|---|---|
| **Objective** | Verify logout from the dashboard destroys the session. |
| **Test Cases To Be Executed** | TC-21-009, TC-21-019 |
| **Set Up** | 1. Access the dashboard, then log out; confirm session destroyed. [TC-21-009, TC-21-019] |
| **Wrap Up** | Clear cookies. |

*Table 2.21.8 Logout Test Procedure*

| **Test Procedure ID** | TP-21-009 |
|---|---|
| **Objective** | Verify session timeout redirects admin/staff to login. |
| **Test Cases To Be Executed** | TC-21-010, TC-21-020 |
| **Set Up** | 1. Access the dashboard, simulate timeout; confirm redirect to login. [TC-21-010, TC-21-020] |
| **Wrap Up** | None. |

*Table 2.21.9 Session Timeout Test Procedure*

| **Test Procedure ID** | TP-21-010 |
|---|---|
| **Objective** | Verify re-login allows a fresh dashboard request and the access-denied page redirects. |
| **Test Cases To Be Executed** | TC-21-011, TC-21-012 |
| **Set Up** | 1. Log in again; confirm the dashboard request succeeds. [TC-21-011]<br>2. From the access-denied page, confirm redirect to login. [TC-21-012] |
| **Wrap Up** | Clear cookies. |

*Table 2.21.10 Re-login / Access-Denied Redirect Test Procedure*

---

### 2.22 F022 Food/Menu Management Test Procedure

Prerequisites: admin login. **`food_items` has no status column**, so availability/archive transition cases are not implemented. Items created with an `F022TEST_` marker.

| **Test Procedure ID** | TP-22-001 |
|---|---|
| **Objective** | Verify a food item can be added. |
| **Test Cases To Be Executed** | TC-22-001, TC-22-018 |
| **Set Up** | 1. As admin, add a food item via `api/menu-handler.php`; confirm it is created and listed. [TC-22-001, TC-22-018] |
| **Wrap Up** | Delete the `F022TEST_` item. |

*Table 2.22.1 Add Food Item Test Procedure*

| **Test Procedure ID** | TP-22-002 |
|---|---|
| **Objective** | Verify a food item's details can be updated. |
| **Test Cases To Be Executed** | TC-22-004, TC-22-008, TC-22-019 |
| **Set Up** | 1. Add an item; update its fields; confirm updated successfully. [TC-22-004, TC-22-008, TC-22-019] |
| **Wrap Up** | Delete the `F022TEST_` item. |

*Table 2.22.2 Update Food Item Test Procedure*

| **Test Procedure ID** | TP-22-003 |
|---|---|
| **Objective** | Verify a food item can be deleted. |
| **Test Cases To Be Executed** | TC-22-006, TC-22-010, TC-22-014, TC-22-025 |
| **Set Up** | 1. Add an item; delete it; confirm removed. [TC-22-006, TC-22-010, TC-22-025]<br>2. Add → update → delete; confirm removed. [TC-22-014] |
| **Wrap Up** | Delete any remaining `F022TEST_` items. |

*Table 2.22.3 Delete Food Item Test Procedure*

| **Test Procedure ID** | TP-22-004 |
|---|---|
| **Objective** | Record that availability/archive transitions are unsupported (no status column). |
| **Test Cases To Be Executed** | TC-22-002, TC-22-003, TC-22-005, TC-22-007, TC-22-009, TC-22-011, TC-22-012, TC-22-013, TC-22-015, TC-22-016, TC-22-017, TC-22-020, TC-22-021, TC-22-022, TC-22-023, TC-22-024 |
| **Set Up** | 1. Attempt mark-unavailable / mark-available / archive / restore / save-as-status; confirm **not implemented — skipped** (`food_items` has no `status` column). [all listed TCs] |
| **Wrap Up** | None. |

*Table 2.22.4 Availability / Archive States (Not Implemented) Test Procedure*

---

### 2.23 F023 Room Management Test Procedure

Prerequisites: admin login. Rooms have a status column (available/reserved/occupied/maintenance). Rooms created with a test marker.

| **Test Procedure ID** | TP-23-001 |
|---|---|
| **Objective** | Verify a room can be added (status available). |
| **Test Cases To Be Executed** | TC-23-001, TC-23-019 |
| **Set Up** | 1. As admin, add a room via `api/room-handler.php`; confirm created with status available. [TC-23-001, TC-23-019] |
| **Wrap Up** | Delete the marker room. |

*Table 2.23.1 Add Room Test Procedure*

| **Test Procedure ID** | TP-23-002 |
|---|---|
| **Objective** | Verify room details can be updated in any status. |
| **Test Cases To Be Executed** | TC-23-004, TC-23-008, TC-23-011, TC-23-012, TC-23-023 |
| **Set Up** | 1. Add a room; update fields in available/reserved/occupied/maintenance; confirm updated. [TC-23-004, TC-23-008, TC-23-011, TC-23-012, TC-23-023] |
| **Wrap Up** | Delete the marker room. |

*Table 2.23.2 Update Room Test Procedure*

| **Test Procedure ID** | TP-23-003 |
|---|---|
| **Objective** | Verify a room can be deleted from any status. |
| **Test Cases To Be Executed** | TC-23-005, TC-23-014, TC-23-018, TC-23-024 |
| **Set Up** | 1. Delete rooms in available / maintenance; confirm removed. [TC-23-005, TC-23-014, TC-23-024]<br>2. Update then delete; confirm removed. [TC-23-018] |
| **Wrap Up** | Delete any remaining marker rooms. |

*Table 2.23.3 Delete Room Test Procedure*

| **Test Procedure ID** | TP-23-004 |
|---|---|
| **Objective** | Verify reserve and cancel transitions. |
| **Test Cases To Be Executed** | TC-23-002, TC-23-007, TC-23-021 |
| **Set Up** | 1. available → reserved (reserve). [TC-23-002]<br>2. reserved → available (cancel). [TC-23-007, TC-23-021] |
| **Wrap Up** | Delete the marker room. |

*Table 2.23.4 Reserve / Cancel Test Procedure*

| **Test Procedure ID** | TP-23-005 |
|---|---|
| **Objective** | Verify check-in and check-out transitions. |
| **Test Cases To Be Executed** | TC-23-006, TC-23-009, TC-23-020 |
| **Set Up** | 1. reserved → occupied (check-in). [TC-23-006, TC-23-020]<br>2. occupied → available (check-out). [TC-23-009, TC-23-020] |
| **Wrap Up** | Delete the marker room. |

*Table 2.23.5 Check-in / Check-out Test Procedure*

| **Test Procedure ID** | TP-23-006 |
|---|---|
| **Objective** | Verify the maintenance flow (mark, report issue, complete). |
| **Test Cases To Be Executed** | TC-23-003, TC-23-010, TC-23-013, TC-23-022, TC-23-025 |
| **Set Up** | 1. available → maintenance (mark). [TC-23-003]<br>2. occupied → maintenance (report issue). [TC-23-010, TC-23-025]<br>3. maintenance → available (complete). [TC-23-013, TC-23-022, TC-23-025] |
| **Wrap Up** | Delete the marker room. |

*Table 2.23.6 Maintenance Flow Test Procedure*

| **Test Procedure ID** | TP-23-007 |
|---|---|
| **Objective** | Verify save-as-status updates. |
| **Test Cases To Be Executed** | TC-23-015, TC-23-016, TC-23-017 |
| **Set Up** | 1. Save status=available; confirm → available. [TC-23-015]<br>2. Save status=reserved; confirm → reserved. [TC-23-016]<br>3. Save status=maintenance; confirm → maintenance. [TC-23-017] |
| **Wrap Up** | Delete the marker room. |

*Table 2.23.7 Save-as Status Test Procedure*

---

### 2.24 F024 Table Management Test Procedure

Prerequisites: admin login. Tables have a status column (available/reserved/occupied/maintenance). Tables created with a test marker.

| **Test Procedure ID** | TP-24-001 |
|---|---|
| **Objective** | Verify a table can be added (status available). |
| **Test Cases To Be Executed** | TC-24-001, TC-24-019 |
| **Set Up** | 1. As admin, add a table via `api/table-handler.php`; confirm created with status available. [TC-24-001, TC-24-019] |
| **Wrap Up** | Delete the marker table. |

*Table 2.24.1 Add Table Test Procedure*

| **Test Procedure ID** | TP-24-002 |
|---|---|
| **Objective** | Verify table details can be updated in any status. |
| **Test Cases To Be Executed** | TC-24-004, TC-24-008, TC-24-011, TC-24-012, TC-24-023 |
| **Set Up** | 1. Add a table; update fields across statuses; confirm updated. [TC-24-004, TC-24-008, TC-24-011, TC-24-012, TC-24-023] |
| **Wrap Up** | Delete the marker table. |

*Table 2.24.2 Update Table Test Procedure*

| **Test Procedure ID** | TP-24-003 |
|---|---|
| **Objective** | Verify a table can be deleted from any status. |
| **Test Cases To Be Executed** | TC-24-005, TC-24-014, TC-24-018, TC-24-024 |
| **Set Up** | 1. Delete tables in available / maintenance; confirm removed. [TC-24-005, TC-24-014, TC-24-024]<br>2. Update then delete; confirm removed. [TC-24-018] |
| **Wrap Up** | Delete any remaining marker tables. |

*Table 2.24.3 Delete Table Test Procedure*

| **Test Procedure ID** | TP-24-004 |
|---|---|
| **Objective** | Verify reserve and cancel transitions. |
| **Test Cases To Be Executed** | TC-24-002, TC-24-007, TC-24-021 |
| **Set Up** | 1. available → reserved (reserve). [TC-24-002]<br>2. reserved → available (cancel). [TC-24-007, TC-24-021] |
| **Wrap Up** | Delete the marker table. |

*Table 2.24.4 Reserve / Cancel Test Procedure*

| **Test Procedure ID** | TP-24-005 |
|---|---|
| **Objective** | Verify customer-arrival and complete-dining transitions. |
| **Test Cases To Be Executed** | TC-24-006, TC-24-009, TC-24-020 |
| **Set Up** | 1. reserved → occupied (customer arrives). [TC-24-006, TC-24-020]<br>2. occupied → available (complete dining). [TC-24-009, TC-24-020] |
| **Wrap Up** | Delete the marker table. |

*Table 2.24.5 Arrive / Complete Dining Test Procedure*

| **Test Procedure ID** | TP-24-006 |
|---|---|
| **Objective** | Verify the maintenance flow (mark, report issue, complete). |
| **Test Cases To Be Executed** | TC-24-003, TC-24-010, TC-24-013, TC-24-022, TC-24-025 |
| **Set Up** | 1. available → maintenance (mark). [TC-24-003]<br>2. occupied → maintenance (report issue). [TC-24-010, TC-24-025]<br>3. maintenance → available (complete). [TC-24-013, TC-24-022, TC-24-025] |
| **Wrap Up** | Delete the marker table. |

*Table 2.24.6 Maintenance Flow Test Procedure*

| **Test Procedure ID** | TP-24-007 |
|---|---|
| **Objective** | Verify save-as-status updates. |
| **Test Cases To Be Executed** | TC-24-015, TC-24-016, TC-24-017 |
| **Set Up** | 1. Save status=available; confirm → available. [TC-24-015]<br>2. Save status=reserved; confirm → reserved. [TC-24-016]<br>3. Save status=maintenance; confirm → maintenance. [TC-24-017] |
| **Wrap Up** | Delete the marker table. |

*Table 2.24.7 Save-as Status Test Procedure*

---

### 2.25 F025 Order Management Test Procedure

Prerequisites: admin login; seeded order. Valid statuses are only pending/confirmed/completed/cancelled — preparing/ready/refunded are unsupported.

| **Test Procedure ID** | TP-25-001 |
|---|---|
| **Objective** | Verify a newly placed order is pending. |
| **Test Cases To Be Executed** | TC-25-001 |
| **Set Up** | 1. Seed a new order; confirm status = pending. [TC-25-001] |
| **Wrap Up** | Delete the seeded order. |

*Table 2.25.1 New Order Pending Test Procedure*

| **Test Procedure ID** | TP-25-002 |
|---|---|
| **Objective** | Verify a pending order can be confirmed. |
| **Test Cases To Be Executed** | TC-25-002 |
| **Set Up** | 1. As admin, confirm a pending order; confirm pending → confirmed. [TC-25-002] |
| **Wrap Up** | Reset/delete the seeded order. |

*Table 2.25.2 Confirm Order Test Procedure*

| **Test Procedure ID** | TP-25-003 |
|---|---|
| **Objective** | Verify pending and confirmed orders can be cancelled. |
| **Test Cases To Be Executed** | TC-25-003, TC-25-005, TC-25-011, TC-25-012 |
| **Set Up** | 1. Cancel a pending order; confirm pending → cancelled. [TC-25-003, TC-25-011]<br>2. Cancel a confirmed order; confirm confirmed → cancelled. [TC-25-005, TC-25-012] |
| **Wrap Up** | Reset/delete the seeded orders. |

*Table 2.25.3 Cancel Order Test Procedure*

| **Test Procedure ID** | TP-25-004 |
|---|---|
| **Objective** | Record that preparing / ready states are unsupported. |
| **Test Cases To Be Executed** | TC-25-004, TC-25-006, TC-25-007, TC-25-008, TC-25-010, TC-25-013 |
| **Set Up** | 1. Attempt confirmed → preparing; confirm **no `preparing` status**. **[gap]** [TC-25-004, TC-25-010, TC-25-013]<br>2. Attempt preparing → ready and ready → completed; confirm **no `preparing`/`ready`**. **[gap]** [TC-25-006, TC-25-007, TC-25-008] |
| **Wrap Up** | Reset/delete the seeded order. |

*Table 2.25.4 Preparing / Ready States (Finding) Test Procedure*

| **Test Procedure ID** | TP-25-005 |
|---|---|
| **Objective** | Record that the refunded state is unsupported. |
| **Test Cases To Be Executed** | TC-25-009, TC-25-014 |
| **Set Up** | 1. Attempt cancelled → refunded; confirm **no `refunded` status**. **[gap]** [TC-25-009, TC-25-014] |
| **Wrap Up** | Reset/delete the seeded order. |

*Table 2.25.5 Refund (Finding) Test Procedure*

---

### 2.26 F026 Customer Management Test Procedure

Prerequisites: admin login; customers created with `cmtest_`. There is **no customer search** feature. Another user's email exists for the duplicate case.

| **Test Procedure ID** | TP-26-001 |
|---|---|
| **Objective** | Verify the customer list is shown and a customer record is updated (main flow). |
| **Test Cases To Be Executed** | TC-26-001, TC-26-009 |
| **Set Up** | 1. As admin, open the customers table; confirm rows shown.<br>2. Update a seeded customer via `api/admin-users.php`; confirm `first_name` changes. [TC-26-001, TC-26-009] |
| **Wrap Up** | Delete all `cmtest_` customers. |

*Table 2.26.1 Customer View / Update Main Flow Test Procedure*

| **Test Procedure ID** | TP-26-002 |
|---|---|
| **Objective** | Verify an unauthorized user is rejected. |
| **Test Cases To Be Executed** | TC-26-002, TC-26-010 |
| **Set Up** | 1. With no admin session, call the API; confirm `{success:false,'Unauthorized'}`. [TC-26-002, TC-26-010] |
| **Wrap Up** | None. |

*Table 2.26.2 Unauthorized Access Test Procedure*

| **Test Procedure ID** | TP-26-003 |
|---|---|
| **Objective** | Verify a not-found message for an invalid customer id. |
| **Test Cases To Be Executed** | TC-26-005, TC-26-013 |
| **Set Up** | 1. `get` with id=999999; confirm `{success:false}` with "not found". [TC-26-005, TC-26-013] |
| **Wrap Up** | None. |

*Table 2.26.3 Customer Record Not Found Test Procedure*

| **Test Procedure ID** | TP-26-004 |
|---|---|
| **Objective** | Verify invalid update data is rejected. |
| **Test Cases To Be Executed** | TC-26-006, TC-26-014 |
| **Set Up** | 1. Update a seeded customer with an empty email; confirm `{success:false,'Missing required fields'}`. [TC-26-006, TC-26-014] |
| **Wrap Up** | Delete the `cmtest_` customer. |

*Table 2.26.4 Invalid Customer Update Test Procedure*

| **Test Procedure ID** | TP-26-005 |
|---|---|
| **Objective** | Verify a customer account can be deleted. |
| **Test Cases To Be Executed** | TC-26-007, TC-26-015 |
| **Set Up** | 1. Delete a seeded customer; confirm `{success:true}` and the row is removed. [TC-26-007, TC-26-015] |
| **Wrap Up** | Delete any remaining `cmtest_` customers. |

*Table 2.26.5 Delete Customer Test Procedure*

| **Test Procedure ID** | TP-26-006 |
|---|---|
| **Objective** | Verify a duplicate-email update is rejected and the record is unchanged. |
| **Test Cases To Be Executed** | TC-26-008, TC-26-016 |
| **Set Up** | 1. Update a seeded customer to another user's email; confirm `{success:false,'Email already exists'}` and the email/name are unchanged. [TC-26-008, TC-26-016] |
| **Wrap Up** | Delete the `cmtest_` customer. |

*Table 2.26.6 Database / Server Error Test Procedure*

| **Test Procedure ID** | TP-26-007 |
|---|---|
| **Objective** | Record that customer search/filter is unimplemented. |
| **Test Cases To Be Executed** | TC-26-003, TC-26-004, TC-26-011, TC-26-012 |
| **Set Up** | 1. Search with no match; confirm a "no customer record found" message **should** appear. **[gap]** [TC-26-003, TC-26-011]<br>2. Search by name/email; confirm matching records **should** appear. **[gap]** [TC-26-004, TC-26-012] |
| **Wrap Up** | None. |

*Table 2.26.7 Customer Search (Not Implemented) Test Procedure*

---

### 2.27 F027 Staff Management Test Procedure

Prerequisites: admin login; staff created with `stafftest_`; existing email for the duplicate case. The create action does **not** validate email format.

| **Test Procedure ID** | TP-27-001 |
|---|---|
| **Objective** | Verify unauthenticated and unauthorized access are rejected. |
| **Test Cases To Be Executed** | TC-27-001, TC-27-002, TC-27-013, TC-27-014 |
| **Set Up** | 1. With no session, call `api/admin-users.php`; confirm Unauthorized. [TC-27-001, TC-27-013]<br>2. With a non-admin session, attempt staff management; confirm rejected. [TC-27-002, TC-27-014] |
| **Wrap Up** | None. |

*Table 2.27.1 Unauthorized / No Permission Test Procedure*

| **Test Procedure ID** | TP-27-002 |
|---|---|
| **Objective** | Verify missing staff details are rejected. |
| **Test Cases To Be Executed** | TC-27-003, TC-27-015 |
| **Set Up** | 1. Create a staff with no password; confirm `{success:false,'Missing required fields'}`. [TC-27-003, TC-27-015] |
| **Wrap Up** | None. |

*Table 2.27.2 Missing Staff Details Test Procedure*

| **Test Procedure ID** | TP-27-003 |
|---|---|
| **Objective** | Verify a duplicate staff account cannot be created. |
| **Test Cases To Be Executed** | TC-27-005, TC-27-017 |
| **Set Up** | 1. Create with email=`yangenna20@gmail.com`; confirm `{success:false,'Email already exists'}`. [TC-27-005, TC-27-017] |
| **Wrap Up** | None. |

*Table 2.27.3 Duplicate Staff Account Test Procedure*

| **Test Procedure ID** | TP-27-004 |
|---|---|
| **Objective** | Verify a new staff account can be created (main flow). |
| **Test Cases To Be Executed** | TC-27-006, TC-27-010 |
| **Set Up** | 1. Create a valid staff (role=staff); confirm `{success:true}` and `role='staff'`. [TC-27-006, TC-27-010] |
| **Wrap Up** | Delete the `stafftest_` account. |

*Table 2.27.4 Create Staff Account Test Procedure*

| **Test Procedure ID** | TP-27-005 |
|---|---|
| **Objective** | Verify update/delete on a non-existent record is rejected. |
| **Test Cases To Be Executed** | TC-27-007, TC-27-018 |
| **Set Up** | 1. `update`/`delete` id=999999; confirm `{success:false,'User not found'}` for both. [TC-27-007, TC-27-018] |
| **Wrap Up** | None. |

*Table 2.27.5 Staff Record Not Found Test Procedure*

| **Test Procedure ID** | TP-27-006 |
|---|---|
| **Objective** | Verify an existing staff account can be updated. |
| **Test Cases To Be Executed** | TC-27-008, TC-27-011 |
| **Set Up** | 1. Create a staff; update its first_name; confirm `{success:true}` and the change. [TC-27-008, TC-27-011] |
| **Wrap Up** | Delete the `stafftest_` account. |

*Table 2.27.6 Update Staff Account Test Procedure*

| **Test Procedure ID** | TP-27-007 |
|---|---|
| **Objective** | Verify an existing staff account can be deleted. |
| **Test Cases To Be Executed** | TC-27-009, TC-27-012 |
| **Set Up** | 1. Create a staff; delete it; confirm `{success:true}` and the row is removed. [TC-27-009, TC-27-012] |
| **Wrap Up** | Delete any remaining `stafftest_` accounts. |

*Table 2.27.7 Delete Staff Account Test Procedure*

| **Test Procedure ID** | TP-27-008 |
|---|---|
| **Objective** | Record that a malformed staff email is not rejected. |
| **Test Cases To Be Executed** | TC-27-004, TC-27-016 |
| **Set Up** | 1. Create a staff with email=`notanemail`; confirm it **should** be rejected. **[gap]** [TC-27-004, TC-27-016] |
| **Wrap Up** | Delete the created `notanemail` account if it was created. |

*Table 2.27.8 Invalid Staff Email (Finding) Test Procedure*

---

### 2.28 F028 Coupon Management Test Procedure

Prerequisites: admin login; coupons created with a `TST…` prefix. Length / negative-min-purchase / usage-limit / past-expiry validations are absent.

| **Test Procedure ID** | TP-28-001 |
|---|---|
| **Objective** | Verify the coupon-code length boundary. |
| **Test Cases To Be Executed** | TC-28-001, TC-28-002, TC-28-003, TC-28-019 |
| **Set Up** | 1. code=`AB`; confirm it **should** be rejected. **[gap]** [TC-28-001, TC-28-019]<br>2. code=`ABC`; confirm created. [TC-28-002]<br>3. code=`ABCDE`; confirm created. [TC-28-003] |
| **Wrap Up** | Delete all `TST…` coupons. |

*Table 2.28.1 Coupon Code Length Boundary Test Procedure*

| **Test Procedure ID** | TP-28-002 |
|---|---|
| **Objective** | Verify the minimum-purchase boundary. |
| **Test Cases To Be Executed** | TC-28-004, TC-28-005, TC-28-006, TC-28-020 |
| **Set Up** | 1. min_purchase=`-100`; confirm it **should** be rejected. **[gap]** [TC-28-004, TC-28-020]<br>2. min_purchase=`0`; confirm created. [TC-28-005]<br>3. min_purchase=`500`; confirm created. [TC-28-006] |
| **Wrap Up** | Delete all `TST…` coupons. |

*Table 2.28.2 Minimum Purchase Boundary Test Procedure*

| **Test Procedure ID** | TP-28-003 |
|---|---|
| **Objective** | Verify the discount-amount validation. |
| **Test Cases To Be Executed** | TC-28-007, TC-28-008, TC-28-009, TC-28-021 |
| **Set Up** | 1. discount=`0`; confirm "Discount value must be greater than 0". [TC-28-007, TC-28-021]<br>2. discount=`1`; confirm created. [TC-28-008]<br>3. percentage=`150`; confirm "cannot exceed 100". [TC-28-009] |
| **Wrap Up** | Delete all `TST…` coupons. |

*Table 2.28.3 Discount Amount Test Procedure*

| **Test Procedure ID** | TP-28-004 |
|---|---|
| **Objective** | Verify the usage-limit boundary. |
| **Test Cases To Be Executed** | TC-28-010, TC-28-011, TC-28-012, TC-28-022 |
| **Set Up** | 1. usage_limit=`-5`; confirm it **should** be rejected. **[gap]** [TC-28-010, TC-28-022]<br>2. usage_limit=`1`; confirm created. [TC-28-011]<br>3. usage_limit=`10`; confirm created. [TC-28-012] |
| **Wrap Up** | Delete all `TST…` coupons. |

*Table 2.28.4 Usage Limit Boundary Test Procedure*

| **Test Procedure ID** | TP-28-005 |
|---|---|
| **Objective** | Verify the expiry-date boundary. |
| **Test Cases To Be Executed** | TC-28-013, TC-28-014, TC-28-015, TC-28-023 |
| **Set Up** | 1. valid_until=past; confirm it **should** be rejected. **[gap]** [TC-28-013, TC-28-023]<br>2. valid_until=today 23:59:59; confirm created. [TC-28-014]<br>3. valid_until=future; confirm created. [TC-28-015] |
| **Wrap Up** | Delete all `TST…` coupons. |

*Table 2.28.5 Expiry Date Boundary Test Procedure*

| **Test Procedure ID** | TP-28-006 |
|---|---|
| **Objective** | Verify valid creation and the invalid-data rejection (main / alternate). |
| **Test Cases To Be Executed** | TC-28-016, TC-28-017, TC-28-018 |
| **Set Up** | 1. Submit valid coupon data; confirm `{success:true}` / "created successfully". [TC-28-016, TC-28-018]<br>2. Submit empty code; confirm "Coupon code is required". [TC-28-017] |
| **Wrap Up** | Delete all `TST…` coupons. |

*Table 2.28.6 Valid / Invalid Output Test Procedure*

---

### 2.29 F029 Blog Management Test Procedure

Prerequisites: admin login; posts created with `F029TEST_`. The add action does **no image type/size validation**.

| **Test Procedure ID** | TP-29-001 |
|---|---|
| **Objective** | Verify a blog post can be created (main flow). |
| **Test Cases To Be Executed** | TC-29-001, TC-29-010 |
| **Set Up** | 1. As admin, `add` a blog (title/category/content/status) via `api/admin-blogs.php`; confirm `{success:true}` and the stored title. [TC-29-001, TC-29-010] |
| **Wrap Up** | Delete all `F029TEST_` posts. |

*Table 2.29.1 Create Blog Test Procedure*

| **Test Procedure ID** | TP-29-002 |
|---|---|
| **Objective** | Verify an unauthorized user is rejected. |
| **Test Cases To Be Executed** | TC-29-002, TC-29-011 |
| **Set Up** | 1. With no session, `add` a blog; confirm `{success:false,'Unauthorized'}`. [TC-29-002, TC-29-011] |
| **Wrap Up** | None. |

*Table 2.29.2 Unauthorized Access Test Procedure*

| **Test Procedure ID** | TP-29-003 |
|---|---|
| **Objective** | Verify missing required fields are rejected. |
| **Test Cases To Be Executed** | TC-29-003, TC-29-012 |
| **Set Up** | 1. `add` with empty content; confirm `{success:false,'Content is required'}`. [TC-29-003, TC-29-012] |
| **Wrap Up** | None. |

*Table 2.29.3 Missing Required Fields Test Procedure*

| **Test Procedure ID** | TP-29-004 |
|---|---|
| **Objective** | Verify an existing blog post can be edited. |
| **Test Cases To Be Executed** | TC-29-005, TC-29-014 |
| **Set Up** | 1. Add a post; `update` its title; confirm `{success:true}` and the change. [TC-29-005, TC-29-014] |
| **Wrap Up** | Delete the `F029TEST_` post. |

*Table 2.29.4 Edit Blog Test Procedure*

| **Test Procedure ID** | TP-29-005 |
|---|---|
| **Objective** | Verify publish and unpublish status changes. |
| **Test Cases To Be Executed** | TC-29-006, TC-29-007, TC-29-015, TC-29-016 |
| **Set Up** | 1. `update` status=published (from draft); confirm published. [TC-29-006, TC-29-015]<br>2. `update` status=draft (from published); confirm unpublished. [TC-29-007, TC-29-016] |
| **Wrap Up** | Delete the `F029TEST_` post. |

*Table 2.29.5 Publish / Unpublish Test Procedure*

| **Test Procedure ID** | TP-29-006 |
|---|---|
| **Objective** | Verify a blog post can be deleted. |
| **Test Cases To Be Executed** | TC-29-008, TC-29-017 |
| **Set Up** | 1. Add a post; `delete` it; confirm `{success:true}` and the row is removed. [TC-29-008, TC-29-017] |
| **Wrap Up** | Delete any remaining `F029TEST_` posts. |

*Table 2.29.6 Delete Blog Test Procedure*

| **Test Procedure ID** | TP-29-007 |
|---|---|
| **Objective** | Verify an invalid update keeps the blog data unchanged. |
| **Test Cases To Be Executed** | TC-29-009, TC-29-018 |
| **Set Up** | 1. `update` with an empty title; confirm `{success:false,'Missing required fields'}` and the title unchanged. [TC-29-009, TC-29-018] |
| **Wrap Up** | Delete the `F029TEST_` post. |

*Table 2.29.7 Database / Server Error Test Procedure*

| **Test Procedure ID** | TP-29-008 |
|---|---|
| **Objective** | Record that a non-image upload is not rejected. |
| **Test Cases To Be Executed** | TC-29-004, TC-29-013 |
| **Set Up** | 1. `add` a blog with `featured_image=bad.txt` (text/plain); confirm it **should** be rejected. **[gap]** [TC-29-004, TC-29-013] |
| **Wrap Up** | Delete the created blog + uploaded file. |

*Table 2.29.8 Invalid Blog Image (Finding) Test Procedure*

---

### 2.30 F030 Contact Request Management Test Procedure

Prerequisites: admin login; requests created with a `CRTEST_` subject. The status enum is only pending/in-progress/resolved — there is **no `viewed` state**. Replies are exercised via `update_status` (no email).

| **Test Procedure ID** | TP-30-001 |
|---|---|
| **Objective** | Verify a request can be deleted from each reachable state. |
| **Test Cases To Be Executed** | TC-30-002, TC-30-006, TC-30-009, TC-30-012, TC-30-019, TC-30-021, TC-30-022, TC-30-023 |
| **Set Up** | 1. Create a pending request; delete it; confirm removed. [TC-30-002, TC-30-019]<br>2. Create an in-progress request; delete it; confirm removed. [TC-30-006, TC-30-021]<br>3. Create a resolved request; delete it; confirm removed. [TC-30-009, TC-30-022]<br>4. Create a resolved (closed) request; delete it; confirm removed. [TC-30-012, TC-30-023] |
| **Wrap Up** | Delete all `CRTEST_` requests. |

*Table 2.30.1 Delete From States Test Procedure*

| **Test Procedure ID** | TP-30-002 |
|---|---|
| **Objective** | Verify in-progress → resolved transitions (respond / close). |
| **Test Cases To Be Executed** | TC-30-007, TC-30-008 |
| **Set Up** | 1. Create an in-progress request; `update_status`=resolved (respond); confirm resolved. [TC-30-007]<br>2. Create an in-progress request; `update_status`=resolved (close without reply); confirm resolved. [TC-30-008] |
| **Wrap Up** | Delete all `CRTEST_` requests. |

*Table 2.30.2 In-Progress → Resolved Test Procedure*

| **Test Procedure ID** | TP-30-003 |
|---|---|
| **Objective** | Verify resolved-state transitions (close responded, reopen). |
| **Test Cases To Be Executed** | TC-30-010, TC-30-011, TC-30-013 |
| **Set Up** | 1. Create a resolved request; `update_status`=resolved (close); confirm succeeds (closed = resolved). [TC-30-010]<br>2. Create a resolved request; `update_status`=in-progress (reopen); confirm in-progress. [TC-30-011, TC-30-013] |
| **Wrap Up** | Delete all `CRTEST_` requests. |

*Table 2.30.3 Resolved Transitions Test Procedure*

| **Test Procedure ID** | TP-30-004 |
|---|---|
| **Objective** | Record that the `viewed` state does not exist. |
| **Test Cases To Be Executed** | TC-30-001, TC-30-003, TC-30-004, TC-30-005, TC-30-020 |
| **Set Up** | 1. Create a request; `update_status`=`viewed`; confirm "Invalid status" — the `viewed` state does not exist. **[gap]** [TC-30-001, TC-30-003, TC-30-004, TC-30-005, TC-30-020] |
| **Wrap Up** | Delete all `CRTEST_` requests. |

*Table 2.30.4 Viewed State (Finding) Test Procedure*

| **Test Procedure ID** | TP-30-005 |
|---|---|
| **Objective** | Record that flows passing through `viewed` are unreachable. |
| **Test Cases To Be Executed** | TC-30-014, TC-30-015, TC-30-016, TC-30-017, TC-30-018 |
| **Set Up** | 1. Attempt the full lifecycle flows that pass through `viewed` (view → in-progress → responded → closed, reply-after-viewing, close-without-reply, reopen variations); confirm the `viewed` step is unreachable. **[gap]** [TC-30-014, TC-30-015, TC-30-016, TC-30-017, TC-30-018] |
| **Wrap Up** | Delete all `CRTEST_` requests. |

*Table 2.30.5 Flows Requiring Viewed (Finding) Test Procedure*

---

## 3.0 Procedure Notes

- **Order of execution.** Procedures are independent and may run in any order, except those that mutate
  shared catalogue data — TP-06-004 (empty menu) and any procedure that backs up/restores a table —
  which must run serially (`--workers=1`).
- **Findings.** Steps and procedures marked **[gap]** or "Not implemented / skipped" (TP-22-004) are
  IV&V findings recording where the application diverges from the design. Their failure/skip is the
  expected, documented result, captured in the Test Incident Report.
- **Cleanup verification.** After each procedure, confirm zero leftover rows for that procedure's data
  marker (e.g. `SELECT COUNT(*) FROM contact_requests WHERE subject LIKE 'CRTEST_%'` returns 0) and
  that any backed-up shared table has been restored.

