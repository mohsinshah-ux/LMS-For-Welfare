# Push login fix to `main` (wrong branch recovery)

If you pushed to the wrong branch, use one of these flows.

## Option A — Merge wrong branch into `main`

Replace `your-wrong-branch` with the branch name you used by mistake.

```bash
git checkout main
git pull origin main
git merge your-wrong-branch
git push origin main
```

## Option B — Copy only current files to `main`

```bash
git checkout main
git pull origin main
# copy or cherry-pick commits from the other branch, then:
git add .
git commit -m "fix: vercel login api proxy and production cors"
git push origin main
```

## After push

1. **Vercel** → Settings → Git → set **Production Branch** to `main` (not `vercel/react-server-components-*` bot branches).
2. Redeploy from `main` with **Clear build cache** enabled.
3. Set `NEXT_PUBLIC_API_URL` to your Django backend URL.
4. **Render** — set `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to your Vercel URL.

## Vercel "Permission denied" on next build

If you see `node_modules/.bin/next: Permission denied`:

- Deploy from `main` after pulling the latest `frontend/vercel.json` fix.
- In Vercel → Deployments → Redeploy → check **Clear build cache**.
