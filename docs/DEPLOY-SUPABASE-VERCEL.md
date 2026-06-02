# Deploy LMS — Supabase + Vercel only (no Render)

| Layer | Platform |
|-------|----------|
| Frontend + API | **Vercel** ([lms-for-welfare.vercel.app](https://lms-for-welfare.vercel.app)) |
| Database + Auth | **Supabase** |
| Render | **Not used** |

## 1) Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. **SQL Editor** → run [`supabase/migrations/001_lms_schema.sql`](../supabase/migrations/001_lms_schema.sql)
3. **Authentication** → **Providers** → enable **Email**
4. **Authentication** → **Users** → **Add user**:
   - Email: `admin@lms.local`
   - Password: `Admin@123`
   - Confirm email (or disable email confirmation in Auth settings for testing)

## 2) Vercel ↔ Supabase integration

You already connected the integration. Ensure these exist under **Vercel → Settings → Environment Variables**:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auto from integration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auto from integration |
| `SUPABASE_SERVICE_ROLE_KEY` | Copy from Supabase → **Settings → API** → `service_role` (secret) |

**Remove** (no longer used):

- `NEXT_PUBLIC_API_URL` (was for Render — delete it)

Redeploy Vercel after env changes (**Clear build cache**).

## 3) Vercel project settings

- **Root Directory:** `frontend`
- **Production Branch:** `main`

## 4) Verify

| Test | URL |
|------|-----|
| Health API | `https://lms-for-welfare.vercel.app/api/health` |
| Login | `https://lms-for-welfare.vercel.app/login` |

Login with `admin@lms.local` / `Admin@123`.

## 5) Local development

```bash
cd frontend
cp .env.example .env.local
# Fill Supabase URL, anon key, service role key
npm install
npm run dev
```

## Architecture

```text
Browser → Vercel (Next.js pages + /api/* routes) → Supabase (Postgres + Auth)
```

No Django server required in production.
