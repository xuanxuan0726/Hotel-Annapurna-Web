# Test Log

**for**

## Hotel Annapurna Web — Hotel Management System

Independent Verification and Validation

| | |
|---|---|
| **Version** | 1.0.0 |
| **Date** | 11/06/2026 |
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
| **Document Name** | Hotel Annapurna Web Management System Test Log (Iteration 1) |
| **Reference Number** | HAWS_TL_1 |
| **Version** | 1.0.0 |
| **Project Code** | CSE6324_HAWS |
| **Status** | In-use |
| **Date Released** | 11/06/2026 |

| Name | Position | Signature |
|---|---|---|
| Prepared By: Tey Jun Cheng | Test Analyst (Tester), Hotel Annapurna IV&V | |
| Reviewed By: Teoh Xuan Xuan | Test Lead, Hotel Annapurna IV&V | |
| Verified By: Yang Jia En | Test Manager, Hotel Annapurna IV&V | |

## Version History

| Version | Release Date | Section | Amendments |
|---|---|---|---|
| 1.0.0 | 11/06/2026 | All | Original Document — execution log for the F001–F030 test cases (HAWS_TCS_1) run through their procedures (HAWS_TPS_1). |

## Distribution List

| Version | Release Date | Controlled Copy No | Department | Issue Date |
|---|---|---|---|---|
| 1.0.0 | 11/06/2026 | 01 | Hotel Annapurna IV&V – QA | 11/06/2026 |
| 1.0.0 | 11/06/2026 | 02 | Hotel Annapurna IV&V – Test Team | 11/06/2026 |
| 1.0.0 | 11/06/2026 | 03 | Hotel Annapurna – Development Team | 11/06/2026 |

---

## Test Log

### General Information

| | |
|---|---|
| **Test Log Scope** | This Test Log covers the execution of all test cases for features **F001–F030** as specified in the Test Case Specification (HAWS_TCS_1_1.0.0), run through the procedures in the Test Procedure Specification (HAWS_TPS_1_1.0.0). |
| **Test Log Description** | The item under test is the Hotel Annapurna Web Hotel Management System (HAWS_WEB v1.0). This log records the per–test-case execution result (Pass / Fail / Skipped), the procedure that executed each case, the testing tool used, and a cross-reference to the Test Incident Report (HAWS_TIR_1_2.0.0) for every case that did not pass. A **Fail** denotes a guard/validation the design requires but the build does not implement; **Skipped** denotes a state/feature the design defines that does not exist in the build (not implementable). All such results are recorded as IV&V findings. |
| **Version Author** | Tey Jun Cheng |
| **Revision Version** | 1.0 |
| **Contact Number** | – |
| **People Responsible** | Yang Jia En (Test Manager) · Teoh Xuan Xuan (Test Lead) · Cheong Xin Chen (Test Analyst) · Tey Jun Cheng (Test Analyst / Tester) |
| **References** | HAWS_TCS_1_1.0.0 (Test Case Specification); HAWS_TPS_1_1.0.0 (Test Procedure Specification); HAWS_TDS_1_1.0.0 (Test Design Specification); HAWS_TIR_1_2.0.0 (Test Incident Report); Playwright HTML report (`tests/`, 30 specs); Selenium suite (`selenium/`, F008–F011) |

### Activities Execution Information

| | |
|---|---|
| **Execution Start Date** | 10/06/2026 |
| **End Date** | 11/06/2026 |
| **Execution Start Time** | 09:00 |
| **End Time** | 17:00 |
| **Tester Name** | Tey Jun Cheng |
| **Participant** | Yang Jia En; Teoh Xuan Xuan; Cheong Xin Chen |

---

## Procedure Result

> **Columns** — Requirement ID (Feature) · Test Design ID (TDS §) · Test Case ID · Test Procedure ID · Type of Testing · Tool · Pass/Fail · Test Incident Report ID · Remark.
> **Tools** — *Playwright* = `@playwright/test` on Chromium (`--workers=1`); *Selenium* = `selenium-webdriver` + Mocha (F008–F011 mirror); *Katalon* = manual Web-keyword steps (F012). Cases that did not pass cite the incident raised in HAWS_TIR_1.

### F001 User Registration — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F001 | 2.2.1 | TC-01-001 | TP-01-001 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-016 | TP-01-001 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-002 | TP-01-002 | Functional | Playwright | Pass | – | HTML5 native block |
| F001 | 2.2.1 | TC-01-003 | TP-01-003 | Functional | Playwright | Pass | – | HTML5 native block |
| F001 | 2.2.1 | TC-01-004 | TP-01-004 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-018 | TP-01-004 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-005 | TP-01-005 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-006 | TP-01-006 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-007 | TP-01-006 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-008 | TP-01-007 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-009 | TP-01-007 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-010 | TP-01-007 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-011 | TP-01-007 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-012 | TP-01-008 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-013 | TP-01-008 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-014 | TP-01-008 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-REG-002 | 11-digit contact rejected; design treats it as valid (upper boundary) |
| F001 | 2.2.1 | TC-01-015 | TP-01-008 | Functional | Playwright | Pass | – | – |
| F001 | 2.2.1 | TC-01-017 | TP-01-009 | Functional | Playwright | Pass | – | – |

### F002 User Login — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F002 | 2.2.2 | TC-02-001 | TP-02-001 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-002 | TP-02-001 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-010 | TP-02-001 | Functional | Playwright | Pass | – | HTML5 native block (empty email) |
| F002 | 2.2.2 | TC-02-003 | TP-02-002 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-011 | TP-02-002 | Functional | Playwright | Pass | – | HTML5 native block (empty password) |
| F002 | 2.2.2 | TC-02-004 | TP-02-003 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-012 | TP-02-003 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-005 | TP-02-004 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-013 | TP-02-004 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-006 | TP-02-005 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-008 | TP-02-005 | Functional | Playwright | Pass | – | – |
| F002 | 2.2.2 | TC-02-007 | TP-02-006 | Functional | Playwright | Pass | – | Admin → `/admin/index.php` redirect |
| F002 | 2.2.2 | TC-02-009 | TP-02-006 | Functional | Playwright | Pass | – | Customer → `index.php` redirect |

### F003 Session Verification — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F003 | 2.2.3 | TC-03-001 | TP-03-001 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-002 | TP-03-001 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-009 | TP-03-001 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-003 | TP-03-002 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-010 | TP-03-002 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-004 | TP-03-003 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-011 | TP-03-003 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-005 | TP-03-004 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-012 | TP-03-004 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-006 | TP-03-005 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-013 | TP-03-005 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-007 | TP-03-006 | Functional | Playwright | Pass | – | – |
| F003 | 2.2.3 | TC-03-008 | TP-03-006 | Functional | Playwright | Pass | – | – |

### F004 OTP Account Verification — Tool: Playwright (Mailtrap sink; OTP read from DB)

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F004 | 2.2.4 | TC-04-001 | TP-04-001 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-010 | TP-04-001 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-002 | TP-04-002 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-011 | TP-04-002 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-003 | TP-04-003 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-012 | TP-04-003 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-004 | TP-04-004 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-013 | TP-04-004 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-005 | TP-04-005 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-009 | TP-04-005 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-007 | TP-04-006 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-014 | TP-04-006 | Functional | Playwright | Pass | – | 60s resend cooldown |
| F004 | 2.2.4 | TC-04-006 | TP-04-007 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-008 | TP-04-007 | Functional | Playwright | Pass | – | – |
| F004 | 2.2.4 | TC-04-015 | TP-04-007 | Functional | Playwright | Pass | – | 60s resend cooldown |

### F005 Password Reset — Tool: Playwright (no email sent; OTP read from DB)

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F005 | 2.2.5 | TC-05-001 | TP-05-001 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-002 | TP-05-001 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-004 | TP-05-001 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-014 | TP-05-001 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-003 | TP-05-002 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-005 | TP-05-003 | Functional | Playwright | Pass | – | HTML5 native block |
| F005 | 2.2.5 | TC-05-006 | TP-05-003 | Functional | Playwright | Pass | – | HTML5 `minlength` block |
| F005 | 2.2.5 | TC-05-015 | TP-05-003 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-007 | TP-05-004 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-008 | TP-05-004 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-009 | TP-05-005 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-011 | TP-05-005 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-013 | TP-05-005 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-010 | TP-05-006 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-012 | TP-05-006 | Functional | Playwright | Pass | – | – |
| F005 | 2.2.5 | TC-05-016 | TP-05-006 | Functional | Playwright | Pass | – | – |

### F006 Browse Food Menu — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F006 | 2.2.6 | TC-06-001 | TP-06-001 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-003 | TP-06-001 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-004 | TP-06-001 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-005 | TP-06-001 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-006 | TP-06-002 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-007 | TP-06-002 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-008 | TP-06-003 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-009 | TP-06-003 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-010 | TP-06-003 | Functional | Playwright | Pass | – | – |
| F006 | 2.2.6 | TC-06-002 | TP-06-004 | Functional | Playwright | Pass | – | empty-state (data backup/restore) |

### F007 Add Food to Cart — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F007 | 2.2.7 | TC-07-001 | TP-07-001 | Functional | Playwright | Pass | – | – |
| F007 | 2.2.7 | TC-07-009 | TP-07-001 | Functional | Playwright | Pass | – | – |
| F007 | 2.2.7 | TC-07-005 | TP-07-002 | Functional | Playwright | Pass | – | – |
| F007 | 2.2.7 | TC-07-006 | TP-07-003 | Functional | Playwright | Pass | – | – |
| F007 | 2.2.7 | TC-07-007 | TP-07-004 | Functional | Playwright | Pass | – | – |
| F007 | 2.2.7 | TC-07-008 | TP-07-005 | Functional | Playwright | Pass | – | – |
| F007 | 2.2.7 | TC-07-002 | TP-07-006 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CART-002 | Food added without login; no login gate on add-to-cart |
| F007 | 2.2.7 | TC-07-010 | TP-07-006 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CART-002 | No login gate on add-to-cart |
| F007 | 2.2.7 | TC-07-003 | TP-07-007 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CART-003 | Unavailable food item added; no availability gate for food |
| F007 | 2.2.7 | TC-07-004 | TP-07-007 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CART-003 | No food availability gate |
| F007 | 2.2.7 | TC-07-011 | TP-07-007 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CART-003 | No food availability gate |

### F008 Room Availability Checking — Tool: Playwright + Selenium

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F008 | 2.2.8 | TC-08-001 | TP-08-001 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-002 | TP-08-001 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-003 | TP-08-002 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-004 | TP-08-002 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-005 | TP-08-003 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-006 | TP-08-004 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-007 | TP-08-004 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-008 | TP-08-004 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-009 | TP-08-005 | Functional | Playwright + Selenium | Pass | – | – |
| F008 | 2.2.8 | TC-08-010 | TP-08-005 | Functional | Playwright + Selenium | Pass | – | – |

### F009 Room Booking — Tool: Playwright + Selenium

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F009 | 2.2.9 | TC-09-001 | TP-09-001 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-014 | TP-09-001 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-009 | TP-09-002 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-010 | TP-09-002 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-011 | TP-09-003 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-012 | TP-09-003 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-002 | TP-09-004 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-015 | TP-09-004 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-003 | TP-09-005 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-016 | TP-09-005 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-004 | TP-09-006 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-017 | TP-09-006 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-005 | TP-09-007 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-018 | TP-09-007 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-006 | TP-09-008 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-019 | TP-09-008 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-007 | TP-09-009 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-020 | TP-09-009 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-008 | TP-09-010 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-021 | TP-09-010 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-013 | TP-09-011 | Functional | Playwright + Selenium | Pass | – | – |
| F009 | 2.2.9 | TC-09-022 | TP-09-011 | Functional | Playwright + Selenium | Pass | – | – |

### F010 Table Availability Checking — Tool: Playwright + Selenium

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F010 | 2.2.10 | TC-10-001 | TP-10-001 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-002 | TP-10-001 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-011 | TP-10-001 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-012 | TP-10-001 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-003 | TP-10-002 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-004 | TP-10-002 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-013 | TP-10-002 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-005 | TP-10-003 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-014 | TP-10-003 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-006 | TP-10-004 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-007 | TP-10-004 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-008 | TP-10-004 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-009 | TP-10-005 | Functional | Playwright + Selenium | Pass | – | – |
| F010 | 2.2.10 | TC-10-010 | TP-10-005 | Functional | Playwright + Selenium | Pass | – | – |

### F011 Table Reservation — Tool: Playwright + Selenium

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F011 | 2.2.11 | TC-11-001 | TP-11-001 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-013 | TP-11-001 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-009 | TP-11-002 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-010 | TP-11-002 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-011 | TP-11-002 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-002 | TP-11-003 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-014 | TP-11-003 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-003 | TP-11-004 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-015 | TP-11-004 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-004 | TP-11-005 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-016 | TP-11-005 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-005 | TP-11-006 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-017 | TP-11-006 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-006 | TP-11-007 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-018 | TP-11-007 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-007 | TP-11-008 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-019 | TP-11-008 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-008 | TP-11-009 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-020 | TP-11-009 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-012 | TP-11-010 | Functional | Playwright + Selenium | Pass | – | – |
| F011 | 2.2.11 | TC-11-021 | TP-11-010 | Functional | Playwright + Selenium | Pass | – | – |

### F012 Cart Checkout — Tool: Playwright; Katalon (manual)

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F012 | 2.2.12 | TC-12-007 | TP-12-001 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-009 | TP-12-001 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-010 | TP-12-001 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-011 | TP-12-001 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-008 | TP-12-002 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-001 | TP-12-003 | Functional | Playwright; Katalon | Pass | – | – |
| F012 | 2.2.12 | TC-12-012 | TP-12-003 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-002 | TP-12-004 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-013 | TP-12-004 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-003 | TP-12-005 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-014 | TP-12-005 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-004 | TP-12-006 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-015 | TP-12-006 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-005 | TP-12-007 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-016 | TP-12-007 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-006 | TP-12-008 | Functional | Playwright | Pass | – | – |
| F012 | 2.2.12 | TC-12-017 | TP-12-008 | Functional | Playwright | Pass | – | – |

### F013 Coupon Validation — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F013 | 2.2.13 | TC-13-001 | TP-13-001 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-002 | TP-13-001 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-003 | TP-13-001 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-004 | TP-13-002 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-005 | TP-13-002 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-006 | TP-13-002 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-007 | TP-13-003 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-008 | TP-13-003 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-009 | TP-13-003 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-010 | TP-13-004 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-011 | TP-13-004 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-012 | TP-13-004 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-013 | TP-13-005 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-014 | TP-13-006 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-015 | TP-13-006 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-016 | TP-13-006 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-017 | TP-13-006 | Functional | Playwright | Pass | – | – |
| F013 | 2.2.13 | TC-13-018 | TP-13-006 | Functional | Playwright | Pass | – | – |

### F014 Payment Processing — Tool: Playwright (Stripe sandbox)

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F014 | 2.2.14 | TC-14-001 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-002 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-003 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-004 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-014 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-015 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-016 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-017 | TP-14-001 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-005 | TP-14-002 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-011 | TP-14-002 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-006 | TP-14-003 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-PAY-002 | eSewa gateway not integrated; no redirect |
| F014 | 2.2.14 | TC-14-007 | TP-14-003 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-PAY-002 | eSewa not integrated |
| F014 | 2.2.14 | TC-14-008 | TP-14-003 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-PAY-002 | eSewa not integrated |
| F014 | 2.2.14 | TC-14-012 | TP-14-003 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-PAY-002 | eSewa not integrated |
| F014 | 2.2.14 | TC-14-018 | TP-14-003 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-PAY-002 | eSewa not integrated |
| F014 | 2.2.14 | TC-14-009 | TP-14-004 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-010 | TP-14-004 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-013 | TP-14-004 | Functional | Playwright | Pass | – | – |
| F014 | 2.2.14 | TC-14-019 | TP-14-004 | Functional | Playwright | Pass | – | – |

### F015 Order History Viewing — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F015 | 2.2.15 | TC-15-001 | TP-15-001 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-004 | TP-15-001 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-007 | TP-15-001 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-002 | TP-15-002 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-008 | TP-15-002 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-003 | TP-15-003 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-009 | TP-15-003 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-005 | TP-15-004 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-010 | TP-15-004 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-006 | TP-15-005 | Functional | Playwright | Pass | – | – |
| F015 | 2.2.15 | TC-15-011 | TP-15-005 | Functional | Playwright | Pass | – | – |

### F016 Booking History Viewing — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F016 | 2.2.16 | TC-16-001 | TP-16-001 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-004 | TP-16-001 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-008 | TP-16-001 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-002 | TP-16-002 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-009 | TP-16-002 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-003 | TP-16-003 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-010 | TP-16-003 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-005 | TP-16-004 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-011 | TP-16-004 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-006 | TP-16-005 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-012 | TP-16-005 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-007 | TP-16-006 | Functional | Playwright | Pass | – | – |
| F016 | 2.2.16 | TC-16-013 | TP-16-006 | Functional | Playwright | Pass | – | – |

### F017 Profile Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F017 | 2.2.17 | TC-17-001 | TP-17-001 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-009 | TP-17-001 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-010 | TP-17-001 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-011 | TP-17-001 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-002 | TP-17-002 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-012 | TP-17-002 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-003 | TP-17-003 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-013 | TP-17-003 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-004 | TP-17-004 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-014 | TP-17-004 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-005 | TP-17-005 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-015 | TP-17-005 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-006 | TP-17-006 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-016 | TP-17-006 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-007 | TP-17-007 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-017 | TP-17-007 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-008 | TP-17-008 | Functional | Playwright | Pass | – | – |
| F017 | 2.2.17 | TC-17-018 | TP-17-008 | Functional | Playwright | Pass | – | – |

### F018 Contact Form Submission — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F018 | 2.2.18 | TC-18-001 | TP-18-001 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-007 | TP-18-001 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-002 | TP-18-002 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-008 | TP-18-002 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-003 | TP-18-003 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-009 | TP-18-003 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-004 | TP-18-004 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-010 | TP-18-004 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-005 | TP-18-005 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-011 | TP-18-005 | Functional | Playwright | Pass | – | – |
| F018 | 2.2.18 | TC-18-006 | TP-18-006 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CONTACT-001 | DB insert failure throws uncaught mysqli exception |
| F018 | 2.2.18 | TC-18-012 | TP-18-006 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-CONTACT-001 | No graceful error handling on DB failure |

### F019 Blog Viewing — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F019 | 2.2.19 | TC-19-001 | TP-19-001 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-003 | TP-19-001 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-007 | TP-19-001 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-002 | TP-19-002 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-008 | TP-19-002 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-004 | TP-19-003 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-009 | TP-19-003 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-005 | TP-19-004 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-010 | TP-19-004 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-006 | TP-19-005 | Functional | Playwright | Pass | – | – |
| F019 | 2.2.19 | TC-19-011 | TP-19-005 | Functional | Playwright | Pass | – | – |

### F020 Blog Interaction — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F020 | 2.2.20 | TC-20-001 | TP-20-001 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-010 | TP-20-001 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-008 | TP-20-002 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-017 | TP-20-002 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-002 | TP-20-003 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-011 | TP-20-003 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-003 | TP-20-004 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-012 | TP-20-004 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-004 | TP-20-005 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-013 | TP-20-005 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-005 | TP-20-006 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-014 | TP-20-006 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-006 | TP-20-007 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-015 | TP-20-007 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-007 | TP-20-008 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-016 | TP-20-008 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-009 | TP-20-009 | Functional | Playwright | Pass | – | – |
| F020 | 2.2.20 | TC-20-018 | TP-20-009 | Functional | Playwright | Pass | – | – |

### F021 Admin Dashboard Access — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F021 | 2.2.21 | TC-21-001 | TP-21-001 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-002 | TP-21-001 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-003 | TP-21-002 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-015 | TP-21-002 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-004 | TP-21-003 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-016 | TP-21-003 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-005 | TP-21-004 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-013 | TP-21-004 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-006 | TP-21-005 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-014 | TP-21-005 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-007 | TP-21-006 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-017 | TP-21-006 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-008 | TP-21-007 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-018 | TP-21-007 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-009 | TP-21-008 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-019 | TP-21-008 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-010 | TP-21-009 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-020 | TP-21-009 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-011 | TP-21-010 | Functional | Playwright | Pass | – | – |
| F021 | 2.2.21 | TC-21-012 | TP-21-010 | Functional | Playwright | Pass | – | – |

### F022 Food/Menu Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F022 | 2.2.22 | TC-22-001 | TP-22-001 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-018 | TP-22-001 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-004 | TP-22-002 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-008 | TP-22-002 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-019 | TP-22-002 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-006 | TP-22-003 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-010 | TP-22-003 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-014 | TP-22-003 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-025 | TP-22-003 | Functional | Playwright | Pass | – | – |
| F022 | 2.2.22 | TC-22-002 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | No `status` column; availability/archive states not implemented |
| F022 | 2.2.22 | TC-22-003 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-005 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-007 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-009 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-011 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-012 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-013 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-015 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-016 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-017 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-020 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-021 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-022 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-023 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |
| F022 | 2.2.22 | TC-22-024 | TP-22-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-MENU-001 | Not implementable |

### F023 Room Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F023 | 2.2.23 | TC-23-001 | TP-23-001 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-019 | TP-23-001 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-004 | TP-23-002 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-008 | TP-23-002 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-011 | TP-23-002 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-012 | TP-23-002 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-023 | TP-23-002 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-005 | TP-23-003 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-014 | TP-23-003 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-018 | TP-23-003 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-024 | TP-23-003 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-002 | TP-23-004 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-007 | TP-23-004 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-021 | TP-23-004 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-006 | TP-23-005 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-009 | TP-23-005 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-020 | TP-23-005 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-003 | TP-23-006 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-010 | TP-23-006 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-013 | TP-23-006 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-022 | TP-23-006 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-025 | TP-23-006 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-015 | TP-23-007 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-016 | TP-23-007 | Functional | Playwright | Pass | – | – |
| F023 | 2.2.23 | TC-23-017 | TP-23-007 | Functional | Playwright | Pass | – | – |

### F024 Table Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F024 | 2.2.24 | TC-24-001 | TP-24-001 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-019 | TP-24-001 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-004 | TP-24-002 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-008 | TP-24-002 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-011 | TP-24-002 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-012 | TP-24-002 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-023 | TP-24-002 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-005 | TP-24-003 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-014 | TP-24-003 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-018 | TP-24-003 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-024 | TP-24-003 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-002 | TP-24-004 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-007 | TP-24-004 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-021 | TP-24-004 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-006 | TP-24-005 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-009 | TP-24-005 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-020 | TP-24-005 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-003 | TP-24-006 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-010 | TP-24-006 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-013 | TP-24-006 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-022 | TP-24-006 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-025 | TP-24-006 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-015 | TP-24-007 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-016 | TP-24-007 | Functional | Playwright | Pass | – | – |
| F024 | 2.2.24 | TC-24-017 | TP-24-007 | Functional | Playwright | Pass | – | – |

### F025 Order Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F025 | 2.2.25 | TC-25-001 | TP-25-001 | Functional | Playwright | Pass | – | – |
| F025 | 2.2.25 | TC-25-002 | TP-25-002 | Functional | Playwright | Pass | – | – |
| F025 | 2.2.25 | TC-25-003 | TP-25-003 | Functional | Playwright | Pass | – | – |
| F025 | 2.2.25 | TC-25-005 | TP-25-003 | Functional | Playwright | Pass | – | – |
| F025 | 2.2.25 | TC-25-011 | TP-25-003 | Functional | Playwright | Pass | – | – |
| F025 | 2.2.25 | TC-25-012 | TP-25-003 | Functional | Playwright | Pass | – | – |
| F025 | 2.2.25 | TC-25-004 | TP-25-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-001 | "preparing"/"ready" order states not implemented |
| F025 | 2.2.25 | TC-25-006 | TP-25-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-001 | Not implementable |
| F025 | 2.2.25 | TC-25-007 | TP-25-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-001 | Not implementable |
| F025 | 2.2.25 | TC-25-008 | TP-25-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-001 | Not implementable |
| F025 | 2.2.25 | TC-25-010 | TP-25-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-001 | Not implementable |
| F025 | 2.2.25 | TC-25-013 | TP-25-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-001 | Not implementable |
| F025 | 2.2.25 | TC-25-009 | TP-25-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-002 | "refunded" order state not implemented |
| F025 | 2.2.25 | TC-25-014 | TP-25-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-ORDER-002 | Not implementable |

### F026 Customer Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F026 | 2.2.26 | TC-26-001 | TP-26-001 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-009 | TP-26-001 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-002 | TP-26-002 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-010 | TP-26-002 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-005 | TP-26-003 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-013 | TP-26-003 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-006 | TP-26-004 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-014 | TP-26-004 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-007 | TP-26-005 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-015 | TP-26-005 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-008 | TP-26-006 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-016 | TP-26-006 | Functional | Playwright | Pass | – | – |
| F026 | 2.2.26 | TC-26-003 | TP-26-007 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CUST-001 | No customer search/filter feature |
| F026 | 2.2.26 | TC-26-004 | TP-26-007 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CUST-001 | Not implementable |
| F026 | 2.2.26 | TC-26-011 | TP-26-007 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CUST-001 | Not implementable |
| F026 | 2.2.26 | TC-26-012 | TP-26-007 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CUST-001 | Not implementable |

### F027 Staff Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F027 | 2.2.27 | TC-27-001 | TP-27-001 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-002 | TP-27-001 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-013 | TP-27-001 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-014 | TP-27-001 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-003 | TP-27-002 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-015 | TP-27-002 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-005 | TP-27-003 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-017 | TP-27-003 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-006 | TP-27-004 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-010 | TP-27-004 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-007 | TP-27-005 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-018 | TP-27-005 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-008 | TP-27-006 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-011 | TP-27-006 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-009 | TP-27-007 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-012 | TP-27-007 | Functional | Playwright | Pass | – | – |
| F027 | 2.2.27 | TC-27-004 | TP-27-008 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-STAFF-001 | Malformed email accepted on staff create |
| F027 | 2.2.27 | TC-27-016 | TP-27-008 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-STAFF-001 | No email-format validation |

### F028 Coupon Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F028 | 2.2.28 | TC-28-001 | TP-28-001 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Too-short code accepted (no length check) |
| F028 | 2.2.28 | TC-28-002 | TP-28-001 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-003 | TP-28-001 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-019 | TP-28-001 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Too-short code accepted |
| F028 | 2.2.28 | TC-28-004 | TP-28-002 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Negative minimum-purchase accepted |
| F028 | 2.2.28 | TC-28-005 | TP-28-002 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-006 | TP-28-002 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-020 | TP-28-002 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Negative minimum-purchase accepted |
| F028 | 2.2.28 | TC-28-007 | TP-28-003 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-008 | TP-28-003 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-009 | TP-28-003 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-021 | TP-28-003 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-010 | TP-28-004 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Invalid usage limit accepted |
| F028 | 2.2.28 | TC-28-011 | TP-28-004 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-012 | TP-28-004 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-022 | TP-28-004 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Invalid usage limit accepted |
| F028 | 2.2.28 | TC-28-013 | TP-28-005 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Past expiry date accepted |
| F028 | 2.2.28 | TC-28-014 | TP-28-005 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-015 | TP-28-005 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-023 | TP-28-005 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-COUPON-001 | Past expiry date accepted |
| F028 | 2.2.28 | TC-28-016 | TP-28-006 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-017 | TP-28-006 | Functional | Playwright | Pass | – | – |
| F028 | 2.2.28 | TC-28-018 | TP-28-006 | Functional | Playwright | Pass | – | – |

### F029 Blog Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F029 | 2.2.29 | TC-29-001 | TP-29-001 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-010 | TP-29-001 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-002 | TP-29-002 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-011 | TP-29-002 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-003 | TP-29-003 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-012 | TP-29-003 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-005 | TP-29-004 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-014 | TP-29-004 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-006 | TP-29-005 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-007 | TP-29-005 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-015 | TP-29-005 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-016 | TP-29-005 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-008 | TP-29-006 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-017 | TP-29-006 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-009 | TP-29-007 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-018 | TP-29-007 | Functional | Playwright | Pass | – | – |
| F029 | 2.2.29 | TC-29-004 | TP-29-008 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-BLOG-001 | Non-image upload accepted (no type/size check) |
| F029 | 2.2.29 | TC-29-013 | TP-29-008 | Functional | Playwright | **Fail** | HAWS_TIR_1 / TIR-BLOG-001 | No image-upload validation |

### F030 Contact Request Management — Tool: Playwright

| Req ID | TDS § | Test Case ID | Test Procedure ID | Type | Tool | Pass/Fail | Test Incident Report ID | Remark |
|---|---|---|---|---|---|---|---|---|
| F030 | 2.2.30 | TC-30-002 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-006 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-009 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-012 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-019 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-021 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-022 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-023 | TP-30-001 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-007 | TP-30-002 | Functional | Playwright | Pass | – | responded = resolved |
| F030 | 2.2.30 | TC-30-008 | TP-30-002 | Functional | Playwright | Pass | – | closed = resolved |
| F030 | 2.2.30 | TC-30-010 | TP-30-003 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-011 | TP-30-003 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-013 | TP-30-003 | Functional | Playwright | Pass | – | – |
| F030 | 2.2.30 | TC-30-001 | TP-30-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | No "viewed" state (enum is pending/in-progress/resolved) |
| F030 | 2.2.30 | TC-30-003 | TP-30-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-004 | TP-30-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-005 | TP-30-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-020 | TP-30-004 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-014 | TP-30-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Flow passes through unreachable "viewed" state |
| F030 | 2.2.30 | TC-30-015 | TP-30-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-016 | TP-30-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-017 | TP-30-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |
| F030 | 2.2.30 | TC-30-018 | TP-30-005 | Functional | Playwright | **Skipped** | HAWS_TIR_1 / TIR-CONTACT-002 | Not implementable |

---

## Result Summary

| Result | Count |
|---|---|
| **Pass** | 444 |
| **Fail** (design-vs-implementation guard/validation missing) | 25 |
| **Skipped** (state/feature not implemented) | 38 |
| **Total test cases executed** | 507 |

> **Fail (25):** TC-01-014 (TIR-REG-002); TC-07-002/010 (TIR-CART-002); TC-07-003/004/011 (TIR-CART-003); TC-14-006/007/008/012/018 (TIR-PAY-002); TC-18-006/012 (TIR-CONTACT-001); TC-27-004/016 (TIR-STAFF-001); TC-28-001/019/004/020/010/022/013/023 (TIR-COUPON-001); TC-29-004/013 (TIR-BLOG-001).
> **Skipped (38):** TC-22 ×16 (TIR-MENU-001); TC-25-004/006/007/008/010/013 (TIR-ORDER-001) + TC-25-009/014 (TIR-ORDER-002); TC-26-003/004/011/012 (TIR-CUST-001); TC-30-001/003/004/005/020/014/015/016/017/018 (TIR-CONTACT-002).
> Every Fail/Skipped case is documented in the **Test Incident Report HAWS_TIR_1_2.0.0** (incidents 9–21). The 8 manual exploratory security findings (incidents 1–8) are recorded separately in that report as type *Exploratory*.

---

## Environment Information

| Requested Test Environment | Test Environment After Changes |
|---|---|
| **Hardware:** Test workstation, Intel Core i5 / 8 GB RAM minimum.<br>**Server:** XAMPP (Apache + MariaDB/MySQL); schema `hotel_annapurna` loaded.<br>**Runtime:** PHP 8.1+; Node.js LTS (Playwright `@playwright/test` ^1.60.0); Java JDK 11+ (Selenium standalone).<br>**Browsers:** Chromium (primary, `--workers=1`); Firefox/WebKit (optional).<br>**Tools:** Playwright; Selenium WebDriver + Mocha; Katalon Studio (manual, F012); Mailtrap SMTP sink; MySQL CLI `C:\xampp\mysql\bin\mysql.exe -uroot`.<br>**Accounts:** Admin `lucavalentines80@gmail.com` / `adminadmin`; Customer `yangenna20@gmail.com` / `ennayang`.<br>**Reference:** HAWS_TPS_1_1.0.0 | No change. All execution ran on the requested environment; throwaway users / seeded rows created during testing were cleaned up in each procedure's Wrap Up, and the `food_items` empty-state backup (TC-06-002) was restored. The application build was not modified during execution. |

---

## Anomalous Events

| Unexpected event occurred | Test Procedure ID | Anomaly Reporter Name |
|---|---|---|
| Registration rejected an 11-digit contact number that the design treats as the valid upper boundary. | TP-01-008 | Cheong Xin Chen |
| Food item added to the cart while logged out — no login gate fired on add-to-cart. | TP-07-006 | Cheong Xin Chen |
| Food item unavailable today was still added to the cart — no availability gate for food. | TP-07-007 | Cheong Xin Chen |
| Selecting eSewa did not redirect to the gateway; the gateway return paths could not be exercised. | TP-14-003 | Tey Jun Cheng |
| Contact-form DB insert failure produced an uncaught `mysqli` exception / raw error instead of a handled message. | TP-18-006 | Tey Jun Cheng |
| Food/Menu state transitions (unavailable/archived/restore) had no `status` column to act on. | TP-22-004 | Yang Jia En |
| Order status could not be set to `preparing` / `ready`; the values were rejected as invalid. | TP-25-004 | Tey Jun Cheng |
| Order status could not be set to `refunded`; the value was rejected as invalid. | TP-25-005 | Tey Jun Cheng |
| Customer Management page had no search/filter control to exercise the search flows. | TP-26-007 | Cheong Xin Chen |
| Staff create accepted a malformed email address (`notanemail`). | TP-27-008 | Tey Jun Cheng |
| Coupon create accepted out-of-range values (short code, negative minimum purchase, invalid usage limit, past expiry). | TP-28-001 / TP-28-002 / TP-28-004 / TP-28-005 | Teoh Xuan Xuan |
| Blog add moved a non-image file (`.txt`) and created the post — no file-type/size validation. | TP-29-008 | Teoh Xuan Xuan |
| Contact-request status could not be set to `viewed`; the value was rejected as invalid, blocking every flow through it. | TP-30-004 / TP-30-005 | Teoh Xuan Xuan |

---

## Approvals

| Name | Job Title | Signature |
|---|---|---|
| Teoh Xuan Xuan | Test Lead, Hotel Annapurna IV&V | |
| Yang Jia En | Test Manager, Hotel Annapurna IV&V | |
| | Product Manager, Hotel Annapurna | |
