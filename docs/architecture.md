# System Architecture

## High-Level Architecture

- **Client Layer**: Next.js 15 web app with role-based dashboards.
- **API Layer**: NestJS modular monolith (can evolve into microservices).
- **Domain Layer**: Financing, Customer, Recovery, Accounting, Reporting bounded contexts.
- **Data Layer**: PostgreSQL with transactional integrity and auditability.
- **Integration Layer**: Email/SMS providers, file storage (S3/local), PDF/Excel engines.

## Core Design Principles

- Modular domain-driven architecture
- Explicit RBAC and authorization guards
- Event-driven side effects (notifications, audit logs)
- Financial consistency via double-entry accounting
- Full traceability (audit logs + status histories)

## Backend Module Map

- `auth`: JWT login, refresh, MFA-ready challenge hooks
- `users`: user profile lifecycle
- `roles`: roles, permissions, assignment
- `employees`: employee HR and performance snapshots
- `customers`: KYC and business profiles
- `financing-products`: Islamic product catalog
- `financing-applications`: application lifecycle
- `agreements`: template-based agreement generation and versioning
- `installments`: schedule generation and status tracking
- `payments`: receipt and ledger posting
- `recoveries`: overdue workflows and actions
- `accounting`: chart of accounts, journal entries, ledgers
- `cashflow`: inflow/outflow tracking
- `profit-loss`: P&L snapshots and trends
- `notifications`: email/sms/in-app orchestration
- `reports`: PDF/Excel export orchestration
- `audit-log`: immutable activity trail
- `dashboard`: KPI aggregation endpoints

## Request Lifecycle

1. Request hits NestJS controller with auth guard.
2. JWT strategy resolves user context.
3. RBAC guard validates required permission.
4. Service executes domain logic in DB transaction.
5. Domain events emitted for notification/audit projections.
6. Structured response returned.

## Frontend Architecture

- App router with protected route groups by role
- Shared UI design system (Tailwind + shadcn/ui)
- Domain feature modules for each business area
- Data access via typed API client layer
- Recharts-based analytics components

## Security Architecture

- JWT access/refresh strategy
- Password hashing (`argon2` recommended)
- Optional TOTP MFA extension point
- Rate limiting on auth and sensitive endpoints
- Full audit logging for login, data mutation, approvals, financial events

## Deployment Topology

- Web: Next.js app behind CDN/reverse proxy
- API: NestJS container deployment (horizontal scale)
- DB: PostgreSQL with PITR backups
- Object Storage: S3 bucket (or local fallback for on-prem)
- Queues (recommended): Redis/BullMQ for async notifications and report generation
