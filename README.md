# Islamic Banking Loan Management System (LMS)

- **Frontend**: Next.js 15 (deploy on Vercel)
- **Backend**: Django + Django REST Framework (deploy on Render/Railway/VPS)
- **Database**: PostgreSQL (production), SQLite (GitHub CI)

## Deploy from GitHub

### 1) GitHub CI

Push to `main`. Workflow runs:

- Frontend build (`frontend/`)
- Django backend check (`backend/`) using SQLite in CI

### 2) Backend (Render recommended)

1. Create a **Web Service** from this repo.
2. Set **Root Directory** to `backend`.
3. Build command:

```bash
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py seed_lms
```

4. Start command:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

5. Environment variables:

- `DJANGO_SECRET_KEY` (random secure value)
- `DJANGO_DEBUG=False`
- `DATABASE_URL` (Render PostgreSQL connection string)
- `CORS_ALLOWED_ORIGINS=https://your-app.vercel.app`

Or use the included [`render.yaml`](render.yaml) blueprint.

Default seeded user after `seed_lms`:

- Username: `superadmin`
- Password: `Admin@123`

### 3) Frontend (Vercel)

1. Import GitHub repo in Vercel.
2. **Required:** Project Settings → General → **Root Directory** = `frontend` → Save.
3. **Do not** set a custom Output Directory in Vercel (leave default `.next`). The app builds to `frontend/.next` automatically when root is `frontend`.
4. Set environment variable:

- `NEXT_PUBLIC_API_URL=https://<your-render-backend-url>`

5. Deploy (clear build cache once if a previous deploy failed).

Vercel config for the frontend lives in [`frontend/vercel.json`](frontend/vercel.json) only. There is no root `vercel.json` (it caused `frontend/frontend/.next` path errors).

**Backend is Django only** — there is no Node API in this repo. Deploy API separately (Render) using the `backend/` folder.

## Local development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_lms
python manage.py runserver 8000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

## API endpoints

- `GET /health`
- `POST /auth/login`
- `GET/POST /customers`
- `GET/POST /financing-applications`
- `PATCH /financing-applications/<id>/status`
- `GET /installments`
- `POST /installments/generate`
- `GET/POST /payments`
- `GET /dashboard/kpis`
