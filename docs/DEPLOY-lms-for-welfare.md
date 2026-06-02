# Deployment for https://lms-for-welfare.vercel.app

## 1) Render (Django API)

Create Web Service from this repo, root directory `backend`, or use `render.yaml`.

After deploy, your API URL will be like:

`https://islamic-lms-api.onrender.com`

Test: open `https://islamic-lms-api.onrender.com/health` → must return JSON `{"status":"ok",...}`.

### Render environment (copy-paste)

| Key | Value |
|-----|--------|
| `CORS_ALLOWED_ORIGINS` | `https://lms-for-welfare.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://lms-for-welfare.vercel.app` |
| `DJANGO_ALLOWED_HOSTS` | `islamic-lms-api.onrender.com` |
| `DJANGO_DEBUG` | `False` |

Run once in Render Shell:

```bash
python manage.py migrate
python manage.py seed_lms
```

Login: `superadmin` / `Admin@123`

## 2) Vercel (frontend)

Project: [lms-for-welfare.vercel.app](https://lms-for-welfare.vercel.app)

Settings → General → **Root Directory**: `frontend`

Settings → Environment Variables:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://islamic-lms-api.onrender.com` |

Use your **actual** Render URL if different. Must be `https`, no trailing slash, **not** localhost.

Redeploy after saving env vars (**Clear build cache**).

## 3) Verify login

On https://lms-for-welfare.vercel.app/login the line **API:** must show your Render URL, not `127.0.0.1`.
