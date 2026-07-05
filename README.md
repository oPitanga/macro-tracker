# Macro Tracker

A daily calorie and macronutrient tracker: set goals, log meals against a food
library, and review progress over the last 7 days. Built as an installable
PWA (React + Vite).

## Develop

```bash
cd app
npm install
npm run dev
```

## Build

```bash
cd app
npm run build   # output in app/dist
```

## Deploy

Pushes to `main` build and publish automatically to GitHub Pages via
`.github/workflows/deploy-pages.yml`. The live site is served at:

```
https://opitanga.github.io/macro-tracker/
```

(GitHub Pages must be enabled once, under Settings → Pages → Source →
"GitHub Actions", for the first deploy to go live.)
