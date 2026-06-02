# Database ERD (Textual)

## Identity and Access

- `users` -> `employee_profiles` (1:1 optional)
- `roles` <-> `permissions` via `role_permissions` (M:N)
- `users` <-> `roles` via `user_roles` (M:N)

## Core Master Data

- `branches` -> `users` (1:M)
- `departments` -> `employee_profiles` (1:M)
- `designations` -> `employee_profiles` (1:M)

## Customer and KYC

- `customers` -> `customer_documents` (1:M)
- `customers` -> `financing_applications` (1:M)
- `customers` -> `customer_timeline_events` (1:M)

## Islamic Financing Domain

- `financing_types` -> `financing_products` (1:M)
- `financing_products` -> `financing_applications` (1:M)
- `financing_applications` -> `application_status_history` (1:M)
- `financing_applications` -> `agreements` (1:M)
- `financing_applications` -> `installments` (1:M)
- `financing_applications` -> `recoveries` (1:M)

## Financial Operations

- `installments` -> `payments` (1:M)
- `payments` -> `payment_receipts` (1:1)
- `payments` -> `journal_entries` (1:1 recommended)
- `journal_entries` -> `journal_lines` (1:M)
- `chart_of_accounts` -> `journal_lines` (1:M)
- `journal_lines` -> `ledger_entries` (1:1 projection)
- `branches` -> `cash_flow_entries` (1:M)
- `branches` -> `profit_loss_entries` (1:M)

## Reporting and Audit

- `users` -> `audit_logs` (1:M)
- `users` -> `notifications` (1:M)
- `report_jobs` reference report generation requests by user and branch

## Constraints Overview

- Unique constraints on business IDs (`customer_id`, `application_no`, `agreement_no`)
- FK constraints with explicit delete behavior
- Indexing on status/date/user and financial aggregation dimensions
- Check constraints for monetary non-negativity and double-entry balance integrity
