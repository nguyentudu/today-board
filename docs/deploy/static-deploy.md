# Static Deploy

Moon Product v1 Local is a static Vite app. It does not need a backend for controlled public testing.

Recommended static hosts:

- Vercel
- Netlify
- GitHub Pages

Do not use Railway yet. There is no backend, database, sync service, queue, worker, or server process to host.

## Build Command

```bash
npm run build
```

## Output Directory

```text
dist
```

## Public Test Note

Use a static deploy only to make the local board easier for 10 users to open. Keep the product scope local and portable.
