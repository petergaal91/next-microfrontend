## Getting started

```bash
npm install
cp apps/login/.env.local.example apps/login/.env.local  # fill in real Strivacity tenant values
npm run dev
```

This builds the two widget bundles once, then starts all four apps
concurrently:

- http://localhost:3000 — home
- http://localhost:3000/products — products (via the home gateway)
- http://localhost:3002/auth — login micro-app (isolated widget preview)
- http://localhost:3003 — cart micro-app (isolated widget preview)
