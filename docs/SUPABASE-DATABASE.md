# Supabase PostgreSQL + Render (Django API)

Use Supabase for the database only. Host the Django API on Render and the frontend on Vercel.

## Vercel ↔ Supabase integration (important)

If you connected **Supabase to Vercel** in the Vercel dashboard, Vercel may add variables like:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `POSTGRES_URL` / `DATABASE_URL`

**This LMS app does not use those on the frontend.** The Next.js app talks to **Django on Render**, not to Supabase directly.

| Variable from integration | Used by this project? | Where it belongs |
|---------------------------|----------------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No (not in code) | Ignore for now |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Ignore for now |
| `POSTGRES_URL` / `DATABASE_URL` on **Vercel** | No | Copy **Postgres URI** to **Render** as `DATABASE_URL` |
| `NEXT_PUBLIC_API_URL` on **Vercel** | **Yes** | Your **Render** Django URL |

**You still need:**

1. **Render** Web Service with `DATABASE_URL` = Supabase **direct** Postgres URI (`?sslmode=require`)
2. **Vercel** `NEXT_PUBLIC_API_URL` = `https://your-service.onrender.com`

Connecting Supabase to Vercel alone does **not** replace deploying Django on Render.

## 1) Create Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose organization, **name** (e.g. `lms-for-welfare`)
3. Set a strong **Database password** — save it (you need it for `DATABASE_URL`)
4. Pick a **region** close to your Render region
5. Wait until the project is **Active**

## 2) Get `DATABASE_URL` from Supabase

1. Supabase Dashboard → your project
2. **Project Settings** (gear) → **Database**
3. Under **Connection string**, choose **URI**
4. Copy the string. It looks like:

```text
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

5. Replace `[YOUR-PASSWORD]` with the database password you set in step 1

### Which connection type to use

| Type | When to use |
|------|-------------|
| **Direct connection** (host `db.xxx.supabase.co`, port **5432**) | Best for Django **migrations** (`migrate`, `seed_lms`) |
| **Session pooler** (port **5432** on pooler host) | Good for Django app runtime |
| **Transaction pooler** (port **6543**) | Can break some Django migrations — avoid for build/migrate |

**Recommended for Render:** use **Direct connection** URI from Supabase (port 5432, host `db.<project-ref>.supabase.co`).

Append SSL if not already in the URI:

```text
?sslmode=require
```

Example (your values will differ):

```text
postgresql://postgres:YOUR_PASSWORD@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
```

## 3) Supabase settings checklist

| Setting | What to do |
|---------|------------|
| **Database password** | Set at project creation; store securely |
| **Connection string** | Copy **URI** from Database settings |
| **SSL** | Use `sslmode=require` in `DATABASE_URL` |
| **IPv4** | If Render cannot connect, enable **IPv4 add-on** or use Supabase pooler (see Supabase dashboard hint) |
| **API keys** (anon / service_role) | **Not used** by Django — only `DATABASE_URL` |
| **Row Level Security** | Optional; Django uses direct Postgres, not Supabase client |
| **Tables** | Do **not** create tables manually — run `python manage.py migrate` on Render |

## 4) Render Web Service environment variables

On your Render **Web Service** (root `backend`), set:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Full Supabase URI from step 2 (with real password) |
| `DJANGO_SECRET_KEY` | Random secret |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `your-service.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://lms-for-welfare.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://lms-for-welfare.vercel.app` |

**Build command** (keep migrate + seed):

```bash
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py seed_lms
```

**Start command:**

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

## 5) Vercel (unchanged)

```text
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com
```

## 6) Verify

1. Render deploy succeeds (migrate runs in build)
2. Browser: `https://your-render-service.onrender.com/health` → `{"status":"ok",...}`
3. Login on https://lms-for-welfare.vercel.app with `superadmin` / `Admin@123`

## Troubleshooting

| Error | Fix |
|-------|-----|
| SSL required | Add `?sslmode=require` to `DATABASE_URL` |
| Connection timeout from Render | Use **Direct** connection; enable Supabase **IPv4** if offered |
| Migrate fails on pooler :6543 | Switch to **Direct** connection (port 5432) |
| Password auth failed | Reset DB password in Supabase → update `DATABASE_URL` on Render |
