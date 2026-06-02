# Islamic Banking Loan Management System (LMS)

**Stack:** Next.js on Vercel + Supabase (database & auth). **No Render.**

- Frontend: [https://lms-for-welfare.vercel.app](https://lms-for-welfare.vercel.app)
- Deploy guide: [docs/DEPLOY-SUPABASE-VERCEL.md](docs/DEPLOY-SUPABASE-VERCEL.md)

## Monorepo layout

| Path | Purpose |
|------|---------|
| `frontend/` | Next.js app + `/api/*` routes (Vercel) |
| `supabase/migrations/` | SQL schema for Supabase |
| `backend/` | Legacy Django (optional local use only — not deployed) |
| `docs/` | Architecture & deployment |

## Quick deploy checklist

1. Run SQL in Supabase → [supabase/migrations/001_lms_schema.sql](supabase/migrations/001_lms_schema.sql)
2. Create auth user `admin@lms.local` / `Admin@123` in Supabase
3. Vercel ↔ Supabase integration env vars + `SUPABASE_SERVICE_ROLE_KEY`
4. Remove `NEXT_PUBLIC_API_URL` from Vercel if present
5. Redeploy Vercel (root directory `frontend`)

## Local dev

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Default login (after Supabase user created)

- Email: `admin@lms.local`
- Password: `Admin@123`
