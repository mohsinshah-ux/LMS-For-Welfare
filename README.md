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

1. `docker compose up -d`
2. `cd backend`
3. `npm install`
4. Copy `.env.example` to `.env`
5. `npm run prisma:generate`
6. `npm run prisma:migrate -- --name init`
7. `npm run prisma:seed`
8. `npm run start:dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev`

### Seeded Admin Credentials

- Username: `superadmin`
- Email: `admin@lms.local`
- Password: `Admin@123`

## Production Deploy (GitHub + Vercel)

### 1) GitHub Repository

1. Ensure these files exist and are committed:
   - `.gitignore`
   - `.github/workflows/ci.yml`
   - `vercel.json`
2. Push to `main` branch:
   - `git add .`
   - `git commit -m "prepare production deployment for github and vercel"`
   - `git push origin main`

### 2) Backend Deployment (Required before Vercel frontend)

Deploy `backend/` to your server/platform (Railway, Render, VPS, ECS, etc.) with:

- Build command: `npm install && npm run prisma:generate && npm run build`
- Start command: `npm run start`
- Required environment variables:
  - See `backend/.env.production.example`

After deploy, run migrations against production DB:

- `npm run prisma:migrate -- --name init`
- `npm run prisma:seed` (optional for initial admin user)

### 3) Frontend Deployment on Vercel

1. Import GitHub repository in Vercel.
2. Keep project root as repository root (uses `vercel.json`), or set root to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend public URL
4. Deploy.

### 4) Vercel + API CORS Alignment

Set backend `CORS_ORIGIN` to your Vercel domain:

- Example: `https://your-project.vercel.app`

## Notes

- This is a robust starter foundation designed for enterprise extension.
- Business-critical financial logic should be covered by integration and reconciliation tests before go-live.
- Vercel hosts the frontend. Backend should run on a Node-friendly host with PostgreSQL connectivity.
