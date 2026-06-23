# Public Test URL

Use a static public URL only for controlled 10-user testing.

This is not launch, scale, marketing, or ecosystem connection.

## Recommended Deploy Order

1. Vercel
2. Netlify
3. GitHub Pages

Do not use Railway yet. Moon Today Board has no backend, database, worker, queue, sync service, or server process.

## Public Test Deployment

- GitHub repo URL: `https://github.com/nguyentudu/today-board.git`
- Repo visibility: `public`
- Public test URL: `https://nguyentudu.github.io/today-board/`
- Deploy provider: `GitHub Pages`
- Pages source: `gh-pages / root`
- Status: `active`
- Build command: `npm run build`
- Output directory: `dist`
- Test cohort: 10 users
- Validation status: Re-entry Notes v1 active
- Success gate: 3 successful re-entries

## Re-entry Notes v1

Re-entry Notes v1 tests whether users can recover context quickly after returning.

Successful re-entry means:

- user returns after at least 48 hours
- user recovers context in under 30 seconds
- user can continue without opening another tool

Allowed claim:

- REENTRY_SIGNAL

Not allowed:

- PMF
- Retention proven
- Commercial validation
- Product-market fit

## Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`

## GitHub Pages

- Build with `npm run build`
- Publish the generated `dist` output with a static Pages workflow.

## Public Test Rule

Give the URL only to the 10 testers. Ask them to export their board if they want to keep it outside Moon.
