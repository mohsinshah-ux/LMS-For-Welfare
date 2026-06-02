# Islamic Banking Loan Management System (LMS)

Enterprise-grade Islamic Financing Loan Management System built with:

- Frontend: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- Backend: NestJS (Node.js), TypeScript
- Database: PostgreSQL
- Auth: JWT + RBAC (MFA ready)
- Reporting: PDF + Excel export-ready service contracts
- Notifications: Email, SMS, in-app notification architecture

## Monorepo Structure

- `docs/` architecture and domain documentation
- `backend/` NestJS API with modular architecture
- `frontend/` Next.js 15 app with role-aware dashboards
- `database/` PostgreSQL schema and seed starter

## Delivered Artifacts

1. System Architecture: `docs/architecture.md`
2. Database ERD: `docs/erd.md`
3. PostgreSQL Schema: `database/schema.sql`
4. API Documentation: `docs/api-spec.yaml`
5. Backend Structure: `backend/src`
6. Frontend Structure: `frontend/src`
7. Dashboard UI Design: `docs/ui-ux-dashboard.md`
8. User Flow Diagrams: `docs/user-flows.md`
9. Authentication Flow: `docs/auth-flow.md`
10. RBAC Matrix: `docs/rbac-matrix.md`
11. Islamic Financing Workflows: `docs/financing-workflows.md`
12. Production-ready source layout and starter code

## Quick Start

### Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and update values
4. Run migrations/schema initialization against PostgreSQL
5. `npm run start:dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev`

## Notes

- This is a robust starter foundation designed for enterprise extension.
- Business-critical financial logic should be covered by integration and reconciliation tests before go-live.
